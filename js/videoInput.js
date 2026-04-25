export class VideoFileInput {
  constructor() {
    this.objectUrl = null;
  }

  async start(videoEl, file) {
    if (!file) {
      throw new Error("Select a video file first.");
    }
    this.cleanup();
    this.objectUrl = URL.createObjectURL(file);
    videoEl.srcObject = null;
    videoEl.src = this.objectUrl;
    videoEl.muted = true;
    videoEl.currentTime = 0;
    await videoEl.play();
  }

  stop(videoEl) {
    if (videoEl) {
      videoEl.pause();
      videoEl.removeAttribute("src");
      videoEl.load();
    }
    this.cleanup();
  }

  cleanup() {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}
