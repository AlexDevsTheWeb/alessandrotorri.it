---
type: Reference
title: State Management
description: Zustand stores for authentication and theme state.
tags: [state, zustand, auth, theme]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
---

# State Management

## Auth store (`src/store/authStore.ts`)

| Field | Type | Description |
|-------|------|-------------|
| `user` | `User \| null` | Current authenticated user |
| `isLoading` | `boolean` | Auth loading flag |
| `error` | `string \| null` | Auth error message |

| Action | Description |
|--------|-------------|
| `login(email, password)` | Email/password sign-in |
| `loginWithGoogle()` | Google OAuth sign-in |
| `logout()` | Sign out and clear state |

`onAuthStateChanged` in `src/App.tsx` keeps the store in sync with Firebase.

## Theme store (`src/store/themeStore.ts`)

| Field | Type | Description |
|-------|------|-------------|
| `themeMode` | `'light' \| 'dark'` | Current theme (default: `dark`) |

| Action | Description |
|--------|-------------|
| `toggleTheme()` | Switch between light and dark |

## Pattern

- Zustand over Redux for minimal boilerplate.
- No middleware and no persistence — the theme resets on reload.
- Theme is consumed through MUI `ThemeProvider` in `src/App.tsx`.

## Related

- [Tech Stack](/concepts/tech-stack.md)
- [Firebase Backend](/concepts/firebase-backend.md)
