# Minimal Firefox Startpage

A clean little new tab page for Firefox. Just the useful stuff, without turning every tab into a dashboard.

## Features

- Large clock and date
- Search with selectable search engines
- Quicklinks
- Optional rotating quotes
- Optional Unsplash wallpapers
- Wallpaper blur and darkness controls
- Custom colors, text sizes, and local fonts
- Simple left-side settings panel
- No ads, analytics, telemetry, or remote font services

## Settings

Open settings with `Ctrl + Shift + ,` or click the hidden hotspot in the top-left corner.

Changes to appearance preview live while the settings panel is open.

## Search

Choose from DuckDuckGo, Google, Brave Search, Startpage, Kagi, or Bing.

You can also use a custom search URL. Add `%s` where the search terms should go:

```text
https://example.com/search?q=%s
```

## Quotes

The add-on ships with no quotes pre-installed. Add, edit, or remove your own from Settings.

For example:

```text
Small steps still move the map.
Leave tomorrow a cleaner starting point.
```

If the quote list is empty, the quote area stays hidden.

## Fonts

Font presets use fonts already installed on your system. You can also enter any custom local font name or CSS font stack.

No fonts are bundled or downloaded from a font service.

## Unsplash wallpapers

Unsplash support is optional.

Add your own Unsplash Access Key and collection URLs in Settings, then choose `[enable Unsplash]`.

Your key is stored locally in Firefox. It is sent only to `api.unsplash.com` when requesting wallpapers and is never sent to the developer.

Wallpapers are cached and shared between tabs to reduce unnecessary API requests. Manual wallpaper refreshes have a 2 minute cooldown.

## Privacy

Settings, quicklinks, quotes, search preferences, and Unsplash configuration are stored locally in Firefox.

Search terms are sent only to the search engine you choose. If Unsplash is enabled, wallpaper requests go directly to Unsplash.

No user data is collected, stored, sold, or shared with the developer.

See [PRIVACY.md](PRIVACY.md) for the full privacy summary.

## License

Licensed under the Mozilla Public License 2.0. See [LICENSE](LICENSE).
