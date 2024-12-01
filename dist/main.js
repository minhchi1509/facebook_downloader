"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  FacebookDownloader: () => FacebookDownloader_default
});
module.exports = __toCommonJS(main_exports);

// src/modules/downloaders/PhotoDownloader.ts
var import_path5 = __toESM(require("path"));

// src/modules/utils/CacheCursor.ts
var import_path2 = __toESM(require("path"));

// src/modules/utils/FileUtils.ts
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
var FileUtils = class {
};
FileUtils.writeToFile = (absolutePath, content) => {
  const dir = import_path.default.dirname(absolutePath);
  if (!import_fs.default.existsSync(dir)) {
    import_fs.default.mkdirSync(dir, { recursive: true });
  }
  import_fs.default.writeFileSync(absolutePath, content);
};
FileUtils.readObjectFromJsonFile = (absolutePath) => {
  if (!import_fs.default.existsSync(absolutePath)) {
    return null;
  }
  return JSON.parse(import_fs.default.readFileSync(absolutePath, "utf-8"));
};
var FileUtils_default = FileUtils;

// src/modules/utils/CacheCursor.ts
var _CacheCursor = class _CacheCursor {
};
_CacheCursor.getSavedCacheCursorPath = (userId) => {
  const baseDir = import_path2.default.resolve("cache_cursor", userId);
  return {
    PHOTOS_CACHE_CURSOR_PATH: import_path2.default.resolve(baseDir, "photos.json"),
    REELS_CACHE_CURSOR_PATH: import_path2.default.resolve(baseDir, "reels.json"),
    VIDEOS_CACHE_CURSOR_PATH: import_path2.default.resolve(baseDir, "videos.json")
  };
};
_CacheCursor.writeCacheCursor = (userId, mediaType, cursor) => {
  const {
    PHOTOS_CACHE_CURSOR_PATH,
    REELS_CACHE_CURSOR_PATH,
    VIDEOS_CACHE_CURSOR_PATH
  } = _CacheCursor.getSavedCacheCursorPath(userId);
  const mappedPath = {
    PHOTOS: PHOTOS_CACHE_CURSOR_PATH,
    VIDEOS: VIDEOS_CACHE_CURSOR_PATH,
    REELS: REELS_CACHE_CURSOR_PATH
  };
  FileUtils_default.writeToFile(
    mappedPath[mediaType],
    JSON.stringify(cursor, null, 2)
  );
};
_CacheCursor.getCacheCursor = (userId, mediaType) => {
  const {
    PHOTOS_CACHE_CURSOR_PATH,
    REELS_CACHE_CURSOR_PATH,
    VIDEOS_CACHE_CURSOR_PATH
  } = _CacheCursor.getSavedCacheCursorPath(userId);
  const mappedPath = {
    PHOTOS: PHOTOS_CACHE_CURSOR_PATH,
    VIDEOS: VIDEOS_CACHE_CURSOR_PATH,
    REELS: REELS_CACHE_CURSOR_PATH
  };
  return FileUtils_default.readObjectFromJsonFile(
    mappedPath[mediaType]
  );
};
var CacheCursor = _CacheCursor;
var CacheCursor_default = CacheCursor;

