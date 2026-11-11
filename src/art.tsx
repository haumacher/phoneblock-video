import React from 'react';
import { Easing, Img, staticFile } from 'remotion';

export const NAVY = '#101828';
export const RED = '#DC1E1E';
export const GREEN = '#2FA866';
export const FONT = "'Lato', 'Noto Sans', sans-serif";

// --- time helpers (t in seconds) -----------------------------------------
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const ramp = (t: number, start: number, dur = 0.4) => clamp((t - start) / dur);
export const ease = (x: number) => Easing.inOut(Easing.cubic)(clamp(x));
export const easeOut = (x: number) => Easing.out(Easing.cubic)(clamp(x));
export const back = (x: number) => Easing.out(Easing.back(1.8))(clamp(x));
export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
/** Fades in at `a`, out at `b`. */
export const window_ = (t: number, a: number, b: number, fade = 0.3) =>
	Math.min(ramp(t, a, fade), 1 - ramp(t, b - fade, fade));

/** Rings like a phone: shakes in 1.0 s bursts every 1.6 s. */
export const ringAngle = (t: number, start: number, stop = Infinity) => {
	if (t < start || t >= stop) return 0;
	const p = (t - start) % 1.6;
	if (p > 1.0) return 0;
	return Math.sin((t - start) * Math.PI * 2 * 11) * 7;
};

// --- Sprite: an absolutely placed piece with its own SVG coordinates --------
type SpriteProps = {
	x: number; y: number; s?: number; w: number; h: number; ox: number; oy: number;
	rot?: number; opacity?: number; z?: number; children: React.ReactNode;
};
export const Sprite: React.FC<SpriteProps> = ({ x, y, s = 1, w, h, ox, oy, rot = 0, opacity = 1, z, children }) => (
	<div style={{
		position: 'absolute', left: x - ox * s, top: y - oy * s, width: w * s, height: h * s,
		transform: rot ? `rotate(${rot}deg)` : undefined, transformOrigin: `${ox * s}px ${oy * s}px`,
		opacity, zIndex: z,
	}}>
		{children}
	</div>
);
const Svg: React.FC<{ w: number; h: number; children: React.ReactNode }> = ({ w, h, children }) => (
	<svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" style={{ position: 'absolute', overflow: 'visible' }}>{children}</svg>
);
const At: React.FC<{ w: number; h: number; x: number; y: number; bw: number; bh: number; children: React.ReactNode }> = ({ w, h, x, y, bw, bh, children }) => (
	<div style={{ position: 'absolute', left: `${(x / w) * 100}%`, top: `${(y / h) * 100}%`, width: `${(bw / w) * 100}%`, height: `${(bh / h) * 100}%` }}>{children}</div>
);

// --- Dongle (T-Dongle-S3, top view, plug to the left) ----------------------
// Anchor: the plug tip. The plug is 90 long; ~60 of it disappear in a port.
export const DONGLE_W = 420;
export const Dongle: React.FC<{ x: number; y: number; s?: number; lcd: string; led?: string; ledGlow?: number; opacity?: number; z?: number; rot?: number }> = ({ x, y, s = 1, lcd, led = GREEN, ledGlow = 0.6, opacity, z, rot }) => (
	<Sprite x={x} y={y} s={s} w={420} h={130} ox={0} oy={65} opacity={opacity} z={z} rot={rot}>
		<Svg w={420} h={130}>
			<defs>
				<linearGradient id="plug" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#E3E7EC" /><stop offset="1" stopColor="#AEB5BF" />
				</linearGradient>
				<linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#2A303B" /><stop offset="1" stopColor="#14171D" />
				</linearGradient>
			</defs>
			<rect x={0} y={29} width={100} height={72} rx={4} fill="url(#plug)" />
			<rect x={14} y={45} width={22} height={12} rx={2} fill="#59616D" />
			<rect x={14} y={73} width={22} height={12} rx={2} fill="#59616D" />
			<rect x={90} y={0} width={330} height={130} rx={24} fill="url(#body)" />
			<rect x={96} y={4} width={318} height={18} rx={9} fill="#ffffff" opacity={0.06} />
			<rect x={150} y={7} width={220} height={116} rx={8} fill="#07080B" />
			<circle cx={398} cy={65} r={22} fill={led} opacity={ledGlow * 0.35} />
			<circle cx={398} cy={65} r={9} fill={led} />
			<circle cx={395} cy={62} r={3} fill="#fff" opacity={0.7} />
		</Svg>
		<At w={420} h={130} x={160} y={15} bw={200} bh={100}>
			<Img src={staticFile(`img/${lcd}.png`)} style={{ width: '100%', height: '100%', imageRendering: lcd.startsWith('lcd-logo') ? 'auto' : 'pixelated', display: 'block' }} />
		</At>
	</Sprite>
);

