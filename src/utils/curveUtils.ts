import { CurvePoint, RGBCurves, CurveChannel } from '../types/editor';

export const DEFAULT_RGB_CURVES: RGBCurves = {
  rgb: [
    { x: 0, y: 0 },
    { x: 255, y: 255 },
  ],
  red: [
    { x: 0, y: 0 },
    { x: 255, y: 255 },
  ],
  green: [
    { x: 0, y: 0 },
    { x: 255, y: 255 },
  ],
  blue: [
    { x: 0, y: 0 },
    { x: 255, y: 255 },
  ],
};

export const CURVE_PRESETS: {
  id: string;
  name: string;
  banglaName: string;
  icon: string;
  description: string;
  curves: RGBCurves;
}[] = [
  {
    id: 'linear',
    name: 'Linear (Reset)',
    banglaName: 'রিসেট (স্বাভাবিক)',
    icon: '📈',
    description: 'ডিফল্ট নিরপেক্ষ কার্ভ',
    curves: {
      rgb: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
      red: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
      green: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
      blue: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
    },
  },
  {
    id: 's-curve',
    name: 'S-Curve Contrast',
    banglaName: 'এস-কার্ভ (কন্ট্রাস্ট)',
    icon: '⚡',
    description: 'পাঞ্চি সিনেমাটিক কন্ট্রাস্ট ও উজ্জ্বল হাইলাইটস',
    curves: {
      rgb: [
        { x: 0, y: 0 },
        { x: 64, y: 44 },
        { x: 192, y: 212 },
        { x: 255, y: 255 },
      ],
      red: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
      green: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
      blue: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
    },
  },
  {
    id: 'film-matte',
    name: 'Vintage Matte',
    banglaName: 'ভিন্টেজ ফিল্ম ফেড',
    icon: '🎞️',
    description: 'উত্তোলিত শ্যাডো ও ক্লাসিক ফিল্ম স্টক লুক',
    curves: {
      rgb: [
        { x: 0, y: 32 },
        { x: 64, y: 72 },
        { x: 192, y: 204 },
        { x: 255, y: 236 },
      ],
      red: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
      green: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
      blue: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
    },
  },
  {
    id: 'teal-orange',
    name: 'Teal & Orange',
    banglaName: 'হলিউড টিল-অরেঞ্জ',
    icon: '🎬',
    description: 'শ্যাডোতে কুল সায়ান/ব্লু এবং হাইলাইটসে উষ্ণ অরেঞ্জ',
    curves: {
      rgb: [
        { x: 0, y: 0 },
        { x: 80, y: 70 },
        { x: 180, y: 195 },
        { x: 255, y: 255 },
      ],
      red: [
        { x: 0, y: 0 },
        { x: 80, y: 60 },
        { x: 180, y: 215 },
        { x: 255, y: 255 },
      ],
      green: [
        { x: 0, y: 0 },
        { x: 128, y: 126 },
        { x: 255, y: 255 },
      ],
      blue: [
        { x: 0, y: 28 },
        { x: 80, y: 95 },
        { x: 180, y: 155 },
        { x: 255, y: 228 },
      ],
    },
  },
  {
    id: 'warm-golden',
    name: 'Golden Hour',
    banglaName: 'গোল্ডেন আওয়ার',
    icon: '🌅',
    description: 'উষ্ণ সানসেট টোন এবং রিচ অ্যাম্বার আলো',
    curves: {
      rgb: [
        { x: 0, y: 0 },
        { x: 128, y: 134 },
        { x: 255, y: 255 },
      ],
      red: [
        { x: 0, y: 0 },
        { x: 128, y: 152 },
        { x: 255, y: 255 },
      ],
      green: [
        { x: 0, y: 0 },
        { x: 128, y: 138 },
        { x: 255, y: 255 },
      ],
      blue: [
        { x: 0, y: 0 },
        { x: 128, y: 104 },
        { x: 255, y: 240 },
      ],
    },
  },
  {
    id: 'cross-process',
    name: 'Cross Process',
    banglaName: 'ক্রস প্রসেস (লোমো)',
    icon: '🧪',
    description: 'উচ্চ নাটকীয় কন্ট্রাস্ট ও ভাইব্রেন্ট কেমিক্যাল শিফট',
    curves: {
      rgb: [
        { x: 0, y: 0 },
        { x: 64, y: 45 },
        { x: 192, y: 215 },
        { x: 255, y: 255 },
      ],
      red: [
        { x: 0, y: 0 },
        { x: 96, y: 80 },
        { x: 192, y: 220 },
        { x: 255, y: 255 },
      ],
      green: [
        { x: 0, y: 10 },
        { x: 128, y: 140 },
        { x: 255, y: 245 },
      ],
      blue: [
        { x: 0, y: 40 },
        { x: 128, y: 105 },
        { x: 255, y: 230 },
      ],
    },
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    banglaName: 'সাইবারপাঙ্ক নিয়ন',
    icon: '🔮',
    description: 'ম্যাজেন্টা ও ডিপ সায়ান নিয়ন ভাইব',
    curves: {
      rgb: [
        { x: 0, y: 0 },
        { x: 128, y: 130 },
        { x: 255, y: 255 },
      ],
      red: [
        { x: 0, y: 15 },
        { x: 128, y: 145 },
        { x: 255, y: 255 },
      ],
      green: [
        { x: 0, y: 0 },
        { x: 128, y: 110 },
        { x: 255, y: 240 },
      ],
      blue: [
        { x: 0, y: 35 },
        { x: 128, y: 160 },
        { x: 255, y: 255 },
      ],
    },
  },
  {
    id: 'invert',
    name: 'Invert / Negative',
    banglaName: 'নেগেটিভ (ইনভার্ট)',
    icon: '🔄',
    description: 'সম্পূর্ণ রিভার্সড কালার ইনভার্সন',
    curves: {
      rgb: [
        { x: 0, y: 255 },
        { x: 255, y: 0 },
      ],
      red: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
      green: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
      blue: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
    },
  },
];

