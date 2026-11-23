# GCU website

Static Garden City University concept homepage. Requires Node.js 22 or newer; no third-party packages or secrets are needed.

## Development

Run `npm run dev` and open http://localhost:5173. Refresh the browser after edits. Set `PORT` to use another port.

- `index.html`: page structure and content
- `assets/styles.css`: visual design and responsive styles
- `assets/main.js`: mobile navigation
- `scripts/`: local server, validation, and build

## Validation and production

Run `npm run build` to validate JavaScript, local assets, and section links, then generate `dist/`. Run `npm run preview` to serve that production output locally. Upload the contents of `dist/` to a static host. The server is intended for local development, not production hosting.

## Content still needed

The Matterport campus tour remains a placeholder until the university's scan URL is supplied. Images currently use external Unsplash URLs and are illustrative; Google Fonts also requires internet access. Confirm university statistics, contact details, programme links, branding, and image permissions before public launch. School cards currently link to the official university homepage. Admissions uses the existing external admissions site; this project does not collect application data.
