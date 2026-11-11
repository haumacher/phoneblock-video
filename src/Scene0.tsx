import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { T } from './timeline';
import {
	Bubble, Dongle, FONT, GREEN, Label, NAVY, Phone, RED, Router, back, ease, easeOut, lerp, ramp, ringAngle, window_,
} from './art';

// Scene geometry (1920×1080 scene coordinates).
const ROUTER = { x: 1340, y: 585 };
const DONGLE_S = 0.5;
const DONGLE_TIP = { x: ROUTER.x + 150 - 60 * DONGLE_S, y: ROUTER.y };
const DONGLE_SCREEN = { x: DONGLE_TIP.x + 260 * DONGLE_S, y: ROUTER.y };
const PHONE = { x: 1775, y: 632 };
const FOCUS = { x: 1600, y: 560, s: 2.6 };
const NUMBER = '030 12345678';

const Room: React.FC<{ clock: number; steam: number; t: number }> = ({ clock, steam, t }) => (
	<svg width={1920} height={1080} style={{ position: 'absolute' }}>
		<defs>
			<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor="#1B2550" /><stop offset="1" stopColor="#47508A" />
			</linearGradient>
			<radialGradient id="lamp" cx="0.5" cy="0" r="0.8">
				<stop offset="0" stopColor="#FFE7A3" stopOpacity="0.55" /><stop offset="1" stopColor="#FFE7A3" stopOpacity="0" />
			</radialGradient>
		</defs>
		<rect width={1920} height={1080} fill="#F3E7D9" />
		<rect y={700} width={1920} height={200} fill="#EAD7C2" />
		<rect y={696} width={1920} height={8} fill="#D9C1A6" />
		<rect y={900} width={1920} height={180} fill="#B98B63" />
		{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={i * 260 - 40} y={900} width={4} height={180} fill="#A57A55" />)}
		<rect y={960} width={1920} height={3} fill="#A57A55" />
		{/* window */}
		<rect x={150} y={130} width={380} height={330} rx={10} fill="#FFFFFF" />
		<rect x={166} y={146} width={348} height={298} rx={4} fill="url(#sky)" />
		<circle cx={440} cy={220} r={32} fill="#F6E7A6" />
		<circle cx={455} cy={210} r={30} fill="url(#sky)" opacity={0.0} />
		{[[220, 190], [300, 170], [260, 260], [370, 300], [210, 360], [470, 360]].map(([x, y], i) => (
			<circle key={i} cx={x} cy={y} r={3} fill="#fff" opacity={0.6 + 0.4 * Math.sin(t * 3 + i)} />
		))}
		<rect x={336} y={146} width={8} height={298} fill="#FFFFFF" />
		<rect x={166} y={290} width={348} height={8} fill="#FFFFFF" />
		<rect x={130} y={456} width={420} height={18} rx={6} fill="#FFFFFF" />
		{/* clock */}
		<g transform="translate(1010 230)">
			<circle r={62} fill="#FFFFFF" stroke="#8D5B37" strokeWidth={8} />
			{Array.from({ length: 12 }).map((_, i) => (
				<rect key={i} x={-2} y={-52} width={4} height={10} fill="#8D5B37" transform={`rotate(${i * 30})`} />
			))}
			<rect x={-3} y={-30} width={6} height={32} rx={3} fill={NAVY} transform={`rotate(${clock / 12 + 230})`} />
			<rect x={-2} y={-46} width={4} height={48} rx={2} fill={NAVY} transform={`rotate(${clock})`} />
			<circle r={6} fill={RED} />
		</g>
		{/* lamp */}
		<rect x={718} y={0} width={4} height={250} fill="#6B5B4B" />
		<path d="M 650 320 L 680 250 L 760 250 L 790 320 Z" fill="#E8B44A" />
		<path d="M 560 320 L 880 320 L 1120 900 L 320 900 Z" fill="url(#lamp)" />
		{/* chair behind table */}
		<rect x={630} y={590} width={180} height={190} rx={18} fill="#7A4E2D" />
		<rect x={655} y={612} width={130} height={22} rx={8} fill="#8F6038" />
		{/* table */}
		<rect x={410} y={790} width={30} height={170} fill="#86592F" />
		<rect x={1000} y={790} width={30} height={170} fill="#86592F" />
		<rect x={380} y={760} width={680} height={32} rx={8} fill="#9C6B43" />
		<ellipse cx={720} cy={756} rx={130} ry={24} fill="#FFFFFF" stroke="#DCE0E5" strokeWidth={3} />
		<ellipse cx={720} cy={752} rx={88} ry={14} fill="#F2F4F6" />
		<ellipse cx={720} cy={744} rx={62} ry={18} fill="#F1C27D" />
		<ellipse cx={716} cy={736} rx={30} ry={9} fill="#D64933" />
		<ellipse cx={736} cy={732} rx={9} ry={4} fill="#4CAF50" />
		<rect x={560} y={742} width={8} height={30} rx={3} fill="#AEB5BF" />
		<rect x={870} y={738} width={8} height={34} rx={3} fill="#AEB5BF" />
		<path d="M 912 690 L 958 690 L 952 760 L 918 760 Z" fill="#CFE8F5" opacity={0.75} />
		<path d="M 915 722 L 955 722 L 952 760 L 918 760 Z" fill="#8CC7EA" opacity={0.8} />
		{/* steam */}
		{[690, 722, 754].map((x, i) => {
			const ph = t * 1.4 + i * 0.7;
			const rise = (ph % 1);
			return (
				<path key={i} d={`M ${x} ${712 - rise * 30} c -16 -22 16 -38 0 -60 c -16 -22 16 -38 0 -60`}
					fill="none" stroke="#FFFFFF" strokeWidth={7} strokeLinecap="round"
					opacity={steam * 0.75 * Math.sin(Math.PI * rise)} />
			);
		})}
		{/* sideboard */}
		<rect x={1150} y={652} width={690} height={232} fill="#8D5B37" />
		<rect x={1172} y={672} width={320} height={192} rx={6} fill="#95623D" stroke="#7A4C2C" strokeWidth={4} />
		<rect x={1510} y={672} width={310} height={192} rx={6} fill="#95623D" stroke="#7A4C2C" strokeWidth={4} />
		<circle cx={1470} cy={768} r={7} fill="#D8B26A" />
		<circle cx={1532} cy={768} r={7} fill="#D8B26A" />
		<rect x={1170} y={884} width={20} height={20} fill="#6E4527" />
		<rect x={1800} y={884} width={20} height={20} fill="#6E4527" />
		<rect x={1130} y={630} width={730} height={24} rx={6} fill="#A9744A" />
	</svg>
);

