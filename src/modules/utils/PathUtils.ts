import { existsSync } from "fs";
import path from "path";

class PathUtils {
  static getLocalDownloadDir = () => {
    const LOCAL_DOWNLOAD_DIR = path.resolve(
      process.env.USERPROFILE || "",
      "Downloads"
    );
    if (!existsSync(LOCAL_DOWNLOAD_DIR)) {
      throw new Error("❌ Cannot find the download directory on your system");
    }
    return LOCAL_DOWNLOAD_DIR;
  };

  static getSavedUserMediaDirPath = (userId: string) => {
    const LOCAL_DOWNLOAD_DIR = path.resolve(
      process.env.USERPROFILE || "",
      "Downloads"
    );
    if (!existsSync(LOCAL_DOWNLOAD_DIR)) {
      throw new Error("❌ Cannot find the download directory on your system");
    }
    const BASE_DIR = path.resolve(
      LOCAL_DOWNLOAD_DIR,
      "facebook_downloader",
      userId
    );
    return {
      PHOTOS_SAVED_DIR: path.resolve(BASE_DIR, "photos"),
      REELS_SAVED_DIR: path.resolve(BASE_DIR, "reels"),
      VIDEOS_SAVED_DIR: path.resolve(BASE_DIR, "videos"),
      STORIES_SAVED_DIR: path.resolve(BASE_DIR, "stories"),
    };
  };
}

export default PathUtils;
