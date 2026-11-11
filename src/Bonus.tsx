import React from 'react';
import { AbsoluteFill } from 'remotion';
import { T, dlg } from './timeline';
import { Dongle, FONT, GREEN, NAVY, Person, RED, back, ease, easeOut, lerp, ramp, window_ } from './art';

const AVATAR = { x: 290, y: 500 };
const DONGLE_TIP = { x: 1450, y: 450 };
const CHAT = { left: 560, right: 1360, bottom: 900, top: 190 };
const BW = 600;

/** Rough bubble height for the stack layout (Lato 30 px, ~33 chars per line). */
const bubbleH = (text: string) => Math.ceil(text.length / 31) * 39 + 34 + 30;

const Eq: React.FC<{ t: number; color: string }> = ({ t, color }) => (
	<span style={{ display: 'inline-flex', gap: 3, alignItems: 'flex-end', height: 18, marginLeft: 10, verticalAlign: 'middle' }}>
		{[0, 1, 2, 3].map((i) => (
			<span key={i} style={{ width: 4, borderRadius: 2, background: color, height: 5 + 13 * Math.abs(Math.sin(t * 9 + i * 1.7)) }} />
		))}
	</span>
);

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export const Bonus: React.FC<{ t: number }> = ({ t }) => {
	const o = window_(t, T.bonus, T.end, 0.5);
	const enter = back(ramp(t, T.bonus + 0.2, 0.6));
	const talking = t >= T.talk;
	const hungUp = t >= T.hangupB;
	const elapsed = Math.max(0, Math.min(t, T.hangupB) - T.talk);

	// caller's mood: 0 friendly … 1 fed up, by how far the dialogue got
	const fume = ramp(t, dlg.find((l) => l.key === 'p5')!.start, 0.2);
	const speaking = dlg.find((l) => t >= l.start && t < l.end);

	// chat stack: newest at the bottom, the stack slides up as one appears
	const shown = dlg.filter((l) => t >= l.start - 0.05);
	let y = CHAT.bottom;
	const placed = [] as { l: typeof dlg[number]; top: number; k: number }[];
	for (let i = shown.length - 1; i >= 0; i--) {
		const l = shown[i];
		const k = ease(ramp(t, l.start - 0.05, 0.3));
		const h = (bubbleH(l.text) + 18) * k;
		y -= h;
		placed.push({ l, top: y, k });
	}
	const settingsK = back(ramp(t, T.settings, 0.5));
	const chatDim = 1 - 0.4 * ramp(t, T.hangupB + 1.0, 0.5) - 0.4 * ramp(t, T.settings - 0.2, 0.4);

	return (
		<AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, #1E2A44, ${NAVY})`, opacity: o, overflow: 'hidden', fontFamily: FONT }}>
			<div style={{ position: 'absolute', left: 0, right: 0, top: 60, textAlign: 'center', transform: `scale(${0.8 + 0.2 * enter})`, opacity: Math.min(1, enter) }}>
				<span style={{ background: '#FCD34D', color: NAVY, fontWeight: 900, fontSize: 26, padding: '6px 16px', borderRadius: 999, letterSpacing: 2 }}>BONUS</span>
				<div style={{ color: '#fff', fontWeight: 900, fontSize: 64, marginTop: 14 }}>Der Dongle plaudert</div>
			</div>

			{/* the caller: blows up like a balloon, then bursts at the hang-up */}
			{(() => {
				const prog = Math.min(1, Math.max(0, (t - T.talk) / (T.hangupB - T.talk)));
				const g = ease(prog);
				const burst = t >= T.hangupB;
				const swell = burst ? 0 : 1 + 0.8 * g + (speaking?.who === 'caller' ? 0.04 * Math.sin(t * 14) : 0) + 0.12 * ramp(t, T.hangupB - 0.25, 0.25);
				const red = (c0: number, c1: number) => Math.round(lerp(c0, c1, g));
				const fill = g < 0.5 ? `rgb(255, ${red(255, 130)}, ${red(255, 130)})` : `rgb(${red(255, 185)}, ${red(255, 28)}, ${red(255, 28)})`;
				const bp = ramp(t, T.hangupB, 0.7);
				return <>
					{!burst ? (
						<div style={{ position: 'absolute', left: AVATAR.x - 140, top: AVATAR.y - 140, width: 280, height: 280, opacity: ramp(t, T.bonus + 0.4, 0.4), transform: `scale(${swell})`, transformOrigin: '50% 50%' }}>
							<svg width={280} height={280} viewBox="-140 -140 280 280" style={{ overflow: 'visible' }}>
								{g > 0.45 ? <path d={`M 0 120 l -10 14 h 20 z M 0 134 q ${-20 + 10 * Math.sin(t * 3)} 40 0 80 q ${20 - 10 * Math.sin(t * 3)} 40 0 80`} fill={fill} stroke="#94A3B8" strokeWidth={3} opacity={ramp(g, 0.45, 0.15)} /> : null}
								{speaking?.who === 'caller' ? <circle r={128 + 8 * Math.abs(Math.sin(t * 8))} fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={6} /> : null}
								<circle r={120} fill={fill} stroke={RED} strokeWidth={8 / swell} />
								<ellipse cx={-48} cy={-62} rx={22} ry={12} fill="#fff" opacity={0.35 * g} transform="rotate(-35 -48 -62)" />
								<Person x={0} y={18} s={2.0} color="#64748B" headset />
								{g > 0.35 ? <path d="M 52 -62 q 10 16 0 24 q -10 -8 0 -24 z" fill="#60A5FA" opacity={ramp(g, 0.35, 0.15)} transform={`translate(0 ${(t * 30) % 18})`} /> : null}
								{fume > 0 ? [0, 1, 2].map((i) => (
									<path key={i} d={`M ${-40 + i * 40} -128 q -12 -18 0 -36 q 12 -18 0 -36`} fill="none" stroke="#F87171" strokeWidth={6}
										strokeLinecap="round" opacity={fume * (0.5 + 0.5 * Math.sin(t * 10 + i))} />
								)) : null}
							</svg>
						</div>
					) : (
						<svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
							<circle cx={AVATAR.x} cy={AVATAR.y} r={120 * 1.9 * (1 + bp)} fill="none" stroke="#FCA5A5" strokeWidth={30 * (1 - bp)} opacity={1 - bp} />
							{Array.from({ length: 16 }).map((_, i) => {
								const a = (i / 16) * Math.PI * 2 + i;
								const d = 140 + 360 * easeOut(bp);
								return <path key={i} d="M -18 -10 L 22 -4 L 6 14 Z" fill={i % 3 ? '#DC2626' : '#F87171'} opacity={1 - ramp(bp, 0.6, 0.4)}
									transform={`translate(${AVATAR.x + Math.cos(a) * d} ${AVATAR.y + Math.sin(a) * d + 160 * bp * bp}) rotate(${i * 47 + bp * 400}) scale(${1.4 - bp * 0.6})`} />;
							})}
							<text x={AVATAR.x} y={AVATAR.y + 30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={130 * back(ramp(t, T.hangupB, 0.3))}
								fill="#FCD34D" stroke={NAVY} strokeWidth={8} paintOrder="stroke" opacity={1 - ramp(t, T.hangupB + 1.2, 0.4)} transform={`rotate(-8 ${AVATAR.x} ${AVATAR.y})`}>PENG!</text>
						</svg>
					)}
					<div style={{ position: 'absolute', top: AVATAR.y + 120 * (burst ? 1 : swell) + 30 + (g > 0.45 && !burst ? 150 : 0), left: AVATAR.x, transform: 'translateX(-50%)', whiteSpace: 'nowrap', textAlign: 'center', opacity: ramp(t, T.bonus + 0.4, 0.4) * (1 - ramp(t, T.hangupB, 0.3)) }}>
						<div style={{ color: '#fff', fontSize: 30, fontWeight: 800 }}>Werbeanrufer</div>
						<div style={{ color: 'rgba(255,255,255,.6)', fontSize: 24, fontWeight: 700 }}>„Ihr Energieversorger“</div>
					</div>
				</>;
			})()}

			{/* the dongle */}
			<Dongle x={DONGLE_TIP.x} y={DONGLE_TIP.y} s={1.0} lcd={t >= T.hangupB + 1.5 ? 'lcd-logo-badge1' : 'lcd-call-spam'} led={GREEN} ledGlow={0.6}
				opacity={ramp(t, T.bonus + 0.5, 0.4)} />
			{speaking?.who === 'bot' ? (
				<div style={{
					position: 'absolute', left: DONGLE_TIP.x + 80, top: DONGLE_TIP.y - 110, width: 380, height: 220, borderRadius: 40,
					boxShadow: `0 0 ${30 + 20 * Math.abs(Math.sin(t * 8))}px rgba(220,30,30,.55)`, pointerEvents: 'none',
				}} />
			) : null}
			<div style={{ position: 'absolute', left: DONGLE_TIP.x + 250, top: DONGLE_TIP.y + 110, transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap', opacity: ramp(t, T.bonus + 0.5, 0.4) }}>
				<div style={{ color: '#fff', fontSize: 30, fontWeight: 800 }}>PhoneBlock-Dongle</div>
				<div style={{ color: 'rgba(255,255,255,.6)', fontSize: 24, fontWeight: 700 }}>Stimme „Grandpa“</div>
				<div style={{
					marginTop: 18, display: 'inline-block', background: hungUp ? RED : 'rgba(255,255,255,.12)', color: '#fff',
					fontSize: 34, fontWeight: 900, padding: '8px 22px', borderRadius: 999, fontVariantNumeric: 'tabular-nums', opacity: talking ? 1 : 0,
				}}>{hungUp ? `aufgelegt nach ${fmt(elapsed)}` : `● ${fmt(elapsed)}`}</div>
			</div>

			{/* the conversation */}
			<div style={{ position: 'absolute', inset: 0, opacity: chatDim }}>
				{placed.map(({ l, top, k }) => {
					const bot = l.who === 'bot';
					const fadeTop = Math.min(1, Math.max(0, (top - CHAT.top) / 80));
					return (
						<div key={l.key} style={{
							position: 'absolute', top, width: BW, left: bot ? CHAT.right - BW : CHAT.left, opacity: k * fadeTop,
							transform: `translateY(${(1 - k) * 20}px) scale(${0.9 + 0.1 * k})`, transformOrigin: bot ? 'right bottom' : 'left bottom',
							display: 'flex', justifyContent: bot ? 'flex-end' : 'flex-start',
						}}>
							<div style={{
								background: bot ? RED : '#fff', color: bot ? '#fff' : NAVY, borderRadius: 26,
								borderBottomRightRadius: bot ? 6 : 26, borderBottomLeftRadius: bot ? 26 : 6,
								padding: '14px 24px 18px', fontSize: 30, fontWeight: 700, lineHeight: 1.3, maxWidth: BW,
								boxShadow: '0 8px 20px rgba(0,0,0,.25)',
							}}>
								<div style={{ fontSize: 20, fontWeight: 900, opacity: 0.65, letterSpacing: 1 }}>
									{bot ? 'DONGLE' : 'ANRUFER'}
									{speaking?.key === l.key ? <Eq t={t} color={bot ? '#fff' : NAVY} /> : null}
								</div>
								{l.text}
							</div>
						</div>
					);
				})}
			</div>

			{/* the setting */}
			{settingsK > 0 ? (
				<div style={{
					position: 'absolute', left: 960, top: 520, width: 760, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * settingsK})`,
					opacity: Math.min(1, settingsK), background: '#fff', borderRadius: 28, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,.4)', color: NAVY,
				}}>
					<div style={{ background: '#EEF2F7', padding: '18px 32px', fontSize: 26, fontWeight: 800, color: '#5B6576' }}>http://answerbot/ › Einstellungen</div>
					<div style={{ padding: '26px 36px 34px' }}>
						<div style={{ fontSize: 34, fontWeight: 900, marginBottom: 18 }}>Bei Spam-Anrufen</div>
						{[['Ansage abspielen und auflegen', false], ['Mit dem Anrufer sprechen (Dialog)', true]].map(([label, on], i) => (
							<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 32, fontWeight: 700, padding: '8px 0' }}>
								<span style={{ width: 30, height: 30, borderRadius: 15, border: `4px solid ${on ? RED : '#AEB5BF'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
									{on ? <span style={{ width: 14, height: 14, borderRadius: 7, background: RED }} /> : null}
								</span>
								{label as string}
							</div>
						))}
						<div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 32, fontWeight: 700, marginTop: 18, opacity: ramp(t, T.settings + 1.2, 0.3) }}>
							<span style={{ fontWeight: 900 }}>Stimme</span>
							<span style={{ border: '3px solid #D5DBE3', borderRadius: 12, padding: '6px 18px' }}>Grandpa ▾</span>
						</div>
					</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};
