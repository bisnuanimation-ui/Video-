export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5' | '21:9';

export interface CurvePoint {
  x: number; // 0 - 255
  y: number; // 0 - 255
}

export interface RGBCurves {
  rgb: CurvePoint[];   // Master (Overall Luminance/Contrast)
  red: CurvePoint[];   // Red channel
  green: CurvePoint[]; // Green channel
  blue: CurvePoint[];  // Blue channel
}

export type CurveChannel = 'rgb' | 'red' | 'green' | 'blue';

export interface FilterSettings {
  brightness: number; // 0 - 200 (100 is default)
  contrast: number;   // 0 - 200 (100 is default)
  saturation: number; // 0 - 200 (100 is default)
  brilliance: number; // 0 - 200 (100 is default)
  sharpen: number;    // 0 - 100 (0 is default)
  highlights: number; // 0 - 200 (100 is default)
  shadows: number;    // 0 - 200 (100 is default)
  whites: number;     // 0 - 200 (100 is default)
  blacks: number;     // 0 - 200 (100 is default)
  temperature: number;// -100 to 100 (0 is default)
  hue: number;        // -180 to 180 (0 is default)
  fade: number;       // 0 - 100 (0 is default)
  vignette: number;   // 0 - 100 (0 is default)
  grain: number;      // 0 - 100 (0 is default)
  sepia: number;      // 0 - 100 (0 is default)
  grayscale: number;  // 0 - 100 (0 is default)
  invert: number;     // 0 - 100 (0 is default)
  curves?: RGBCurves;
}

export interface Keyframe {
  id: string;
  time: number;
  name?: string;
  settings: FilterSettings;
  easing?: 'linear' | 'smooth' | 'ease-in-out';
}

export interface TextOverlay {
  id: string;
  text: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  fontSize: number; // in px
  color: string;
  bgColor: string;
  fontFamily: string;
  startTime: number;
  endTime: number;
}

export interface StickerOverlay {
  id: string;
  emoji: string;
  name: string;
  x: number;
  y: number;
  size: number;
  startTime: number;
  endTime: number;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  volume: number;
  isMuted: boolean;
}

export interface PresetFilter {
  id: string;
  name: string;
  banglaName: string;
  category: 'Featured' | 'NEW' | 'Hits' | 'Life' | 'Landscape' | 'Cinematic' | 'FilmStocks' | 'Moody' | 'SciFi' | 'Vintage';
  previewGradient: string;
  thumbnailUrl?: string;
  description: string;
  settings: Partial<FilterSettings>;
}

export interface ColorPalette {
  id: string;
  name: string;
  banglaName: string;
  colors: string[]; // 4 hex palette colors
  mood: string;
  presetId: string;
  recommendedSettings: Partial<FilterSettings>;
}

export interface SampleVideo {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  duration: number;
  category: string;
}

export interface AIScene {
  id: string;
  start: number;
  end: number;
  label: string;
  confidence: number;
  vibe: string;
}

export interface SelectiveColorSettings {
  enabled: boolean;
  activeColor: 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'magenta' | 'custom';
  customHex: string;
  hueShift: number; // -180 to 180
  saturation: number; // -100 to 100
  luminance: number; // -100 to 100
  rangeWidth: number; // 10 - 100
  feather: number; // 0 - 100
}

export interface SkinToneProtection {
  enabled: boolean;
  protectAmount: number; // 0 - 100
  warmth: number; // -50 to 50
  rosyTint: number; // -50 to 50
  softGlow: number; // 0 - 100
  showSkinLineGuide: boolean;
}

export type CameraLogProfile = 
  | 'rec709'
  | 'arri-logc'
  | 'sony-slog3'
  | 'red-log3g10'
  | 'dji-dlog'
  | 'blackmagic-gen5'
  | 'canon-clog3';

export interface LogProfileSettings {
  profile: CameraLogProfile;
  exposureComp: number; // -3 to +3 EV
  contrastRecovery: number; // 0 - 100
  highlightRollOff: number; // 0 - 100
  lutIntensity: number; // 0 - 100
}

export type NodeType = 'input' | 'primary' | 'curves' | 'selective' | 'lut' | 'vfx' | 'output';

export interface ColorGradingNode {
  id: string;
  name: string;
  type: NodeType;
  bypassed: boolean;
  opacity: number; // 0 - 100
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light';
  description: string;
}

export type LightSourceType = 'point' | 'rim' | 'spotlight' | 'studio-key' | 'neon-edge' | 'sunset-flare' | 'top-spot';

