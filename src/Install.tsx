import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { T } from './timeline';
import { Dongle, FONT, GREEN, NAVY, Phone, RED, Router, Sprite, back, ease, easeOut, lerp, ramp, window_ } from './art';
import { LogoImg } from './Scene0';

const BLUE = '#2563EB';
const TEAL = '#00796B';

// --- small pieces ------------------------------------------------------------

/** The classic ESP32 stick: translucent case, black board. Anchor: plug tip. */
const ClassicStick: React.FC<{ x: number; y: number; s?: number; led?: string; opacity?: number }> = ({ x, y, s = 1, led = '#E5484D', opacity }) => (
	<Sprite x={x} y={y} s={s} w={440} h={130} ox={0} oy={65} opacity={opacity}>
		<svg viewBox="0 0 440 130" width="100%" height="100%" style={{ position: 'absolute', overflow: 'visible' }}>
			<rect x={0} y={29} width={100} height={72} rx={4} fill="#D9DEE5" />
			<rect x={14} y={45} width={22} height={12} rx={2} fill="#7B8490" />
			<rect x={14} y={73} width={22} height={12} rx={2} fill="#7B8490" />
			<rect x={92} y={14} width={300} height={102} rx={10} fill="#1B1E25" />
			<rect x={150} y={36} width={56} height={56} rx={4} fill="#2E333D" />
			<rect x={236} y={44} width={36} height={36} rx={3} fill="#2E333D" />
			{[0, 1, 2, 3].map((i) => <rect key={i} x={112} y={30 + i * 20} width={18} height={8} rx={2} fill="#C9A227" />)}
			<circle cx={360} cy={92} r={7} fill={led} />
			<path d="M 86 6 H 360 a 64 59 0 0 1 0 118 H 86 Z" fill="#E8F1FA" opacity={0.42} stroke="#BFD0E2" strokeWidth={3} />
			<circle cx={402} cy={65} r={11} fill="#EEF2F7" stroke="#BFD0E2" strokeWidth={3} />
		</svg>
	</Sprite>
);

const Check: React.FC<{ ok: boolean; size?: number }> = ({ ok, size = 46 }) => (
	<span style={{
		width: size, height: size, borderRadius: size / 2, background: ok ? GREEN : RED, color: '#fff', display: 'inline-flex',
		alignItems: 'center', justifyContent: 'center', fontSize: size * 0.62, fontWeight: 900, flex: 'none',
	}}>{ok ? '✓' : '✕'}</span>
);

const Card: React.FC<{ x: number; y: number; w: number; k: number; children: React.ReactNode; bg?: string; z?: number }> = ({ x, y, w, k, children, bg = '#fff', z = 20 }) => (
	<div style={{
		position: 'absolute', left: x, top: y, width: w, opacity: Math.min(1, k), zIndex: z,
		transform: `translateY(${(1 - Math.min(1, k)) * 30}px) scale(${0.92 + 0.08 * k})`,
		background: bg, borderRadius: 22, boxShadow: '0 12px 32px rgba(16,24,40,.12)', fontFamily: FONT, color: NAVY,
	}}>{children}</div>
);

const Tap: React.FC<{ x: number; y: number; t: number; at: number }> = ({ x, y, t, at }) => {
	const p = ramp(t, at - 0.35, 0.8);
	if (p <= 0 || p >= 1) return null;
	const press = p < 0.45 ? 1 : 1 - (p - 0.45) / 0.55;
	const ring = Math.max(0, (p - 0.4) / 0.6);
	return (
		<div style={{ position: 'absolute', left: x, top: y, zIndex: 60, pointerEvents: 'none' }}>
			<div style={{ position: 'absolute', left: -60 * ring - 14, top: -60 * ring - 14, width: 28 + 120 * ring, height: 28 + 120 * ring, borderRadius: '50%', border: `5px solid rgba(37,99,235,${0.8 * (1 - ring)})` }} />
			<div style={{ position: 'absolute', left: -22, top: -22, width: 44, height: 44, borderRadius: '50%', background: `rgba(37,99,235,${0.45 * press})` }} />
		</div>
	);
};

const Cursor: React.FC<{ x: number; y: number; down?: boolean; opacity?: number }> = ({ x, y, down, opacity = 1 }) => (
	<svg width={46} height={60} viewBox="0 0 23 30" style={{ position: 'absolute', left: x - 4, top: y - 2, zIndex: 70, opacity, transform: `scale(${down ? 0.88 : 1})`, filter: 'drop-shadow(0 3px 4px rgba(0,0,0,.35))' }}>
		<path d="M 2 2 L 2 24 L 8 18 L 12 28 L 16 26 L 12 17 L 20 17 Z" fill="#fff" stroke="#111" strokeWidth={1.6} strokeLinejoin="round" />
	</svg>
);