// src/modules/utils/DownloadUtils.ts
var import_axios = __toESM(require("axios"));
var import_path3 = __toESM(require("path"));
var import_fs2 = __toESM(require("fs"));
var DownloadUtils = class {
};
DownloadUtils.downloadByBatch = async (data, downloadFunction, isLogProcess = false, batchSize = 5) => {
  for (let i = 0; i < data.length; i += batchSize) {
    const from = i;
    const to = Math.min(i + batchSize, data.length);
    const sliceData = data.slice(from, to);
    await Promise.all(
      sliceData.map(
        (item, index) => downloadFunction(item, from + index + 1)
      )
    );
    if (isLogProcess) {
      console.log(`\u{1F525}Downloaded ${to}/${data.length} items`);
    }
  }
};
DownloadUtils.downloadMedia = async (mediaDownloadUrl, outputPath) => {
  const dir = import_path3.default.dirname(outputPath);
  if (!import_fs2.default.existsSync(dir)) {
    import_fs2.default.mkdirSync(dir, { recursive: true });
  }
  const writer = import_fs2.default.createWriteStream(outputPath);
  try {
    const response = await import_axios.default.get(mediaDownloadUrl, {
      responseType: "stream"
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error(
      "\u274C Error downloading file:",
      error.response?.data
    );
    writer.close();
  }
};
var DownloadUtils_default = DownloadUtils;

// src/modules/utils/PathUtils.ts
var import_fs3 = require("fs");
var import_path4 = __toESM(require("path"));
var PathUtils = class {
};
PathUtils.getLocalDownloadDir = () => {
  const LOCAL_DOWNLOAD_DIR = import_path4.default.resolve(
    process.env.USERPROFILE || "",
    "Downloads"
  );
  if (!(0, import_fs3.existsSync)(LOCAL_DOWNLOAD_DIR)) {
    throw new Error("\u274C Cannot find the download directory on your system");
  }
  return LOCAL_DOWNLOAD_DIR;
};
PathUtils.getSavedUserMediaDirPath = (userId) => {
  const LOCAL_DOWNLOAD_DIR = import_path4.default.resolve(
    process.env.USERPROFILE || "",
    "Downloads"
  );
  if (!(0, import_fs3.existsSync)(LOCAL_DOWNLOAD_DIR)) {
    throw new Error("\u274C Cannot find the download directory on your system");
  }
  const BASE_DIR = import_path4.default.resolve(
    LOCAL_DOWNLOAD_DIR,
    "facebook_downloader",
    userId
  );
  return {
    PHOTOS_SAVED_DIR: import_path4.default.resolve(BASE_DIR, "photos"),
    REELS_SAVED_DIR: import_path4.default.resolve(BASE_DIR, "reels"),
    VIDEOS_SAVED_DIR: import_path4.default.resolve(BASE_DIR, "videos"),
    STORIES_SAVED_DIR: import_path4.default.resolve(BASE_DIR, "stories")
  };
};
var PathUtils_default = PathUtils;

// src/modules/downloaders/PhotoDownloader.ts
var PhotoDownloader = class {
  constructor(facebookRequest) {
    this.downloadAllUserPhotos = async (userName, limit = Infinity) => {
      if (limit !== Infinity && limit % 8 !== 0) {
        throw new Error("\u274C Limit must be a multiple of 8");
      }
      const userId = await this.facebookRequest.getFbUserIdByUserName(userName);
      const cursor = CacheCursor_default.getCacheCursor(userId, "PHOTOS");
      const startCursor = cursor?.nextCursor || "";
      const totalDownloadedPhotos = cursor?.totalFetchedItems || 0;
      const photosData = await this.facebookRequest.getUserPhotos(
        userId,
        startCursor,
        totalDownloadedPhotos,
        limit
      );
      if (!photosData.length) {
        console.log(`\u{1F440} No photos found for ${userName}`);
        return;
      }
      console.log(`
\u{1F680} Start downloading photos of user ${userId}...`);
      const { PHOTOS_SAVED_DIR } = PathUtils_default.getSavedUserMediaDirPath(userId);
      await DownloadUtils_default.downloadByBatch(
        photosData,
        async (photo, index) => {
          const fileName = `${totalDownloadedPhotos + index}_${photo.id}.jpg`;
          const savedFilePath = import_path5.default.resolve(PHOTOS_SAVED_DIR, fileName);
          await DownloadUtils_default.downloadMedia(photo.uri, savedFilePath);
        },
        true,
        10
      );
      console.log(
        `\u2705 Download photos of user ${userId} successfully and saved to ${PHOTOS_SAVED_DIR}`
      );
    };
    this.facebookRequest = facebookRequest;
  }
};
var PhotoDownloader_default = PhotoDownloader;

// src/modules/downloaders/ReelDownloader.ts
var import_path6 = __toESM(require("path"));
var ReelDownloader = class {
  constructor(facebookRequest) {
    this.downloadAllUserReels = async (userName, limit = Infinity) => {
      if (limit !== Infinity && limit % 10 !== 0) {
        throw new Error("\u274C Limit must be a multiple of 10");
      }
      const userId = await this.facebookRequest.getFbUserIdByUserName(userName);
      const cursor = CacheCursor_default.getCacheCursor(userId, "REELS");
      const startCursor = cursor?.nextCursor || "";
      const totalDownloadedReels = cursor?.totalFetchedItems || 0;
      const reelsData = await this.facebookRequest.getUserReels(
        userId,
        startCursor,
        totalDownloadedReels,
        limit
      );
      if (!reelsData.length) {
        console.log(`\u{1F440} No reels found for ${userName}`);
        return;
      }
      console.log(`
\u{1F680} Start downloading reels of user ${userId}...`);
      const { REELS_SAVED_DIR } = PathUtils_default.getSavedUserMediaDirPath(userId);
      await DownloadUtils_default.downloadByBatch(
        reelsData,
        async (reel, index) => {
          const fileName = `${totalDownloadedReels + index}_${reel.id}.mp4`;
          const savedFilePath = import_path6.default.resolve(REELS_SAVED_DIR, fileName);
          await DownloadUtils_default.downloadMedia(reel.uri, savedFilePath);
        },
        true,
        10
      );
      console.log(
        `\u2705 Download reels of user ${userId} successfully and saved to ${REELS_SAVED_DIR}`
      );
    };
    this.facebookRequest = facebookRequest;
  }
};
var ReelDownloader_default = ReelDownloader;

// src/modules/downloaders/StoryDownloader.ts
var import_path7 = __toESM(require("path"));
var StoryDownloader = class {
  constructor(facebookRequest) {
    this.downloadStoryById = async (storyId, storyIndex) => {
      const storyData = await this.facebookRequest.getStoryMedia(storyId);
      if (!storyData || storyData?.stories.length === 0) {
        console.log(`\u274C Story with id ${storyId} not found`);
        return;
      }
      const { stories, ownerId } = storyData;
      await DownloadUtils_default.downloadByBatch(
        stories,
        async (storyMedia, index) => {
          const { STORIES_SAVED_DIR } = PathUtils_default.getSavedUserMediaDirPath(ownerId);
          const baseDir = import_path7.default.resolve(
            STORIES_SAVED_DIR,
            `${storyIndex}_${storyId}`
          );
          const fileName = `${index}_${storyMedia.id}.${storyMedia.isVideo ? "mp4" : "jpg"}`;
          await DownloadUtils_default.downloadMedia(
            storyMedia.uri,
            import_path7.default.resolve(baseDir, fileName)
          );
        },
        true
      );
      console.log(`\u2705 Downloaded story with id ${storyId} successfully
`);
    };
    this.facebookRequest = facebookRequest;
  }
  async downloadStories(storiesId) {
    for (let i = 0; i < storiesId.length; i++) {
      console.log(
        `\u{1F680} Start downloading story with id ${storiesId[i]} (${i + 1}/${storiesId.length})...`
      );
      await this.downloadStoryById(storiesId[i], i + 1);
    }
  }
};
var StoryDownloader_default = StoryDownloader;

// src/modules/downloaders/VideoDownloader.ts
var import_path8 = __toESM(require("path"));
var VideoDownloader = class {
  constructor(facebookRequest) {
    this.downloadAllUserVideos = async (userName, limit = Infinity) => {
      if (limit !== Infinity && limit % 8 !== 0) {
        throw new Error("\u274C Limit must be a multiple of 8");
      }
      const userId = await this.facebookRequest.getFbUserIdByUserName(userName);
      const cursor = CacheCursor_default.getCacheCursor(userId, "VIDEOS");
      const startCursor = cursor?.nextCursor || "";
      const totalDownloadedVideos = cursor?.totalFetchedItems || 0;
      const videosData = await this.facebookRequest.getUserVideos(
        userId,
        startCursor,
        totalDownloadedVideos,
        limit
      );
      if (!videosData.length) {
        console.log(`\u{1F440} No videos found for ${userName}`);
        return;
      }
      console.log(`
\u{1F680} Start downloading videos of user ${userId}...`);
      const { VIDEOS_SAVED_DIR } = PathUtils_default.getSavedUserMediaDirPath(userId);
      await DownloadUtils_default.downloadByBatch(
        videosData,
        async (video, index) => {
          const fileName = `${totalDownloadedVideos + index}_${video.id}.mp4`;
          const savedFilePath = import_path8.default.resolve(VIDEOS_SAVED_DIR, fileName);
          await DownloadUtils_default.downloadMedia(video.uri, savedFilePath);
        },
        true
      );
      console.log(
        `\u2705 Download videos of user ${userId} successfully and saved to ${VIDEOS_SAVED_DIR}`
      );
    };
    this.facebookRequest = facebookRequest;
  }
};
var VideoDownloader_default = VideoDownloader;

// src/modules/FacebookRequest.ts
var import_axios2 = __toESM(require("axios"));
var FacebookRequest = class {
  constructor(cookies) {
    this.getCurrentUserToken = async () => {
      try {
        const { data } = await this.axiosInstance.get(
          "https://www.facebook.com/"
        );
        const userId = data.match(/"userId":(\d+)/)[1];
        const fbDtsg = data.match(/"DTSGInitialData".*?"token":"(.*?)"/)[1];
        return { userId, fbDtsg };
      } catch (error) {
        throw new Error(
          "\u274C Error when getting your Facebook token: Invalid cookie"
        );
      }
    };
    this.makeRequestToFacebook = async (userToken, docID, query) => {
      const formData = new FormData();
      formData.set("fb_dtsg", userToken.fbDtsg);
      formData.set("av", userToken.userId);
      formData.set("doc_id", docID);
      formData.set("variables", JSON.stringify(query));
      const { data } = await this.axiosInstance.post("/", formData);
      return data;
    };
    this.getFbUserIdByUserName = async (userName) => {
      try {
        const { data } = await this.axiosInstance.get(
          `https://www.facebook.com/${userName}`
        );
        const userId = data.match(/"userID":"(\d+)"/)[1];
        return userId;
      } catch (error) {
        throw new Error("\u274C Error when getting user id by username");
      }
    };
    this.getUserPhotos = async (userId, startCursor, totalFetchedPhotos, limit) => {
      const userToken = await this.getCurrentUserToken();
      console.log(
        `\u{1F680} Start getting photos of user ${userId}. Fetched: ${totalFetchedPhotos}. Maximum: ${limit}`
      );
      const baseQuery = {
        scale: 1,
        id: btoa(`app_collection:${userId}:2305272732:5`)
      };
      const profilePhotos = [];
      let hasNextPage = false;
      let endCursor = startCursor;
      do {
        const docID = "27205790585732100";
        const query = {
          ...baseQuery,
          count: 8,
          cursor: endCursor
        };
        const responseData = await this.makeRequestToFacebook(
          userToken,
          docID,
          query
        );
        const originalPhotos = responseData?.data?.node?.pageItems?.edges;
        const pageInfor = responseData?.data?.node?.pageItems?.page_info;
        if (!originalPhotos || !pageInfor) {
          console.log("\u{1F610} There are some errors. Start retrying...");
          continue;
        }
        const formattedPhotosList = originalPhotos.map(
          ({ node }) => ({
            id: node.node.id,
            uri: node.node.viewer_image.uri
          })
        );
        profilePhotos.push(...formattedPhotosList);
        console.log(`\u{1F525} Got ${profilePhotos.length} photos...`);
        hasNextPage = pageInfor.has_next_page;
        endCursor = pageInfor.end_cursor;
      } while (hasNextPage && profilePhotos.length < limit);
      const cacheCursorInfor = {
        nextCursor: hasNextPage ? endCursor : "",
        totalFetchedItems: hasNextPage ? totalFetchedPhotos + profilePhotos.length : 0
      };
      CacheCursor_default.writeCacheCursor(userId, "PHOTOS", cacheCursorInfor);
      hasNextPage ? console.log(
        `\u{1F503} Got ${profilePhotos.length} photos and still have photos left`
      ) : console.log(
        `\u2705 Get all photos of user ${userId} successfully. Total: ${profilePhotos.length + totalFetchedPhotos}`
      );
      return profilePhotos;
    };
    this.getUserReels = async (userId, startCursor, totalFetchedReels, limit) => {
      const userToken = await this.getCurrentUserToken();
      console.log(
        `\u{1F680} Start getting reels of user ${userId}. Fetched: ${totalFetchedReels}. Maximum: ${limit}`
      );
      const baseQuery = {
        scale: 1,
        id: btoa(`app_collection:${userId}:168684841768375:260`),
        feedLocation: "COMET_MEDIA_VIEWER",
        feedbackSource: 65,
        focusCommentID: null,
        renderLocation: null,
        useDefaultActor: true,
        __relay_internal__pv__FBReelsMediaFooter_comet_enable_reels_ads_gkrelayprovider: false,
        __relay_internal__pv__IsWorkUserrelayprovider: false
      };
      const profileReels = [];
      let hasNextPage = false;
      let endCursor = startCursor;
      do {
        const docID = "8445448972232150";
        const query = {
          ...baseQuery,
          count: 10,
          cursor: endCursor
        };
        const responseText = await this.makeRequestToFacebook(
          userToken,
          docID,
          query
        );
        const originalReelsData = JSON.parse(
          responseText?.split("\n")?.[0] ?? "null"
        )?.data?.node?.aggregated_fb_shorts;
        if (!originalReelsData) {
          console.log("\u{1F610} There are some errors. Start retrying...");
          continue;
        }
        const formattedReels = originalReelsData.edges.map((item) => {
          const reel = item.profile_reel_node.node.short_form_video_context.playback_video.videoDeliveryLegacyFields;
          const id = reel.id;
          const uri = reel.browser_native_hd_url || reel.browser_native_sd_url;
          return { id, uri };
        });
        profileReels.push(...formattedReels);
        console.log(`\u{1F525} Got ${profileReels.length} reels...`);
        hasNextPage = originalReelsData.page_info.has_next_page;
        endCursor = originalReelsData.page_info.end_cursor;
      } while (hasNextPage && profileReels.length < limit);
      const cacheCursorInfor = {
        nextCursor: hasNextPage ? endCursor : "",
        totalFetchedItems: hasNextPage ? totalFetchedReels + profileReels.length : 0
      };
      CacheCursor_default.writeCacheCursor(userId, "REELS", cacheCursorInfor);
      hasNextPage ? console.log(
        `\u{1F503} Got ${profileReels.length} reels and still have reels left`
      ) : console.log(
        `\u2705 Get all reels of user ${userId} successfully. Total: ${profileReels.length + totalFetchedReels}`
      );
      return profileReels;
    };
    this.getVideoDownloadUri = async (videoUrl) => {
      const { data: responseData } = await this.axiosInstance.get(videoUrl, {
        headers: {
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
        }
      });
      const regex = /"progressive_urls":(.*?),"hls_playlist_urls":/;
      const match = responseData.match(regex);
      if (!match) {
        throw new Error("\u274C Error when getting video download uri");
      }
      const videoDownloadUris = JSON.parse(match[1]);
      const hdUri = videoDownloadUris.find(
        (v) => v.metadata.quality === "HD"
      );
      const sdUri = videoDownloadUris.find(
        (v) => v.metadata.quality === "SD"
      );
      return hdUri.progressive_url || sdUri.progressive_url;
    };
    this.getUserVideos = async (userId, startCursor, totalFetchedVideos, limit) => {
      const userToken = await this.getCurrentUserToken();
      console.log(
        `\u{1F680} Start getting videos of user ${userId}. Fetched: ${totalFetchedVideos}. Maximum: ${limit}`
      );
      const profileVideos = [];
      const baseQuery = {
        scale: 1,
        id: btoa(`app_collection:${userId}:1560653304174514:133`)
      };
      let hasNextPage = false;
      let endCursor = startCursor;
      do {
        const docID = "27205790585732100";
        const query = {
          ...baseQuery,
          count: 8,
          cursor: endCursor
        };
        const responseData = await this.makeRequestToFacebook(
          userToken,
          docID,
          query
        );
        const originalVideosId = responseData?.data?.node?.pageItems?.edges;
        const pageInfor = responseData?.data?.node?.pageItems?.page_info;
        if (!originalVideosId || !pageInfor) {
          console.log("\u{1F610} There are some errors. Start retrying...");
          continue;
        }
        const formattedVideos = await Promise.all(
          originalVideosId.map(async ({ node }) => {
            const videoId = node.node.id;
            const videoUrl = node.url;
            const videoUri = await this.getVideoDownloadUri(videoUrl);
            return { id: videoId, uri: videoUri };
          })
        );
        profileVideos.push(...formattedVideos);
        console.log(`\u{1F525} Got ${profileVideos.length} videos...`);
        hasNextPage = pageInfor.has_next_page;
        endCursor = pageInfor.end_cursor;
      } while (hasNextPage && profileVideos.length < limit);
      const cacheCursorInfor = {
        nextCursor: hasNextPage ? endCursor : "",
        totalFetchedItems: hasNextPage ? totalFetchedVideos + profileVideos.length : 0
      };
      CacheCursor_default.writeCacheCursor(userId, "VIDEOS", cacheCursorInfor);
      hasNextPage ? console.log(
        `\u{1F503} Got ${profileVideos.length} videos and still have videos left`
      ) : console.log(
        `\u2705 Get all videos of user ${userId} successfully. Total: ${profileVideos.length + totalFetchedVideos}`
      );
      return profileVideos;
    };
    this.getStoryMedia = async (storyId) => {
      const userToken = await this.getCurrentUserToken();
      const data = await this.makeRequestToFacebook(
        userToken,
        "8367440913325249",
        {
          bucketID: storyId,
          focusCommentID: null,
          scale: 1
        }
      );
      const storiesDataString = data.match(
        /"unified_stories":\{"edges":(.*?)\},"owner":\{/
      );
      const storyOwnerIdString = data.match(
        /"__isNode":"User","id":"(.*?)","name":/
      );
      if (storiesDataString && storiesDataString[1] && storyOwnerIdString && storyOwnerIdString[1]) {
        const storyOwnerId = storyOwnerIdString[1];
        const storiesData = JSON.parse(storiesDataString[1]);
        const stories = storiesData.map((story) => {
          const storyData = story?.node?.attachments?.[0]?.media;
          if (!storyData) {
            return void 0;
          }
          const id = storyData.id;
          const isVideo = storyData.__isMedia === "Video";
          const thumbnailUrl = isVideo ? storyData.previewImage.uri || storyData.preferred_thumbnail.image.uri : void 0;
          const downloadUrl = isVideo ? storyData.videoDeliveryLegacyFields.browser_native_hd_url || storyData.videoDeliveryLegacyFields.browser_native_sd_url : storyData.image.uri;
          return {
            id,
            uri: downloadUrl,
            isVideo,
            thumbnailUri: thumbnailUrl
          };
        }).filter((story) => !!story);
        return { ownerId: storyOwnerId, stories };
      }
    };
    this.axiosInstance = import_axios2.default.create({
      baseURL: "https://www.facebook.com/api/graphql",
      headers: { cookie: cookies }
    });
    this.axiosInstance.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response) {
          const responseData = error.response.data;
          throw new Error(
            `\u274C Error when making request to Instagram: ${JSON.stringify(
              responseData,
              null,
              2
            )}`
          );
        }
        throw new Error(`\u274C Unknown error: ${error.message}`);
      }
    );
  }
};
var FacebookRequest_default = FacebookRequest;

// src/modules/FacebookDownloader.ts
var FacebookDownloader = class {
  constructor(cookies) {
    this.facebookRequest = new FacebookRequest_default(cookies);
    this.photo = new PhotoDownloader_default(this.facebookRequest);
    this.reel = new ReelDownloader_default(this.facebookRequest);
    this.video = new VideoDownloader_default(this.facebookRequest);
    this.story = new StoryDownloader_default(this.facebookRequest);
  }
};
var FacebookDownloader_default = FacebookDownloader;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FacebookDownloader
});
