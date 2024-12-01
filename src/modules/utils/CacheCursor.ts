import path from "path";
import { ICachedCursor } from "src/interfaces";
import FileUtils from "src/modules/utils/FileUtils";

class CacheCursor {
  static getSavedCacheCursorPath = (userId: string) => {
    const baseDir = path.resolve("cache_cursor", userId);
    return {
      PHOTOS_CACHE_CURSOR_PATH: path.resolve(baseDir, "photos.json"),
      REELS_CACHE_CURSOR_PATH: path.resolve(baseDir, "reels.json"),
      VIDEOS_CACHE_CURSOR_PATH: path.resolve(baseDir, "videos.json"),
    };
  };

  static writeCacheCursor = (
    userId: string,
    mediaType: "PHOTOS" | "REELS" | "VIDEOS",
    cursor: ICachedCursor
  ) => {
    const {
      PHOTOS_CACHE_CURSOR_PATH,
      REELS_CACHE_CURSOR_PATH,
      VIDEOS_CACHE_CURSOR_PATH,
    } = this.getSavedCacheCursorPath(userId);
    const mappedPath = {
      PHOTOS: PHOTOS_CACHE_CURSOR_PATH,
      VIDEOS: VIDEOS_CACHE_CURSOR_PATH,
      REELS: REELS_CACHE_CURSOR_PATH,
    };
    FileUtils.writeToFile(
      mappedPath[mediaType],
      JSON.stringify(cursor, null, 2)
    );
  };

  static getCacheCursor = (
    userId: string,
    mediaType: "PHOTOS" | "REELS" | "VIDEOS"
  ) => {
    const {
      PHOTOS_CACHE_CURSOR_PATH,
      REELS_CACHE_CURSOR_PATH,
      VIDEOS_CACHE_CURSOR_PATH,
    } = this.getSavedCacheCursorPath(userId);
    const mappedPath = {
      PHOTOS: PHOTOS_CACHE_CURSOR_PATH,
      VIDEOS: VIDEOS_CACHE_CURSOR_PATH,
      REELS: REELS_CACHE_CURSOR_PATH,
    };
    return FileUtils.readObjectFromJsonFile<ICachedCursor>(
      mappedPath[mediaType]
    );
  };
}

export default CacheCursor;
