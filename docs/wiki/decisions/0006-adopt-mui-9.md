---
type: Decision
title: "0006 — Adopt Material UI 9"
description: Upgrade the MUI family to v9.5 and migrate the v7-only APIs; keep the remaining majors out of this loop.
tags: [decision, mui, material-ui, dependencies, migration]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
sources:
  - id: gh-issue-6
    resource: https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/6
    title: "Issue #6 — evaluate dependency majors deferred from issue #1"
    author: human:alessandrotorri
  - id: mui-v9-guide
    resource: https://mui.com/material-ui/migration/upgrade-to-v9/
    title: MUI — Upgrade to v9
---

# Context

The project was on MUI 7. MUI v9 is the next stable major (there is no v8) and removes deprecated APIs, deprecated system props, `GridLegacy`, and `Dialog`'s `PaperProps`. The owner asked to bring the MUI family to v9 and update whatever is required for it.

# Decision

Adopt the MUI 9.5 family:

- `@mui/material` 9.5.0
- `@mui/icons-material` 9.5.0
- `@mui/lab` 9.0.0-beta.10

`@mui/system`, `@mui/utils`, and `@mui/styled-engine` follow at 9.5.0. React 19.3.1 and Emotion 11.14 satisfy the v9 peers, so no React/Emotion upgrade is needed.

Migrate v9-breaking usage immediately:

- use `slotProps.paper` instead of `PaperProps` on `Dialog`;
- use `sx` for system props on `Box`, `Grid`, and `Stack`;
- pass `nativeButton={false}` when a button-like component renders a React Router `Link`;
- do not reintroduce `GridLegacy`, removed `*Outline` icons, `MuiTouchRipple` theme entries, or `disableEscapeKeyDown`.

Keep the other majors (Vite 8, ESLint 10, TypeScript 7, Firebase 13, framer-motion 14, uuid 14, `globals` 17, `eslint-plugin-react-refresh` 0.5) out of this loop; they remain in issue #6.

# Consequences

- The MUI family is aligned and the v9 deprecation debt is removed.
- Future MUI code must use v9 APIs from the start: `sx` for styles, `slotProps` for slots, explicit `nativeButton`.
- The bundle is slightly larger (1.366 MB / 423.65 kB gzip); phase 5 code splitting still owns that.
- A future MUI 10 alpha exists but is explicitly out of scope.
- The other majors stay visible and individually reviewable.

# Links

- [Source summary](/sources/2026-10-29-gh-issue-6.md)
- [MUI v9 upgrade guide](https://mui.com/material-ui/migration/upgrade-to-v9/)
- [Pull request #8](https://github.com/AlexDevsTheWeb/alessandrotorri.it/pull/8)
- [Tech Stack](/concepts/tech-stack.md)
- [Issue #6](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/6)
