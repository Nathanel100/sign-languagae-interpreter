export class UI {
  constructor() {
    this.inputMode = document.getElementById("inputMode");
    this.aslToTextLanguageSelect = document.getElementById("aslToTextLanguageSelect");
    this.fileRow = document.getElementById("fileRow");
    this.videoFile = document.getElementById("videoFile");
    this.startBtn = document.getElementById("startBtn");
    this.stopBtn = document.getElementById("stopBtn");
    this.resetBtn = document.getElementById("resetBtn");
    this.debugBtn = document.getElementById("debugBtn");
    this.video = document.getElementById("video");
    this.overlay = document.getElementById("overlay");
    this.status = document.getElementById("status");
    this.currentSign = document.getElementById("currentSign");
    this.confidence = document.getElementById("confidence");
    this.confidenceFill = document.getElementById("confidenceFill");
    this.fps = document.getElementById("fps");
    this.outputText = document.getElementById("outputText");
    this.signOutput = document.getElementById("signOutput");
    this.signOutputImage = document.getElementById("signOutputImage");
    this.signOutputSequence = document.getElementById("signOutputSequence");
    this.tokenChips = document.getElementById("tokenChips");
    this.speakOutputBtn = document.getElementById("speakOutputBtn");
    this.copyOutputBtn = document.getElementById("copyOutputBtn");
    this.clearOutputBtn = document.getElementById("clearOutputBtn");
    this.listenStartBtn = document.getElementById("listenStartBtn");
    this.listenStopBtn = document.getElementById("listenStopBtn");
    this.clearSttBtn = document.getElementById("clearSttBtn");
    this.copySttBtn = document.getElementById("copySttBtn");
    this.sttState = document.getElementById("sttState");
    this.ttsInput = document.getElementById("ttsInput");
    this.themeSelect = document.getElementById("themeSelect");
    this.locationPreferenceSelect = document.getElementById("locationPreferenceSelect");
    this.locationLanguageStatus = document.getElementById("locationLanguageStatus");
    this.connectionModeSelect = document.getElementById("connectionModeSelect");
    this.connectionModeStatus = document.getElementById("connectionModeStatus");
    this.detectLocationLanguageBtn = document.getElementById("detectLocationLanguageBtn");
    this.locationLanguageStatus = document.getElementById("locationLanguageStatus");
    this.textToAslInput = document.getElementById("textToAslInput");
    this.textToAslLanguageSelect = document.getElementById("textToAslLanguageSelect");
    this.convertAslBtn = document.getElementById("convertAslBtn");
    this.translateAslImagesBtn = document.getElementById("translateAslImagesBtn");
    this.playAslSequenceBtn = document.getElementById("playAslSequenceBtn");
    this.stopAslSequenceBtn = document.getElementById("stopAslSequenceBtn");
    this.aslOutput = document.getElementById("aslOutput");
    this.aslImageOutput = document.getElementById("aslImageOutput");
    this.textToAslLivePreviewImage = document.getElementById("textToAslLivePreviewImage");
    this.textToAslLivePreviewLabel = document.getElementById("textToAslLivePreviewLabel");
    this.imageTextFile = document.getElementById("imageTextFile");
    this.imageToTextPanel = document.getElementById("imageToTextPanel");
    this.extractImageTextBtn = document.getElementById("extractImageTextBtn");
    this.imageTextOutput = document.getElementById("imageTextOutput");
    this.speakInputBtn = document.getElementById("speakInputBtn");
    this.stopSpeakBtn = document.getElementById("stopSpeakBtn");
    this.languageSelect = document.getElementById("languageSelect");
    this.voiceSelect = document.getElementById("voiceSelect");
    this.rateRange = document.getElementById("rateRange");
    this.rateValue = document.getElementById("rateValue");
    this.sttOutput = document.getElementById("sttOutput");
    this.debugPanel = document.getElementById("debugPanel");
    this.debugText = document.getElementById("debugText");
    this.toastContainer = document.getElementById("toastContainer");
  }

  setInputMode(mode) {
    if (!this.fileRow) return;
    this.fileRow.hidden = mode !== "video";
  }

  setRunning(isRunning) {
    if (!this.startBtn || !this.stopBtn) return;
    this.startBtn.disabled = isRunning;
    this.stopBtn.disabled = !isRunning;
  }

  setStatus(message) {
    if (!this.status) return;
    this.status.textContent = message;
  }

  setCollectStatus(message) {
    if (!this.collectStatus) return;
    this.collectStatus.textContent = message;
  }

  setLocationLanguageStatus(message) {
    if (!this.locationLanguageStatus) return;
    this.locationLanguageStatus.textContent = message;
  }

  setConnectionModeStatus(message) {
    if (!this.connectionModeStatus) return;
    this.connectionModeStatus.textContent = message;
  }

  setLocationLanguageStatus(message) {
    if (!this.locationLanguageStatus) return;
    this.locationLanguageStatus.textContent = message;
  }

  setCurrentSign(label, confidence) {
    if (!this.currentSign || !this.confidence || !this.confidenceFill) return;
    this.currentSign.textContent = label;
    this.confidence.textContent = confidence.toFixed(2);
    this.confidenceFill.style.width = `${Math.max(0, Math.min(100, confidence * 100))}%`;
  }

  setFPS(value) {
    if (!this.fps) return;
    this.fps.textContent = String(value);
  }

  setOutput(text) {
    if (!this.outputText) return;
    this.outputText.value = text;
  }

  setSignOutput(text) {
    if (!this.signOutput) return;
    this.signOutput.textContent = text || "-";
  }

  setSignOutputImage(src, label = "sign") {
    if (!this.signOutputImage) return;
    if (!src) {
      this.signOutputImage.removeAttribute("src");
      this.signOutputImage.alt = "No sign image";
      return;
    }
    this.signOutputImage.src = src;
    this.signOutputImage.alt = `${label} sign`;
  }

  addSignOutputSequenceItem(item) {
    if (!this.signOutputSequence || !item?.src) return;
    const card = document.createElement("button");
    card.type = "button";
    card.className = "sign-image-card";
    card.dataset.label = item.label || "";
    card.dataset.language = (item.language || "ASL").toUpperCase();
    card.style.setProperty("--token-accent", this.getDistinctAccent(item.label, item.language));
    card.title = `Speak ${item.label || "sign"}`;

    const img = document.createElement("img");
    img.className = "sign-image";
    img.src = item.src;
    img.alt = `${item.label || "sign"} signal`;
    img.loading = "lazy";
    img.onerror = () => {
      img.onerror = null;
      img.src = this.getFallbackSignImage(item.label || "?", item.language);
    };

    const caption = document.createElement("span");
    caption.className = "sign-image-label";
    caption.textContent = item.label || "?";

    card.appendChild(img);
    card.appendChild(caption);
    this.signOutputSequence.prepend(card);

    while (this.signOutputSequence.children.length > 30) {
      this.signOutputSequence.removeChild(this.signOutputSequence.lastElementChild);
    }
  }

  clearSignOutputSequence() {
    if (!this.signOutputSequence) return;
    this.signOutputSequence.innerHTML = "";
  }

  addTokenChip(token) {
    if (!this.tokenChips) return;
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "token-chip";
    chip.dataset.token = token;
    chip.textContent = token;
    this.tokenChips.prepend(chip);
    while (this.tokenChips.children.length > 24) {
      this.tokenChips.removeChild(this.tokenChips.lastElementChild);
    }
  }

  clearTokenChips() {
    if (!this.tokenChips) return;
    this.tokenChips.innerHTML = "";
  }

  setSpeechListening(isListening) {
    if (!this.listenStartBtn || !this.listenStopBtn || !this.sttState) return;
    this.listenStartBtn.disabled = isListening;
    this.listenStopBtn.disabled = !isListening;
    this.sttState.textContent = isListening ? "Listening" : "Idle";
    this.sttState.classList.toggle("listening", isListening);
  }

  setSpeechToText(text) {
    if (!this.sttOutput) return;
    this.sttOutput.value = text;
  }

  setAslOutput(text) {
    if (!this.aslOutput) return;
    this.aslOutput.value = text;
  }

  renderAslImages(items) {
    if (!this.aslImageOutput) return;
    this.aslImageOutput.innerHTML = "";
    if (!items?.length) {
      this.setTextToAslLivePreview("", "-", "ASL");
      return;
    }

    items.forEach((item) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "sign-image-card";
      card.dataset.label = item.label;
      card.dataset.language = (item.language || "ASL").toUpperCase();
      card.style.setProperty("--token-accent", this.getDistinctAccent(item.label, item.language));
      card.title = `Speak ${item.label}`;

      const img = document.createElement("img");
      img.className = "sign-image";
      img.src = item.src;
      img.alt = `${item.label} sign`;
      img.loading = "lazy";
      img.referrerPolicy = "no-referrer";
      img.onerror = () => {
        img.onerror = null;
        img.src = this.getFallbackSignImage(item.label, item.language);
      };

      const caption = document.createElement("span");
      caption.className = "sign-image-label";
      caption.textContent = item.label;

      card.appendChild(img);
      card.appendChild(caption);
      this.aslImageOutput.appendChild(card);
    });
    const first = items[0];
    this.setTextToAslLivePreview(first?.src || "", first?.label || "-", first?.language || "ASL");
  }

  getFallbackSignImage(label, language = "ASL") {
    const safeLabel = String(label ?? "?").replace(/[<>&"]/g, "");
    const lang = String(language || "ASL").toUpperCase();
    const icon = lang === "BSL" ? "B" : lang === "ISL" ? "I" : "A";
    const accent = lang === "BSL" ? "#a78bfa" : lang === "ISL" ? "#34d399" : "#93c5fd";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="140" viewBox="0 0 220 140"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1f2937"/></linearGradient></defs><rect width="220" height="140" rx="12" fill="url(#g)"/><rect x="8" y="8" width="204" height="124" rx="10" fill="none" stroke="${accent}" stroke-width="2"/><text x="110" y="28" text-anchor="middle" font-size="12" fill="${accent}" font-family="Arial, sans-serif">${lang} MISSING IMAGE</text><text x="110" y="74" text-anchor="middle" font-size="46" fill="${accent}" font-family="Arial, sans-serif">${icon}</text><text x="110" y="114" text-anchor="middle" font-size="18" fill="#e5e7eb" font-family="Arial, sans-serif">${safeLabel}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  getDistinctAccent(label, language = "ASL") {
    const seed = `${String(language || "ASL").toUpperCase()}-${String(label || "")}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash * 31 + seed.charCodeAt(i)) % 360;
    }
    return `hsl(${hash}, 78%, 58%)`;
  }

  setImageTextOutput(text) {
    if (!this.imageTextOutput) return;
    this.imageTextOutput.value = text;
  }

  setSignSequencePlaying(isPlaying) {
    if (!this.playAslSequenceBtn || !this.stopAslSequenceBtn) return;
    this.playAslSequenceBtn.disabled = isPlaying;
    this.stopAslSequenceBtn.disabled = !isPlaying;
  }

  clearActiveSignImage() {
    if (!this.aslImageOutput) return;
    this.aslImageOutput.querySelectorAll(".sign-image-card.active").forEach((el) => el.classList.remove("active"));
  }

  setActiveSignImage(index) {
    if (!this.aslImageOutput) return;
    this.clearActiveSignImage();
    const cards = this.aslImageOutput.querySelectorAll(".sign-image-card");
    const card = cards[index];
    if (!card) return;
    card.classList.add("active");
    card.scrollIntoView({ block: "nearest", inline: "nearest" });
    const img = card.querySelector("img");
    this.setTextToAslLivePreview(
      img?.src || "",
      card.dataset.label || "-",
      card.dataset.language || "ASL"
    );
  }

  setTextToAslLivePreview(src, label = "-", language = "ASL") {
    if (this.textToAslLivePreviewImage) {
      if (src) {
        this.textToAslLivePreviewImage.src = src;
        this.textToAslLivePreviewImage.alt = "";
      } else {
        this.textToAslLivePreviewImage.removeAttribute("src");
        this.textToAslLivePreviewImage.alt = "";
      }
    }
    if (this.textToAslLivePreviewLabel) {
      this.textToAslLivePreviewLabel.textContent = `Live preview: ${label} (${String(language).toUpperCase()})`;
    }
  }

  setRateValue(value) {
    if (!this.rateValue) return;
    this.rateValue.textContent = `${Number(value).toFixed(1)}x`;
  }

  showToast(message) {
    if (!this.toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    this.toastContainer.appendChild(toast);
    window.setTimeout(() => {
      toast.classList.add("hide");
      window.setTimeout(() => toast.remove(), 180);
    }, 1800);
  }

  populateVoices(voices) {
    if (!this.voiceSelect) return;
    this.voiceSelect.innerHTML = "";
    voices.forEach((voice) => {
      const option = document.createElement("option");
      option.value = voice.name;
      option.textContent = `${voice.name} (${voice.lang})`;
      this.voiceSelect.appendChild(option);
    });
  }

  toggleDebug() {
    if (!this.debugPanel) return;
    this.debugPanel.hidden = !this.debugPanel.hidden;
  }

  setDebug(data) {
    if (!this.debugText) return;
    this.debugText.textContent = JSON.stringify(data, null, 2);
  }

  clearCanvas() {
    if (!this.overlay) return;
    const ctx = this.overlay.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, this.overlay.width, this.overlay.height);
  }
}