/**
 * Fritsch-Carlson monotonic cubic Hermite spline interpolation.
 * Prevents overshoot and creates smooth professional curves.
 */
export function generateChannelLUT(points: CurvePoint[]): number[] {
  const sorted = [...points].sort((a, b) => a.x - b.x);
  const lut = new Array<number>(256);

  if (sorted.length === 0) {
    for (let i = 0; i < 256; i++) lut[i] = i;
    return lut;
  }

  if (sorted.length === 1) {
    const val = Math.min(255, Math.max(0, Math.round(sorted[0].y)));
    for (let i = 0; i < 256; i++) lut[i] = val;
    return lut;
  }

  // Ensure start and end
  const pts: CurvePoint[] = [];
  if (sorted[0].x > 0) {
    pts.push({ x: 0, y: sorted[0].y });
  }
  pts.push(...sorted);
  if (sorted[sorted.length - 1].x < 255) {
    pts.push({ x: 255, y: sorted[sorted.length - 1].y });
  }

  const n = pts.length;
  const x = pts.map((p) => p.x);
  const y = pts.map((p) => p.y);

  // Secants
  const delta = new Array<number>(n - 1);
  const m = new Array<number>(n);

  for (let i = 0; i < n - 1; i++) {
    const dx = x[i + 1] - x[i];
    delta[i] = dx === 0 ? 0 : (y[i + 1] - y[i]) / dx;
  }

  // Slopes
  m[0] = delta[0];
  for (let i = 1; i < n - 1; i++) {
    m[i] = (delta[i - 1] + delta[i]) / 2;
  }
  m[n - 1] = delta[n - 2];

  // Fritsch-Carlson monotonicity
  for (let i = 0; i < n - 1; i++) {
    if (delta[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
    } else {
      const alpha = m[i] / delta[i];
      const beta = m[i + 1] / delta[i];
      const dist = alpha * alpha + beta * beta;
      if (dist > 9) {
        const tau = 3 / Math.sqrt(dist);
        m[i] = tau * alpha * delta[i];
        m[i + 1] = tau * beta * delta[i];
      }
    }
  }

  // Evaluate for each integer 0..255
  for (let val = 0; val < 256; val++) {
    if (val <= x[0]) {
      lut[val] = Math.min(255, Math.max(0, Math.round(y[0])));
      continue;
    }
    if (val >= x[n - 1]) {
      lut[val] = Math.min(255, Math.max(0, Math.round(y[n - 1])));
      continue;
    }

    // Find segment
    let i = 0;
    while (i < n - 1 && val > x[i + 1]) {
      i++;
    }

    const h = x[i + 1] - x[i];
    const t = h === 0 ? 0 : (val - x[i]) / h;
    const t2 = t * t;
    const t3 = t2 * t;

    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;

    const interpolatedY =
      h00 * y[i] + h10 * h * m[i] + h01 * y[i + 1] + h11 * h * m[i + 1];

    lut[val] = Math.min(255, Math.max(0, Math.round(interpolatedY)));
  }

  return lut;
}

/**
 * Checks if a channel's curve is default linear (0,0)->(255,255)
 */
export function isChannelDefault(points: CurvePoint[]): boolean {
  if (points.length !== 2) return false;
  return (
    points[0].x === 0 &&
    points[0].y === 0 &&
    points[1].x === 255 &&
    points[1].y === 255
  );
}

/**
 * Checks if all RGB curves are completely linear/untouched
 */
export function isCurvesDefault(curves?: RGBCurves): boolean {
  if (!curves) return true;
  return (
    isChannelDefault(curves.rgb) &&
    isChannelDefault(curves.red) &&
    isChannelDefault(curves.green) &&
    isChannelDefault(curves.blue)
  );
}

/**
 * Generates tableValues string for SVG feComponentTransfer
 * Samples 64 points across 0..255 to provide smooth, high-performance GPU hardware acceleration
 */
export function generateFeComponentTransferTable(curves?: RGBCurves): {
  r: string;
  g: string;
  b: string;
  isModified: boolean;
} {
  if (!curves || isCurvesDefault(curves)) {
    return {
      r: '0 1',
      g: '0 1',
      b: '0 1',
      isModified: false,
    };
  }

  const masterLUT = generateChannelLUT(curves.rgb);
  const redLUT = generateChannelLUT(curves.red);
  const greenLUT = generateChannelLUT(curves.green);
  const blueLUT = generateChannelLUT(curves.blue);

  // Sample 64 equidistant points for the SVG table values
  const SAMPLE_COUNT = 64;
  const rValues: string[] = [];
  const gValues: string[] = [];
  const bValues: string[] = [];

  for (let s = 0; s < SAMPLE_COUNT; s++) {
    const inputIdx = Math.round((s / (SAMPLE_COUNT - 1)) * 255);
    const masterVal = masterLUT[inputIdx];

    const finalR = redLUT[masterVal] / 255;
    const finalG = greenLUT[masterVal] / 255;
    const finalB = blueLUT[masterVal] / 255;

    rValues.push(finalR.toFixed(3));
    gValues.push(finalG.toFixed(3));
    bValues.push(finalB.toFixed(3));
  }

  return {
    r: rValues.join(' '),
    g: gValues.join(' '),
    b: bValues.join(' '),
    isModified: true,
  };
}

/**
 * Generates an SVG path data string for rendering in the curves graph box
 * Coordinates are 0..256 x 0..256 (where visual y is 256 - y)
 */
export function generateCurveSvgPath(points: CurvePoint[]): string {
  const lut = generateChannelLUT(points);
  const d: string[] = [];

  // Sample every 4 pixels for a 64-step crisp SVG path
  for (let x = 0; x <= 256; x += 4) {
    const clampedX = Math.min(255, x);
    const yVal = lut[clampedX];
    const svgY = 256 - yVal; // Flip Y for SVG coordinates
    if (x === 0) {
      d.push(`M ${x} ${svgY}`);
    } else {
      d.push(`L ${x} ${svgY}`);
    }
  }

  return d.join(' ');
}

/**
 * Smooth keyframe interpolation for curves
 */
export function interpolateRGBCurves(
  a: RGBCurves,
  b: RGBCurves,
  progress: number
): RGBCurves {
  const channels: CurveChannel[] = ['rgb', 'red', 'green', 'blue'];
  const res: RGBCurves = {
    rgb: [],
    red: [],
    green: [],
    blue: [],
  };

  channels.forEach((ch) => {
    const lutA = generateChannelLUT(a[ch]);
    const lutB = generateChannelLUT(b[ch]);
    // Blend key points by sampling 5 primary tone anchors: blacks (0), shadows (64), midtones (128), highlights (192), whites (255)
    const anchors = [0, 64, 128, 192, 255];
    res[ch] = anchors.map((x) => {
      const yA = lutA[x];
      const yB = lutB[x];
      const blendedY = Math.round(yA + (yB - yA) * progress);
      return { x, y: Math.min(255, Math.max(0, blendedY)) };
    });
  });

  return res;
}
