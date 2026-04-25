export class SpeechToText {
  constructor() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.Recognition = Recognition || null;
    this.recognition = null;
    this.running = false;
  }

  isSupported() {
    return Boolean(this.Recognition);
  }

  start({ onPartial, onFinal, onError, onStateChange }) {
    if (!this.isSupported()) {
      throw new Error("Speech-to-text is not supported in this browser.");
    }
    if (this.running) return;

    this.recognition = new this.Recognition();
    this.recognition.lang = "en-US";
    this.recognition.interimResults = true;
    this.recognition.continuous = true;

    this.recognition.onresult = (event) => {
      let partial = "";
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          partial += transcript;
        }
      }
      if (partial) onPartial?.(partial.trim());
      if (finalText) onFinal?.(finalText.trim());
    };

    this.recognition.onerror = (event) => {
      onError?.(event.error || "speech-recognition-error");
    };

    this.recognition.onstart = () => {
      this.running = true;
      onStateChange?.(true);
    };

    this.recognition.onend = () => {
      this.running = false;
      onStateChange?.(false);
    };

    this.recognition.start();
  }

  stop() {
    if (!this.recognition) return;
    this.recognition.stop();
  }
}
