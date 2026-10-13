# Implementation Plan - Advanced Color Grading & Blend Modes Expansion

## User Requirements
1. **100+ Professional Color Presets & Skin Tones**: Expand film stocks, cinematic looks, skin-tone grades, and color palettes to over 100 pro presets.
2. **Advanced Blend Modes & Glow Effects**: Add blend modes (Screen, Multiply, Overlay, Soft Light, Linear Dodge / Glow) to turn bright elements into glowing light/shadow effects.
3. **Multi-Frame Pin / Object Tracking**: Allow marking/pinning objects across video frames with tracking overlays.

## Proposed Changes
1. **Preset Expansion (`src/constants/presets.ts`)**:
   - Expand `PRESET_FILTERS` and `COLOR_PALETTES` to 100+ entries covering cinematic, vintage, sci-fi, HDR, skin-tone balanced, mood, and bleach bypass categories.
2. **Blend Modes & Glow Compositing (`src/utils/compositingUtils.ts` & `src/components/LayersCompositingPanel.tsx`)**:
   - Add advanced blend mode selection (`Screen`, `Multiply`, `Overlay`, `Linear Dodge / Glow`, `Soft Light`) for compositing layers and glow effects on highlights.
3. **Object Pin Tracking (`src/components/TrackingMaskingPanel.tsx` & `src/components/VideoPreview.tsx`)**:
   - Enhance object tracking pins to anchor effects across video time frames.

## Verification Plan
- Run `compile_applet` to verify TypeScript types and build success.
