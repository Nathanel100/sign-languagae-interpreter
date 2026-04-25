export class CameraInput {
  constructor() {
    this.stream = null;
  }

  async start(videoEl) {
    this.stream = await getCameraStream();
    await applyLowLightFriendlyConstraints(this.stream);
    videoEl.srcObject = this.stream;
    await videoEl.play();
  }

  stop(videoEl) {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    if (videoEl) {
      videoEl.srcObject = null;
    }
  }
}

async function getCameraStream() {
  const constraintProfiles = [
    {
      video: {
        facingMode: { ideal: "user" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30, max: 30 }
      },
      audio: false
    },
    {
      video: {
        facingMode: { ideal: "user" },
        width: { ideal: 960 },
        height: { ideal: 540 },
        frameRate: { ideal: 24, max: 30 }
      },
      audio: false
    },
    {
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 }
      },
      audio: false
    },
    { video: true, audio: false }
  ];

  if (navigator.mediaDevices?.getUserMedia) {
    let lastError = null;
    for (const constraints of constraintProfiles) {
      try {
        return await navigator.mediaDevices.getUserMedia(constraints);
      } catch (error) {
        lastError = error;
      }
    }
    if (lastError) {
      throw mapCameraError(lastError);
    }
  }

  const legacyGetUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  if (legacyGetUserMedia) {
    const constraints = constraintProfiles[constraintProfiles.length - 1];
    return new Promise((resolve, reject) => {
      legacyGetUserMedia.call(navigator, constraints, resolve, reject);
    });
  }

  const isLikelyInsecure = window.location.protocol !== "https:" && !isLocalHostLike(window.location.hostname);
  if (isLikelyInsecure) {
    throw new Error("Camera needs HTTPS or localhost. Run this app on http://localhost (not file://).");
  }

  throw new Error("Camera API is unavailable in this browser. Try latest Chrome/Edge/Safari.");
}

function isLocalHostLike(hostname) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "[::1]" ||
    hostname === "::" ||
    hostname === "[::]"
  );
}

function mapCameraError(error) {
  const name = error?.name || "";
  if (name === "NotAllowedError" || name === "SecurityError") {
    return new Error("Camera permission denied. Allow camera access and try again.");
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return new Error("No camera device found.");
  }
  if (name === "NotReadableError" || name === "TrackStartError") {
    return new Error("Camera is busy or unavailable (used by another app).");
  }
  if (name === "OverconstrainedError" || name === "ConstraintNotSatisfiedError") {
    return new Error("Camera constraints not supported on this device.");
  }
  return new Error(error?.message || "Could not start camera.");
}

async function applyLowLightFriendlyConstraints(stream) {
  const track = stream?.getVideoTracks?.()[0];
  if (!track?.applyConstraints) return;

  try {
    await track.applyConstraints({
      advanced: [
        { exposureMode: "continuous" },
        { whiteBalanceMode: "continuous" },
        { focusMode: "continuous" }
      ]
    });
  } catch {
    // Browsers/devices vary; silently keep default camera behavior.
  }
}
