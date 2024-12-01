export interface ICachedCursor {
  totalFetchedItems: number;
  nextCursor: string;
}

export interface ICurrentUserToken {
  userId: string;
  fbDtsg: string;
}

export interface IPhotoMedia {
  id: string;
  uri: string;
}

export interface IReelMedia {
  id: string;
  uri: string;
}

export interface IVideoMedia {
  id: string;
  uri: string;
}

export interface IStoryMedia {
  id: string;
  uri: string;
  isVideo: boolean;
  thumbnailUri?: string;
}
