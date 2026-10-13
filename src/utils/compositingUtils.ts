import { 
  SelectiveColorSettings, 
  SkinToneProtection, 
  LogProfileSettings, 
  CameraLogProfile, 
  ColorGradingNode, 
  VirtualLightSettings, 
  OpticsSettings, 
  ObjectTrackerSettings, 
  MaskingSettings, 
  CompositingLayer, 
  ChromaKeyerSettings,
  FilterSettings
} from '../types/editor';

export const DEFAULT_SELECTIVE_COLOR: SelectiveColorSettings = {
  enabled: false,
  activeColor: 'red',
  customHex: '#ef4444',
  hueShift: 0,
  saturation: 0,
  luminance: 0,
  rangeWidth: 45,
  feather: 30,
};

export const COLOR_HUE_RANGES: Record<string, { label: string; bengaliLabel: string; colorHex: string; baseHue: number }> = {
  red: { label: 'Red', bengaliLabel: 'লাল (Red)', colorHex: '#ef4444', baseHue: 0 },
  orange: { label: 'Orange', bengaliLabel: 'কমলা (Orange)', colorHex: '#f97316', baseHue: 30 },
  yellow: { label: 'Yellow', bengaliLabel: 'হলুদ (Yellow)', colorHex: '#eab308', baseHue: 60 },
  green: { label: 'Green', bengaliLabel: 'সবুজ (Green)', colorHex: '#22c55e', baseHue: 120 },
  cyan: { label: 'Cyan', bengaliLabel: 'সায়ান (Cyan)', colorHex: '#06b6d4', baseHue: 180 },
  blue: { label: 'Blue', bengaliLabel: 'নীল (Blue)', colorHex: '#3b82f6', baseHue: 240 },
  magenta: { label: 'Magenta', bengaliLabel: 'ম্যাজেন্টা (Magenta)', colorHex: '#d946ef', baseHue: 300 },
  custom: { label: 'Custom', bengaliLabel: 'কাস্টম পিক (Custom)', colorHex: '#a855f7', baseHue: 270 },
};

export const DEFAULT_SKIN_TONE: SkinToneProtection = {
  enabled: false,
  protectAmount: 70,
  warmth: 15,
  rosyTint: 10,
  softGlow: 25,
  showSkinLineGuide: false,
};

export interface CameraLogInfo {
  id: CameraLogProfile;
  name: string;
  manufacturer: string;
  bengaliName: string;
  description: string;
  badge: string;
  curveContrast: number;
  curveBrightness: number;
  saturationBoost: number;
  highlightRecovery: number;
}