// --- Router (front view) -----------------------------------------------
// Anchor: centre of the body. USB port on the right edge at (+150, 0)·s.
export const ROUTER_PORT = 150;
export const Router: React.FC<{ x: number; y: number; s?: number; t: number; opacity?: number; z?: number }> = ({ x, y, s = 1, t, opacity, z }) => (
	<Sprite x={x} y={y} s={s} w={320} h={240} ox={160} oy={180} opacity={opacity} z={z}>
		<Svg w={320} h={240}>
			<rect x={52} y={22} width={14} height={120} rx={7} fill="#D5DBE3" stroke="#B8C0CB" strokeWidth={2} transform="rotate(-8 59 140)" />
			<rect x={254} y={22} width={14} height={120} rx={7} fill="#D5DBE3" stroke="#B8C0CB" strokeWidth={2} transform="rotate(8 261 140)" />
			<rect x={10} y={130} width={300} height={100} rx={24} fill="#FAFBFC" stroke="#BCC4CF" strokeWidth={3} />
			<rect x={22} y={198} width={276} height={22} rx={10} fill="#E9EDF2" />
			{[0, 1, 2, 3, 4].map((i) => (
				<circle key={i} cx={60 + i * 22} cy={168} r={6}
					fill={i === 3 && Math.floor(t * 3 + i) % 2 === 0 ? '#9FDDB9' : '#33B36B'} />
			))}
			<circle cx={244} cy={166} r={15} fill="#E4E8EE" stroke="#BCC4CF" strokeWidth={2} />
			<text x={244} y={170} fontSize={10} textAnchor="middle" fill="#6B7380" fontFamily={FONT} fontWeight={700}>WPS</text>
			<rect x={306} y={166} width={8} height={28} rx={2} fill="#3A404A" />
		</Svg>
	</Sprite>
);

// --- DECT phone in its base ---------------------------------------------
// Anchor: bottom centre of the base.
export const Phone: React.FC<{ x: number; y: number; s?: number; angle?: number; lift?: number; screen?: string; waves?: number; opacity?: number; z?: number }> = ({ x, y, s = 1, angle = 0, lift = 0, screen, waves = 0, opacity, z }) => (
	<Sprite x={x} y={y} s={s} w={160} h={260} ox={80} oy={250} opacity={opacity} z={z}>
		<Svg w={160} h={260}>
			<rect x={15} y={214} width={130} height={36} rx={14} fill="#3B4252" />
			<rect x={30} y={206} width={100} height={14} rx={6} fill="#2B313C" />
			<g transform={`translate(0 ${-lift}) rotate(${angle} 80 210)`}>
				<rect x={46} y={30} width={68} height={178} rx={24} fill="#4C566A" />
				<rect x={50} y={34} width={22} height={170} rx={11} fill="#ffffff" opacity={0.07} />
				<rect x={56} y={46} width={48} height={38} rx={6} fill={screen ? '#A7E8D8' : '#68768C'} />
				{screen ? <text x={80} y={70} fontSize={8.5} textAnchor="middle" fill="#0F3B32" fontFamily={FONT} fontWeight={700}>{screen}</text> : null}
				{[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => (
					<circle key={`${r}-${c}`} cx={64 + c * 16} cy={104 + r * 18} r={5} fill="#D8DEE9" opacity={0.85} />
				)))}
				<rect x={68} y={36} width={24} height={4} rx={2} fill="#2B313C" />
			</g>
			{waves > 0 ? [0, 1, 2].map((i) => (
				<g key={i} opacity={waves * (1 - i * 0.28)} fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round">
					<path d={`M ${32 - i * 16} ${70 - i * 6} q ${-14 - i * 4} ${40 + i * 6} 0 ${80 + i * 12}`} />
					<path d={`M ${128 + i * 16} ${70 - i * 6} q ${14 + i * 4} ${40 + i * 6} 0 ${80 + i * 12}`} />
				</g>
			)) : null}
		</Svg>
	</Sprite>
);

