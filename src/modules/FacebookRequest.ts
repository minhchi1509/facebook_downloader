import axios, { AxiosError, AxiosInstance } from "axios";
import {
  ICachedCursor,
  ICurrentUserToken,
  IPhotoMedia,
  IReelMedia,
  IVideoMedia,
} from "src/interfaces";
import CacheCursor from "src/modules/utils/CacheCursor";

class FacebookRequest {
  private axiosInstance: AxiosInstance;

  constructor(cookies: string) {
    this.axiosInstance = axios.create({
      baseURL: "https://www.facebook.com/api/graphql",
      headers: { cookie: cookies },
    });
    this.axiosInstance.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        if (error.response) {
          const responseData = error.response.data;
          throw new Error(
            `❌ Error when making request to Instagram: ${JSON.stringify(
              responseData,
              null,
              2
            )}`
          );
        }
        throw new Error(`❌ Unknown error: ${error.message}`);
      }
    );
  }

  private getCurrentUserToken = async () => {
    try {
      const { data } = await this.axiosInstance.get(
        "https://www.facebook.com/"
      );
      const userId = data.match(/"userId":(\d+)/)[1];
      const fbDtsg = data.match(/"DTSGInitialData".*?"token":"(.*?)"/)[1];
      return { userId, fbDtsg };
    } catch (error) {
      throw new Error(
        "❌ Error when getting your Facebook token: Invalid cookie"
      );
    }
  };

  private makeRequestToFacebook = async (
    userToken: ICurrentUserToken,
    docID: string,
    query: any
  ) => {
    const formData = new FormData();
    formData.set("fb_dtsg", userToken.fbDtsg);
    formData.set("av", userToken.userId);
    formData.set("doc_id", docID);
    formData.set("variables", JSON.stringify(query));
    const { data } = await this.axiosInstance.post("/", formData);
    return data;
  };

  getFbUserIdByUserName = async (userName: string) => {
    try {
      const { data } = await this.axiosInstance.get(
        `https://www.facebook.com/${userName}`
      );
      const userId = data.match(/"userID":"(\d+)"/)[1];
      return userId as string;
    } catch (error) {
      throw new Error("❌ Error when getting user id by username");
    }
  };

  getUserPhotos = async (
    userId: string,
    startCursor: string,
    totalFetchedPhotos: number,
    limit: number
  ) => {
    const userToken = await this.getCurrentUserToken();
    console.log(
      `🚀 Start getting photos of user ${userId}. Fetched: ${totalFetchedPhotos}. Maximum: ${limit}`
    );

    const baseQuery = {
      scale: 1,
      id: btoa(`app_collection:${userId}:2305272732:5`),
    };
    const profilePhotos: IPhotoMedia[] = [];
    let hasNextPage = false;
    let endCursor = startCursor;
    do {
      const docID = "27205790585732100";
      const query = {
        ...baseQuery,
        count: 8,
        cursor: endCursor,
      };
      const responseData = await this.makeRequestToFacebook(
        userToken,
        docID,
        query
      );

      const originalPhotos = responseData?.data?.node?.pageItems?.edges;
      const pageInfor = responseData?.data?.node?.pageItems?.page_info;

      if (!originalPhotos || !pageInfor) {
        console.log("😐 There are some errors. Start retrying...");
        continue;
      }

      const formattedPhotosList: IPhotoMedia[] = originalPhotos.map(
        ({ node }: any) => ({
          id: node.node.id,
          uri: node.node.viewer_image.uri,
        })
      );

      profilePhotos.push(...formattedPhotosList);
      console.log(`🔥 Got ${profilePhotos.length} photos...`);
      hasNextPage = pageInfor.has_next_page;
      endCursor = pageInfor.end_cursor;
    } while (hasNextPage && profilePhotos.length < limit);
    const cacheCursorInfor: ICachedCursor = {
      nextCursor: hasNextPage ? endCursor : "",
      totalFetchedItems: hasNextPage
        ? totalFetchedPhotos + profilePhotos.length
        : 0,
    };
    CacheCursor.writeCacheCursor(userId, "PHOTOS", cacheCursorInfor);
    hasNextPage
      ? console.log(
          `🔃 Got ${profilePhotos.length} photos and still have photos left`
        )
      : console.log(
          `✅ Get all photos of user ${userId} successfully. Total: ${
            profilePhotos.length + totalFetchedPhotos
          }`
        );

    return profilePhotos;
  };

  getUserReels = async (
    userId: string,
    startCursor: string,
    totalFetchedReels: number,
    limit: number
  ) => {
    const userToken = await this.getCurrentUserToken();
    console.log(
      `🚀 Start getting reels of user ${userId}. Fetched: ${totalFetchedReels}. Maximum: ${limit}`
    );

    const baseQuery = {
      scale: 1,
      id: btoa(`app_collection:${userId}:168684841768375:260`),
      feedLocation: "COMET_MEDIA_VIEWER",
      feedbackSource: 65,
      focusCommentID: null,
      renderLocation: null,
      useDefaultActor: true,
      __relay_internal__pv__FBReelsMediaFooter_comet_enable_reels_ads_gkrelayprovider:
        false,
      __relay_internal__pv__IsWorkUserrelayprovider: false,
    };
    const profileReels: IReelMedia[] = [];
    let hasNextPage = false;
    let endCursor = startCursor;
    do {
      const docID = "8445448972232150";
      const query = {
        ...baseQuery,
        count: 10,
        cursor: endCursor,
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
        console.log("😐 There are some errors. Start retrying...");
        continue;
      }

      const formattedReels = originalReelsData.edges.map((item: any) => {
        const reel =
          item.profile_reel_node.node.short_form_video_context.playback_video
            .videoDeliveryLegacyFields;
        const id = reel.id;
        const uri = reel.browser_native_hd_url || reel.browser_native_sd_url;
        return { id, uri };
      });

      profileReels.push(...formattedReels);
      console.log(`🔥 Got ${profileReels.length} reels...`);
      hasNextPage = originalReelsData.page_info.has_next_page;
      endCursor = originalReelsData.page_info.end_cursor;
    } while (hasNextPage && profileReels.length < limit);

    const cacheCursorInfor: ICachedCursor = {
      nextCursor: hasNextPage ? endCursor : "",
      totalFetchedItems: hasNextPage
        ? totalFetchedReels + profileReels.length
        : 0,
    };
    CacheCursor.writeCacheCursor(userId, "REELS", cacheCursorInfor);
    hasNextPage
      ? console.log(
          `🔃 Got ${profileReels.length} reels and still have reels left`
        )
      : console.log(
          `✅ Get all reels of user ${userId} successfully. Total: ${
            profileReels.length + totalFetchedReels
          }`
        );
    return profileReels;
  };

  private getVideoDownloadUri = async (videoUrl: string) => {
    const { data: responseData } = await this.axiosInstance.get(videoUrl, {
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      },
    });
    const regex = /"progressive_urls":(.*?),"hls_playlist_urls":/;
    const match = responseData.match(regex);
    if (!match) {
      throw new Error("❌ Error when getting video download uri");
    }
    const videoDownloadUris = JSON.parse(match[1]);
    const hdUri = videoDownloadUris.find(
      (v: any) => v.metadata.quality === "HD"
    );
    const sdUri = videoDownloadUris.find(
      (v: any) => v.metadata.quality === "SD"
    );
    return (hdUri.progressive_url || sdUri.progressive_url) as string;
  };

  getUserVideos = async (
    userId: string,
    startCursor: string,
    totalFetchedVideos: number,
    limit: number
  ) => {
    const userToken = await this.getCurrentUserToken();
    console.log(
      `🚀 Start getting videos of user ${userId}. Fetched: ${totalFetchedVideos}. Maximum: ${limit}`
    );

    const profileVideos: IVideoMedia[] = [];
    const baseQuery = {
      scale: 1,
      id: btoa(`app_collection:${userId}:1560653304174514:133`),
    };
    let hasNextPage = false;
    let endCursor = startCursor;
    do {
      const docID = "27205790585732100";
      const query = {
        ...baseQuery,
        count: 8,
        cursor: endCursor,
      };
      const responseData = await this.makeRequestToFacebook(
        userToken,
        docID,
        query
      );

      const originalVideosId = responseData?.data?.node?.pageItems?.edges;
      const pageInfor = responseData?.data?.node?.pageItems?.page_info;

      if (!originalVideosId || !pageInfor) {
        console.log("😐 There are some errors. Start retrying...");
        continue;
      }

      const formattedVideos: IVideoMedia[] = await Promise.all(
        originalVideosId.map(async ({ node }: any) => {
          const videoId = node.node.id;
          const videoUrl = node.url;
          const videoUri = await this.getVideoDownloadUri(videoUrl);
          return { id: videoId, uri: videoUri };
        })
      );
      profileVideos.push(...formattedVideos);
      console.log(`🔥 Got ${profileVideos.length} videos...`);
      hasNextPage = pageInfor.has_next_page;
      endCursor = pageInfor.end_cursor;
    } while (hasNextPage && profileVideos.length < limit);

    const cacheCursorInfor: ICachedCursor = {
      nextCursor: hasNextPage ? endCursor : "",
      totalFetchedItems: hasNextPage
        ? totalFetchedVideos + profileVideos.length
        : 0,
    };
    CacheCursor.writeCacheCursor(userId, "VIDEOS", cacheCursorInfor);
    hasNextPage
      ? console.log(
          `🔃 Got ${profileVideos.length} videos and still have videos left`
        )
      : console.log(
          `✅ Get all videos of user ${userId} successfully. Total: ${
            profileVideos.length + totalFetchedVideos
          }`
        );
    return profileVideos;
  };

  getStoryMedia = async (storyId: string) => {
    const userToken = await this.getCurrentUserToken();
    const data = await this.makeRequestToFacebook(
      userToken,
      "8367440913325249",
      {
        bucketID: storyId,
        focusCommentID: null,
        scale: 1,
      }
    );

    const storiesDataString = data.match(
      /"unified_stories":\{"edges":(.*?)\},"owner":\{/
    );
    const storyOwnerIdString = data.match(
      /"__isNode":"User","id":"(.*?)","name":/
    );

    if (
      storiesDataString &&
      storiesDataString[1] &&
      storyOwnerIdString &&
      storyOwnerIdString[1]
    ) {
      const storyOwnerId = storyOwnerIdString[1];
      const storiesData: any[] = JSON.parse(storiesDataString[1]);
      const stories: any[] = storiesData
        .map((story) => {
          const storyData = story?.node?.attachments?.[0]?.media;
          if (!storyData) {
            return undefined;
          }
          const id = storyData.id;
          const isVideo = storyData.__isMedia === "Video";
          const thumbnailUrl = isVideo
            ? storyData.previewImage.uri ||
              storyData.preferred_thumbnail.image.uri
            : undefined;
          const downloadUrl = isVideo
            ? storyData.videoDeliveryLegacyFields.browser_native_hd_url ||
              storyData.videoDeliveryLegacyFields.browser_native_sd_url
            : storyData.image.uri;
          return {
            id,
            uri: downloadUrl,
            isVideo,
            thumbnailUri: thumbnailUrl,
          };
        })
        .filter((story) => !!story);
      return { ownerId: storyOwnerId, stories };
    }
  };
}

export default FacebookRequest;