export const CAMERA_LOG_PRESETS: CameraLogInfo[] = [
  {
    id: 'rec709',
    name: 'Rec.709 Standard',
    manufacturer: 'ITU-R',
    bengaliName: 'স্ট্যান্ডার্ড ব্রডকাস্ট (Rec.709)',
    description: 'সাধারণ ক্যামেরা বা স্মার্টফোন ভিডিওর স্ট্যান্ডার্ড কালার স্পেস।',
    badge: 'Standard',
    curveContrast: 100,
    curveBrightness: 100,
    saturationBoost: 100,
    highlightRecovery: 0,
  },
  {
    id: 'arri-logc',
    name: 'ARRI Log-C to Rec.709',
    manufacturer: 'ARRI Alexa 35 / Mini LF',
    bengaliName: 'অ্যারি লগ-সি (ARRI Log-C)',
    description: 'হলিউড ব্লকবাস্টার মুভির জন্য বিখ্যাত ভাইব্র্যান্ট অ্যান্ড ন্যাচারাল কালার ট্রান্সফর্ম।',
    badge: 'Cinema King',
    curveContrast: 135,
    curveBrightness: 110,
    saturationBoost: 130,
    highlightRecovery: 40,
  },
  {
    id: 'sony-slog3',
    name: 'Sony S-Log3 / S-Gamut3',
    manufacturer: 'Sony FX3 / FX6 / A7S III',
    bengaliName: 'সোনি এস-লগ৩ (Sony S-Log3)',
    description: 'হাই ডায়নামিক রেঞ্জ রিকভারি ও ক্রিস্প শ্যাডো রিটেনশন অ্যালগরিদম।',
    badge: '15+ Stops',
    curveContrast: 140,
    curveBrightness: 108,
    saturationBoost: 125,
    highlightRecovery: 50,
  },
  {
    id: 'red-log3g10',
    name: 'RED Log3G10 / WideGamut',
    manufacturer: 'RED V-Raptor / Komodo',
    bengaliName: 'রেড লগ৩জি১০ (RED RAW)',
    description: 'হাই স্যাচুরেশন লুমিন্যান্স ও সিনেমা সেন্সর স্কিন কালার প্রিজার্ভেশন।',
    badge: 'RAW Studio',
    curveContrast: 142,
    curveBrightness: 105,
    saturationBoost: 135,
    highlightRecovery: 45,
  },
  {
    id: 'dji-dlog',
    name: 'DJI D-Log M to Rec.709',
    manufacturer: 'DJI Mavic 3 / Osmo Pocket 3',
    bengaliName: 'ডিজেআই ডি-লগ (DJI D-Log)',
    description: 'ড্রোন ও অ্যাকশন ফুটেজের জন্য এরিয়াল ল্যান্ডস্কেপ বুস্ট ও স্কাই কনট্রাস্ট।',
    badge: 'Drone / Action',
    curveContrast: 132,
    curveBrightness: 112,
    saturationBoost: 128,
    highlightRecovery: 35,
  },
  {
    id: 'blackmagic-gen5',
    name: 'Blackmagic Film Gen 5',
    manufacturer: 'BMPCC 6K / URSA Mini Pro',
    bengaliName: 'ব্ল্যাকম্যাজিক ফিল্ম ৫ (BM Gen5)',
    description: 'অরগ্যানিক ফিল্ম-লাইক রোল-অফ ও শ্যাডো ডিটেইলিং প্রযুক্তি।',
    badge: 'Organic Film',
    curveContrast: 138,
    curveBrightness: 106,
    saturationBoost: 122,
    highlightRecovery: 38,
  },
  {
    id: 'canon-clog3',
    name: 'Canon C-Log 3 Cinema',
    manufacturer: 'Canon EOS C70 / R5C',
    bengaliName: 'ক্যানন সি-লগ ৩ (Canon C-Log3)',
    description: 'উষ্ণ স্কিন টোন ও প্রিসাইজ নিউট্রাল কনট্রাস্ট কার্ভ।',
    badge: 'Warm Tone',
    curveContrast: 130,
    curveBrightness: 109,
    saturationBoost: 120,
    highlightRecovery: 30,
  },
];

export const DEFAULT_LOG_SETTINGS: LogProfileSettings = {
  profile: 'rec709',
  exposureComp: 0,
  contrastRecovery: 50,
  highlightRollOff: 40,
  lutIntensity: 100,
};

export const DEFAULT_NODES: ColorGradingNode[] = [
  {
    id: 'node-in',
    name: 'Input Media',
    type: 'input',
    bypassed: false,
    opacity: 100,
    blendMode: 'normal',
    description: 'অরিজিনাল ভিডিও ইনপুট',
  },
  {
    id: 'node-primaries',
    name: 'Node 1: Base Exposure',
    type: 'primary',
    bypassed: false,
    opacity: 100,
    blendMode: 'normal',
    description: 'লাইটিং ও বেসিক ব্যালেন্স',
  },
  {
    id: 'node-curves',
    name: 'Node 2: RGB Curves',
    type: 'curves',
    bypassed: false,
    opacity: 100,
    blendMode: 'normal',
    description: 'স্পেকট্রাম কালার চ্যানেল গ্রেড',
  },
  {
    id: 'node-look',
    name: 'Node 3: Selective & Skin',
    type: 'selective',
    bypassed: false,
    opacity: 100,
    blendMode: 'normal',
    description: 'স্কিন টোন ও কালার আইসোলেশন',
  },
  {
    id: 'node-out',
    name: 'Master Output',
    type: 'output',
    bypassed: false,
    opacity: 100,
    blendMode: 'normal',
    description: 'কম্পোজিট মাস্টার প্রিভিউ',
  },
];

export const DEFAULT_VIRTUAL_LIGHT: VirtualLightSettings = {
  enabled: false,
  type: 'spotlight',
  x: 35,
  y: 30,
  color: '#ffdd88',
  intensity: 65,
  radius: 45,
  angle: 45,
  castShadows: true,
  shadowAngle: 135,
  shadowOpacity: 55,
  shadowBlur: 20,
  linkedToTracker: false,
  motionBlurEnabled: false,
  motionBlurIntensity: 35,
  motionBlurAngle: 45,
  blurTrackingEnabled: false,
  blurTrackingRadius: 35,
  goldenEffectEnabled: false,
  goldenIntensity: 70,
  goldenBackgroundGlow: 50,
  spotBlurEnabled: false,
  spotBlurX: 50,
  spotBlurY: 50,
  spotBlurRadius: 40,
  spotBlurIntensity: 25,
};