// --- People --------------------------------------------------------------
export const Person: React.FC<{ x: number; y: number; s?: number; color: string; opacity?: number; headset?: boolean }> = ({ x, y, s = 1, color, opacity = 1, headset }) => (
	<g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
		<circle cx={0} cy={-22} r={20} fill={color} />
		<path d="M -34 34 q 0 -38 34 -38 q 34 0 34 38 z" fill={color} />
		{headset ? <>
			<path d="M -24 -22 a 24 24 0 0 1 48 0" fill="none" stroke={NAVY} strokeWidth={6} />
			<rect x={-30} y={-28} width={10} height={16} rx={4} fill={NAVY} />
			<path d="M -25 -14 q 2 16 20 16" fill="none" stroke={NAVY} strokeWidth={4} />
		</> : null}
	</g>
);

/** A comic speech bubble (HTML), its tail pointing at (tx, ty). */
export const Bubble: React.FC<{ x: number; y: number; w: number; tx: number; ty: number; opacity?: number; scale?: number; bg?: string; color?: string; size?: number; children: React.ReactNode; z?: number }> = ({ x, y, w, tx, ty, opacity = 1, scale = 1, bg = '#fff', color = NAVY, size = 34, children, z = 50 }) => {
	// tail as an SVG triangle from the bubble centre-bottom area to the target
	return (
		<div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity, zIndex: z, pointerEvents: 'none' }}>
			<svg width={1920} height={1080} style={{ position: 'absolute' }}>
				<path d={`M ${x + w * 0.42} ${y + 40} L ${tx} ${ty} L ${x + w * 0.58} ${y + 40} Z`} fill={bg}
					style={{ filter: 'drop-shadow(0 6px 10px rgba(16,24,40,.18))' }} />
			</svg>
			<div style={{
				position: 'absolute', left: x, top: y, width: w, background: bg, color, borderRadius: 28,
				padding: '22px 30px', fontFamily: FONT, fontSize: size, fontWeight: 700, lineHeight: 1.25,
				boxShadow: '0 10px 30px rgba(16,24,40,.18)', transform: `scale(${scale})`, transformOrigin: `${tx - x}px ${ty - y}px`,
				boxSizing: 'border-box',
			}}>{children}</div>
		</div>
	);
};

export const Label: React.FC<{ x: number; y: number; opacity?: number; children: React.ReactNode; color?: string; bg?: string; size?: number; anchor?: 'center' | 'left'; z?: number }> = ({ x, y, opacity = 1, children, color = NAVY, bg, size = 30, anchor = 'center', z = 40 }) => (
	<div style={{
		position: 'absolute', left: x, top: y, transform: anchor === 'center' ? 'translate(-50%, -50%)' : 'translate(0, -50%)',
		opacity, color, background: bg, padding: bg ? '8px 20px' : 0, borderRadius: 999, whiteSpace: 'nowrap',
		fontFamily: FONT, fontSize: size, fontWeight: 800, zIndex: z, boxShadow: bg ? '0 6px 18px rgba(16,24,40,.15)' : undefined,
	}}>{children}</div>
);

// --- geometry for wires ----------------------------------------------------
export type Pt = { x: number; y: number };
export const qpt = (a: Pt, c: Pt, b: Pt, u: number): Pt => ({
	x: (1 - u) * (1 - u) * a.x + 2 * (1 - u) * u * c.x + u * u * b.x,
	y: (1 - u) * (1 - u) * a.y + 2 * (1 - u) * u * c.y + u * u * b.y,
});
