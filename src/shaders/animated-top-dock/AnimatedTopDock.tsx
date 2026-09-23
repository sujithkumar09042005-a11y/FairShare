import { useEffect, useRef, useState, type ReactNode } from "react";
import { createTopDockController, type TopDockOptions } from "./topDockController";

export const ANIMATED_TOP_DOCK_VARIANTS = ["sable", "modern", "retro", "glass"] as const;
export type AnimatedTopDockVariant = (typeof ANIMATED_TOP_DOCK_VARIANTS)[number];

export type DockItem = { id: string; label: string; icon: ReactNode };

export type AnimatedTopDockProps = {
  variant?: AnimatedTopDockVariant;
  proximity?: number;
  spring?: number;
  damping?: number;
  widthGrowth?: number;
  heightGrowth?: number;
  drop?: number;
  /* retro field */
  pixelSize?: number;
  speed?: number;
  noise?: number;
  levels?: number;
  scanlines?: number;
  /* glass field */
  particles?: number;
  thickness?: number;
  dispersion?: number;
  specular?: number;
  rim?: number;
  drift?: number;
  className?: string;
  /* app integration props */
  items?: readonly DockItem[];
  activeId?: string;
  onItemSelect?: (id: string) => void;
  brandName?: string;
  brandMark?: ReactNode;
  brandHref?: string;
  onBrandClick?: () => void;
  ghostLabel?: ReactNode;
  onGhostClick?: () => void;
  ghostSlot?: ReactNode;
  ctaLabel?: ReactNode;
  onCtaClick?: () => void;
  hideStage?: boolean;
};

export const ANIMATED_TOP_DOCK_DEFAULTS = {
  variant: "sable" as AnimatedTopDockVariant,
  proximity: 122,
  spring: 0.19,
  damping: 0.7,
  widthGrowth: 17,
  heightGrowth: 16,
  drop: 3.5,
  pixelSize: 4,
  speed: 1,
  noise: 1,
  levels: 7,
  scanlines: 0.32,
  particles: 22,
  thickness: 0.115,
  dispersion: 0.05,
  specular: 0.85,
  rim: 0.5,
  drift: 1,
} as const;

const ITEMS: readonly DockItem[] = [
  { id: "system", label: "SYSTEM", icon: <><rect x="2.25" y="2.25" width="4.5" height="4.5" rx=".8" /><rect x="9.25" y="2.25" width="4.5" height="4.5" rx=".8" /><rect x="2.25" y="9.25" width="4.5" height="4.5" rx=".8" /><rect x="9.25" y="9.25" width="4.5" height="4.5" rx=".8" /></> },
  { id: "method", label: "METHOD", icon: <><circle cx="3" cy="8" r="1.5" /><circle cx="12.5" cy="3.5" r="1.5" /><circle cx="12.5" cy="12.5" r="1.5" /><path d="M4.5 7.3 11 4.2M4.5 8.7l6.5 3.1" /></> },
  { id: "work", label: "WORK", icon: <><rect x="2" y="3" width="12" height="10" rx="1.5" /><path d="M2 6h12M5 4.5h.01M7 4.5h.01" /></> },
  { id: "access", label: "ACCESS", icon: <><circle cx="5.2" cy="6.2" r="2.7" /><path d="m7.2 8.2 5.9 5.1M10.2 10.8l1.5-1.5M12 12.4l1.4-1.4" /></> },
  { id: "notes", label: "NOTES", icon: <><path d="M4 2.25h5.4L12 4.85v8.9H4z" /><path d="M9.25 2.25V5h2.7M6 8h4M6 10.5h4" /></> },
];