/** Incoming-call badge: red circle with a handset, the number below. */
const CallBadge: React.FC<{ x: number; y: number; s: number; t: number; number: string; color?: string }> = ({ x, y, s, t, number, color = RED }) => (
	<div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, zIndex: 30 }}>
		<svg width={120} height={120} viewBox="-60 -60 120 120" style={{ display: 'block', overflow: 'visible' }}>
			{[0, 1].map((i) => {
				const p = (t * 1.2 + i * 0.5) % 1;
				return <circle key={i} r={26 + p * 30} fill="none" stroke={color} strokeWidth={4} opacity={1 - p} />;
			})}
			<circle r={26} fill={color} />
			<path d="M -11 -12 q -4 4 0 12 q 6 12 18 16 q 6 2 9 -3 l 2 -4 l -8 -6 l -5 4 q -8 -4 -12 -12 l 4 -5 l -6 -8 z" fill="#fff" />
		</svg>
		<div style={{
			position: 'absolute', left: '50%', top: 98, transform: 'translateX(-50%)', background: '#fff', color: NAVY,
			fontFamily: FONT, fontWeight: 800, fontSize: 18, padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap',
			boxShadow: '0 3px 8px rgba(16,24,40,.2)',
		}}>{number}</div>
	</div>
);

export const Scene0: React.FC<{ t: number }> = ({ t }) => {
	const rewinding = t >= T.rewind && t < T.room2;
	const variantB = t >= T.room2;
	const rp = ease(ramp(t, T.rewind, 1.3));
	// The room's own clock: runs, runs backwards during the rewind, restarts.
	const rt = variantB ? t - T.room2 : rewinding ? lerp(T.rewind, 0, rp) : t;

	// camera
	const z = variantB ? ease(ramp(t, T.zoom, 1.1)) : 0;
	const cs = lerp(1, FOCUS.s, z);
	const fx = lerp(960, FOCUS.x, z);
	const fy = lerp(540, FOCUS.y, z);
	const cam = (p: { x: number; y: number }) => ({ x: (p.x - fx) * cs + 960, y: (p.y - fy) * cs + 540 });

	// variant A: ringing, pickup, the sales pitch
	const angleA = variantB ? 0 : ringAngle(rt, T.ring1, T.pickup);
	const lift = variantB ? 0 : easeOut(ramp(rt, T.pickup, 0.5));
	const steam = variantB ? 1 : 1 - ramp(rt, T.pickup + 1.5, 2.0);
	const ringing = angleA !== 0 ? 1 : 0;
	const screenA = !variantB && rt >= T.ring1 ? NUMBER : undefined;
	const pitch = variantB ? 0 : window_(rt, T.pickup + 0.3, T.rewind + 0.3, 0.25);
	const grr = variantB ? 0 : window_(rt, T.grr, T.rewind + 0.3, 0.2);

	// variant B: the dongle and the call it takes
	const pop = variantB ? back(ramp(t, T.donglePop, 0.45)) : 0;
	const spam = variantB && t >= T.spam0;
	const callIn = variantB ? back(ramp(t, T.call0, 0.4)) : 0;
	const fly = variantB ? ease(ramp(t, T.spam0 - 0.4, 0.4)) : 0;
	const badgeAt = { x: lerp(ROUTER.x, DONGLE_SCREEN.x, fly), y: lerp(ROUTER.y - 150, DONGLE_SCREEN.y, fly) };
	const ledGlow = spam ? 0.6 + 0.4 * Math.sin(t * 10) : 0.5;

	const clock = rt * 2 + 40 - (rewinding ? 720 * rp : variantB ? 720 : 0);
	const fadeOut = 1 - ramp(t, T.title - 0.1, 0.5);

	const vhs = rewinding ? 1 : 0;
	const jitter = rewinding ? Math.sin(t * 90) * 6 : 0;

	return (
		<AbsoluteFill style={{ background: '#F3E7D9', opacity: fadeOut, overflow: 'hidden' }}>
			<div style={{
				position: 'absolute', width: 1920, height: 1080, transformOrigin: '0 0',
				transform: `translate(${960 - fx * cs + jitter}px, ${540 - fy * cs}px) scale(${cs})`,
				filter: rewinding ? 'saturate(0.55) contrast(1.15) hue-rotate(-8deg)' : undefined,
			}}>
				<Room clock={clock} steam={steam} t={rt} />
				{variantB && pop > 0 ? (
					<Dongle x={DONGLE_TIP.x} y={DONGLE_TIP.y} s={DONGLE_S * pop} lcd={spam ? 'lcd-call-spam' : 'lcd-logo'}
						led={GREEN} ledGlow={0.6} z={5} />
				) : null}
				<Router x={ROUTER.x} y={ROUTER.y} t={t} z={6} />
				<Phone x={PHONE.x} y={PHONE.y} angle={angleA + (lift ? -12 * lift : 0)} lift={lift * 90} screen={screenA} waves={ringing} z={7} />
				{variantB && callIn > 0 && t < T.spam0 ? (
					<CallBadge x={badgeAt.x} y={badgeAt.y} s={callIn * 0.42 * (1 - 0.6 * fly)} t={t} number={NUMBER} />
				) : null}
			</div>

			{/* screen-space overlays */}
			<Bubble x={1020} y={150} w={640} tx={1730} ty={330} opacity={pitch} scale={0.85 + 0.15 * back(ramp(rt, T.pickup + 0.3, 0.35))} size={32}>
				„Guten Tag! Hier ist Ihr Energieversorger. Haben Sie kurz Zeit für ein <i>ganz besonderes</i> Angebot …?“
			</Bubble>
			<Bubble x={420} y={420} w={260} tx={660} ty={640} opacity={grr} scale={0.6 + 0.4 * back(ramp(rt, T.grr, 0.3))} size={64} color={RED}>
				<span style={{ letterSpacing: 4 }}>#@!%?</span>
			</Bubble>
			{variantB ? (() => {
				const d = cam({ x: DONGLE_SCREEN.x, y: DONGLE_TIP.y - 30 });
				const s = cam({ x: DONGLE_SCREEN.x, y: DONGLE_TIP.y + 40 });
				const p = cam({ x: PHONE.x, y: PHONE.y - 230 });
				return <>
					<Label x={d.x} y={d.y - 40} opacity={pop * (1 - ramp(t, T.call0 - 0.3, 0.3))} bg={NAVY} color="#fff" size={34}>PhoneBlock-Dongle</Label>
					<Label x={s.x} y={s.y + 40} opacity={ramp(t, T.spam0 + 0.5, 0.3)} bg={RED} color="#fff" size={36}>Spam abgefangen</Label>
					<Label x={p.x} y={p.y} opacity={ramp(t, T.still0, 0.3)} bg={GREEN} color="#fff" size={36}>✓ Telefon bleibt still</Label>
				</>;
			})() : null}

			{/* VHS rewind look */}
			{vhs ? (
				<AbsoluteFill style={{ pointerEvents: 'none' }}>
					<AbsoluteFill style={{
						background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0px, rgba(0,0,0,.18) 2px, transparent 2px, transparent 6px)',
					}} />
					<div style={{
						position: 'absolute', left: 0, right: 0, top: ((t * 900) % 1300) - 200, height: 60,
						background: 'linear-gradient(transparent, rgba(255,255,255,.35), transparent)',
					}} />
					<div style={{
						position: 'absolute', left: 90, top: 70, color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 96,
						textShadow: '0 0 12px rgba(0,0,0,.6)', opacity: Math.floor(t * 4) % 2 ? 1 : 0.75,
						display: 'flex', alignItems: 'center', gap: 24 }}>
						<svg width={150} height={90} viewBox="0 0 150 90"><path d="M 75 0 L 0 45 L 75 90 Z M 150 0 L 75 45 L 150 90 Z" fill="#fff" /></svg>
						<span style={{ fontSize: 64, letterSpacing: 4 }}>ZURÜCK</span></div>
				</AbsoluteFill>
			) : null}
		</AbsoluteFill>
	);
};

export const TitleCard: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
	const o = window_(t, a, b, 0.45);
	const k = back(ramp(t, a + 0.1, 0.6));
	return (
		<AbsoluteFill style={{ background: NAVY, opacity: o, alignItems: 'center', justifyContent: 'center', fontFamily: FONT }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 56, transform: `scale(${0.85 + 0.15 * k})` }}>
				<LogoImg size={250} />
				<div>
					<div style={{ color: '#fff', fontSize: 120, fontWeight: 900, letterSpacing: -2 }}>
						PhoneBlock<span style={{ color: RED }}>-Dongle</span>
					</div>
					<div style={{ color: 'rgba(255,255,255,.85)', fontSize: 50, fontWeight: 700, marginTop: 10, opacity: ramp(t, a + 0.6, 0.4) }}>
						Werbeanrufe abfangen – bevor es klingelt.
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const LogoImg: React.FC<{ size: number }> = ({ size }) => (
	<div style={{ width: size, height: size, borderRadius: size * 0.22, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
		<Img src={staticFile('img/app-logo.svg')} style={{ width: size * 0.86, height: size * 0.86 }} />
	</div>
);
