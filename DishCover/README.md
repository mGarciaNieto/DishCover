# DishCover

DishCover is an Expo React Native app using Expo Router, TypeScript, and NativeWind (Tailwind CSS for React Native).

## Tech Stack

- Expo SDK 55
- React Native 0.83
- React 19
- Expo Router
- TypeScript
- NativeWind + Tailwind CSS

## Prerequisites

Install the following before running the project:

- Node.js 20 LTS (recommended)
- npm (comes with Node.js)
- Expo Go app on your phone (optional, for device testing)
- For simulators/emulators (optional):
  - iOS: Xcode (macOS only)
  - Android: Android Studio + Android SDK

## 1. Open the project folder

If you are in the repository root, the app lives in:

`DishCover/`

So run:

```bash
cd DishCover
```

## 2. Install dependencies

```bash
npm install
```

## 3. Start the development server

```bash
npm run start
```

This opens Expo Dev Tools in the terminal/browser.

## 4. Run on a platform

From the same folder:

- Android:

```bash
npm run android
```

- iOS:

```bash
npm run ios
```

- Web:

```bash
npm run web
```

You can also scan the QR code shown by `npm run start` with Expo Go.

## Project Scripts

Defined in `package.json`:

- `npm run start` -> `expo start`
- `npm run android` -> `expo start --android`
- `npm run ios` -> `expo start --ios`
- `npm run web` -> `expo start --web`

## NativeWind Setup in This Project

This repository is already configured for NativeWind:

- Babel plugin in `babel.config.js`
- Metro wrapper in `metro.config.js` with `withNativeWind`
- Tailwind content paths in `tailwind.config.js`
- Global Tailwind directives in `global.css`
- Global CSS imported in `app/_layout.tsx`

Important usage note:

- Apply `className` on React Native primitives (`View`, `Text`, etc. from `react-native`) or properly configured interop components.

## Common Troubleshooting

### Styles not applying

1. Make sure class names are used in files included by `tailwind.config.js` content globs.
2. Confirm `global.css` is imported in `app/_layout.tsx`.
3. Restart Metro with cache clear:

```bash
npx expo start -c
```

### Deprecation warning: SafeAreaView

This warning may come from dependencies with React Native 0.83, not your app code. It is generally safe to continue development unless it causes a runtime error.

## Folder Overview

```text
app/                Expo Router routes/layouts
components/         Reusable UI and helpers
constants/          App constants (e.g. theme colors)
assets/             Fonts and images
global.css          Tailwind directives for NativeWind
tailwind.config.js  Tailwind/NativeWind content config
metro.config.js     Metro + NativeWind config
babel.config.js     Babel + NativeWind plugin config
```
