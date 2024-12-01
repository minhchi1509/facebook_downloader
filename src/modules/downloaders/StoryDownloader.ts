import path from "path";
import { IStoryMedia } from "src/interfaces";
import FacebookRequest from "src/modules/FacebookRequest";
import DownloadUtils from "src/modules/utils/DownloadUtils";
import PathUtils from "src/modules/utils/PathUtils";

class StoryDownloader {
  private facebookRequest: FacebookRequest;

  constructor(facebookRequest: FacebookRequest) {
    this.facebookRequest = facebookRequest;
  }

  private downloadStoryById = async (storyId: string, storyIndex: number) => {
    const storyData = await this.facebookRequest.getStoryMedia(storyId);
    if (!storyData || storyData?.stories.length === 0) {
      console.log(`❌ Story with id ${storyId} not found`);
      return;
    }

    const { stories, ownerId } = storyData;
    await DownloadUtils.downloadByBatch(
      stories,
      async (storyMedia: IStoryMedia, index: number) => {
        const { STORIES_SAVED_DIR } =
          PathUtils.getSavedUserMediaDirPath(ownerId);
        const baseDir = path.resolve(
          STORIES_SAVED_DIR,
          `${storyIndex}_${storyId}`
        );
        const fileName = `${index}_${storyMedia.id}.${
          storyMedia.isVideo ? "mp4" : "jpg"
        }`;
        await DownloadUtils.downloadMedia(
          storyMedia.uri,
          path.resolve(baseDir, fileName)
        );
      },
      true
    );
    console.log(`✅ Downloaded story with id ${storyId} successfully\n`);
  };

  async downloadStories(storiesId: string[]) {
    for (let i = 0; i < storiesId.length; i++) {
      console.log(
        `🚀 Start downloading story with id ${storiesId[i]!} (${i + 1}/${
          storiesId.length
        })...`
      );
      await this.downloadStoryById(storiesId[i]!, i + 1);
    }
  }
}

export default StoryDownloader;
