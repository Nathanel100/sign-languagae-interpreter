const DB_NAME = "aslTranslatorOfflineDB";
const DB_VERSION = 3;
const SETTINGS_STORE = "settings";
const SESSIONS_STORE = "sessions";
const SIGN_LANGUAGES_STORE = "signLanguages";

export class OfflineStore {
  constructor() {
    this.db = null;
  }

  async init() {
    if (!("indexedDB" in window)) {
      throw new Error("IndexedDB is not supported in this browser.");
    }
    this.db = await openDatabase();
  }

  async saveSetting(key, value) {
    if (!this.db) return;
    await runTransaction(this.db, SETTINGS_STORE, "readwrite", (store) => {
      store.put({ key, value, updatedAt: Date.now() });
    });
  }

  async getSetting(key) {
    if (!this.db) return null;
    return runTransaction(this.db, SETTINGS_STORE, "readonly", (store, done) => {
      const req = store.get(key);
      req.onsuccess = () => done(req.result?.value ?? null);
      req.onerror = () => done(null);
    });
  }

  async saveSession(data) {
    if (!this.db) return;
    const payload = {
      id: "latest",
      ...data,
      updatedAt: Date.now()
    };
    await runTransaction(this.db, SESSIONS_STORE, "readwrite", (store) => {
      store.put(payload);
    });
  }

  async getLatestSession() {
    if (!this.db) return null;
    return runTransaction(this.db, SESSIONS_STORE, "readonly", (store, done) => {
      const req = store.get("latest");
      req.onsuccess = () => done(req.result ?? null);
      req.onerror = () => done(null);
    });
  }

  async seedSignLanguageData() {
    if (!this.db) return;
    const seeds = buildSignLanguageSeeds();
    await runTransaction(this.db, SIGN_LANGUAGES_STORE, "readwrite", (store) => {
      seeds.forEach((item) => {
        store.put(item);
      });
    });
  }

  async getSignLanguageById(id) {
    if (!this.db) return null;
    return runTransaction(this.db, SIGN_LANGUAGES_STORE, "readonly", (store, done) => {
      const req = store.get(id);
      req.onsuccess = () => done(req.result ?? null);
      req.onerror = () => done(null);
    });
  }

  async getAllSignLanguages() {
    if (!this.db) return [];
    return runTransaction(this.db, SIGN_LANGUAGES_STORE, "readonly", (store, done) => {
      const req = store.getAll();
      req.onsuccess = () => done(req.result ?? []);
      req.onerror = () => done([]);
    });
  }
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE, { keyPath: "key" });
      }
      if (!db.objectStoreNames.contains(SESSIONS_STORE)) {
        db.createObjectStore(SESSIONS_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(SIGN_LANGUAGES_STORE)) {
        db.createObjectStore(SIGN_LANGUAGES_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function buildSignLanguageSeeds() {
  const now = Date.now();
  return [buildAslDetailedSeed(now), buildBslSeed(now), buildIslSeed(now)];
}

function buildAslDetailedSeed(now) {
  return {
    id: "asl-detailed",
    languageName: "American Sign Language",
    shortCode: "ASL",
    region: "United States and Canada",
    directionality: "one-handed and two-handed signs",
    status: "active",
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((symbol) => ({
      symbol,
      type: "letter",
      category: "alphabet",
      handUsage: ["left", "right"],
      motionType: ["static"],
      confidenceHint: 0.65,
      description: `ASL letter ${symbol}`,
      tips: [
        "Keep hand centered in frame.",
        "Avoid motion blur while holding the sign."
      ]
    })),
    numbers: Array.from({ length: 10 }, (_, n) => ({
      symbol: String(n),
      type: "number",
      category: "digits",
      handUsage: ["left", "right"],
      motionType: ["static"],
      description: `ASL number ${n}`
    })),
    phrases: [
      { symbol: "HELLO", type: "phrase", difficulty: "easy", description: "Greeting" },
      { symbol: "THANK YOU", type: "phrase", difficulty: "easy", description: "Gratitude" },
      { symbol: "PLEASE", type: "phrase", difficulty: "medium", description: "Polite request" },
      { symbol: "YES", type: "phrase", difficulty: "easy", description: "Affirmation" },
      { symbol: "NO", type: "phrase", difficulty: "easy", description: "Negation" },
      { symbol: "SORRY", type: "phrase", difficulty: "easy", description: "Apology" },
      { symbol: "I LOVE YOU", type: "phrase", difficulty: "medium", description: "Affection phrase" }
    ],
    confusionPairs: [
      ["M", "N"],
      ["U", "V"],
      ["R", "U"],
      ["P", "Q"],
      ["A", "S"]
    ],
    metadata: {
      schemaVersion: 1,
      source: "project-seed",
      notes: "Use this dataset as offline baseline for rule tuning."
    },
    createdAt: now,
    updatedAt: now
  };
}

function buildBslSeed(now) {
  return {
    id: "bsl-basic",
    languageName: "British Sign Language",
    shortCode: "BSL",
    region: "United Kingdom",
    directionality: "mostly two-handed alphabet",
    status: "planned",
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((symbol) => ({
      symbol,
      type: "letter",
      category: "alphabet",
      handUsage: ["both"],
      motionType: ["static", "dynamic"],
      description: `BSL letter ${symbol} (reference entry)`
    })),
    phrases: [
      { symbol: "HELLO", type: "phrase", description: "Greeting reference" },
      { symbol: "THANK YOU", type: "phrase", description: "Gratitude reference" }
    ],
    metadata: {
      schemaVersion: 1,
      source: "project-seed",
      notes: "Reference dataset for future BSL classifier profile."
    },
    createdAt: now,
    updatedAt: now
  };
}

function buildIslSeed(now) {
  return {
    id: "isl-basic",
    languageName: "Indian Sign Language",
    shortCode: "ISL",
    region: "India",
    directionality: "mixed hand usage",
    status: "planned",
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((symbol) => ({
      symbol,
      type: "letter",
      category: "alphabet",
      handUsage: ["left", "right", "both"],
      motionType: ["static", "dynamic"],
      description: `ISL letter ${symbol} (reference entry)`
    })),
    phrases: [
      { symbol: "NAMASTE", type: "phrase", description: "Greeting reference" },
      { symbol: "THANK YOU", type: "phrase", description: "Gratitude reference" }
    ],
    metadata: {
      schemaVersion: 1,
      source: "project-seed",
      notes: "Reference dataset for future ISL classifier profile."
    },
    createdAt: now,
    updatedAt: now
  };
}

function runTransaction(db, storeName, mode, callback) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    let resolved = false;
    const done = (value) => {
      if (!resolved) {
        resolved = true;
        resolve(value);
      }
    };
    callback(store, done);
    tx.oncomplete = () => done(null);
    tx.onerror = () => reject(tx.error);
  });
}
