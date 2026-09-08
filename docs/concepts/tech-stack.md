---
type: Reference
title: Tech Stack
description: Frameworks, libraries, and toolchain used in the project.
tags: [tech-stack, react, mui, firebase, vite]
generated: { by: human:alessandro, at: 2026-08-26T22:00:00Z }
status: stable
---

# Tech Stack

## Core

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.2.0 |
| Language | TypeScript | ~5.9.3 |
| Bundler | Vite | 7.2.4 |
| UI Library | MUI (Material-UI) | 7.3.7 |
| State | Zustand | 5.0.10 |
| Routing | React Router DOM | 7.13.0 |

## Firebase

| Service | Package | Purpose |
|---------|---------|---------|
| Auth | firebase | Google sign-in for admin |
| Firestore | firebase | Image metadata, collections |
| Storage | firebase | Image file hosting |

## Supporting Libraries

| Library | Purpose |
|---------|---------|
| `@mui/lab` | Masonry layout component |
| `@mui/icons-material` | Icon set |
| `@emotion/react` + `@emotion/styled` | CSS-in-JS (MUI dependency) |
| `framer-motion` | Page transitions, stagger animations |
| `@hello-pangea/dnd` | Drag-and-drop reordering in admin |
| `react-firebase-hooks` | Firestore query hooks |
| `uuid` | Unique ID generation |

## Dev Tooling

- ESLint with flat config + typescript-eslint
- Firebase Studio (IDX) as dev environment
- Firebase MCP server configured in `.idx/mcp.json`