// --- the step tracker --------------------------------------------------------

const STEPS = ['Bestellen', 'Aufspielen', 'Einstecken', 'Einrichten'];
const Tracker: React.FC<{ t: number }> = ({ t }) => {
	const starts = [T.st1, T.st2, T.st3, T.st4];
	const cur = starts.filter((s) => t >= s).length - 1;
	const o = window_(t, T.st1 - 0.2, T.st5, 0.4);
	return (
		<div style={{ position: 'absolute', left: 0, right: 0, top: 36, display: 'flex', justifyContent: 'center', gap: 14, opacity: o, zIndex: 80, fontFamily: FONT }}>
			{STEPS.map((s, i) => {
				const active = i === cur, done = i < cur;
				return (
					<div key={i} style={{
						display: 'flex', alignItems: 'center', gap: 12, padding: '10px 22px 10px 12px', borderRadius: 999,
						background: active ? NAVY : done ? '#D7F0E2' : '#fff', color: active ? '#fff' : NAVY,
						boxShadow: '0 4px 14px rgba(16,24,40,.10)', fontSize: 26, fontWeight: 800,
						transform: `scale(${active ? 1 + 0.06 * back(ramp(t, starts[i], 0.4)) - 0.06 * ramp(t, starts[i] + 0.4, 0.3) : 1})`,
					}}>
						<span style={{
							width: 36, height: 36, borderRadius: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
							background: active ? RED : done ? GREEN : '#E3E8EF', color: active || done ? '#fff' : NAVY, fontWeight: 900,
						}}>{done ? '✓' : i + 1}</span>
						{s}
					</div>
				);
			})}
		</div>
	);
};

// --- A: does it fit? ---------------------------------------------------------

const Compat: React.FC<{ t: number }> = ({ t }) => {
	const o = window_(t, T.inst, T.st1 + 0.2, 0.4);
	if (o <= 0) return null;
	const rows: [number, boolean, string, string][] = [
		[T.chk1, true, 'Jede Fritz!Box', 'egal, bei welchem Anbieter'],
		[T.chk2, true, 'Jeder Telekom-Anschluss', 'egal, mit welchem Router'],
		[T.chk3, true, 'Andere Router', 'wenn sie IP-Telefone erlauben'],
		[T.chk4, false, 'Vodafone mit EasyBox', 'leider nicht möglich'],
	];
	return (
		<AbsoluteFill style={{ opacity: o }}>
			<div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: FONT, color: NAVY, fontSize: 76, fontWeight: 900, transform: `scale(${0.9 + 0.1 * back(ramp(t, T.inst + 0.3, 0.5))})`, opacity: ramp(t, T.inst + 0.3, 0.3) }}>
				Passt das bei dir?
			</div>
			{rows.map(([at, ok, a, b], i) => (
				<Card key={i} x={460} y={270 + i * 150} w={1000} k={back(ramp(t, at, 0.45))}>
					<div style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '24px 34px' }}>
						<Check ok={ok} size={64} />
						<div>
							<div style={{ fontSize: 42, fontWeight: 900, color: ok ? NAVY : RED }}>{a}</div>
							<div style={{ fontSize: 30, fontWeight: 700, color: '#5B6576' }}>{b}</div>
						</div>
					</div>
				</Card>
			))}
		</AbsoluteFill>
	);
};

// --- B: step 1, order ----------------------------------------------------------

