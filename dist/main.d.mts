interface IPhotoMedia {
    id: string;
    uri: string;
}
interface IReelMedia {
    id: string;
    uri: string;
}
interface IVideoMedia {
    id: string;
    uri: string;
}

declare class FacebookRequest {
    private axiosInstance;
    constructor(cookies: string);
    private getCurrentUserToken;
    private makeRequestToFacebook;
    getFbUserIdByUserName: (userName: string) => Promise<string>;
    getUserPhotos: (userId: string, startCursor: string, totalFetchedPhotos: number, limit: number) => Promise<IPhotoMedia[]>;
    getUserReels: (userId: string, startCursor: string, totalFetchedReels: number, limit: number) => Promise<IReelMedia[]>;
    private getVideoDownloadUri;
    getUserVideos: (userId: string, startCursor: string, totalFetchedVideos: number, limit: number) => Promise<IVideoMedia[]>;
    getStoryMedia: (storyId: string) => Promise<{
        ownerId: any;
        stories: any[];
    } | undefined>;
}

declare class PhotoDownloader {
    private facebookRequest;
    constructor(facebookRequest: FacebookRequest);
    downloadAllUserPhotos: (userName: string, limit?: number) => Promise<void>;
}

declare class ReelDownloader {
    private facebookRequest;
    constructor(facebookRequest: FacebookRequest);
    downloadAllUserReels: (userName: string, limit?: number) => Promise<void>;
}

declare class StoryDownloader {
    private facebookRequest;
    constructor(facebookRequest: FacebookRequest);
    private downloadStoryById;
    downloadStories(storiesId: string[]): Promise<void>;
}

declare class VideoDownloader {
    private facebookRequest;
    constructor(facebookRequest: FacebookRequest);
    downloadAllUserVideos: (userName: string, limit?: number) => Promise<void>;
}

declare class FacebookDownloader {
    private facebookRequest;
    photo: PhotoDownloader;
    reel: ReelDownloader;
    video: VideoDownloader;
    story: StoryDownloader;
    constructor(cookies: string);
}

export { FacebookDownloader };
