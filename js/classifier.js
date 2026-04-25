const TIP_IDS = { thumb: 4, index: 8, middle: 12, ring: 16, pinky: 20 };
const PIP_IDS = { thumb: 3, index: 6, middle: 10, ring: 14, pinky: 18 };
const MCP_IDS = { thumb: 2, index: 5, middle: 9, ring: 13, pinky: 17 };

const LETTER_MODELS = [
  { letter: "A", pattern: [0, 0, 0, 0], thumbAcross: true, thumbTucked: false, thumbPosition: "side", openCount: 0 },
  { letter: "B", pattern: [1, 1, 1, 1], thumbAcross: false, openCount: 4 },
  { letter: "C", pattern: [1, 1, 1, 1], cShape: true, openCount: 4 },
  { letter: "D", pattern: [1, 0, 0, 0], openCount: 1 },
  { letter: "E", pattern: [0, 0, 0, 0], thumbAcross: false, openCount: 0 },
  { letter: "F", pattern: [0, 1, 1, 1], fShape: true, openCount: 3 },
  { letter: "G", pattern: [1, 0, 0, 0], horizontalIndex: true, openCount: 1 },
  { letter: "H", pattern: [1, 1, 0, 0], horizontalIndex: true, openCount: 2 },
  { letter: "I", pattern: [0, 0, 0, 1], openCount: 1 },
  { letter: "J", pattern: [0, 0, 0, 1], hasMotionHint: true, openCount: 1 },
  { letter: "K", pattern: [1, 1, 0, 0], thumbOpen: true, openCount: 2 },
  { letter: "L", pattern: [1, 0, 0, 0], thumbOpen: true, openCount: 1 },
  { letter: "M", pattern: [0, 0, 0, 0], thumbAcross: true, oShape: false, thumbDepth: "deep", thumbPosition: "deep", openCount: 0 },
  { letter: "N", pattern: [0, 0, 0, 0], thumbAcross: true, thumbDepth: "mid", openCount: 0 },
  { letter: "O", pattern: [0, 0, 0, 0], oShape: true, thumbAcross: false, thumbTucked: false, openCount: 0 },
  { letter: "P", pattern: [1, 1, 0, 0], downTilt: true, openCount: 2 },
  { letter: "Q", pattern: [1, 0, 0, 0], downTilt: true, openCount: 1 },
  { letter: "R", pattern: [1, 1, 0, 0], crossedIndexMiddle: true, openCount: 2 },
  { letter: "S", pattern: [0, 0, 0, 0], thumbAcross: false, openCount: 0 },
  { letter: "T", pattern: [0, 0, 0, 0], thumbDepth: "tip", thumbTucked: true, thumbPosition: "between", openCount: 0 },
  { letter: "U", pattern: [1, 1, 0, 0], openCount: 2 },
  { letter: "V", pattern: [1, 1, 0, 0], spreadIndexMiddle: true, openCount: 2 },
  { letter: "W", pattern: [1, 1, 1, 0], openCount: 3 },
  { letter: "X", pattern: [1, 0, 0, 0], hookIndex: true, openCount: 1 },
  { letter: "Y", pattern: [0, 0, 0, 1], thumbOpen: true, openCount: 1 },
  { letter: "Z", pattern: [1, 0, 0, 0], hasMotionHint: true, openCount: 1 }
];

export function classifySign(landmarks) {
  if (!landmarks) return unknown();

  const features = getFeatures(landmarks);
  const scored = LETTER_MODELS.map((model) => ({
    letter: model.letter,
    score: modelScore(model, features)
  })).sort((a, b) => b.score - a.score);

  if (!scored.length || scored[0].score < 0.46) {
    return unknown(features.fingerState);
  }

  return result(scored[0].letter, scored[0].score, {
    fingerState: features.fingerState,
    top3: scored.slice(0, 3)
  });
}

function getFingerState(landmarks) {
  return {
    thumb: isThumbExtended(landmarks),
    index: isFingerExtended(landmarks, "index"),
    middle: isFingerExtended(landmarks, "middle"),
    ring: isFingerExtended(landmarks, "ring"),
    pinky: isFingerExtended(landmarks, "pinky")
  };
}

