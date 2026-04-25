import { APP_CONFIG } from "./config.js";

const MP_TASKS_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs";
const WASM_ROOT =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";

export class LandmarkDetector {
  constructor() {
    this.handLandmarker = null;
    this.histories = [[], []];
    this.ready = false;
  }

  async init() {
    if (this.ready) return;
    try {
      const mp = await import(MP_TASKS_URL);
      const filesetResolver = await mp.FilesetResolver.forVisionTasks(WASM_ROOT);
      this.handLandmarker = await mp.HandLandmarker.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
          },
          runningMode: "VIDEO",
          numHands: 2
        }
      );
      this.ready = true;
    } catch (error) {
      throw new Error(
        "Hand model unavailable offline. Connect once to load model, then retry."
      );
    }
  }

  detect(videoEl, nowMs) {
    if (!this.handLandmarker || videoEl.readyState < 2) {
      return null;
    }

    const result = this.handLandmarker.detectForVideo(videoEl, nowMs);
    const allLandmarks = result?.landmarks ?? [];
    if (!allLandmarks.length) {
      this.histories = [[], []];
      return { hands: [] };
    }

    const hands = allLandmarks.slice(0, 2).map((landmarks, index) => {
      this.histories[index].push(landmarks);
      const max = APP_CONFIG.smoothing.historySize;
      if (this.histories[index].length > max) this.histories[index].shift();
      const smoothed = smoothLandmarks(this.histories[index]);
      const handedness = result?.handednesses?.[index]?.[0]?.categoryName ?? "unknown";
      const handednessScore = result?.handednesses?.[index]?.[0]?.score ?? 0;
      return { landmarks: smoothed, handedness, handednessScore };
    });

    if (hands.length < this.histories.length) {
      for (let i = hands.length; i < this.histories.length; i += 1) {
        this.histories[i] = [];
      }
    }

    return { hands };
  }
}

function smoothLandmarks(history) {
  const count = history.length;
  return history[0].map((_, idx) => {
    let sx = 0;
    let sy = 0;
    let sz = 0;
    for (const frame of history) {
      sx += frame[idx].x;
      sy += frame[idx].y;
      sz += frame[idx].z;
    }
    return { x: sx / count, y: sy / count, z: sz / count };
  });
}
