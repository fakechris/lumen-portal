# Lumen Portal

The bilingual Lumen Open website source for https://lumenopen.com. Chinese routes start at `/`; English routes start at `/en/`. Nine independent product pages describe release availability, licensing and data boundaries.

## Working copy

Maintain the site from this checkout. On this machine that directory is `/Users/chris/workspace/lumenopen`.

The 2026-10-01 Codex tree at `/Users/chris/Documents/Codex/2026-10-01/task-4/lumen-portal` is the original snapshot. Do not keep editing it. `1136b38` (`Clarify product discovery and release access with verified metadata`) is the revision last confirmed live on https://lumenopen.com and https://www.lumenopen.com.

The site was built on 2026-10-01 in Codex on this Mac. The original task names are 「部署 Lumen Open 官网」, 「恢复官网浏览器部署」, and 「优化官网搜索与转化」.

## Development

Requires Node.js 20 or newer. No dependency installation is needed.

Product facts and both languages live in `src/products.mjs`. Page structure, navigation, and shared copy live in `src/build.mjs`. Media lives in `public/assets/`.

```sh
npm run build
npm run preview
```

`npm run build` writes static output to `dist/`. `npm run preview` serves that directory at http://localhost:4173. `npm test` builds, then runs `scripts/check.mjs`.

Pushing to GitHub does not deploy the website. Publish by uploading the contents of `dist/` in the Cloudflare dashboard: **Workers & Pages → lumen-portal**. That Pages project serves `lumenopen.com` and `www.lumenopen.com`.

`mail.lumenopen.com` is a separate Worker. It is not part of this source tree.

## Content and media

Product facts in `src/products.mjs` were reviewed on 2026-11-24 against public GitHub releases and READMEs, and checked again the same evening. A downloadable release is labeled separately from `main`. Involute `npm-v0.3.0` and Plan of Plan `v0.1.0` are published source or container releases without desktop installers; the Involute npm publish was refused. OVP `desktop-v2.2.0` is the published desktop download. Lumen Navi `v0.3.0` has macOS Apple Silicon, Intel, and Windows x64 installers. Lumen ASR `v0.4.0` is a prerelease with macOS Apple Silicon and Windows x64 installers. The live site stays on the last uploaded `dist/` until that directory is published again.

Involute hosted access is invitation-only. Lumen ASR is a prerelease. Plan of Plan has no declared license. Lumen Cut installers are for macOS ARM. Lumen Navi v0.3.0 also publishes a Windows x64 installer. These tools are independent projects; local operation does not imply completely offline operation.

Product icons and eligible screenshots come from public repositories; see `ASSET_SOURCES.json` and `ASSETS.md`. The optional optical loop is ten seconds, muted and respects reduced motion. The 55-second brand film includes Chinese and English caption tracks and preserves its original music and sound effects. LumenBox is shown as an explicitly labelled functional concept animation; it does not depict a product interface. Involute remains invitation-only. The build shows a film-in-production treatment if the optional full film is absent.

Do not commit credentials, account secrets, local QA captures, or browser data.

## License

No license has been selected for this website source. Public availability alone does not grant an open-source license. Third-party/product assets remain subject to their originating project’s terms; this repository does not relicense them.