const Order: React.FC<{ t: number }> = ({ t }) => {
	const o = window_(t, T.st1, T.st2 + 0.2, 0.4);
	if (o <= 0) return null;
	const c = back(ramp(t, T.st1 + 0.3, 0.6));
	const s3 = back(ramp(t, T.s3, 0.6));
	const shift = ease(ramp(t, T.s3 - 0.2, 0.7));
	const chips = ['ESP32', 'ESP32-C3', 'ESP32-S3 · 16 MB'];
	return (
		<AbsoluteFill style={{ opacity: o }}>
			<ClassicStick x={lerp(760, 300, shift)} y={430} s={1.5 * Math.min(1, c)} opacity={Math.min(1, c)} />
			<div style={{ position: 'absolute', left: lerp(760, 300, shift) + 240, top: 560, transform: 'translateX(-50%)', fontFamily: FONT, color: NAVY, fontSize: 32, fontWeight: 800, opacity: Math.min(1, c), whiteSpace: 'nowrap' }}>ESP32-USB-Stick</div>
			<Card x={lerp(1420, 330, shift)} y={lerp(330, 640, shift)} w={320} k={back(ramp(t, T.price1, 0.45))}>
				<div style={{ padding: '18px 26px', fontSize: 34, fontWeight: 900 }}>💶 ca. 10 €</div>
			</Card>
			<Card x={lerp(1420, 330, shift) + (shift > 0 ? 340 : 0)} y={lerp(450, 640, shift)} w={360} k={back(ramp(t, T.ship, 0.45))}>
				<div style={{ padding: '18px 26px', fontSize: 34, fontWeight: 900 }}>📦 ca. 2 Wochen</div>
			</Card>
			{s3 > 0 ? <>
				<Dongle x={1120} y={430} s={1.5 * s3} lcd="lcd-logo" led={GREEN} opacity={Math.min(1, s3)} />
				<div style={{ position: 'absolute', left: 1120 + 315, top: 560, transform: 'translateX(-50%)', fontFamily: FONT, color: NAVY, fontSize: 32, fontWeight: 800, opacity: Math.min(1, s3), whiteSpace: 'nowrap', textAlign: 'center' }}>
					T-Dongle-S3 <span style={{ color: '#5B6576', fontWeight: 700 }}>· mit Display</span>
				</div>
			</> : null}
			<div style={{ position: 'absolute', left: 0, right: 0, top: 820, display: 'flex', justifyContent: 'center', gap: 22, fontFamily: FONT }}>
				{chips.map((ch, i) => {
					const k = back(ramp(t, T.chips + i * 0.9, 0.4));
					return (
						<div key={i} style={{
							display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderRadius: 999, padding: '12px 26px 12px 14px',
							fontSize: 34, fontWeight: 900, color: NAVY, opacity: Math.min(1, k), transform: `scale(${k})`, boxShadow: '0 8px 20px rgba(16,24,40,.12)',
						}}><Check ok size={42} />{ch}</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

// --- C: step 2, flash in the browser -----------------------------------------

const SCREEN = { x: 330, y: 150, w: 1160, h: 690 };
const PAGE_S = SCREEN.w / 1280;
const BTN = { x: SCREEN.x + 158 * PAGE_S, y: SCREEN.y + 48 + 660 * PAGE_S };

const Dialog: React.FC<{ k: number; w: number; children: React.ReactNode; top?: number }> = ({ k, w, children, top = 230 }) => (
	k <= 0 ? null : (
		<div style={{
			position: 'absolute', left: SCREEN.x + SCREEN.w / 2 - w / 2, top: SCREEN.y + top, width: w, zIndex: 40, opacity: Math.min(1, k),
			transform: `scale(${0.9 + 0.1 * k})`, background: '#fff', borderRadius: 24, boxShadow: '0 24px 60px rgba(0,0,0,.35)',
			fontFamily: "'Roboto', 'Noto Sans', sans-serif", color: '#1F1F1F', overflow: 'hidden',
		}}>{children}</div>
	)
);

const Flash: React.FC<{ t: number }> = ({ t }) => {
	const o = window_(t, T.st2, T.st3 + 0.3, 0.4);
	if (o <= 0) return null;
	const lap = back(ramp(t, T.st2 + 0.2, 0.6));
	const plug = ease(ramp(t, T.plugPC, 0.8));
	const page = ramp(t, T.page, 0.4);
	// cursor path: rest → button → list item → Verbinden → Install
	const serialK = window_(t, T.serial, T.install, 0.2);
	const espK = window_(t, T.install, T.complete + 3.0, 0.2);
	const prog = clamp01((t - T.progress) / (T.complete - T.progress));
	const stage = t < T.confirm ? 'menu' : t < T.progress ? 'confirm' : t < T.complete ? 'progress' : 'done';
	const pts = [
		{ at: T.page, x: 1100, y: 600 },
		{ at: T.clickFlash, x: BTN.x, y: BTN.y },
		{ at: T.connect - 0.5, x: 740, y: 330 },
		{ at: T.connect, x: 1010, y: 640 },
		{ at: T.install + 0.6, x: 780, y: 420 },
		{ at: T.confirm, x: 960, y: 560 },
		{ at: T.progress + 1.0, x: 1200, y: 760 },
	];
	let cx = pts[0].x, cy = pts[0].y;
	for (let i = 1; i < pts.length; i++) {
		const u = ease(ramp(t, pts[i].at - 0.45, 0.45));
		cx = lerp(cx, pts[i].x, u); cy = lerp(cy, pts[i].y, u);
	}
	const down = pts.slice(1).some((p) => t >= p.at - 0.05 && t < p.at + 0.12);
	const stamp = back(ramp(t, T.stamp, 0.4));
	return (
		<AbsoluteFill style={{ opacity: o }}>
			<div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - Math.min(1, lap)) * 80}px)`, opacity: Math.min(1, lap) }}>
				{/* laptop */}
				<div style={{ position: 'absolute', left: SCREEN.x - 22, top: SCREEN.y - 22, width: SCREEN.w + 44, height: SCREEN.h + 44, background: '#2B303A', borderRadius: 28 }} />
				<svg width={1920} height={1080} style={{ position: 'absolute' }}>
					<path d={`M ${SCREEN.x - 120} ${SCREEN.y + SCREEN.h + 22} H ${SCREEN.x + SCREEN.w + 120} L ${SCREEN.x + SCREEN.w + 60} ${SCREEN.y + SCREEN.h + 72} H ${SCREEN.x - 60} Z`} fill="#C9CFD8" />
					<rect x={SCREEN.x + SCREEN.w / 2 - 110} y={SCREEN.y + SCREEN.h + 22} width={220} height={12} rx={6} fill="#AEB5BF" />
				</svg>
				<div style={{ position: 'absolute', left: SCREEN.x, top: SCREEN.y, width: SCREEN.w, height: SCREEN.h, background: '#fff', overflow: 'hidden', borderRadius: 6 }}>
					<div style={{ height: 48, background: '#E8EAED', display: 'flex', alignItems: 'center', padding: '0 18px', gap: 10 }}>
						{['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
						<div style={{ marginLeft: 18, flex: 1, background: '#fff', borderRadius: 999, padding: '6px 18px', fontFamily: FONT, fontSize: 22, color: '#3C4043' }}>
							🔒 phoneblock.net/dongle
						</div>
					</div>
					<div style={{ opacity: page }}>
						<Img src={staticFile('ui/web-step2.png')} style={{ width: SCREEN.w, display: 'block' }} />
					</div>
					{espK > 0 ? <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.35 * espK})` }} /> : null}
				</div>
				{/* the dongle in the laptop's USB port (right side of the base) */}
				<Dongle x={lerp(1760, SCREEN.x + SCREEN.w + 70, plug)} y={SCREEN.y + SCREEN.h + 46} s={0.7} lcd="lcd-logo" led={t >= T.complete ? '#FFFFFF' : '#4A4F59'} opacity={ramp(t, T.st2 + 0.4, 0.3)} />
			</div>

			<Dialog k={serialK} w={620} top={60}>
				<div style={{ padding: '24px 28px 8px', fontSize: 24, fontWeight: 500 }}>phoneblock.net möchte eine Verbindung mit einem seriellen Port herstellen</div>
				<div style={{ margin: '12px 28px', border: '1px solid #DADCE0', borderRadius: 8, height: 160 }}>
					<div style={{ padding: '12px 16px', fontSize: 22, background: t >= T.connect - 0.4 ? '#D3E3FD' : 'transparent' }}>USB JTAG/serial debug unit (COM3)</div>
				</div>
				<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '10px 28px 24px' }}>
					<span style={{ padding: '10px 22px', borderRadius: 999, background: t >= T.connect - 0.4 ? '#0B57D0' : '#E3E3E3', color: t >= T.connect - 0.4 ? '#fff' : '#888', fontSize: 22, fontWeight: 600 }}>Verbinden</span>
					<span style={{ padding: '10px 22px', borderRadius: 999, border: '1px solid #DADCE0', color: '#0B57D0', fontSize: 22, fontWeight: 600 }}>Abbrechen</span>
				</div>
			</Dialog>

			<Dialog k={espK} w={560} top={160}>
				{stage === 'menu' ? <div style={{ padding: '30px 36px' }}>
					<div style={{ fontSize: 40, marginBottom: 26 }}>PhoneBlock Dongle</div>
					<div style={{ fontSize: 28, padding: '12px 0', display: 'flex', gap: 22 }}>⬇&nbsp; Install PhoneBlock Dongle</div>
					<div style={{ fontSize: 28, padding: '12px 0', display: 'flex', gap: 22, color: '#555' }}>›_&nbsp; Logs &amp; Console</div>
				</div> : null}
				{stage === 'confirm' ? <div style={{ padding: '30px 36px' }}>
					<div style={{ fontSize: 40, marginBottom: 22 }}>Confirm Installation</div>
					<div style={{ fontSize: 26 }}>Do you want to install PhoneBlock Dongle 2.0.0?</div>
					<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 40, marginTop: 34, fontSize: 26, color: '#03A9F4', fontWeight: 500 }}><span>Back</span><span>Install</span></div>
				</div> : null}
				{stage === 'progress' ? <div style={{ padding: '30px 36px' }}>
					<div style={{ fontSize: 40, marginBottom: 22 }}>Installing</div>
					<div style={{ fontSize: 26, marginBottom: 18 }}>Installation {Math.round(prog * 100)} %</div>
					<div style={{ height: 10, borderRadius: 5, background: '#E0E0E0', overflow: 'hidden' }}>
						<div style={{ width: `${prog * 100}%`, height: '100%', background: '#03A9F4' }} />
					</div>
					<div style={{ fontSize: 22, color: '#666', marginTop: 18 }}>This will take about a minute. Keep this page visible.</div>
				</div> : null}
				{stage === 'done' ? <div style={{ padding: '34px 36px', textAlign: 'center' }}>
					<div style={{ fontSize: 64 }}>🎉</div>
					<div style={{ fontSize: 32, margin: '10px 0 20px' }}>Installation complete!</div>
					<div style={{ textAlign: 'right', fontSize: 26, color: '#03A9F4', fontWeight: 500 }}>Next</div>
				</div> : null}
			</Dialog>

			<Cursor x={cx} y={cy} down={down} opacity={ramp(t, T.page, 0.3) * (1 - ramp(t, T.complete + 0.5, 0.3))} />
			{stamp > 0 ? (
				<div style={{
					position: 'absolute', left: 1180, top: 120, zIndex: 90, transform: `rotate(-8deg) scale(${stamp})`, opacity: Math.min(1, stamp),
					background: GREEN, color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 44, padding: '18px 34px', borderRadius: 18,
					boxShadow: '0 14px 30px rgba(16,24,40,.25)', border: '5px solid #fff',
				}}>Kein Programmieren nötig ✓</div>
			) : null}
		</AbsoluteFill>
	);
};
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

