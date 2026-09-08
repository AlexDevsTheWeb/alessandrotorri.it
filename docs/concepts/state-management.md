---
type: Reference
title: State Management
description: Zustand stores for authentication and theme state.
tags: [state, zustand, auth, theme]
generated: { by: human:alessandro, at: 2026-08-26T22:00:00Z }
status: stable
---

# State Management

## Auth Store (`src/store/authStore.ts`)

| Field | Type | Description |
|-------|------|-------------|
| `user` | `FirebaseUser \| null` | Current authenticated user |
| `isLoading` | `boolean` | Auth state loading flag |
| `error` | `string \| null` | Auth error message |

| Action | Description |
|--------|-------------|
| `login(email, password)` | Email/password sign-in |
| `loginWithGoogle()` | Google OAuth sign-in |
| `logout()` | Sign out and clear state |

Auth state also synced via `onAuthStateChanged` in `App.tsx`.

## Theme Store (`src/store/themeStore.ts`)

| Field | Type | Description |
|-------|------|-------------|
| `themeMode` | `'light' \| 'dark'` | Current theme (default: dark) |

| Action | Description |
|--------|-------------|
| `toggleTheme()` | Switch between light and dark |

## Pattern

- Zustand chosen over Redux for minimal boilerplate
- No middleware, no persistence — state resets on page reload
- Theme persisted via MUI's `ThemeProvider` + `useTheme`
