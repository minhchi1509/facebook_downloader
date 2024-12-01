import path from "path";
import { IVideoMedia } from "src/interfaces";
import FacebookRequest from "src/modules/FacebookRequest";
import CacheCursor from "src/modules/utils/CacheCursor";
import DownloadUtils from "src/modules/utils/DownloadUtils";
import PathUtils from "src/modules/utils/PathUtils";

class VideoDownloader {
  private facebookRequest: FacebookRequest;

  constructor(facebookRequest: FacebookRequest) {
    this.facebookRequest = facebookRequest;
  }

  downloadAllUserVideos = async (
    userName: string,
    limit: number = Infinity
  ) => {
    if (limit !== Infinity && limit % 8 !== 0) {
      throw new Error("❌ Limit must be a multiple of 8");
    }
    const userId = await this.facebookRequest.getFbUserIdByUserName(userName);
    const cursor = CacheCursor.getCacheCursor(userId, "VIDEOS");
    const startCursor = cursor?.nextCursor || "";
    const totalDownloadedVideos = cursor?.totalFetchedItems || 0;
    const videosData = await this.facebookRequest.getUserVideos(
      userId,
      startCursor,
      totalDownloadedVideos,
      limit
    );
    if (!videosData.length) {
      console.log(`👀 No videos found for ${userName}`);
      return;
    }
    console.log(`\n🚀 Start downloading videos of user ${userId}...`);
    const { VIDEOS_SAVED_DIR } = PathUtils.getSavedUserMediaDirPath(userId);
    await DownloadUtils.downloadByBatch(
      videosData,
      async (video: IVideoMedia, index: number) => {
        const fileName = `${totalDownloadedVideos + index}_${video.id}.mp4`;
        const savedFilePath = path.resolve(VIDEOS_SAVED_DIR, fileName);
        await DownloadUtils.downloadMedia(video.uri, savedFilePath);
      },
      true
    );
    console.log(
      `✅ Download videos of user ${userId} successfully and saved to ${VIDEOS_SAVED_DIR}`
    );
  };
}

export default VideoDownloader;
