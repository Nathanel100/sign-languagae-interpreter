import { APP_CONFIG } from "./config.js";

export class OnlineStore {
  constructor() {
    this.enabled = Boolean(APP_CONFIG.onlineDb.enabled);
    this.provider = APP_CONFIG.onlineDb.provider;
    this.url = APP_CONFIG.onlineDb.supabaseUrl;
    this.key = APP_CONFIG.onlineDb.supabaseAnonKey;
  }

  isConfigured() {
    return this.enabled && this.provider === "supabase-rest" && Boolean(this.url) && Boolean(this.key);
  }

  async syncSession(payload) {
    if (!this.isConfigured()) return { ok: false, reason: "not-configured" };
    return this.upsert("app_sessions", payload, "id");
  }

  async syncSetting(key, value) {
    if (!this.isConfigured()) return { ok: false, reason: "not-configured" };
    return this.upsert(
      "app_settings",
      {
        key,
        value,
        updated_at: new Date().toISOString()
      },
      "key"
    );
  }

  async syncLanguage(languageRecord) {
    if (!this.isConfigured()) return { ok: false, reason: "not-configured" };
    return this.upsert("sign_languages", languageRecord, "id");
  }

  async fetchLanguages() {
    if (!this.isConfigured()) return [];
    const endpoint = `${this.url}/rest/v1/sign_languages?select=*`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: this.headers()
    });
    if (!response.ok) return [];
    return response.json();
  }

  async upsert(table, payload, conflictColumn) {
    const endpoint = `${this.url}/rest/v1/${table}?on_conflict=${encodeURIComponent(conflictColumn)}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        ...this.headers(),
        Prefer: "resolution=merge-duplicates"
      },
      body: JSON.stringify(payload)
    });
    return { ok: response.ok, status: response.status };
  }

  headers() {
    return {
      apikey: this.key,
      Authorization: `Bearer ${this.key}`,
      "Content-Type": "application/json"
    };
  }
}
