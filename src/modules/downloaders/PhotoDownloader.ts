import path from "path";
import { IPhotoMedia } from "src/interfaces";
import FacebookRequest from "src/modules/FacebookRequest";
import CacheCursor from "src/modules/utils/CacheCursor";
import DownloadUtils from "src/modules/utils/DownloadUtils";
import PathUtils from "src/modules/utils/PathUtils";

class PhotoDownloader {
  private facebookRequest: FacebookRequest;

  constructor(facebookRequest: FacebookRequest) {
    this.facebookRequest = facebookRequest;
  }

  downloadAllUserPhotos = async (
    userName: string,
    limit: number = Infinity
  ) => {
    if (limit !== Infinity && limit % 8 !== 0) {
      throw new Error("❌ Limit must be a multiple of 8");
    }
    const userId = await this.facebookRequest.getFbUserIdByUserName(userName);
    const cursor = CacheCursor.getCacheCursor(userId, "PHOTOS");
    const startCursor = cursor?.nextCursor || "";
    const totalDownloadedPhotos = cursor?.totalFetchedItems || 0;
    const photosData = await this.facebookRequest.getUserPhotos(
      userId,
      startCursor,
      totalDownloadedPhotos,
      limit
    );
    if (!photosData.length) {
      console.log(`👀 No photos found for ${userName}`);
      return;
    }
    console.log(`\n🚀 Start downloading photos of user ${userId}...`);
    const { PHOTOS_SAVED_DIR } = PathUtils.getSavedUserMediaDirPath(userId);
    await DownloadUtils.downloadByBatch(
      photosData,
      async (photo: IPhotoMedia, index: number) => {
        const fileName = `${totalDownloadedPhotos + index}_${photo.id}.jpg`;
        const savedFilePath = path.resolve(PHOTOS_SAVED_DIR, fileName);
        await DownloadUtils.downloadMedia(photo.uri, savedFilePath);
      },
      true,
      10
    );
    console.log(
      `✅ Download photos of user ${userId} successfully and saved to ${PHOTOS_SAVED_DIR}`
    );
  };
}

export default PhotoDownloader;