function isFingerExtended(landmarks, finger) {
  const tip = landmarks[TIP_IDS[finger]];
  const pip = landmarks[PIP_IDS[finger]];
  const mcp = landmarks[MCP_IDS[finger]];
  const tipToMcp = distance(tip, mcp);
  const pipToMcp = distance(pip, mcp);
  const verticalOpen = tip.y < pip.y + 0.03;
  return tipToMcp > pipToMcp * 1.06 && verticalOpen;
}

function isThumbExtended(landmarks) {
  const tip = landmarks[TIP_IDS.thumb];
  const mcp = landmarks[MCP_IDS.thumb];
  const indexMcp = landmarks[MCP_IDS.index];
  const thumbReach = distance(tip, mcp);
  const awayFromPalmCenter = distance(tip, indexMcp);
  return thumbReach > 0.07 && awayFromPalmCenter > 0.075;
}

function isThumbAcrossPalm(landmarks) {
  return Math.abs(landmarks[4].x - landmarks[9].x) < 0.12;
}

function isCShape(landmarks) {
  const palmToIndex = distance(landmarks[0], landmarks[8]);
  const palmToPinky = distance(landmarks[0], landmarks[20]);
  return palmToIndex > 0.18 && palmToPinky > 0.18;
}

function isOShape(landmarks) {
  const thumbIndexTouch = distance(landmarks[4], landmarks[8]) < 0.06;
  const indexCurve = distance(landmarks[8], landmarks[5]) < 0.12;
  const middleCurve = distance(landmarks[12], landmarks[9]) < 0.12;
  const ringCurve = distance(landmarks[16], landmarks[13]) < 0.12;
  const pinkyCurve = distance(landmarks[20], landmarks[17]) < 0.12;
  const curvedFingers = [indexCurve, middleCurve, ringCurve, pinkyCurve].filter(Boolean).length >= 3;
  const tipCluster = distance(landmarks[8], landmarks[12]) < 0.09 && distance(landmarks[12], landmarks[16]) < 0.09;
  return thumbIndexTouch && curvedFingers && tipCluster;
}

function isFShape(landmarks) {
  const thumbIndex = distance(landmarks[4], landmarks[8]);
  const middleOpen = isFingerExtended(landmarks, "middle");
  const ringOpen = isFingerExtended(landmarks, "ring");
  const pinkyOpen = isFingerExtended(landmarks, "pinky");
  return thumbIndex < 0.06 && middleOpen && ringOpen && pinkyOpen;
}

function isIndexHorizontal(landmarks) {
  return Math.abs(landmarks[8].y - landmarks[6].y) < 0.05 && Math.abs(landmarks[8].x - landmarks[6].x) > 0.08;
}

function isDownTilt(landmarks) {
  return landmarks[8].y > landmarks[5].y;
}

function isIndexHooked(landmarks) {
  return landmarks[8].y > landmarks[7].y && landmarks[7].y < landmarks[6].y;
}

function thumbDepth(landmarks) {
  const d = distance(landmarks[4], landmarks[10]);
  if (d < 0.06) return "tip";
  if (d < 0.1) return "mid";
  return "deep";
}

function isThumbTucked(landmarks) {
  // T tends to keep thumb tip tucked between index and middle finger base.
  const thumbTip = landmarks[4];
  const indexMcp = landmarks[5];
  const middleMcp = landmarks[9];
  const toIndex = distance(thumbTip, indexMcp);
  const toMiddle = distance(thumbTip, middleMcp);
  return toIndex < 0.085 && toMiddle < 0.095;
}

function isThumbOutsidePalm(landmarks) {
  const thumbTipX = landmarks[4].x;
  const palmMcpXs = [landmarks[5].x, landmarks[9].x, landmarks[13].x, landmarks[17].x];
  const minPalmX = Math.min(...palmMcpXs);
  const maxPalmX = Math.max(...palmMcpXs);
  return thumbTipX < minPalmX - 0.006 || thumbTipX > maxPalmX + 0.006;
}