// --- D: step 3, router + WPS ---------------------------------------------------

/** LED colour for the pattern the firmware shows (status_led.c). */
const ledAt = (t: number) => {
	if (t >= T.white) return Math.floor(t * 20) % 20 < 2 ? '#FFFFFF' : '#4A4F59';          // setup: 100 ms / s
	if (t >= T.blue) return Math.floor(t * 10) % 2 === 0 ? '#3B82F6' : '#1F2A44';           // pairing: 5 Hz
	return '#4A4F59';
};

const Wps: React.FC<{ t: number }> = ({ t }) => {
	const o = window_(t, T.st3, T.st4 + 0.2, 0.4);
	if (o <= 0) return null;
	const R = { x: 760, y: 640, s: 2.0 };
	const port = R.x + 150 * R.s;
	const plug = ease(ramp(t, T.toRouter, 1.0));
	const tip = { x: lerp(1500, port - 60 * 1.2, plug), y: lerp(300, R.y, plug) };
	const wpsBtn = { x: R.x + (244 - 160) * R.s, y: R.y + (166 - 180) * R.s };
	const press = ramp(t, T.wps - 0.3, 0.3) * (1 - ramp(t, T.wps + 0.4, 0.3));
	const wavesK = window_(t, T.waves, T.white + 0.6, 0.2);
	const led = ledAt(t);
	const legend = t >= T.white ? ['#FFFFFF', 'kurzes Aufblitzen', 'im WLAN – bereit zur Einrichtung'] : t >= T.blue ? ['#3B82F6', 'blinkt schnell blau', 'wartet auf dein WLAN (WPS)'] : null;
	return (
		<AbsoluteFill style={{ opacity: o }}>
			<Dongle x={tip.x} y={tip.y} s={1.2} lcd="lcd-logo" led={led} ledGlow={led === '#4A4F59' || led === '#1F2A44' ? 0 : 0.9} z={5} rot={(1 - plug) * -10} />
			<Router x={R.x} y={R.y} s={R.s} t={t} z={6} />
			{/* WPS press */}
			<div style={{ position: 'absolute', left: wpsBtn.x - 40, top: wpsBtn.y - 40, width: 80, height: 80, borderRadius: 40, zIndex: 8, boxShadow: `0 0 ${40 * press + (wavesK > 0 ? 20 : 0)}px ${10 * press}px rgba(37,99,235,.6)` }} />
			<div style={{ position: 'absolute', left: wpsBtn.x - 20, top: wpsBtn.y + 10 - 40 * press, fontSize: 110, zIndex: 9, opacity: window_(t, T.wps - 0.8, T.wps + 1.2, 0.3), transform: 'rotate(-10deg)' }}>👆</div>
			<svg width={1920} height={1080} style={{ position: 'absolute', zIndex: 7, pointerEvents: 'none' }}>
				{[0, 1, 2].map((i) => {
					const p = ((t - T.waves) * 1.2 + i / 3) % 1;
					return wavesK > 0 ? <path key={i} d={`M ${R.x - 40} ${R.y - 230 - p * 120} a ${120 + p * 160} ${60 + p * 80} 0 0 1 ${80 + p * 0} 0`} fill="none" /> : null;
				})}
				{wavesK > 0 ? [0, 1, 2].map((i) => {
					const p = ((t - T.waves) * 1.1 + i / 3) % 1;
					const r = 40 + p * 220;
					return <path key={'w' + i} d={`M ${R.x - r} ${R.y - 200} A ${r} ${r} 0 0 1 ${R.x + r} ${R.y - 200}`} fill="none" stroke={BLUE} strokeWidth={10} strokeLinecap="round" opacity={wavesK * (1 - p)} />;
				}) : null}
			</svg>
			<div style={{ position: 'absolute', left: 1260, top: 520, width: 560, height: 240, borderRadius: 120, zIndex: 3, background: `radial-gradient(closest-side, ${led === '#4A4F59' || led === '#1F2A44' ? 'transparent' : led + '55'}, transparent)` }} />
			{legend ? (
				<Card x={1180} y={210} w={600} k={1} z={30}>
					<div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '22px 30px' }}>
						<span style={{ width: 40, height: 40, borderRadius: 20, background: legend[0], border: '3px solid #D5DBE3', boxShadow: `0 0 18px ${legend[0]}`, flex: 'none' }} />
						<div><div style={{ fontSize: 34, fontWeight: 900 }}>LED {legend[1]}</div><div style={{ fontSize: 26, fontWeight: 700, color: '#5B6576' }}>{legend[2]}</div></div>
					</div>
				</Card>
			) : null}
		</AbsoluteFill>
	);
};