export interface VirtualLightSettings {
  enabled: boolean;
  type: LightSourceType;
  x: number; // 0 - 100 (%)
  y: number; // 0 - 100 (%)
  color: string;
  intensity: number; // 0 - 100
  radius: number; // 10 - 100
  angle: number; // 0 - 360 deg
  castShadows: boolean;
  shadowAngle: number; // 0 - 360 deg
  shadowOpacity: number; // 0 - 100
  shadowBlur: number; // 0 - 100
  linkedToTracker: boolean;
  motionBlurEnabled?: boolean;
  motionBlurIntensity?: number; // 0 - 100
  motionBlurAngle?: number; // 0 - 360 deg
  blurTrackingEnabled?: boolean;
  blurTrackingRadius?: number; // 5 - 100
  goldenEffectEnabled?: boolean;
  goldenIntensity?: number; // 0 - 100
  goldenBackgroundGlow?: number; // 0 - 100
  spotBlurEnabled?: boolean;
  spotBlurX?: number; // 0 - 100
  spotBlurY?: number; // 0 - 100
  spotBlurRadius?: number; // 10 - 100
  spotBlurIntensity?: number; // 0 - 100
}

export type FlareType = 'none' | 'anamorphic-blue' | 'warm-vintage' | 'golden-sunburst' | 'dust-particles';

export interface OpticsSettings {
  flareType: FlareType;
  flareIntensity: number; // 0 - 100
  flareX: number; // 0 - 100
  flareY: number; // 0 - 100
  halation: number; // 0 - 100
  highlightBloom: number; // 0 - 100
  ambientOcclusion: number; // 0 - 100
  particlesCount: number; // 0 - 100
}

export type MaskShape = 'none' | 'circle' | 'rectangle' | 'linear-gradient' | 'subject-roto';

export interface TrackingPoint {
  time: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ObjectTrackerSettings {
  isTrackingActive: boolean;
  targetName: string;
  currentX: number; // 0 - 100
  currentY: number; // 0 - 100
  targetWidth: number; // 5 - 80
  targetHeight: number; // 5 - 80
  confidence: number; // 0 - 100
  trackPath: TrackingPoint[];
  autoTrack: boolean;
  anchoredEffect?: 'shadow' | 'light' | 'flare' | 'all' | 'none';
}

export interface MaskingSettings {
  shape: MaskShape;
  invert: boolean;
  feather: number; // 0 - 100
  opacity: number; // 0 - 100
  centerX: number; // 0 - 100
  centerY: number; // 0 - 100
  radiusX: number; // 5 - 60
  radiusY: number; // 5 - 60
  rotation: number; // 0 - 360
  applyOnlyToBackground: boolean;
  linkedToTracker: boolean;
  backgroundRemoval?: boolean;
  alphaMode?: 'transparent' | 'blur-bg' | 'black-matte' | 'checkerboard';
  dressBlurEnabled?: boolean;
  dressBlurRadius?: number; // 0 - 100
  dressBlurMode?: 'dress-soft' | 'bokeh-blur' | 'background-blur' | 'object-isolate';
  dressColorMatch?: string;
}

export type CompositingBlendMode = 
  | 'normal' 
  | 'screen' 
  | 'multiply' 
  | 'overlay' 
  | 'darken'
  | 'lighten'
  | 'soft-light' 
  | 'hard-light' 
  | 'color-dodge' 
  | 'luminosity' 
  | 'difference';

export interface CompositingLayer {
  id: string;
  name: string;
  type: 'base-video' | 'grade-adjustment' | 'virtual-light' | 'lens-flare' | 'chroma-matte' | 'text-overlay' | 'custom-shadow' | 'color-matte' | 'sticker-overlay';
  visible: boolean;
  opacity: number; // 0 - 100
  blendMode: CompositingBlendMode;
  locked: boolean;
  linkedToTracker?: boolean;
  color?: string;
}

export interface ChromaKeyerSettings {
  enabled: boolean;
  keyColor: string; // e.g. '#00ff00'
  tolerance: number; // 0 - 100
  softness: number; // 0 - 100
  spillSuppression: number; // 0 - 100
}

export type ActiveToolTab = 
  | 'filters'
  | 'palettes'
  | 'adjust'
  | 'curves'
  | 'histogram'
  | 'nodes'
  | 'selective-color'
  | 'skin-tone'
  | 'log-luts'
  | 'virtual-lighting'
  | 'optics-flares'
  | 'object-tracking'
  | 'masking-roto'
  | 'layers-compositing'
  | 'chroma-key'
  | 'keyframes'
  | 'quality'
  | 'ai-clipper'
  | 'text'
  | 'stickers'
  | 'audio'
  | 'overlay';
