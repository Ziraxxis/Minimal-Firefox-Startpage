/*
 * ==========================================================
 * MINIMAL FIREFOX STARTPAGE — DEFAULTS
 * ==========================================================
 *
 * Settings saved through the hidden settings panel override these defaults.
 */

const CONFIG = {

  /* Appearance defaults */
  fontFamily: '"Liberation Sans", Arial, sans-serif',
  clockFontFamily: '"Liberation Sans", Arial, sans-serif',

  textColor: "#ECEFF4",
  mutedColor: "#D8DEE9",
  accentColor: "#88C0D0",
  clockColor: "#ECEFF4",

  clockSize: 150,
  dateSize: 13,
  quoteSize: 17,
  searchSize: 16,
  launcherSize: 13,

  /* Wallpaper appearance defaults */
  wallpaperBlur: 0,
  wallpaperDarkness: 43,

  /* Clock */
  clock24Hour: true,
  showSeconds: false,
  showDate: true,

  /* Search */
  searchUrl: "https://duckduckgo.com/?q=%s",

  /* Quotes */
  quoteCycleSeconds: 1800,

  /* Add quotes through the settings panel. */
  quotes: [],

  /* Generic quicklink defaults */
  sites: [
    { name: "twitch",  url: "https://twitch.tv" },
    { name: "youtube", url: "https://youtube.com" },
    { name: "reddit",  url: "https://reddit.com" },
    { name: "chatgpt", url: "https://chatgpt.com" },
    { name: "gmail",   url: "https://mail.google.com" }
  ],

  /*
   * Private wallpaper configuration is intentionally blank in the package.
   * Enter it after installation through the settings panel.
   */
  unsplashAccessKey: "",
  unsplashCollections: [],

  wallpaperCycleMinutes: 30,

  fallbackBackground: ""
};