// --- E: step 4, setup on the phone ----------------------------------------------

const PH = { x: 360, y: 120, w: 460, sc: 0.82 };   // phone frame (local 460×960, scaled); screen 420 wide
const at = (x: number, y: number) => ({ x: PH.x + (20 + x * 1.05) * PH.sc, y: PH.y + (70 + y * 1.05) * PH.sc });

const Setup: React.FC<{ t: number }> = ({ t }) => {
	const o = window_(t, T.st4, T.st5 + 0.2, 0.4);
	if (o <= 0) return null;
	const enter = back(ramp(t, T.st4 + 0.2, 0.6));
	const shots: [number, string, string][] = [
		[0, 'ui-01-start', 'answerbot'],
		[T.tap1 + 0.25, 'ui-02-provider', 'answerbot/#/setup/sip'],
		[T.tap2 + 0.25, 'ui-03-fritzbox-empty', 'answerbot/#/setup/sip/fritzbox'],
		[T.typing + 0.9, 'ui-04-fritzbox-filled', 'answerbot/#/setup/sip/fritzbox'],
		[T.tap3 + 0.25, 'ui-05-2fa', 'answerbot/#/setup/sip/fritzbox'],
		[T.sipOk, 'ui-07-step1-done', 'answerbot'],
		[T.tap4 + 0.25, 'ui-08-link-start', 'answerbot/#/setup/token'],
		[T.tap5 + 0.25, 'ui-09-pb-login', 'phoneblock.net/phoneblock/mobile/login'],
		[T.tokOk, 'ui-10-status', 'answerbot'],
	];
	const cur = shots.filter((s) => t >= s[0]);
	const [since, img, url] = cur[cur.length - 1];
	const prev = cur.length > 1 ? cur[cur.length - 2][1] : null;
	const fade = ramp(t, since, 0.25);
	const typed = Math.max(0, Math.min(9, Math.floor((t - T.typing) / 0.1)));
	const pw = at(200, 417);
	const fbK = window_(t, T.fbKey - 0.6, T.sipOk + 0.6, 0.3);
	const dialK = window_(t, T.dial - 0.3, T.sipOk + 0.6, 0.3);
	const doneK = back(ramp(t, T.done, 0.5));
	const press = ramp(t, T.fbKey, 0.2) * (1 - ramp(t, T.fbKey + 0.5, 0.3));
	const digits = '*18401'.slice(0, Math.max(0, Math.floor((t - T.dial) / 0.18)));
	return (
		<AbsoluteFill style={{ opacity: o }}>
			<div style={{ position: 'absolute', left: PH.x, top: PH.y, width: PH.w, height: 960, transformOrigin: '0 0', transform: `translateY(${(1 - Math.min(1, enter)) * 120}px) scale(${PH.sc})`, opacity: Math.min(1, enter) }}>
				<div style={{ position: 'absolute', left: 0, top: 0, width: PH.w, height: 960, borderRadius: 64, background: '#1B1E25', boxShadow: '0 30px 60px rgba(16,24,40,.3)' }} />
				<div style={{ position: 'absolute', left: 20, top: 22, width: 420, height: 920, borderRadius: 46, background: '#fff', overflow: 'hidden' }}>
					<div style={{ height: 48, background: '#F1F3F4', display: 'flex', alignItems: 'center', padding: '0 16px', fontFamily: FONT, fontSize: 19, color: '#3C4043' }}>
						<div style={{ flex: 1, background: '#fff', borderRadius: 999, padding: '5px 14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{url}</div>
					</div>
					<div style={{ position: 'relative', width: 420, height: 861 }}>
						{prev ? <Img src={staticFile(`ui/${prev}.png`)} style={{ position: 'absolute', width: 420, opacity: 1 - fade }} /> : null}
						<Img src={staticFile(`ui/${img}.png`)} style={{ position: 'absolute', width: 420, opacity: fade }} />
					</div>
				</div>
				{t >= T.typing && t < T.typing + 0.95 ? (
					<div style={{ position: 'absolute', left: 40, top: 70 + 417 * 1.05 - 20, width: 380, height: 40, background: '#fff', border: '2px solid #333', borderRadius: 4, fontSize: 22, padding: '6px 10px', boxSizing: 'border-box', letterSpacing: 2 }}>{'•'.repeat(typed)}|</div>
				) : null}
			</div>
			<Tap {...at(190, 325)} t={t} at={T.tap1} />
			<Tap {...at(200, 288)} t={t} at={T.tap2} />
			<Tap {...pw} t={t} at={T.typing - 0.1} />
			<Tap {...at(136, 465)} t={t} at={T.tap3} />
			<Tap {...at(202, 416)} t={t} at={T.tap4} />
			<Tap {...at(149, 420)} t={t} at={T.tap5} />
			<Tap {...at(164, 438)} t={t} at={T.tap6} />

			{/* 2FA: a key on the box, or the code on a phone */}
			{fbK > 0 ? <>
				<Router x={1250} y={330} s={1.3} t={t} opacity={fbK} z={10} />
				<div style={{ position: 'absolute', left: 1250 + 84 * 1.3 - 45, top: 330 - 14 * 1.3 - 45, width: 90, height: 90, borderRadius: 45, zIndex: 11, boxShadow: `0 0 ${50 * press}px ${14 * press}px rgba(37,99,235,.6)`, opacity: fbK }} />
				<div style={{ position: 'absolute', left: 1250 + 84 * 1.3 - 26, top: 330 + 4 - 40 * press, fontSize: 90, zIndex: 12, opacity: fbK * window_(t, T.fbKey - 0.6, T.fbKey + 1.2, 0.2), transform: 'rotate(-10deg)' }}>👆</div>
				<div style={{ position: 'absolute', left: 1250, top: 490, transform: 'translateX(-50%)', fontFamily: FONT, fontSize: 30, fontWeight: 800, color: NAVY, opacity: fbK, whiteSpace: 'nowrap' }}>eine Taste an der Fritz!Box</div>
			</> : null}
			{dialK > 0 ? <>
				<div style={{ position: 'absolute', left: 1250, top: 560, transform: 'translateX(-50%)', fontFamily: FONT, fontSize: 30, fontWeight: 900, color: '#5B6576', opacity: dialK }}>– oder –</div>
				<Phone x={1250} y={880} s={1.0} screen={digits || ' '} opacity={dialK} z={10} />
				<div style={{ position: 'absolute', left: 1350, top: 760, fontFamily: FONT, fontSize: 30, fontWeight: 800, color: NAVY, opacity: dialK, whiteSpace: 'nowrap' }}>Code wählen: <b>*18401</b></div>
			</> : null}

			{/* done */}
			{doneK > 0 ? <>
				<Dongle x={1180} y={480} s={1.3} lcd="lcd-logo" led={GREEN} ledGlow={0.9} opacity={Math.min(1, doneK)} />
				<div style={{ position: 'absolute', left: 1180 + 273, top: 330, transform: `translateX(-50%) scale(${doneK})`, background: GREEN, color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 52, padding: '14px 36px', borderRadius: 999, boxShadow: '0 14px 30px rgba(47,168,102,.35)', whiteSpace: 'nowrap' }}>✓ Fertig!</div>
				<div style={{ position: 'absolute', left: 1180 + 273, top: 600, transform: 'translateX(-50%)', fontFamily: FONT, fontWeight: 800, fontSize: 30, color: NAVY, opacity: Math.min(1, doneK), whiteSpace: 'nowrap' }}>LED leuchtet grün = einsatzbereit</div>
			</> : null}
		</AbsoluteFill>
	);
};

// --- F: home network only ---------------------------------------------------------

const Safety: React.FC<{ t: number }> = ({ t }) => {
	const o = window_(t, T.st5, T.instEnd + 0.3, 0.4);
	if (o <= 0) return null;
	const house = back(ramp(t, T.st5 + 0.2, 0.6));
	const block = back(ramp(t, T.st5 + 2.6, 0.4));
	return (
		<AbsoluteFill style={{ opacity: o }}>
			<svg width={1920} height={1080} style={{ position: 'absolute' }}>
				<g opacity={Math.min(1, house)} transform={`translate(560 600) scale(${0.85 + 0.15 * house})`}>
					<path d="M -330 -60 L 0 -330 L 330 -60 V 300 H -330 Z" fill="#fff" stroke={NAVY} strokeWidth={14} strokeLinejoin="round" />
					<text x={0} y={250} textAnchor="middle" fontFamily={FONT} fontSize={44} fontWeight={900} fill={NAVY}>Heimnetz</text>
				</g>
				<g opacity={ramp(t, T.st5 + 1.2, 0.4)}>
					<circle cx={1450} cy={520} r={150} fill="#DBEAFE" stroke={BLUE} strokeWidth={10} />
					<ellipse cx={1450} cy={520} rx={60} ry={150} fill="none" stroke={BLUE} strokeWidth={8} />
					<path d="M 1300 520 H 1600 M 1320 450 H 1580 M 1320 590 H 1580" stroke={BLUE} strokeWidth={8} />
					<text x={1450} y={730} textAnchor="middle" fontFamily={FONT} fontSize={44} fontWeight={900} fill={NAVY}>Internet</text>
					<path d="M 1280 520 H 940" stroke="#94A3B8" strokeWidth={12} strokeDasharray="24 18" />
				</g>
				{block > 0 ? (
					<g transform={`translate(1110 520) scale(${block})`}>
						<circle r={70} fill={RED} />
						<path d="M -30 -30 L 30 30 M 30 -30 L -30 30" stroke="#fff" strokeWidth={16} strokeLinecap="round" />
					</g>
				) : null}
			</svg>
			<Router x={470} y={640} s={1.2} t={t} opacity={Math.min(1, house)} z={5} />
			<Dongle x={470 + 150 * 1.2 - 36} y={640} s={0.6} lcd="lcd-logo" led={GREEN} opacity={Math.min(1, house)} z={4} />
			<div style={{ position: 'absolute', left: 1110, top: 620, transform: `translateX(-50%) scale(${block})`, fontFamily: FONT, fontSize: 34, fontWeight: 900, color: RED, whiteSpace: 'nowrap', textAlign: 'center' }}>
				keine Portfreigabe<br /><span style={{ fontSize: 28, color: '#5B6576' }}>kein „Exposed Host“</span>
			</div>
		</AbsoluteFill>
	);
};

export const Install: React.FC<{ t: number }> = ({ t }) => {
	const o = window_(t, T.inst, T.instEnd, 0.4);
	return (
		<AbsoluteFill style={{ background: '#EEF2F7', opacity: o, overflow: 'hidden' }}>
			<svg width={1920} height={1080} style={{ position: 'absolute' }}>
				<defs><pattern id="dots2" width={40} height={40} patternUnits="userSpaceOnUse"><circle cx={2} cy={2} r={2} fill="#D7DEE8" /></pattern></defs>
				<rect width={1920} height={1080} fill="url(#dots2)" />
			</svg>
			<Compat t={t} />
			<Order t={t} />
			<Flash t={t} />
			<Wps t={t} />
			<Setup t={t} />
			<Safety t={t} />
			<Tracker t={t} />
		</AbsoluteFill>
	);
};

export const FinalCard: React.FC<{ t: number; a: number }> = ({ t, a }) => {
	const o = ramp(t, a, 0.5);
	const k = back(ramp(t, a + 0.2, 0.6));
	return (
		<AbsoluteFill style={{ background: NAVY, opacity: o, alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: '#fff', textAlign: 'center' }}>
			<div style={{ transform: `scale(${0.9 + 0.1 * k})`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<LogoImg size={200} />
				<div style={{ fontSize: 100, fontWeight: 900, marginTop: 30 }}>phoneblock.net/<span style={{ color: '#FCA5A5' }}>dongle</span></div>
				<div style={{ fontSize: 40, fontWeight: 700, marginTop: 18, opacity: 0.8 }}>ca. 10 € Hardware · Software kostenlos & Open Source</div>
				<div style={{ fontSize: 30, fontWeight: 700, marginTop: 40, opacity: 0.6 }}>Fragen? GitHub-Diskussionen · Probleme? GitHub-Issues</div>
			</div>
		</AbsoluteFill>
	);
};
export { TEAL };