function getThumbPosition(landmarks) {
  const thumbTip = landmarks[4];
  const indexMcp = landmarks[5];
  const middleMcp = landmarks[9];
  const ringMcp = landmarks[13];

  const toIndex = distance(thumbTip, indexMcp);
  const toMiddle = distance(thumbTip, middleMcp);
  const toRing = distance(thumbTip, ringMcp);

  const outsidePalm = isThumbOutsidePalm(landmarks);

  // Thumb visible on the outside edge (typical "A" profile).
  if (outsidePalm && toIndex < 0.11 && toMiddle > 0.09) return "side";
  // Thumb tucked between index and middle bases (typical "T").
  if (toIndex < 0.095 && toMiddle < 0.095) return "between";
  // Thumb driven deeper across palm under fingers (typical "M").
  if (!outsidePalm && (toRing < 0.095 || toMiddle < 0.085)) return "deep";
  return "neutral";
}

function indexMiddleSpread(landmarks) {
  return distance(landmarks[8], landmarks[12]);
}

function getFeatures(landmarks) {
  const fingerState = getFingerState(landmarks);
  return {
    landmarks,
    fingerState,
    pattern: [
      Number(fingerState.index),
      Number(fingerState.middle),
      Number(fingerState.ring),
      Number(fingerState.pinky)
    ],
    openCount: Number(fingerState.index) + Number(fingerState.middle) + Number(fingerState.ring) + Number(fingerState.pinky),
    thumbOpen: fingerState.thumb,
    thumbAcross: isThumbAcrossPalm(landmarks),
    cShape: isCShape(landmarks),
    oShape: isOShape(landmarks),
    fShape: isFShape(landmarks),
    horizontalIndex: isIndexHorizontal(landmarks),
    downTilt: isDownTilt(landmarks),
    hookIndex: isIndexHooked(landmarks),
    spreadIndexMiddle: indexMiddleSpread(landmarks) > 0.08,
    crossedIndexMiddle: indexMiddleSpread(landmarks) < 0.04,
    thumbDepth: thumbDepth(landmarks),
    thumbOutsidePalm: isThumbOutsidePalm(landmarks),
    thumbPosition: getThumbPosition(landmarks),
    thumbTucked: isThumbTucked(landmarks),
    hasMotionHint: false
  };
}

function modelScore(model, features) {
  let score = 0;
  const patternMatches = model.pattern.filter((v, i) => v === features.pattern[i]).length;
  score += patternMatches * 0.14;

  if (typeof model.openCount === "number") {
    score += Math.max(0, 0.2 - Math.abs(model.openCount - features.openCount) * 0.1);
  }

  const checks = [
    "thumbOpen",
    "thumbAcross",
    "cShape",
    "oShape",
    "fShape",
    "horizontalIndex",
    "downTilt",
    "hookIndex",
    "spreadIndexMiddle",
    "crossedIndexMiddle",
    "thumbTucked",
    "hasMotionHint"
  ];
  for (const key of checks) {
    if (typeof model[key] === "boolean") {
      score += model[key] === features[key] ? 0.08 : -0.06;
    }
  }

  if (model.thumbDepth) {
    score += model.thumbDepth === features.thumbDepth ? 0.1 : -0.03;
  }

  if (model.thumbPosition) {
    score += model.thumbPosition === features.thumbPosition ? 0.14 : -0.06;
  }

  // Stronger disambiguation for closed-fist letters that commonly conflict.
  if (model.letter === "A") {
    if (features.thumbTucked) score -= 0.25;
    if (features.thumbPosition !== "side") score -= 0.2;
    if (features.thumbOutsidePalm) score += 0.14;
    if (features.thumbPosition === "deep") score -= 0.22;
  }
  if (model.letter === "M") {
    if (features.thumbPosition === "side") score -= 0.24;
    if (features.thumbOutsidePalm) score -= 0.2;
    if (features.thumbTucked) score -= 0.08;
  }
  if (model.letter === "T") {
    if (!features.thumbTucked) score -= 0.25;
    if (features.thumbPosition !== "between") score -= 0.18;
  }

  return Math.max(0, Math.min(0.95, score));
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function result(label, confidence, debug) {
  return { label, confidence, debug };
}

function unknown(fingerState = null) {
  return { label: "unknown", confidence: 0, debug: { fingerState, rule: "unknown" } };
}