export const DEFAULT_OPTICS: OpticsSettings = {
  flareType: 'none',
  flareIntensity: 60,
  flareX: 25,
  flareY: 20,
  halation: 0,
  highlightBloom: 0,
  ambientOcclusion: 0,
  particlesCount: 0,
};

export const DEFAULT_OBJECT_TRACKER: ObjectTrackerSettings = {
  isTrackingActive: false,
  targetName: 'Subject Face / Body',
  currentX: 50,
  currentY: 45,
  targetWidth: 28,
  targetHeight: 35,
  confidence: 94,
  autoTrack: true,
  trackPath: [
    { time: 0, x: 48, y: 46, width: 28, height: 35 },
    { time: 3, x: 50, y: 45, width: 28, height: 35 },
    { time: 6, x: 53, y: 44, width: 29, height: 35 },
    { time: 9, x: 51, y: 45, width: 28, height: 35 },
    { time: 12, x: 49, y: 47, width: 28, height: 36 },
  ],
};

export const DEFAULT_MASKING: MaskingSettings = {
  shape: 'none',
  invert: false,
  feather: 40,
  opacity: 85,
  centerX: 50,
  centerY: 50,
  radiusX: 35,
  radiusY: 40,
  rotation: 0,
  applyOnlyToBackground: false,
  linkedToTracker: false,
};

export const DEFAULT_COMPOSITING_LAYERS: CompositingLayer[] = [
  {
    id: 'layer-base',
    name: 'Layer 1: Base Video Footage',
    type: 'base-video',
    visible: true,
    opacity: 100,
    blendMode: 'normal',
    locked: false,
  },
  {
    id: 'layer-grade',
    name: 'Layer 2: CineGrade LUT & Colors',
    type: 'grade-adjustment',
    visible: true,
    opacity: 100,
    blendMode: 'normal',
    locked: false,
  },
  {
    id: 'layer-light',
    name: 'Layer 3: 3D Virtual Spotlight',
    type: 'virtual-light',
    visible: true,
    opacity: 75,
    blendMode: 'soft-light',
    locked: false,
  },
  {
    id: 'layer-optics',
    name: 'Layer 4: Anamorphic Lens Flare',
    type: 'lens-flare',
    visible: true,
    opacity: 65,
    blendMode: 'screen',
    locked: false,
  },
  {
    id: 'layer-matte',
    name: 'Layer 5: Chroma Key Matte',
    type: 'chroma-matte',
    visible: true,
    opacity: 100,
    blendMode: 'normal',
    locked: false,
  },
  {
    id: 'layer-text',
    name: 'Layer 6: Text Overlays',
    type: 'text-overlay',
    visible: true,
    opacity: 100,
    blendMode: 'overlay',
    locked: false,
  },
  {
    id: 'layer-sticker',
    name: 'Layer 7: Sticker & Elements',
    type: 'sticker-overlay',
    visible: true,
    opacity: 100,
    blendMode: 'screen',
    locked: false,
  },
];

export const DEFAULT_CHROMA_KEY: ChromaKeyerSettings = {
  enabled: false,
  keyColor: '#00ff22',
  tolerance: 40,
  softness: 25,
  spillSuppression: 50,
};

/**
 * Calculates modified CSS filter additions for selective color adjustments
 */
export function getSelectiveColorCssFilter(settings: SelectiveColorSettings): string {
  if (!settings.enabled) return '';
  const hueDeg = Math.round(settings.hueShift);
  const satPct = 100 + Math.round(settings.saturation);
  const brightPct = 100 + Math.round(settings.luminance * 0.4);
  return `hue-rotate(${hueDeg}deg) saturate(${Math.max(0, satPct)}%) brightness(${Math.max(20, brightPct)}%)`;
}

/**
 * Calculates Log transform filter factors
 */
export function getLogTransformModifiers(logProfile: CameraLogProfile, intensity: number = 100) {
  const preset = CAMERA_LOG_PRESETS.find(p => p.id === logProfile) || CAMERA_LOG_PRESETS[0];
  const factor = intensity / 100;
  return {
    contrastMultiplier: 1 + ((preset.curveContrast / 100) - 1) * factor,
    brightnessMultiplier: 1 + ((preset.curveBrightness / 100) - 1) * factor,
    saturationMultiplier: 1 + ((preset.saturationBoost / 100) - 1) * factor,
    highlightRecovery: preset.highlightRecovery * factor,
  };
}
