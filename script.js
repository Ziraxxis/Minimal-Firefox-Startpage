(() => {
  "use strict";

  const SETTINGS_KEY = "minimalStartpageSettingsV3";
  const WALLPAPER_KEY = "minimalStartpageWallpaper";
  const WALLPAPER_FETCH_LOCK_KEY = "minimalStartpageWallpaperFetchLock";
  const MANUAL_WALLPAPER_FETCH_KEY = "minimalStartpageManualWallpaperFetch";
  const MANUAL_WALLPAPER_COOLDOWN_MS = 2 * 60 * 1000;
  const WALLPAPER_FETCH_LOCK_MS = 30 * 1000;
  const UTM = "utm_source=minimal_firefox_startpage&utm_medium=referral";

  const clockEl = document.getElementById("clock");
  const dateEl = document.getElementById("date");
  const quoteWrap = document.getElementById("quote-wrap");
  const quoteEl = document.getElementById("quote");
  const form = document.getElementById("search-form");
  const input = document.getElementById("search");
  const launcher = document.getElementById("launcher");
  const background = document.getElementById("background");

  const credit = document.getElementById("credit");
  const creditPhotographer = document.getElementById("credit-photographer");
  const creditUnsplash = document.getElementById("credit-unsplash");

  const hotspot = document.getElementById("settings-hotspot");
  const overlay = document.getElementById("settings-overlay");
  const settingsPanel = document.getElementById("settings-panel");
  const settingsClose = document.getElementById("settings-close");
  const settingsCancel = document.getElementById("cancel-settings");
  const resetSettingsButton = document.getElementById("reset-settings");

  const fontFamilyInput = document.getElementById("setting-font-family");
  const clockFontFamilyInput = document.getElementById("setting-clock-font-family");
  const searchEngineInput = document.getElementById("setting-search-engine");
  const customSearchWrap = document.getElementById("custom-search-wrap");
  const customSearchUrlInput = document.getElementById("custom-search-url");
  const pageCustomFontWrap = document.getElementById("page-custom-font-wrap");
  const pageCustomFontInput = document.getElementById("page-custom-font");
  const clockCustomFontWrap = document.getElementById("clock-custom-font-wrap");
  const clockCustomFontInput = document.getElementById("clock-custom-font");

  const textColorInput = document.getElementById("setting-text-color");
  const textColorValue = document.getElementById("setting-text-color-value");
  const mutedColorInput = document.getElementById("setting-muted-color");
  const mutedColorValue = document.getElementById("setting-muted-color-value");
  const accentColorInput = document.getElementById("setting-accent-color");
  const accentColorValue = document.getElementById("setting-accent-color-value");
  const clockColorInput = document.getElementById("setting-clock-color");
  const clockColorValue = document.getElementById("setting-clock-color-value");

  const clockSizeInput = document.getElementById("setting-clock-size");
  const clockSizeValue = document.getElementById("setting-clock-size-value");
  const dateSizeInput = document.getElementById("setting-date-size");
  const dateSizeValue = document.getElementById("setting-date-size-value");
  const quoteSizeInput = document.getElementById("setting-quote-size");
  const quoteSizeValue = document.getElementById("setting-quote-size-value");
  const searchSizeInput = document.getElementById("setting-search-size");
  const searchSizeValue = document.getElementById("setting-search-size-value");
  const launcherSizeInput = document.getElementById("setting-launcher-size");
  const launcherSizeValue = document.getElementById("setting-launcher-size-value");

  const blurInput = document.getElementById("setting-blur");
  const blurValue = document.getElementById("setting-blur-value");
  const darknessInput = document.getElementById("setting-darkness");
  const darknessValue = document.getElementById("setting-darkness-value");
  const keyInput = document.getElementById("setting-unsplash-key");
  const toggleKey = document.getElementById("toggle-key");
  const enableUnsplashButton = document.getElementById("enable-unsplash");
  const unsplashPermissionStatus = document.getElementById("unsplash-permission-status");
  const fallbackInput = document.getElementById("setting-fallback");
  const sitesEditor = document.getElementById("settings-sites");
  const collectionsEditor = document.getElementById("settings-collections");
  const quotesEditor = document.getElementById("settings-quotes");
  const addSiteButton = document.getElementById("add-site");
  const addCollectionButton = document.getElementById("add-collection");
  const addQuoteButton = document.getElementById("add-quote");
  const siteTemplate = document.getElementById("site-row-template");
  const collectionTemplate = document.getElementById("collection-row-template");
  const quoteTemplate = document.getElementById("quote-row-template");
  const newWallpaperButton = document.getElementById("new-wallpaper");
  const wallpaperStatus = document.getElementById("wallpaper-status");

  function cloneSites(sites) {
    return Array.isArray(sites)
      ? sites
          .filter((site) => site && typeof site === "object")
          .map((site) => ({
            name: String(site.name || ""),
            url: String(site.url || "")
          }))
      : [];
  }

  function cloneCollections(collections) {
    return Array.isArray(collections)
      ? collections.map((value) => String(value || "")).filter(Boolean)
      : [];
  }

  function cloneQuotes(quotes) {
    return Array.isArray(quotes)
      ? quotes.map((value) => String(value || "").trim()).filter(Boolean)
      : [];
  }


  function normalizeHexColor(value, fallback) {
    const raw = String(value || "").trim();

    if (/^#[0-9a-f]{6}$/i.test(raw)) return raw.toUpperCase();

    const short = raw.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
    if (short) {
      return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`.toUpperCase();
    }

    return String(fallback || "#FFFFFF").toUpperCase();
  }

  function normalizedFont(value, fallback) {
    const font = String(value || "").trim();
    return font || String(fallback || "monospace");
  }


  const FONT_PRESETS = Object.freeze([
    {
      label: "Liberation Sans",
      value: '"Liberation Sans", Arial, sans-serif'
    },
    {
      label: "System UI",
      value: 'system-ui, sans-serif'
    },
    {
      label: "Sans Serif",
      value: 'sans-serif'
    },
    {
      label: "Serif",
      value: 'serif'
    },
    {
      label: "Monospace",
      value: 'monospace'
    },
    {
      label: "Liberation Mono",
      value: '"Liberation Mono", "DejaVu Sans Mono", monospace'
    },
    {
      label: "JetBrains Mono",
      value: '"JetBrains Mono", "DejaVu Sans Mono", monospace'
    },
    {
      label: "Noto Sans",
      value: '"Noto Sans", "Liberation Sans", sans-serif'
    },
    {
      label: "Noto Sans Mono",
      value: '"Noto Sans Mono", "DejaVu Sans Mono", monospace'
    },
    {
      label: "DejaVu Sans",
      value: '"DejaVu Sans", "Liberation Sans", sans-serif'
    },
    {
      label: "DejaVu Sans Mono",
      value: '"DejaVu Sans Mono", "Liberation Mono", monospace'
    },
    {
      label: "Cantarell",
      value: '"Cantarell", "Liberation Sans", sans-serif'
    }
  ]);

  const CUSTOM_FONT_VALUE = "__custom__";

  function customFontToStack(value, fallback = "sans-serif") {
    const raw = String(value || "").trim();

    if (!raw) return fallback;

    /*
     * If the user supplied a CSS stack already, preserve it exactly.
     * Otherwise quote the family name and add a generic fallback.
     */
    if (
      raw.includes(",") ||
      raw.startsWith('"') ||
      raw.startsWith("'")
    ) {
      return raw;
    }

    const escaped = raw.replaceAll('"', '\\"');
    return `"${escaped}", ${fallback}`;
  }

  function fontValueForControls(select, customInput, fallback) {
    if (select.value === CUSTOM_FONT_VALUE) {
      return normalizedFont(
        customFontToStack(customInput.value, fallback),
        fallback
      );
    }

    return normalizedFont(select.value, fallback);
  }

  const CUSTOM_SEARCH_VALUE = "__custom__";

  const SEARCH_PRESETS = new Set([
    "https://duckduckgo.com/?q=%s",
    "https://www.google.com/search?q=%s",
    "https://search.brave.com/search?q=%s",
    "https://www.startpage.com/sp/search?query=%s",
    "https://kagi.com/search?q=%s",
    "https://www.bing.com/search?q=%s"
  ]);

  function normalizeSearchUrl(value, fallback = "https://duckduckgo.com/?q=%s") {
    const raw = String(value || "").trim();

    if (!raw) return fallback;
    if (!raw.includes("%s")) return fallback;

    try {
      const testUrl = raw.replace("%s", "test");
      const parsed = new URL(testUrl);

      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        return fallback;
      }

      return raw;
    } catch (_) {
      return fallback;
    }
  }

  function searchUrlFromControls() {
    if (searchEngineInput.value === CUSTOM_SEARCH_VALUE) {
      return normalizeSearchUrl(
        customSearchUrlInput.value,
        DEFAULT_SETTINGS.searchUrl
      );
    }

    return normalizeSearchUrl(
      searchEngineInput.value,
      DEFAULT_SETTINGS.searchUrl
    );
  }

  function populateSearchControls(value) {
    const searchUrl = normalizeSearchUrl(
      value,
      DEFAULT_SETTINGS.searchUrl
    );

    if (SEARCH_PRESETS.has(searchUrl)) {
      searchEngineInput.value = searchUrl;
      customSearchUrlInput.value = "";
      customSearchWrap.hidden = true;
      return;
    }

    searchEngineInput.value = CUSTOM_SEARCH_VALUE;
    customSearchUrlInput.value = searchUrl;
    customSearchWrap.hidden = false;
  }

  function updateCustomSearchVisibility({ focus = false } = {}) {
    const isCustom = searchEngineInput.value === CUSTOM_SEARCH_VALUE;
    customSearchWrap.hidden = !isCustom;

    if (isCustom && focus) {
      window.requestAnimationFrame(() => customSearchUrlInput.focus());
    }
  }

  const DEFAULT_SETTINGS = Object.freeze({
    fontFamily: normalizedFont(CONFIG.fontFamily, "monospace"),
    clockFontFamily: normalizedFont(
      CONFIG.clockFontFamily,
      CONFIG.fontFamily || "monospace"
    ),
    textColor: normalizeHexColor(CONFIG.textColor, "#ECEFF4"),
    mutedColor: normalizeHexColor(CONFIG.mutedColor, "#D8DEE9"),
    accentColor: normalizeHexColor(CONFIG.accentColor, "#88C0D0"),
    clockColor: normalizeHexColor(CONFIG.clockColor, "#ECEFF4"),
    clockSize: Math.min(220, Math.max(48, Number(CONFIG.clockSize) || 150)),
    dateSize: Math.min(28, Math.max(8, Number(CONFIG.dateSize) || 13)),
    quoteSize: Math.min(36, Math.max(10, Number(CONFIG.quoteSize) || 17)),
    searchSize: Math.min(32, Math.max(10, Number(CONFIG.searchSize) || 16)),
    launcherSize: Math.min(30, Math.max(8, Number(CONFIG.launcherSize) || 13)),
    searchUrl: normalizeSearchUrl(
      CONFIG.searchUrl,
      "https://duckduckgo.com/?q=%s"
    ),
    wallpaperBlur: Number.isFinite(Number(CONFIG.wallpaperBlur))
      ? Number(CONFIG.wallpaperBlur)
      : 0,
    wallpaperDarkness: Number.isFinite(Number(CONFIG.wallpaperDarkness))
      ? Number(CONFIG.wallpaperDarkness)
      : 43,
    sites: cloneSites(CONFIG.sites),
    quotes: cloneQuotes(CONFIG.quotes),
    unsplashAccessKey: String(CONFIG.unsplashAccessKey || ""),
    unsplashCollections: cloneCollections(CONFIG.unsplashCollections),
    fallbackBackground: String(CONFIG.fallbackBackground || "")
  });

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function loadSettings() {
    let saved = {};

    try {
      saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") || {};
    } catch (_) {
      saved = {};
    }

    return {
      fontFamily:
        typeof saved.fontFamily === "string"
          ? normalizedFont(saved.fontFamily, DEFAULT_SETTINGS.fontFamily)
          : DEFAULT_SETTINGS.fontFamily,
      clockFontFamily:
        typeof saved.clockFontFamily === "string"
          ? normalizedFont(saved.clockFontFamily, DEFAULT_SETTINGS.clockFontFamily)
          : DEFAULT_SETTINGS.clockFontFamily,
      textColor: normalizeHexColor(saved.textColor, DEFAULT_SETTINGS.textColor),
      mutedColor: normalizeHexColor(saved.mutedColor, DEFAULT_SETTINGS.mutedColor),
      accentColor: normalizeHexColor(saved.accentColor, DEFAULT_SETTINGS.accentColor),
      clockColor: normalizeHexColor(saved.clockColor, DEFAULT_SETTINGS.clockColor),
      clockSize: clamp(
        Number.isFinite(Number(saved.clockSize))
          ? Number(saved.clockSize)
          : DEFAULT_SETTINGS.clockSize,
        48,
        220
      ),
      dateSize: clamp(
        Number.isFinite(Number(saved.dateSize))
          ? Number(saved.dateSize)
          : DEFAULT_SETTINGS.dateSize,
        8,
        28
      ),
      quoteSize: clamp(
        Number.isFinite(Number(saved.quoteSize))
          ? Number(saved.quoteSize)
          : DEFAULT_SETTINGS.quoteSize,
        10,
        36
      ),
      searchSize: clamp(
        Number.isFinite(Number(saved.searchSize))
          ? Number(saved.searchSize)
          : DEFAULT_SETTINGS.searchSize,
        10,
        32
      ),
      launcherSize: clamp(
        Number.isFinite(Number(saved.launcherSize))
          ? Number(saved.launcherSize)
          : DEFAULT_SETTINGS.launcherSize,
        8,
        30
      ),
      searchUrl:
        typeof saved.searchUrl === "string"
          ? normalizeSearchUrl(saved.searchUrl, DEFAULT_SETTINGS.searchUrl)
          : DEFAULT_SETTINGS.searchUrl,
      wallpaperBlur: clamp(
        Number.isFinite(Number(saved.wallpaperBlur))
          ? Number(saved.wallpaperBlur)
          : DEFAULT_SETTINGS.wallpaperBlur,
        0,
        30
      ),
      wallpaperDarkness: clamp(
        Number.isFinite(Number(saved.wallpaperDarkness))
          ? Number(saved.wallpaperDarkness)
          : DEFAULT_SETTINGS.wallpaperDarkness,
        0,
        90
      ),
      sites: Array.isArray(saved.sites)
        ? cloneSites(saved.sites)
        : cloneSites(DEFAULT_SETTINGS.sites),
      quotes: Array.isArray(saved.quotes)
        ? cloneQuotes(saved.quotes)
        : cloneQuotes(DEFAULT_SETTINGS.quotes),
      unsplashAccessKey:
        typeof saved.unsplashAccessKey === "string"
          ? saved.unsplashAccessKey
          : DEFAULT_SETTINGS.unsplashAccessKey,
      unsplashCollections: Array.isArray(saved.unsplashCollections)
        ? cloneCollections(saved.unsplashCollections)
        : cloneCollections(DEFAULT_SETTINGS.unsplashCollections),
      fallbackBackground:
        typeof saved.fallbackBackground === "string"
          ? saved.fallbackBackground
          : DEFAULT_SETTINGS.fallbackBackground
    };
  }

  let SETTINGS = loadSettings();

  function applyVisualSettings(settings = SETTINGS) {
    const root = document.documentElement;

    root.style.setProperty(
      "--font",
      normalizedFont(settings.fontFamily, DEFAULT_SETTINGS.fontFamily)
    );

    root.style.setProperty(
      "--clock-font",
      normalizedFont(settings.clockFontFamily, settings.fontFamily)
    );

    root.style.setProperty(
      "--text",
      normalizeHexColor(settings.textColor, DEFAULT_SETTINGS.textColor)
    );

    root.style.setProperty(
      "--muted",
      normalizeHexColor(settings.mutedColor, DEFAULT_SETTINGS.mutedColor)
    );

    root.style.setProperty(
      "--accent",
      normalizeHexColor(settings.accentColor, DEFAULT_SETTINGS.accentColor)
    );

    root.style.setProperty(
      "--clock-color",
      normalizeHexColor(settings.clockColor, DEFAULT_SETTINGS.clockColor)
    );

    root.style.setProperty(
      "--clock-size",
      `${clamp(Number(settings.clockSize) || DEFAULT_SETTINGS.clockSize, 48, 220)}px`
    );

    root.style.setProperty(
      "--date-size",
      `${clamp(Number(settings.dateSize) || DEFAULT_SETTINGS.dateSize, 8, 28)}px`
    );

    root.style.setProperty(
      "--quote-size",
      `${clamp(Number(settings.quoteSize) || DEFAULT_SETTINGS.quoteSize, 10, 36)}px`
    );

    root.style.setProperty(
      "--search-size",
      `${clamp(Number(settings.searchSize) || DEFAULT_SETTINGS.searchSize, 10, 32)}px`
    );

    root.style.setProperty(
      "--launcher-size",
      `${clamp(Number(settings.launcherSize) || DEFAULT_SETTINGS.launcherSize, 8, 30)}px`
    );

    root.style.setProperty(
      "--wallpaper-blur",
      `${clamp(Number(settings.wallpaperBlur) || 0, 0, 30)}px`
    );

    root.style.setProperty(
      "--wallpaper-darkness",
      String(clamp(Number(settings.wallpaperDarkness) || 0, 0, 90) / 100)
    );
  }

  function updateClock() {
    const now = new Date();

    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !CONFIG.clock24Hour
    };

    if (CONFIG.showSeconds) {
      timeOptions.second = "2-digit";
    }

    clockEl.textContent = now.toLocaleTimeString([], timeOptions);

    if (CONFIG.showDate) {
      dateEl.hidden = false;
      dateEl.textContent = now.toLocaleDateString([], {
        weekday: "long",
        day: "2-digit",
        month: "long"
      });
    } else {
      dateEl.hidden = true;
    }
  }

  function randomIndex(length, previous = -1) {
    if (length <= 1) return 0;

    let index;
    do {
      index = Math.floor(Math.random() * length);
    } while (index === previous);

    return index;
  }

  let currentQuote = -1;

  function showNextQuote() {
    const quotes = cloneQuotes(SETTINGS.quotes);

    if (quotes.length === 0) {
      currentQuote = -1;
      quoteEl.textContent = "";
      quoteWrap.hidden = true;
      return;
    }

    quoteWrap.hidden = false;
    const next = randomIndex(quotes.length, currentQuote);
    currentQuote = next;

    quoteWrap.style.opacity = "0";

    window.setTimeout(() => {
      quoteEl.textContent = quotes[next];
      quoteWrap.style.opacity = "1";
    }, 220);
  }

  function normalizeUrl(value) {
    const url = String(value || "").trim();
    if (!url) return "";
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(url)) return url;
    return `https://${url}`;
  }

  function buildLauncher() {
    launcher.textContent = "";

    for (const site of SETTINGS.sites || []) {
      if (!site?.name || !site?.url) continue;

      const link = document.createElement("a");
      link.textContent = site.name;
      link.href = normalizeUrl(site.url);
      launcher.appendChild(link);
    }
  }

  function submitSearch(event) {
    event.preventDefault();

    const value = input.value.trim();
    if (!value) return;

    const looksLikeUrl =
      /^https?:\/\//i.test(value) ||
      (/^[^\s]+\.[^\s]+$/.test(value) && !value.includes(" "));

    if (looksLikeUrl) {
      window.location.assign(normalizeUrl(value));
      return;
    }

    const destination = normalizeSearchUrl(
      SETTINGS.searchUrl,
      DEFAULT_SETTINGS.searchUrl
    ).replace(
      "%s",
      encodeURIComponent(value)
    );

    window.location.assign(destination);
  }

  function collectionIds(settings = SETTINGS) {
    const ids = [];

    for (const value of settings.unsplashCollections || []) {
      if (!value) continue;

      const match = String(value).match(/\/collections\/([^/]+)/i);
      const id = match ? match[1] : String(value).trim();

      if (id) ids.push(id);
    }

    return ids;
  }

  function setBackground(url) {
    if (!url) return;

    const img = new Image();

    img.onload = () => {
      background.style.opacity = "0";

      window.setTimeout(() => {
        background.style.backgroundImage = `url("${url}")`;
        background.style.opacity = "1";
      }, 160);
    };

    img.src = url;
  }

  function withUtm(url) {
    if (!url) return "#";
    return `${url}${url.includes("?") ? "&" : "?"}${UTM}`;
  }

  function showCredit(data) {
    if (!data?.photographer || !data?.photographerUrl) {
      credit.hidden = true;
      return;
    }

    creditPhotographer.textContent = data.photographer;
    creditPhotographer.href = withUtm(data.photographerUrl);
    creditUnsplash.href = `https://unsplash.com/?${UTM}`;
    credit.hidden = false;
  }

  function applyWallpaperData(data) {
    if (!data?.url) return false;

    setBackground(data.url);
    showCredit(data);
    return true;
  }

  function cacheWallpaper(data) {
    try {
      localStorage.setItem(
        WALLPAPER_KEY,
        JSON.stringify({
          ...data,
          fetchedAt: Date.now()
        })
      );
    } catch (_) {}
  }

  function clearWallpaperCache() {
    try {
      localStorage.removeItem(WALLPAPER_KEY);
    } catch (_) {}
  }

  function getCachedWallpaper() {
    try {
      return JSON.parse(localStorage.getItem(WALLPAPER_KEY) || "null");
    } catch (_) {
      return null;
    }
  }

  async function hasUnsplashAuthConsent() {
    try {
      const permissions = await browser.permissions.getAll();

      return Array.isArray(permissions.data_collection) &&
        permissions.data_collection.includes("authenticationInfo");
    } catch (error) {
      console.warn("Could not read data-collection permissions:", error);
      return false;
    }
  }

  async function requestUnsplashAuthConsent() {
    try {
      return await browser.permissions.request({
        data_collection: ["authenticationInfo"]
      });
    } catch (error) {
      console.warn("Could not request Unsplash data consent:", error);
      return false;
    }
  }

  function setUnsplashPermissionStatus(message, kind = "") {
    unsplashPermissionStatus.textContent = message;
    unsplashPermissionStatus.classList.remove("ok", "error");

    if (kind) {
      unsplashPermissionStatus.classList.add(kind);
    }
  }

  async function updateUnsplashPermissionUi() {
    const granted = await hasUnsplashAuthConsent();

    if (granted) {
      enableUnsplashButton.textContent = "[Unsplash enabled]";
      enableUnsplashButton.disabled = true;
      setUnsplashPermissionStatus("permission granted", "ok");
      return true;
    }

    enableUnsplashButton.textContent = "[enable Unsplash]";
    enableUnsplashButton.disabled = false;
    setUnsplashPermissionStatus("not enabled");
    return false;
  }

  async function enableUnsplash() {
    if (!keyInput.value.trim()) {
      setUnsplashPermissionStatus("enter an access key first", "error");
      keyInput.focus();
      return;
    }

    enableUnsplashButton.disabled = true;
    setUnsplashPermissionStatus("waiting for Firefox…");

    const granted = await requestUnsplashAuthConsent();

    if (granted) {
      enableUnsplashButton.textContent = "[Unsplash enabled]";
      enableUnsplashButton.disabled = true;
      setUnsplashPermissionStatus("permission granted", "ok");
    } else {
      enableUnsplashButton.textContent = "[enable Unsplash]";
      enableUnsplashButton.disabled = false;
      setUnsplashPermissionStatus("permission not granted", "error");
    }
  }

  async function fetchUnsplashWallpaper(settings = SETTINGS) {
    const key = String(settings.unsplashAccessKey || "").trim();
    const ids = collectionIds(settings);

    if (!key || ids.length === 0) {
      return null;
    }

    /*
     * The key is optional authentication data. Never transmit it unless
     * Firefox says the user has granted that optional data permission.
     */
    if (!(await hasUnsplashAuthConsent())) {
      return null;
    }

    const collection = ids[Math.floor(Math.random() * ids.length)];

    const endpoint = new URL("https://api.unsplash.com/photos/random");
    endpoint.searchParams.set("collections", collection);
    endpoint.searchParams.set("orientation", "landscape");
    endpoint.searchParams.set("content_filter", "high");

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Client-ID ${key}`,
        "Accept-Version": "v1"
      }
    });

    if (!response.ok) {
      throw new Error(`Unsplash returned ${response.status}`);
    }

    const photo = await response.json();
    const imageUrl = new URL(photo.urls.raw);
    imageUrl.searchParams.set("auto", "format");
    imageUrl.searchParams.set("fit", "crop");
    imageUrl.searchParams.set("crop", "entropy");
    imageUrl.searchParams.set("w", "2560");
    imageUrl.searchParams.set("q", "88");

    return {
      url: imageUrl.toString(),
      photographer: photo.user?.name || "unknown",
      photographerUrl: photo.user?.links?.html || "",
      photoUrl: photo.links?.html || ""
    };
  }

  function wallpaperFetchLockIsActive() {
    try {
      const timestamp = Number(
        localStorage.getItem(WALLPAPER_FETCH_LOCK_KEY) || 0
      );

      return timestamp > 0 &&
        (Date.now() - timestamp) < WALLPAPER_FETCH_LOCK_MS;
    } catch (_) {
      return false;
    }
  }

  function acquireWallpaperFetchLock() {
    if (wallpaperFetchLockIsActive()) return false;

    try {
      localStorage.setItem(
        WALLPAPER_FETCH_LOCK_KEY,
        String(Date.now())
      );
    } catch (_) {}

    return true;
  }

  function releaseWallpaperFetchLock() {
    try {
      localStorage.removeItem(WALLPAPER_FETCH_LOCK_KEY);
    } catch (_) {}
  }

  async function refreshWallpaper(
    force = false,
    settings = SETTINGS,
    { respectLock = true } = {}
  ) {
    const cached = getCachedWallpaper();
    const cycleMs = Math.max(
      1,
      Number(CONFIG.wallpaperCycleMinutes || 30)
    ) * 60 * 1000;

    if (cached?.url) {
      applyWallpaperData(cached);
    } else if (settings.fallbackBackground) {
      setBackground(settings.fallbackBackground);
      credit.hidden = true;
    }

    const freshEnough =
      cached?.fetchedAt &&
      (Date.now() - cached.fetchedAt) < cycleMs;

    if (!force && freshEnough) {
      return { status: "cached" };
    }

    if (respectLock && !acquireWallpaperFetchLock()) {
      return { status: "locked" };
    }

    try {
      const wallpaper = await fetchUnsplashWallpaper(settings);

      if (!wallpaper) {
        return { status: "not-configured" };
      }

      cacheWallpaper(wallpaper);
      applyWallpaperData(wallpaper);
      return { status: "fetched" };
    } catch (error) {
      console.warn("Wallpaper refresh failed:", error);
      return {
        status: "error",
        error
      };
    } finally {
      if (respectLock) releaseWallpaperFetchLock();
    }
  }

  function addSiteEditorRow(site = { name: "", url: "" }) {
    const fragment = siteTemplate.content.cloneNode(true);
    const row = fragment.querySelector(".site-row");
    row.querySelector(".site-name").value = site.name || "";
    row.querySelector(".site-url").value = site.url || "";
    row.querySelector(".remove-row").addEventListener("click", () => row.remove());
    sitesEditor.appendChild(fragment);
  }

  function addCollectionEditorRow(value = "") {
    const fragment = collectionTemplate.content.cloneNode(true);
    const row = fragment.querySelector(".collection-row");
    row.querySelector(".collection-url").value = value || "";
    row.querySelector(".remove-row").addEventListener("click", () => row.remove());
    collectionsEditor.appendChild(fragment);
  }

  function addQuoteEditorRow(value = "") {
    const fragment = quoteTemplate.content.cloneNode(true);
    const row = fragment.querySelector(".quote-row");
    row.querySelector(".quote-text").value = value || "";
    row.querySelector(".remove-row").addEventListener("click", () => row.remove());
    quotesEditor.appendChild(fragment);
  }


  function firstFontFamily(stack) {
    const raw = String(stack || "").trim();
    const quoted = raw.match(/^\s*["']([^"']+)["']/);

    return quoted
      ? quoted[1]
      : raw.split(",")[0].trim().replace(/^["']|["']$/g, "");
  }

  function populateFontSelect(
    select,
    customWrap,
    customInput,
    selectedValue
  ) {
    select.textContent = "";

    const rawSelected = String(selectedValue || "");
    const selectedFirst = firstFontFamily(rawSelected).toLocaleLowerCase();

    let selectedFound = false;

    for (const preset of FONT_PRESETS) {
      const option = document.createElement("option");
      option.value = preset.value;
      option.textContent = preset.label;
      option.style.fontFamily = preset.value;

      const presetFirst = firstFontFamily(preset.value).toLocaleLowerCase();

      if (
        rawSelected === preset.value ||
        (selectedFirst && selectedFirst === presetFirst)
      ) {
        option.selected = true;
        selectedFound = true;
      }

      select.appendChild(option);
    }

    const customOption = document.createElement("option");
    customOption.value = CUSTOM_FONT_VALUE;
    customOption.textContent = "Custom…";
    select.appendChild(customOption);

    if (!selectedFound && rawSelected) {
      customOption.selected = true;
      customInput.value = rawSelected;
      customWrap.hidden = false;
    } else {
      customInput.value = "";
      customWrap.hidden = true;
    }
  }

  function updateCustomFontVisibility(
    select,
    customWrap,
    customInput,
    { focus = false } = {}
  ) {
    const isCustom = select.value === CUSTOM_FONT_VALUE;
    customWrap.hidden = !isCustom;

    if (isCustom && focus) {
      window.requestAnimationFrame(() => customInput.focus());
    }
  }

  function selectedPageFont() {
    return fontValueForControls(
      fontFamilyInput,
      pageCustomFontInput,
      DEFAULT_SETTINGS.fontFamily
    );
  }

  function selectedClockFont() {
    return fontValueForControls(
      clockFontFamilyInput,
      clockCustomFontInput,
      selectedPageFont() || DEFAULT_SETTINGS.clockFontFamily
    );
  }

  function populateSettingsForm() {
    populateFontSelect(
      fontFamilyInput,
      pageCustomFontWrap,
      pageCustomFontInput,
      SETTINGS.fontFamily
    );

    populateFontSelect(
      clockFontFamilyInput,
      clockCustomFontWrap,
      clockCustomFontInput,
      SETTINGS.clockFontFamily
    );

    textColorInput.value = normalizeHexColor(SETTINGS.textColor, "#ECEFF4");
    mutedColorInput.value = normalizeHexColor(SETTINGS.mutedColor, "#D8DEE9");
    accentColorInput.value = normalizeHexColor(SETTINGS.accentColor, "#88C0D0");
    clockColorInput.value = normalizeHexColor(SETTINGS.clockColor, "#ECEFF4");

    textColorValue.textContent = textColorInput.value.toUpperCase();
    mutedColorValue.textContent = mutedColorInput.value.toUpperCase();
    accentColorValue.textContent = accentColorInput.value.toUpperCase();
    clockColorValue.textContent = clockColorInput.value.toUpperCase();

    clockSizeInput.value = String(SETTINGS.clockSize);
    dateSizeInput.value = String(SETTINGS.dateSize);
    quoteSizeInput.value = String(SETTINGS.quoteSize);
    searchSizeInput.value = String(SETTINGS.searchSize);
    launcherSizeInput.value = String(SETTINGS.launcherSize);

    clockSizeValue.textContent = `${clockSizeInput.value}px`;
    dateSizeValue.textContent = `${dateSizeInput.value}px`;
    quoteSizeValue.textContent = `${quoteSizeInput.value}px`;
    searchSizeValue.textContent = `${searchSizeInput.value}px`;
    launcherSizeValue.textContent = `${launcherSizeInput.value}px`;

    populateSearchControls(SETTINGS.searchUrl);

    blurInput.value = String(SETTINGS.wallpaperBlur);
    darknessInput.value = String(SETTINGS.wallpaperDarkness);
    keyInput.value = SETTINGS.unsplashAccessKey || "";
    keyInput.type = "password";
    toggleKey.textContent = "[show]";
    fallbackInput.value = SETTINGS.fallbackBackground || "";

    blurValue.textContent = `${blurInput.value}px`;
    darknessValue.textContent = `${darknessInput.value}%`;

    sitesEditor.textContent = "";
    for (const site of SETTINGS.sites) addSiteEditorRow(site);

    collectionsEditor.textContent = "";
    for (const collection of SETTINGS.unsplashCollections) {
      addCollectionEditorRow(collection);
    }

    quotesEditor.textContent = "";
    for (const quote of SETTINGS.quotes) {
      addQuoteEditorRow(quote);
    }
  }

  function openSettings() {
    populateSettingsForm();
    setWallpaperStatus("save does not fetch", "");
    updateUnsplashPermissionUi();
    overlay.hidden = false;
    document.body.classList.add("settings-open");
    settingsClose.focus();
  }

  function closeSettings({ restorePreview = true } = {}) {
    overlay.hidden = true;
    document.body.classList.remove("settings-open");

    if (restorePreview) {
      applyVisualSettings(SETTINGS);
    }

    input.focus();
  }

  function collectSitesFromEditor() {
    return Array.from(sitesEditor.querySelectorAll(".site-row"))
      .map((row) => ({
        name: row.querySelector(".site-name").value.trim(),
        url: normalizeUrl(row.querySelector(".site-url").value)
      }))
      .filter((site) => site.name && site.url);
  }

  function collectCollectionsFromEditor() {
    return Array.from(collectionsEditor.querySelectorAll(".collection-url"))
      .map((element) => element.value.trim())
      .filter(Boolean);
  }

  function collectQuotesFromEditor() {
    return Array.from(quotesEditor.querySelectorAll(".quote-text"))
      .map((element) => element.value.trim())
      .filter(Boolean);
  }

  async function saveSettings(event) {
    event.preventDefault();

    const requestedUnsplashKey = keyInput.value.trim();

    /*
     * Saving the key is local-only. Permission to transmit it to Unsplash
     * is requested separately through [enable Unsplash].
     */
    SETTINGS = {
      fontFamily: selectedPageFont(),
      clockFontFamily: selectedClockFont(),
      textColor: normalizeHexColor(textColorInput.value, DEFAULT_SETTINGS.textColor),
      mutedColor: normalizeHexColor(mutedColorInput.value, DEFAULT_SETTINGS.mutedColor),
      accentColor: normalizeHexColor(accentColorInput.value, DEFAULT_SETTINGS.accentColor),
      clockColor: normalizeHexColor(clockColorInput.value, DEFAULT_SETTINGS.clockColor),
      clockSize: clamp(Number(clockSizeInput.value) || DEFAULT_SETTINGS.clockSize, 48, 220),
      dateSize: clamp(Number(dateSizeInput.value) || DEFAULT_SETTINGS.dateSize, 8, 28),
      quoteSize: clamp(Number(quoteSizeInput.value) || DEFAULT_SETTINGS.quoteSize, 10, 36),
      searchSize: clamp(Number(searchSizeInput.value) || DEFAULT_SETTINGS.searchSize, 10, 32),
      launcherSize: clamp(Number(launcherSizeInput.value) || DEFAULT_SETTINGS.launcherSize, 8, 30),
      searchUrl: searchUrlFromControls(),
      wallpaperBlur: clamp(Number(blurInput.value) || 0, 0, 30),
      wallpaperDarkness: clamp(Number(darknessInput.value) || 0, 0, 90),
      sites: collectSitesFromEditor(),
      quotes: collectQuotesFromEditor(),
      unsplashAccessKey: requestedUnsplashKey,
      unsplashCollections: collectCollectionsFromEditor(),
      fallbackBackground: fallbackInput.value.trim()
    };

    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS));
    } catch (_) {}

    /*
     * Deliberately do NOT clear the wallpaper cache and do NOT fetch.
     * Appearance / quicklink saves should cost zero Unsplash API calls.
     */
    applyVisualSettings(SETTINGS);
    buildLauncher();
    currentQuote = -1;
    showNextQuote();

    /*
     * If no wallpaper exists at all, applying a fallback is local-only
     * and does not touch Unsplash.
     */
    if (!getCachedWallpaper()?.url && SETTINGS.fallbackBackground) {
      setBackground(SETTINGS.fallbackBackground);
      credit.hidden = true;
    }

    closeSettings({ restorePreview: false });
  }

  function resetSettings() {
    if (!window.confirm("Reset startpage settings to config.js defaults?")) return;

    try {
      localStorage.removeItem(SETTINGS_KEY);
    } catch (_) {}

    clearWallpaperCache();
    window.location.reload();
  }


  function setWallpaperStatus(message, kind = "") {
    wallpaperStatus.textContent = message;
    wallpaperStatus.classList.remove("ok", "error");
    if (kind) wallpaperStatus.classList.add(kind);
  }

  function settingsWallpaperPreview() {
    return {
      ...SETTINGS,
      unsplashAccessKey: keyInput.value.trim(),
      unsplashCollections: collectCollectionsFromEditor(),
      fallbackBackground: fallbackInput.value.trim()
    };
  }

  async function requestNewWallpaper() {
    const now = Date.now();
    let lastManual = 0;

    try {
      lastManual = Number(
        localStorage.getItem(MANUAL_WALLPAPER_FETCH_KEY) || 0
      );
    } catch (_) {}

    const remaining = MANUAL_WALLPAPER_COOLDOWN_MS - (now - lastManual);

    if (remaining > 0) {
      const seconds = Math.ceil(remaining / 1000);
      setWallpaperStatus(`try again in ${seconds}s`, "error");
      return;
    }

    const previewSettings = settingsWallpaperPreview();

    if (
      !previewSettings.unsplashAccessKey ||
      collectionIds(previewSettings).length === 0
    ) {
      setWallpaperStatus("add key + collection first", "error");
      return;
    }

    if (!(await hasUnsplashAuthConsent())) {
      setWallpaperStatus("enable Unsplash first", "error");
      setUnsplashPermissionStatus("permission required", "error");
      return;
    }

    try {
      localStorage.setItem(
        MANUAL_WALLPAPER_FETCH_KEY,
        String(now)
      );
    } catch (_) {}

    newWallpaperButton.disabled = true;
    setWallpaperStatus("fetching…");

    const result = await refreshWallpaper(
      true,
      previewSettings,
      { respectLock: true }
    );

    newWallpaperButton.disabled = false;

    if (result.status === "fetched") {
      setWallpaperStatus("new wallpaper loaded", "ok");
    } else if (result.status === "locked") {
      setWallpaperStatus("another tab is fetching", "");
    } else if (result.status === "not-configured") {
      setWallpaperStatus("add key + collection first", "error");
    } else {
      setWallpaperStatus("fetch failed", "error");
    }
  }


  function previewAppearance() {
    const preview = {
      ...SETTINGS,
      fontFamily: selectedPageFont(),
      clockFontFamily: selectedClockFont(),
      textColor: normalizeHexColor(textColorInput.value, DEFAULT_SETTINGS.textColor),
      mutedColor: normalizeHexColor(mutedColorInput.value, DEFAULT_SETTINGS.mutedColor),
      accentColor: normalizeHexColor(accentColorInput.value, DEFAULT_SETTINGS.accentColor),
      clockColor: normalizeHexColor(clockColorInput.value, DEFAULT_SETTINGS.clockColor),
      clockSize: Number(clockSizeInput.value),
      dateSize: Number(dateSizeInput.value),
      quoteSize: Number(quoteSizeInput.value),
      searchSize: Number(searchSizeInput.value),
      launcherSize: Number(launcherSizeInput.value)
    };

    applyVisualSettings(preview);
  }

  fontFamilyInput.addEventListener("change", () => {
    updateCustomFontVisibility(
      fontFamilyInput,
      pageCustomFontWrap,
      pageCustomFontInput,
      { focus: true }
    );
    previewAppearance();
  });

  clockFontFamilyInput.addEventListener("change", () => {
    updateCustomFontVisibility(
      clockFontFamilyInput,
      clockCustomFontWrap,
      clockCustomFontInput,
      { focus: true }
    );
    previewAppearance();
  });

  pageCustomFontInput.addEventListener("input", previewAppearance);
  clockCustomFontInput.addEventListener("input", previewAppearance);

  searchEngineInput.addEventListener("change", () => {
    updateCustomSearchVisibility({ focus: true });
  });

  enableUnsplashButton.addEventListener("click", enableUnsplash);
  newWallpaperButton.addEventListener("click", requestNewWallpaper);

  for (const [inputElement, outputElement] of [
    [textColorInput, textColorValue],
    [mutedColorInput, mutedColorValue],
    [accentColorInput, accentColorValue],
    [clockColorInput, clockColorValue]
  ]) {
    inputElement.addEventListener("input", () => {
      outputElement.textContent = inputElement.value.toUpperCase();
      previewAppearance();
    });
  }

  for (const [inputElement, outputElement] of [
    [clockSizeInput, clockSizeValue],
    [dateSizeInput, dateSizeValue],
    [quoteSizeInput, quoteSizeValue],
    [searchSizeInput, searchSizeValue],
    [launcherSizeInput, launcherSizeValue]
  ]) {
    inputElement.addEventListener("input", () => {
      outputElement.textContent = `${inputElement.value}px`;
      previewAppearance();
    });
  }

  blurInput.addEventListener("input", () => {
    blurValue.textContent = `${blurInput.value}px`;
    document.documentElement.style.setProperty(
      "--wallpaper-blur",
      `${blurInput.value}px`
    );
  });

  darknessInput.addEventListener("input", () => {
    darknessValue.textContent = `${darknessInput.value}%`;
    document.documentElement.style.setProperty(
      "--wallpaper-darkness",
      String(Number(darknessInput.value) / 100)
    );
  });

  toggleKey.addEventListener("click", () => {
    const showing = keyInput.type === "text";
    keyInput.type = showing ? "password" : "text";
    toggleKey.textContent = showing ? "[show]" : "[hide]";
  });

  keyInput.addEventListener("input", () => {
    if (enableUnsplashButton.disabled) return;

    if (keyInput.value.trim()) {
      setUnsplashPermissionStatus("saved locally - enable when ready");
    } else {
      setUnsplashPermissionStatus("not enabled");
    }
  });

  addSiteButton.addEventListener("click", () => {
    addSiteEditorRow();
    const rows = sitesEditor.querySelectorAll(".site-row");
    rows[rows.length - 1]?.querySelector(".site-name")?.focus();
  });

  addCollectionButton.addEventListener("click", () => {
    addCollectionEditorRow();
    const rows = collectionsEditor.querySelectorAll(".collection-row");
    rows[rows.length - 1]?.querySelector(".collection-url")?.focus();
  });

  addQuoteButton.addEventListener("click", () => {
    addQuoteEditorRow();
    const rows = quotesEditor.querySelectorAll(".quote-row");
    rows[rows.length - 1]?.querySelector(".quote-text")?.focus();
  });

  hotspot.addEventListener("click", openSettings);
  settingsClose.addEventListener("click", () => closeSettings());
  settingsCancel.addEventListener("click", () => closeSettings());
  resetSettingsButton.addEventListener("click", resetSettings);
  settingsPanel.addEventListener("submit", saveSettings);

  overlay.addEventListener("mousedown", (event) => {
    if (event.target === overlay) closeSettings();
  });

  form.addEventListener("submit", submitSearch);

  document.addEventListener("keydown", (event) => {
    if (
      event.ctrlKey &&
      event.shiftKey &&
      event.key === ","
    ) {
      event.preventDefault();
      if (overlay.hidden) openSettings();
      else closeSettings();
      return;
    }

    if (event.key === "Escape" && !overlay.hidden) {
      event.preventDefault();
      closeSettings();
      return;
    }

    if (
      event.key === "/" &&
      overlay.hidden &&
      document.activeElement !== input
    ) {
      event.preventDefault();
      input.focus();
      input.select();
    }
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      input.value = "";
      input.blur();
    }
  });

  applyVisualSettings();
  updateClock();
  window.setInterval(updateClock, 1000);

  showNextQuote();
  if (CONFIG.quoteCycleSeconds > 0) {
    window.setInterval(showNextQuote, CONFIG.quoteCycleSeconds * 1000);
  }

  buildLauncher();
  refreshWallpaper();

  if (CONFIG.wallpaperCycleMinutes > 0) {
    window.setInterval(
      () => refreshWallpaper(false),
      CONFIG.wallpaperCycleMinutes * 60 * 1000
    );
  }

  window.requestAnimationFrame(() => input.focus());
})();
