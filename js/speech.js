export class SpeechOutput {
  constructor() {
    this.enabled = true;
    this.voice = null;
    this.rate = 1;
    this.language = "en-US";
    this.symbolGapMs = 120;
    this.symbolTimer = null;
    this.lastSpokenAt = 0;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  speak(text) {
    if (!this.enabled || !("speechSynthesis" in window) || !text) return;
    this.stop();
    window.speechSynthesis.resume();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.rate;
    utterance.lang = this.language;
    if (this.voice) {
      utterance.voice = this.voice;
    }
    window.speechSynthesis.speak(utterance);
  }

  speakSymbols(text) {
    if (!this.enabled || !("speechSynthesis" in window) || !text) return;
    const symbols = Array.from(String(text)).filter((ch) => ch.trim().length > 0);
    if (!symbols.length) return;
    this.stop();
    window.speechSynthesis.resume();

    const speakNext = (index) => {
      if (index >= symbols.length) return;
      const symbol = symbols[index];
      const utterance = new SpeechSynthesisUtterance(symbol);
      utterance.rate = Math.max(1, this.rate);
      utterance.lang = this.language;
      if (this.voice) {
        utterance.voice = this.voice;
      }
      utterance.onend = () => {
        this.lastSpokenAt = Date.now();
        this.symbolTimer = window.setTimeout(() => {
          speakNext(index + 1);
        }, this.symbolGapMs);
      };
      window.speechSynthesis.speak(utterance);
    };

    speakNext(0);
  }

  stop() {
    if (!("speechSynthesis" in window)) return;
    if (this.symbolTimer) {
      clearTimeout(this.symbolTimer);
      this.symbolTimer = null;
    }
    window.speechSynthesis.cancel();
  }

  getVoices() {
    if (!("speechSynthesis" in window)) return [];
    return window.speechSynthesis.getVoices();
  }

  setVoiceByName(name) {
    const voices = this.getVoices();
    this.voice = voices.find((v) => v.name === name) || null;
  }

  setRate(rate) {
    this.rate = Math.max(0.8, Math.min(2, Number(rate) || 1));
  }

  setLanguage(language) {
    this.language = language || "en-US";
  }
}
