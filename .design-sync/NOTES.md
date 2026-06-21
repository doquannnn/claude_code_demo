# design-sync notes

## Shape: off-script (CSS / design-token system)
This repo is a vanilla-JS Gomoku game, **not** a React/JS component library.
There is no build, bundler, Storybook, or compiled `dist/`. The design system
lives in `design-system/` as hand-authored standalone HTML preview cards plus
`tokens.css` (a mirror of the `:root` tokens in `style.css`). The standard
converter (`package-build.mjs`, esbuild React bundle) does not apply — there are
no JS components to bundle. The upload layout is produced **by hand** into
`ds-bundle/`.

## Layout produced
- `styles.css` → `@import`s `tokens/tokens.css` + `_ds_bundle.css` (the styling
  truth designs receive).
- `_ds_bundle.css` — real reusable component classes: `.btn`, `.cell`, `.board`,
  `.status`, `.gomoku` (token-driven; generalized from `style.css`).
- `tokens/tokens.css` — the `:root` tokens.
- `components/<Group>/<Name>/{<Name>.html,<Name>.prompt.md}` — preview card
  (with `<!-- @dsCard group="…" -->` first line) + usage reference.
  - Foundations/Tokens, Components/Button, Components/Cell, Components/Status.
- No `.jsx` / `.d.ts` per component: there is no React props API. The component
  "API" is the CSS class + `data-*` vocabulary, documented in each `.prompt.md`
  and in the conventions header.
- No `_ds_bundle.js`: nothing to compile. No `fonts/` (system stack only).

## `_ds_sync.json`: intentionally omitted
The off-script shape has no standard hash recipe, so no sync anchor is written.
Consequence (correct + documented): the next sync re-verifies and re-uploads
everything rather than diffing. Nothing silently rots.

## Verification
No Node on this machine, and the Launch preview sandbox blocks Python's
http.server (getcwd / import machinery → `Operation not permitted`). Cards were
graded by rendering each self-contained HTML through macOS Quick Look
(`qlmanage -t`, WebKit) — all four passed. If re-verifying later, that path
works from the Bash tool: `qlmanage -t -s 1000 -o <out> ds-bundle/.../X.html`.

## Conventions header
`.design-sync/conventions.md` is the human-editable source; on this off-script
path it is also inlined verbatim at the top of `ds-bundle/README.md` by hand
(there is no converter to stitch it via `readmeHeader`). If you edit the
conventions, update both, and re-run the name-validation grep against
`ds-bundle/_ds_bundle.css` + `ds-bundle/tokens/tokens.css`.

## Source of truth in the repo
`design-system/` (cards + `tokens.css`) and `style.css` (`:root` tokens). Keep
`design-system/tokens.css` and `style.css`'s `:root` block in sync; both feed
`ds-bundle/tokens/tokens.css`.