export const MODERN_ITEMS: readonly DockItem[] = [
  { id: "product", label: "Product", icon: <><path d="M8 1.9 14.1 5v6L8 14.1 1.9 11V5z" /><path d="M1.9 5 8 8.1 14.1 5M8 8.1v6" /></> },
  { id: "solutions", label: "Solutions", icon: <><path d="M8 1.9 14.4 5.6 8 9.3 1.6 5.6z" /><path d="m2.6 8 5.4 3.1L13.4 8M2.6 10.7 8 13.8l5.4-3.1" /></> },
  { id: "docs", label: "Docs", icon: <><path d="M3.4 2.4h5.4l3.8 3.8v7.4H3.4z" /><path d="M8.8 2.4v3.8h3.8M5.9 9h4.2M5.9 11.2h3" /></> },
  { id: "pricing", label: "Pricing", icon: <><path d="M8.6 2.2H13v4.4l-6.6 6.6a1.2 1.2 0 0 1-1.7 0L2.2 10.5a1.2 1.2 0 0 1 0-1.7z" /><circle cx="10.6" cy="4.6" r=".9" /></> },
  { id: "changelog", label: "Changelog", icon: <><circle cx="8" cy="8" r="5.9" /><path d="M8 4.6V8l2.4 1.5" /></> },
];

/* every retro glyph is drawn on a 7x7 lattice of whole units so the icons stay
   on the same pixel grid as the dithered field behind them */
const RETRO_ITEMS: readonly DockItem[] = [
  { id: "system", label: "SYSTEM", icon: <><rect x="1" y="1" width="2" height="2" /><rect x="4" y="1" width="2" height="2" /><rect x="1" y="4" width="2" height="2" /><rect x="4" y="4" width="2" height="2" /></> },
  { id: "files", label: "FILES", icon: <><rect x="1" y="0" width="4" height="1" /><rect x="1" y="1" width="1" height="5" /><rect x="5" y="1" width="1" height="5" /><rect x="1" y="6" width="5" height="1" /><rect x="2" y="2" width="3" height="1" /><rect x="2" y="4" width="3" height="1" /></> },
  { id: "net", label: "NET", icon: <><rect x="3" y="0" width="1" height="7" /><rect x="0" y="3" width="7" height="1" /><rect x="1" y="1" width="1" height="1" /><rect x="5" y="1" width="1" height="1" /><rect x="1" y="5" width="1" height="1" /><rect x="5" y="5" width="1" height="1" /></> },
  { id: "disk", label: "DISK", icon: <><rect x="0" y="1" width="7" height="5" /><rect x="2" y="0" width="3" height="2" /><rect x="1" y="4" width="5" height="1" /></> },
  { id: "help", label: "HELP", icon: <><rect x="2" y="0" width="3" height="1" /><rect x="4" y="1" width="2" height="2" /><rect x="3" y="3" width="2" height="1" /><rect x="3" y="4" width="1" height="1" /><rect x="3" y="6" width="1" height="1" /></> },
];

const GLASS_ITEMS: readonly DockItem[] = [
  { id: "overview", label: "Overview", icon: <><circle cx="8" cy="8" r="5.8" /><path d="M2.4 8c2.4-3.5 9-3.5 11.3 0" /></> },
  { id: "studio", label: "Studio", icon: <><rect x="2.2" y="2.2" width="11.6" height="11.6" rx="3.6" /><circle cx="8" cy="8" r="2.5" /></> },
  { id: "library", label: "Library", icon: <><rect x="2.1" y="2.6" width="3" height="10.8" rx="1" /><rect x="6.4" y="2.6" width="3" height="10.8" rx="1" /><path d="m10.9 3.7 2.9 1-2.4 8.6-2.2-.8" /></> },
  { id: "motion", label: "Motion", icon: <><path d="M1.8 10.6c2.6 0 3-5.2 6.2-5.2s3.6 5.2 6.2 5.2" /><circle cx="8" cy="5.4" r=".9" /></> },
  { id: "labs", label: "Labs", icon: <><path d="M6.4 2.2v4L3 12.1a1.3 1.3 0 0 0 1.1 2h7.8a1.3 1.3 0 0 0 1.1-2L9.6 6.2v-4" /><path d="M5.6 2.2h4.8M4.9 9.6h6.2" /></> },
];

