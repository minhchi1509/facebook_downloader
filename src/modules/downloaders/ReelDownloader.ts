import path from "path";
import { IReelMedia } from "src/interfaces";
import FacebookRequest from "src/modules/FacebookRequest";
import CacheCursor from "src/modules/utils/CacheCursor";
import DownloadUtils from "src/modules/utils/DownloadUtils";
import PathUtils from "src/modules/utils/PathUtils";

class ReelDownloader {
  private facebookRequest: FacebookRequest;

  constructor(facebookRequest: FacebookRequest) {
    this.facebookRequest = facebookRequest;
  }

  downloadAllUserReels = async (userName: string, limit: number = Infinity) => {
    if (limit !== Infinity && limit % 10 !== 0) {
      throw new Error("❌ Limit must be a multiple of 10");
    }
    const userId = await this.facebookRequest.getFbUserIdByUserName(userName);
    const cursor = CacheCursor.getCacheCursor(userId, "REELS");
    const startCursor = cursor?.nextCursor || "";
    const totalDownloadedReels = cursor?.totalFetchedItems || 0;
    const reelsData = await this.facebookRequest.getUserReels(
      userId,
      startCursor,
      totalDownloadedReels,
      limit
    );
    if (!reelsData.length) {
      console.log(`👀 No reels found for ${userName}`);
      return;
    }
    console.log(`\n🚀 Start downloading reels of user ${userId}...`);
    const { REELS_SAVED_DIR } = PathUtils.getSavedUserMediaDirPath(userId);
    await DownloadUtils.downloadByBatch(
      reelsData,
      async (reel: IReelMedia, index: number) => {
        const fileName = `${totalDownloadedReels + index}_${reel.id}.mp4`;
        const savedFilePath = path.resolve(REELS_SAVED_DIR, fileName);
        await DownloadUtils.downloadMedia(reel.uri, savedFilePath);
      },
      true,
      10
    );
    console.log(
      `✅ Download reels of user ${userId} successfully and saved to ${REELS_SAVED_DIR}`
    );
  };
}

export default ReelDownloader;
