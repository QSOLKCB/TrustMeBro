# Getting started

The site consists of static files. No package installation or build is required.

From the repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`, clock in, and requisition a stapler. Directly opening `index.html` also works; no files are fetched by the game.

To run the game-rule tests, use Node.js 18 or newer:

```sh
node --test tests/engine.test.js
```

CI also exercises the real browser at 1440, 390, and 320 pixels: a full campaign, the manual, the manifesto, receipt export after clearing, history/completion, literal handling of HTML-shaped input, and absence of external game requests. It retains screenshots and transcripts as workflow artifacts. This tooling is used only for development; it adds nothing to the shipped site.

To reproduce browser checks with Google Chrome installed:

```sh
npm install --prefix /tmp/trustmebro-qa --no-package-lock --no-audit --no-fund playwright@1.62.1
NODE_PATH=/tmp/trustmebro-qa/node_modules node tests/browser.test.js
```

GitHub Pages: in **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**. The `Publish GitHub Pages` workflow stages the site, uploads its Pages artifact, and deploys every push to `main`. It also has a manual **Run workflow** control. Pull requests validate and package the site without publishing it.

The public artifact includes only `index.html`, `manifesto.html`, the two JavaScript files, `style.css`, `favicon.svg`, and `.nojekyll`. The game and manifesto use relative links, so they work under `/TrustMeBro/` as well as a local server root.

If Pages returns 404, check that the publishing source is **GitHub Actions** and that **Publish GitHub Pages** has completed its `deploy` job successfully. A green **Game checks** run verifies gameplay; it does not publish the site. After changing the publishing source, run the publishing workflow again if its previous deployment failed.

Implementation:

- `engine.js`: deterministic rules, case content, commands, and resource accounting; usable in both the browser and Node.js.
- `app.js`: DOM rendering, command history/completion, manual, and receipt export.
- `style.css`: layouts, terminal, and decorative scorched manifesto paper.
- `manifesto.html`: standalone declaration, readable without JavaScript.

The session lives in memory. Refreshing or restarting starts a fresh shift. Export receipts before leaving if you want to retain the transcript. The game does not execute shell commands, call APIs, or perform real enforcement.