const VARIANT_ITEMS: Record<AnimatedTopDockVariant, readonly DockItem[]> = {
  sable: ITEMS,
  modern: MODERN_ITEMS,
  retro: RETRO_ITEMS,
  glass: GLASS_ITEMS,
};

const BRAND_MARK = (
  <svg viewBox="0 0 498 273" aria-hidden="true" fill="currentColor">
    <path d="M 169.00 14.00 C 163.00 13.67, 149.83 14.33, 144.00 15.00 C 138.17 15.67, 137.83 16.33, 134.00 18.00 C 130.17 19.67, 124.50 22.83, 121.00 25.00 C 117.50 27.17, 120.00 24.67, 113.00 31.00 C 106.00 37.33, 87.33 54.50, 79.00 63.00 C 70.67 71.50, 67.17 76.33, 63.00 82.00 C 58.83 87.67, 57.50 94.33, 54.00 97.00 C 50.50 99.67, 45.83 97.00, 42.00 98.00 C 38.17 99.00, 33.67 101.50, 31.00 103.00 C 28.33 104.50, 28.33 104.33, 26.00 107.00 C 23.67 109.67, 19.00 115.17, 17.00 119.00 C 15.00 122.83, 14.50 126.17, 14.00 130.00 C 13.50 133.83, 13.67 138.67, 14.00 142.00 C 14.33 145.33, 15.00 147.33, 16.00 150.00 C 17.00 152.67, 18.33 155.50, 20.00 158.00 C 21.67 160.50, 22.83 162.50, 26.00 165.00 C 29.17 167.50, 35.33 171.33, 39.00 173.00 C 42.67 174.67, 44.33 174.83, 48.00 175.00 C 51.67 175.17, 50.50 163.67, 61.00 174.00 C 71.50 184.33, 100.33 224.67, 111.00 237.00 C 121.67 249.33, 120.17 245.00, 125.00 248.00 C 129.83 251.00, 135.50 253.33, 140.00 255.00 C 144.50 256.67, 147.50 257.67, 152.00 258.00 C 156.50 258.33, 162.50 262.67, 167.00 257.00 C 171.50 251.33, 179.00 229.00, 179.00 224.00 C 179.00 219.00, 170.50 226.50, 167.00 227.00 C 163.50 227.50, 161.00 227.33, 158.00 227.00 C 155.00 226.67, 152.00 226.17, 149.00 225.00 C 146.00 223.83, 143.50 222.67, 140.00 220.00 C 136.50 217.33, 137.00 220.00, 128.00 209.00 C 119.00 198.00, 92.33 164.67, 86.00 154.00 C 79.67 143.33, 89.33 149.50, 90.00 145.00 C 90.67 140.50, 91.17 132.33, 90.00 127.00 C 88.83 121.67, 84.17 115.83, 83.00 113.00 C 81.83 110.17, 81.83 112.50, 83.00 110.00 C 84.17 107.50, 86.67 102.50, 90.00 98.00 C 93.33 93.50, 95.67 90.33, 103.00 83.00 C 110.33 75.67, 127.50 59.33, 134.00 54.00 C 140.50 48.67, 140.83 50.33, 142.00 51.00 C 143.17 51.67, 141.00 55.83, 141.00 58.00 C 141.00 60.17, 140.83 60.67, 142.00 64.00 C 143.17 67.33, 145.33 74.00, 148.00 78.00 C 150.67 82.00, 155.00 85.67, 158.00 88.00 C 161.00 90.33, 163.33 91.00, 166.00 92.00 C 168.67 93.00, 170.33 93.83, 174.00 94.00 C 177.67 94.17, 180.83 87.50, 188.00 93.00 C 195.17 98.50, 210.00 127.00, 217.00 127.00 C 224.00 127.00, 230.50 101.67, 230.00 93.00 C 229.50 84.33, 216.00 80.00, 214.00 75.00 C 212.00 70.00, 217.33 67.50, 218.00 63.00 C 218.67 58.50, 218.50 52.00, 218.00 48.00 C 217.50 44.00, 216.33 41.83, 215.00 39.00 C 213.67 36.17, 212.83 34.00, 210.00 31.00 C 207.17 28.00, 201.83 23.33, 198.00 21.00 C 194.17 18.67, 190.00 17.67, 187.00 17.00 C 184.00 16.33, 183.00 17.50, 180.00 17.00 C 177.00 16.50, 175.00 14.33, 169.00 14.00 Z" />
    <path d="M 311.0 14.0 L 279.0 15.0 L 186.0 258.0 L 218.0 258.0 Z" />
    <path d="M 331.00 14.00 C 326.33 19.50, 319.67 41.83, 319.00 47.00 C 318.33 52.17, 323.00 45.33, 327.00 45.00 C 331.00 44.67, 339.33 44.67, 343.00 45.00 C 346.67 45.33, 346.17 45.67, 349.00 47.00 C 351.83 48.33, 356.17 50.00, 360.00 53.00 C 363.83 56.00, 363.50 54.17, 372.00 65.00 C 380.50 75.83, 405.17 107.67, 411.00 118.00 C 416.83 128.33, 407.67 122.50, 407.00 127.00 C 406.33 131.50, 405.83 139.67, 407.00 145.00 C 408.17 150.33, 414.00 154.67, 414.00 159.00 C 414.00 163.33, 410.00 166.67, 407.00 171.00 C 404.00 175.33, 403.00 177.33, 396.00 185.00 C 389.00 192.67, 371.33 210.83, 365.00 217.00 C 358.67 223.17, 359.83 221.17, 358.00 222.00 C 356.17 222.83, 354.67 224.33, 354.00 222.00 C 353.33 219.67, 354.83 212.33, 354.00 208.00 C 353.17 203.67, 351.67 200.00, 349.00 196.00 C 346.33 192.00, 342.17 187.00, 338.00 184.00 C 333.83 181.00, 328.83 178.83, 324.00 178.00 C 319.17 177.17, 316.33 184.50, 309.00 179.00 C 301.67 173.50, 286.33 146.50, 280.00 145.00 C 273.67 143.50, 273.00 165.00, 271.00 170.00 C 269.00 175.00, 268.50 173.50, 268.00 175.00 C 267.50 176.50, 265.67 175.50, 268.00 179.00 C 270.33 182.50, 280.33 190.83, 282.00 196.00 C 283.67 201.17, 278.50 204.67, 278.00 210.00 C 277.50 215.33, 278.00 223.17, 279.00 228.00 C 280.00 232.83, 281.67 235.67, 284.00 239.00 C 286.33 242.33, 290.17 245.67, 293.00 248.00 C 295.83 250.33, 297.50 251.67, 301.00 253.00 C 304.50 254.33, 310.83 255.67, 314.00 256.00 C 317.17 256.33, 317.17 254.67, 320.00 255.00 C 322.83 255.33, 326.33 257.50, 331.00 258.00 C 335.67 258.50, 342.17 258.83, 348.00 258.00 C 353.83 257.17, 360.00 255.67, 366.00 253.00 C 372.00 250.33, 375.50 249.50, 384.00 242.00 C 392.50 234.50, 409.00 216.83, 417.00 208.00 C 425.00 199.17, 428.00 194.67, 432.00 189.00 C 436.00 183.33, 438.17 176.33, 441.00 174.00 C 443.83 171.67, 446.17 175.17, 449.00 175.00 C 451.83 174.83, 454.33 174.67, 458.00 173.00 C 461.67 171.33, 467.33 168.33, 471.00 165.00 C 474.67 161.67, 478.00 156.83, 480.00 153.00 C 482.00 149.17, 482.50 146.00, 483.00 142.00 C 483.50 138.00, 483.67 133.17, 483.00 129.00 C 482.33 124.83, 480.33 120.00, 479.00 117.00 C 477.67 114.00, 477.17 113.33, 475.00 111.00 C 472.83 108.67, 468.33 104.83, 466.00 103.00 C 463.67 101.17, 463.50 101.00, 461.00 100.00 C 458.50 99.00, 455.17 97.33, 451.00 97.00 C 446.83 96.67, 444.17 105.50, 436.00 98.00 C 427.83 90.50, 409.83 62.33, 402.00 52.00 C 394.17 41.67, 392.50 39.83, 389.00 36.00 C 385.50 32.17, 384.67 31.67, 381.00 29.00 C 377.33 26.33, 371.17 22.17, 367.00 20.00 C 362.83 17.83, 359.33 17.00, 356.00 16.00 C 352.67 15.00, 351.17 14.33, 347.00 14.00 C 342.83 13.67, 335.67 8.50, 331.00 14.00 Z" />
  </svg>
);

