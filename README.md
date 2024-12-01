<div align="center">
    <img src="https://raw.githubusercontent.com/minhchi1509/facebook_downloader/main/public/facebook-logo.svg" width="10%" />
    <br />
     <h1 align="center">Facebook Downloader</h1>
</div>

## Features

- Download all photos, videos, story from a Facebook user

> [!WARNING]
> The above features only apply to public or private Facebook profiles (you have already been their friends).

> [!NOTE]
> All downloaded photos and videos will be saved in the Downloads folder (for Windows) on your computer.

## Installation

```bash
npm install @minhchi1509/facebook-downloader
```

## Usage

- This is an example:

```js
import { FacebookDownloader } from "@minhchi1509/facebook-downloader";

// Cookies of your Facebook account. You can get it by using Cookie-Editor extension on Chrome
const cookies = "YOUR_FACEBOOK_COOKIES";
// Username of the Facebook account you want to download
const username = "minhchi1509";

const facebookDownloader = new FacebookDownloader(cookies);

// Download all photos of the user
facebookDownloader.photo.downloadAllUserPhotos(username);

// Download all videos of the user
facebookDownloader.video.downloadAllUserVideos(username);

// Download all reels of the user
facebookDownloader.reel.downloadAllUserReels(username);

// Download stories
const storiesId = ["STORY_ID_1", "STORY_ID_2"];
facebookDownloader.story.downloadStories(storiesId);
```

## API Documentation

### Download photos, videos, reels

```js
facebookDownloader.photo.downloadAllUserPhotos(username, limit);
facebookDownloader.video.downloadAllUserVideos(username, limit);
facebookDownloader.reel.downloadAllUserReels(username, limit);
```

**Parameters**:
- **username** _(string, required)_: The username of facebook user that you want to download their media
- **limit** _(number, optional)_: The limit number of photos/reels/videos you want to download in one execution. Suitable when a user has too many photos/reels/videos and you only want to download by batch. Default value: `Infinity`

> [!WARNING]
> Note that when you specify the value of `limit` parameter, after the batch download is complete, there will be a folder named **cache_cursor/[user_id]** and it contains files like **photos.json**, **reels.json**, **videos.json** to save information for the next download. Please **DO NOT** edit anything in these files.
> If you want to download again from the beginning, delete the corresponding file, such as: **cache_cursor/[user_id]/photos.json** files.

### Download stories
```js
facebookDownloader.story.downloadStories(storiesId);
```
**Parameters**:
- **storiesId** _(string[], required)_: List of stories ID that you want to download

> [!TIP]
> If you want to download all the highlight stories on someone else's profile, go to their profile, in the highlight story section, scroll down until there are no more highlight stories. Then, press F12, go to the "Console" tab and paste the code below and press "Enter". You will now get an array containing all the story IDs. Pass it as a parameter to the `downloadStories()` function.

```js
let highlightStoryIds = [];
document
  .querySelectorAll(
    "div.x1qjc9v5.x9f619.x78zum5.x2lah0s.xw3qccf.xsgj6o6.x1bhewko.xeaf4i8.x18igh9x.xwyr2us.x1ey03fc.x11b4air"
  )
  .forEach((h) => {
    let e = h.querySelector("a");
    if (e && e.href) {
      let r = e.href.match(/stories\/(\d+)/);
      r && r[1] && highlightStoryIds.push(r[1]);
    }
  }),
  console.log(highlightStoryIds);
```
