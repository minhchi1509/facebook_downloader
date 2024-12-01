import PhotoDownloader from "src/modules/downloaders/PhotoDownloader";
import ReelDownloader from "src/modules/downloaders/ReelDownloader";
import StoryDownloader from "src/modules/downloaders/StoryDownloader";
import VideoDownloader from "src/modules/downloaders/VideoDownloader";
import FacebookRequest from "src/modules/FacebookRequest";

class FacebookDownloader {
  private facebookRequest: FacebookRequest;
  public photo: PhotoDownloader;
  public reel: ReelDownloader;
  public video: VideoDownloader;
  public story: StoryDownloader;

  constructor(cookies: string) {
    this.facebookRequest = new FacebookRequest(cookies);
    this.photo = new PhotoDownloader(this.facebookRequest);
    this.reel = new ReelDownloader(this.facebookRequest);
    this.video = new VideoDownloader(this.facebookRequest);
    this.story = new StoryDownloader(this.facebookRequest);
  }
}

export default FacebookDownloader;