function useDockController(getOptions: () => TopDockOptions) {
  const rootRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    return createTopDockController(root, getOptions);
    /* the getter is a stable ref reader, so the controller is built once */
  }, []);
  return rootRef;
}

type ShaderField = {
  resize: (width: number, height: number) => void;
  render: (now: number) => void;
  setPointer?: (x: number, y: number) => void;
  dispose: () => void;
};

/* both shader variants share the same host lifecycle: measure from the shell,
   pause off-screen and on a hidden tab, and hand the renderer a css-pixel box.
   The module is resolved in its own effect so the effect that owns the GL
   context can create and tear it down synchronously — an async create survives
   its own cleanup and leaves two renderers fighting over one canvas. */
function useShaderField(active: boolean, load: () => Promise<(canvas: HTMLCanvasElement) => ShaderField>) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [factory, setFactory] = useState<{ create: (canvas: HTMLCanvasElement) => ShaderField } | null>(null);

  useEffect(() => {
    if (!active) return undefined;
    let cancelled = false;
    load().then((create) => { if (!cancelled) setFactory({ create }); });
    return () => { cancelled = true; };
  }, [active]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!active || !factory || !host || !canvas) return undefined;
    const field = factory.create(canvas);
    let frame = 0;
    let visible = true;
    let bounds = host.getBoundingClientRect();
    const resize = () => {
      bounds = host.getBoundingClientRect();
      field.resize(bounds.width, bounds.height);
    };
    const tick = (now: number) => {
      field.resize(bounds.width, bounds.height);
      field.render(now);
      frame = visible && !document.hidden ? requestAnimationFrame(tick) : 0;
    };
    const onPointerMove = (event: PointerEvent) => {
      field.setPointer?.(
        ((event.clientX - bounds.left) / Math.max(1, bounds.width)) * 2 - 1,
        -((((event.clientY - bounds.top) / Math.max(1, bounds.height)) * 2) - 1),
      );
    };
    const resizeObserver = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible && !frame) frame = requestAnimationFrame(tick);
      if (!visible && frame) { cancelAnimationFrame(frame); frame = 0; }
    });
    resizeObserver.observe(host);
    intersection.observe(host);
    host.addEventListener("pointermove", onPointerMove, { passive: true });
    resize();
    frame = requestAnimationFrame(tick);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      field.dispose();
    };
  }, [active, factory]);

  return { hostRef, canvasRef };
}

export function AnimatedTopDock({
  className = "",
  items: customItems,
  activeId,
  onItemSelect,
  brandName,
  brandMark,
  brandHref,
  onBrandClick,
  ghostLabel,
  onGhostClick,
  ghostSlot,
  ctaLabel,
  onCtaClick,
  hideStage = false,
  ...props
}: AnimatedTopDockProps) {
  const optionsRef = useRef({ ...ANIMATED_TOP_DOCK_DEFAULTS, ...props });
  optionsRef.current = { ...ANIMATED_TOP_DOCK_DEFAULTS, ...props };
  const variant = optionsRef.current.variant;
  const items = customItems ?? VARIANT_ITEMS[variant] ?? ITEMS;
  const [active, setActive] = useState(activeId ?? items[0]?.id);

  useEffect(() => {
    if (activeId !== undefined) {
      setActive(activeId);
    }
  }, [activeId]);

  /* one spring, three fits: the command bar pins its track so a bar sized to its
     own content never moves, the terminal renormalises its cells across the
     strip, and the glass rail runs the proximity field down the y axis */
  const rootRef = useDockController(() => ({
    ...optionsRef.current,
    axis: variant === "glass" ? ("y" as const) : ("x" as const),
    distribute: variant === "retro",
    lockTrack: variant === "modern",
  }));

  const retro = useShaderField(variant === "retro", async () => {
    const { createRetroPixelField } = await import("./retroPixelField");
    return (canvas: HTMLCanvasElement) =>
      createRetroPixelField(canvas, () => ({
        pixelSize: optionsRef.current.pixelSize,
        noise: optionsRef.current.noise,
        levels: optionsRef.current.levels,
        speed: optionsRef.current.speed,
      }));
  });
  const glass = useShaderField(variant === "glass", async () => {
    const { createGlassParticleField } = await import("./glassParticleField");
    return (canvas: HTMLCanvasElement) =>
      createGlassParticleField(canvas, () => ({
        count: optionsRef.current.particles,
        thickness: optionsRef.current.thickness,
        dispersion: optionsRef.current.dispersion,
        specular: optionsRef.current.specular,
        rim: optionsRef.current.rim,
        drift: optionsRef.current.drift,
      }));
  });

  const dockItems = (itemClass: string, iconClass: string, viewBox: string) =>
    items.map((item) => (
      <button
        key={item.id}
        className={itemClass}
        data-dock-item
        type="button"
        aria-pressed={active === item.id}
        onClick={() => {
          setActive(item.id);
          onItemSelect?.(item.id);
        }}
      >
        <span className={iconClass} aria-hidden="true">
          <svg viewBox={viewBox}>{item.icon}</svg>
        </span>
        <span>{item.label}</span>
      </button>
    ));

  if (variant === "modern") {
    return (
      <header className={`atd-modern__bar${className ? ` ${className}` : ""}`}>
        <a
          className="atd-modern__brand cursor-pointer group/brand hover:opacity-90 transition-opacity"
          href={brandHref || "#top-dock"}
          title="FairShare • Return to Home"
          onClick={(event) => {
            if (onBrandClick) {
              event.preventDefault();
              onBrandClick();
            }
          }}
        >
          <span className="atd-modern__mark" aria-hidden="true">
            {brandMark || BRAND_MARK}
          </span>
          <span className="atd-modern__word">{brandName || "Lumina"}</span>
        </a>
        <nav
          ref={rootRef}
          className="atd-modern__dock"
          aria-label="Primary"
          data-dock-state="idle"
          data-dock-max="0.00"
        >
          {dockItems("atd-modern__item", "atd-modern__icon", "0 0 16 16")}
        </nav>
        <div className="atd-modern__actions">
          {ghostSlot ? (
            ghostSlot
          ) : (
            <button className="atd-modern__ghost" type="button" onClick={onGhostClick}>
              {ghostLabel || "Sign in"}
            </button>
          )}
          <button className="atd-modern__cta" type="button" onClick={onCtaClick}>
            <span>{ctaLabel || "Start building"}</span>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3.2 8h9.1M8.6 4.3 12.4 8l-3.8 3.7" />
            </svg>
          </button>
        </div>
      </header>
    );
  }

  if (variant === "retro") {
    return (
      <div
        ref={retro.hostRef}
        className={`animated-top-dock-component atd-retro${className ? ` ${className}` : ""}`}
        style={{ "--atd-retro-scan": optionsRef.current.scanlines } as React.CSSProperties}
      >
        <canvas ref={retro.canvasRef} className="atd-retro__field" aria-hidden="true" />
        <div className="atd-retro__vignette" aria-hidden="true" />
        <header className="atd-retro__bar">
          <div className="atd-retro__brand">
            <span className="atd-retro__badge" aria-hidden="true">
              <svg viewBox="0 0 7 7">
                <rect x="0" y="2" width="7" height="3" />
                <rect x="2" y="0" width="3" height="7" />
              </svg>
            </span>
            SABLE//OS
          </div>
          <nav
            ref={rootRef}
            className="atd-retro__dock"
            aria-label="Primary"
            data-dock-state="idle"
            data-dock-max="0.00"
          >
            {dockItems("atd-retro__item", "atd-retro__icon", "0 0 7 7")}
          </nav>
          <button className="atd-retro__cta" type="button" onClick={onCtaClick}>
            <span aria-hidden="true">▶</span>
            {ctaLabel || "RUN"}
          </button>
        </header>
        <p className="atd-retro__readout">
          <span>MEM 640K</span>
          <span>DITHER 8×8</span>
          <span>PAL 8</span>
        </p>
        <p className="animated-top-dock-component__caption">FITTED STRIP · ORDERED DITHER</p>
      </div>
    );
  }

  if (variant === "glass") {
    return (
      <div
        ref={glass.hostRef}
        className={`animated-top-dock-component atd-glass${className ? ` ${className}` : ""}`}
        data-dock-frame
      >
        <canvas ref={glass.canvasRef} className="atd-glass__field" aria-hidden="true" />
        <header className="atd-glass__rail">
          <a
            className="atd-glass__brand"
            href={brandHref || "#top-dock"}
            onClick={(event) => {
              if (onBrandClick) {
                event.preventDefault();
                onBrandClick();
              }
            }}
          >
            <span className="atd-glass__mark" aria-hidden="true">
              {brandMark || BRAND_MARK}
            </span>
            <span className="atd-glass__word">{brandName || "Aperture"}</span>
          </a>
          <span className="atd-glass__hairline" aria-hidden="true" />
          <nav
            ref={rootRef}
            className="atd-glass__dock"
            aria-label="Primary"
            data-dock-state="idle"
            data-dock-max="0.00"
          >
            {dockItems("atd-glass__item", "atd-glass__icon", "0 0 16 16")}
          </nav>
          <span className="atd-glass__hairline" aria-hidden="true" />
          <button className="atd-glass__cta" type="button" onClick={onCtaClick}>
            {ctaLabel || "Get the app"}
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3.4 8h9.2M8.8 4.2 12.6 8l-3.8 3.8" />
            </svg>
          </button>
        </header>
        <p className="animated-top-dock-component__caption">VERTICAL RAIL · SCREEN-SPACE DISPERSION</p>
      </div>
    );
  }

  return (
    <div className={`animated-top-dock-component${className ? ` ${className}` : ""}`}>
      <nav
        ref={rootRef}
        className="animated-top-dock__nav"
        aria-label="Animated top dock"
        data-dock-state="idle"
        data-dock-max="0.00"
      >
        <button
          className="animated-top-dock__item animated-top-dock__logo"
          data-dock-item
          type="button"
          aria-label="Home"
          onClick={() => setActive("system")}
        >
          {BRAND_MARK}
        </button>
        {items.map((item) => (
          <button
            key={item.id}
            className="animated-top-dock__item animated-top-dock__link"
            data-dock-item
            type="button"
            aria-pressed={active === item.id}
            onClick={() => {
              setActive(item.id);
              onItemSelect?.(item.id);
            }}
          >
            <span className="animated-top-dock__icon" aria-hidden="true">
              <svg viewBox="0 0 16 16">{item.icon}</svg>
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <p className="animated-top-dock-component__caption">MOVE ACROSS THE DOCK · FOCUS WITH TAB</p>
    </div>
  );
}

export default AnimatedTopDock;
