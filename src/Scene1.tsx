import React from 'react';
import { AbsoluteFill } from 'remotion';
import { T } from './timeline';
import {
	Bubble, Dongle, FONT, GREEN, Label, NAVY, Person, Phone, Pt, RED, Router, back, ease, easeOut, lerp, qpt, ramp, ringAngle, window_,
} from './art';
import { LogoImg } from './Scene0';

const BLUE = '#3B82F6';
const ROUTER = { x: 760, y: 700, s: 1.4 };
const PORT_X = ROUTER.x + 150 * ROUTER.s;
const DS = 1.3;
const DONGLE_TIP = { x: PORT_X - 60 * DS, y: ROUTER.y };
const SCREEN = { x: DONGLE_TIP.x + 260 * DS, y: ROUTER.y };
const PHONE1 = { x: 1690, y: 500 };
const PHONE2 = { x: 1690, y: 960 };
const CALLER = { x: 200, y: 700 };
const CLOUD = { x: SCREEN.x, y: 190 };

type Wire = { a: Pt; c: Pt; b: Pt };
const W_CALLER: Wire = { a: { x: CALLER.x + 85, y: CALLER.y }, c: { x: 420, y: CALLER.y }, b: { x: ROUTER.x - 150 * ROUTER.s, y: ROUTER.y } };
const W_PHONE1: Wire = { a: { x: ROUTER.x + 90, y: ROUTER.y - 70 }, c: { x: 1150, y: 420 }, b: { x: PHONE1.x - 90, y: PHONE1.y - 120 } };
const W_PHONE2: Wire = { a: { x: ROUTER.x + 90, y: ROUTER.y + 70 }, c: { x: 1150, y: 960 }, b: { x: PHONE2.x - 90, y: PHONE2.y - 120 } };
const W_CLOUD: Wire = { a: { x: SCREEN.x, y: SCREEN.y - 90 }, c: { x: SCREEN.x, y: 450 }, b: { x: CLOUD.x, y: CLOUD.y + 105 } };

const path = (w: Wire) => `M ${w.a.x} ${w.a.y} Q ${w.c.x} ${w.c.y} ${w.b.x} ${w.b.y}`;

const WireView: React.FC<{ w: Wire; reveal: number; color?: string; width?: number; dash?: boolean; opacity?: number }> = ({ w, reveal, color = '#B7C1CF', width = 8, dash, opacity = 1 }) => (
	reveal <= 0 ? null : (
		<path d={path(w)} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" opacity={opacity}
			pathLength={1} strokeDasharray={dash ? '0.02 0.02' : `${reveal} 1`} />
	)
);

/** Dots running along a wire while `active` (0..1 progress over the run). */
const Pulses: React.FC<{ w: Wire; t: number; a: number; b: number; color: string; reverse?: boolean }> = ({ w, t, a, b, color, reverse }) => {
	if (t < a || t > b + 0.5) return null;
	return <>{[0, 1, 2].map((i) => {
		const u0 = (t - a) / 0.55 - i * 0.3;
		if (u0 < 0 || u0 > 1 || t - i * 0.165 > b) return null;
		const p = qpt(w.a, w.c, w.b, reverse ? 1 - u0 : u0);
		return <circle key={i} cx={p.x} cy={p.y} r={13} fill={color} stroke="#fff" strokeWidth={4} />;
	})}</>;
};

const Packet: React.FC<{ w: Wire; u: number; opacity: number; bg: string; children: React.ReactNode }> = ({ w, u, opacity, bg, children }) => {
	const p = qpt(w.a, w.c, w.b, u);
	return (
		<div style={{
			position: 'absolute', left: p.x, top: p.y, transform: 'translate(-50%,-50%)', opacity, zIndex: 35,
			background: bg, color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 30, padding: '10px 22px',
			borderRadius: 999, whiteSpace: 'nowrap', boxShadow: '0 8px 20px rgba(16,24,40,.25)',
		}}>{children}</div>
	);
};

const Cloud: React.FC<{ o: number; k: number; count: number }> = ({ o, k, count }) => (
	<div style={{ position: 'absolute', left: CLOUD.x - 240, top: CLOUD.y - 130, width: 480, height: 250, opacity: o, transform: `scale(${0.8 + 0.2 * k})`, zIndex: 20 }}>
		<svg width={480} height={250} viewBox="0 0 480 250" style={{ position: 'absolute', overflow: 'visible', filter: 'drop-shadow(0 12px 24px rgba(16,24,40,.15))' }}>
			<g fill="#fff">
				<circle cx={150} cy={140} r={90} /><circle cx={260} cy={105} r={105} /><circle cx={350} cy={150} r={80} />
				<rect x={70} y={140} width={350} height={95} rx={47} />
			</g>
		</svg>
		<div style={{ position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, fontFamily: FONT }}>
			<LogoImg size={84} />
			<div>
				<div style={{ fontSize: 40, fontWeight: 900, color: NAVY }}>PhoneBlock</div>
				<div style={{ fontSize: 22, fontWeight: 700, color: '#5B6576' }}>Community-Datenbank</div>
			</div>
		</div>
		{count > 0 ? (
			<div style={{
				position: 'absolute', right: -10, top: 10, background: RED, color: '#fff', fontFamily: FONT, fontWeight: 900,
				fontSize: 30, padding: '6px 18px', borderRadius: 999, transform: `scale(${count})`, boxShadow: '0 6px 14px rgba(220,30,30,.35)',
			}}>12× gemeldet</div>
		) : null}
	</div>
);

const PEOPLE = [
	{ x: 820, y: 140, c: '#F59E0B' }, { x: 860, y: 330, c: '#10B981' }, { x: 1010, y: 40, c: '#8B5CF6' },
	{ x: 1340, y: 40, c: '#EC4899' }, { x: 1520, y: 140, c: '#0EA5E9' }, { x: 1490, y: 330, c: '#F97316' },
];

const DeviceList: React.FC<{ o: number; neu: number }> = ({ o, neu }) => {
	const rows = [['Telefon Wohnzimmer', 1], ['Telefon Küche', 1], ['PhoneBlock-Dongle', neu]] as const;
	return (
		<div style={{
			position: 'absolute', left: 70, top: 70, width: 600, background: '#fff', borderRadius: 24, opacity: o, zIndex: 40,
			boxShadow: '0 14px 40px rgba(16,24,40,.15)', fontFamily: FONT, color: NAVY, overflow: 'hidden',
			transform: `translateY(${(1 - o) * 30}px)`,
		}}>
			<div style={{ background: NAVY, color: '#fff', padding: '18px 28px', fontSize: 28, fontWeight: 800 }}>Router › Telefoniegeräte</div>
			{rows.map(([name, k], i) => (
				<div key={i} style={{
					display: 'flex', alignItems: 'center', padding: '16px 28px', fontSize: 30, fontWeight: 700,
					borderTop: i ? '2px solid #EEF1F5' : undefined, opacity: k, transform: `translateX(${(1 - k) * -40}px)`,
				}}>
					<span style={{ color: GREEN, fontSize: 32, marginRight: 18 }}>●</span>
					<span style={{ flex: 1 }}>{name}</span>
					{i === 2 ? <span style={{ background: RED, color: '#fff', fontSize: 20, fontWeight: 900, padding: '4px 12px', borderRadius: 999 }}>NEU</span> : null}
				</div>
			))}
		</div>
	);
};

const Caller: React.FC<{ o: number; k: number; spammer: boolean; number: string; hungUp: number }> = ({ o, k, spammer, number, hungUp }) => (
	<div style={{ position: 'absolute', left: CALLER.x - 90, top: CALLER.y - 90, width: 180, height: 180, opacity: o, transform: `scale(${0.7 + 0.3 * k})`, zIndex: 25 }}>
		<svg width={180} height={180} viewBox="-90 -90 180 180" style={{ overflow: 'visible' }}>
			<circle r={85} fill="#fff" stroke={spammer ? RED : BLUE} strokeWidth={8} />
			<Person x={0} y={12} s={1.4} color={spammer ? '#64748B' : BLUE} headset={spammer} />
		</svg>
		<div style={{ position: 'absolute', left: '50%', top: 200, transform: 'translateX(-50%)', textAlign: 'center', fontFamily: FONT, whiteSpace: 'nowrap' }}>
			<div style={{ fontSize: 28, fontWeight: 800, color: NAVY }}>{spammer ? 'Werbeanrufer' : 'Anrufer'}</div>
			<div style={{ fontSize: 26, fontWeight: 700, color: '#5B6576' }}>{number}</div>
		</div>
		{hungUp > 0 ? (
			<div style={{ position: 'absolute', left: '50%', top: -60, transform: `translateX(-50%) scale(${hungUp})`, background: RED, color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 28, padding: '6px 18px', borderRadius: 999, whiteSpace: 'nowrap' }}>aufgelegt</div>
		) : null}
	</div>
);

export const Scene1: React.FC<{ t: number }> = ({ t }) => {
	const o = window_(t, T.s1, T.s1end, 0.4);

	// 1A: the dongle, its price, into the router
	const enter = back(ramp(t, T.s1 + 0.1, 0.7));
	const plug = ease(ramp(t, T.plug, 1.0));
	const ds = lerp(2.2, DS, plug);
	const bigTip = { x: 960 - 210 * 2.2, y: 520 + (1 - enter) * 700 };
	const dTip = { x: lerp(bigTip.x, DONGLE_TIP.x, plug), y: lerp(bigTip.y, DONGLE_TIP.y, plug) };
	const routerIn = back(ramp(t, T.plug - 0.3, 0.6));
	const priceO = back(ramp(t, T.price, 0.5)) * (1 - ramp(t, T.plug - 0.2, 0.3));
	const swing = Math.sin((t - T.price) * 5) * 14 * Math.exp(-(t - T.price) * 1.2);
	const devO = window_(t, T.devlist, T.callB, 0.4);
	const neu = back(ramp(t, T.devlist + 0.6, 0.4));
	const phonesIn = back(ramp(t, T.devlist + 0.2, 0.5));
	const wiresIn = ease(ramp(t, T.devlist + 0.2, 0.8));

	// which call is on: the spammer (B–D) or the normal caller (E)
	const callE = t >= T.callE - 0.4;
	const callerIn = callE ? back(ramp(t, T.callE - 0.4, 0.5)) : back(ramp(t, T.callB - 0.5, 0.5));
	const callerOut = callE ? 1 : 1 - ramp(t, T.hangup + 1.2, 0.5);
	const callT = callE ? T.callE : T.callB;
	const fan = callE ? T.callE + 0.8 : T.fanout;
	const callColor = callE ? BLUE : RED;
	const callWire = ease(ramp(t, callT, 0.5)) * (callE ? 1 : 1 - ramp(t, T.hangup, 0.3));

	// 1C: the lookup
	const cloudIn = back(ramp(t, T.hashUp - 0.6, 0.5));
	const up = ramp(t, T.hashUp, 1.1);
	const down = ramp(t, T.answer, 0.6);
	const count = back(ramp(t, T.votes + 1.3, 0.4));
	const isSpam = !callE && t >= T.answer + 0.6;
	const lcd = callE ? (t >= T.normalScreen ? (t >= T.ringE + 2.0 ? 'lcd-logo-badge1' : 'lcd-call-normal') : 'lcd-logo-badge1')
		: isSpam ? (t >= T.hangup + 1.2 ? 'lcd-logo-badge1' : 'lcd-call-spam') : 'lcd-logo';
	const led = GREEN;   // the LED shows the device state, not the call (status_led.c)

	// 1D: dongle answers, the announcement, hang-up
	const answered = !callE && t >= T.pickup1 && t < T.hangup;
	const ann = window_(t, T.ann, T.hangup + 0.2, 0.25);
	const hungUp = !callE ? back(ramp(t, T.hangup, 0.35)) * (1 - ramp(t, T.hangup + 1.2, 0.4)) : 0;

	// phones: waiting (delayed ring), not rung, ringing
	const waitB = !callE && t >= T.fanout + 0.5 && t < T.notRang ? 1 : 0;
	const notRang = !callE ? window_(t, T.notRang, T.callE - 0.4, 0.3) : 0;
	const waitE = callE && t >= T.callE + 1.3 && t < T.ringE ? 1 : 0;
	const ringE = callE ? ringAngle(t, T.ringE, T.ringE + 2.6) : 0;
	const ringing = callE && t >= T.ringE && t < T.ringE + 3.5;
	const through = callE ? ramp(t, T.ringE + 0.8, 0.3) : 0;
	const shrug = callE ? window_(t, T.shrug, T.ringE + 0.6, 0.25) : 0;

	return (
		<AbsoluteFill style={{ background: '#EEF2F7', opacity: o, overflow: 'hidden' }}>
			<svg width={1920} height={1080} style={{ position: 'absolute' }}>
				<defs>
					<pattern id="dots" width={40} height={40} patternUnits="userSpaceOnUse">
						<circle cx={2} cy={2} r={2} fill="#D7DEE8" />
					</pattern>
				</defs>
				<rect width={1920} height={1080} fill="url(#dots)" />
				<WireView w={W_PHONE1} reveal={wiresIn} />
				<WireView w={W_PHONE2} reveal={wiresIn} />
				<WireView w={W_CLOUD} reveal={ease(ramp(t, T.hashUp - 0.4, 0.5))} />
				<WireView w={W_CALLER} reveal={callerIn > 0 ? 1 : 0} opacity={callerOut} />
				<WireView w={W_CALLER} reveal={callWire} color={callColor} opacity={callerOut * (answered ? 1 : 0.85)} width={answered ? 12 : 8} />
				<Pulses w={W_CALLER} t={t} a={callT} b={callT + 0.9} color={callColor} />
				<Pulses w={W_PHONE1} t={t} a={fan} b={fan + 0.6} color={callColor} />
				<Pulses w={W_PHONE2} t={t} a={fan} b={fan + 0.6} color={callColor} />
				{answered ? <Pulses w={W_CALLER} t={t} a={T.ann} b={T.hangup - 0.3} color={RED} reverse /> : null}
				{PEOPLE.map((p, i) => {
					const k = back(ramp(t, T.votes + i * 0.12, 0.35));
					return k > 0 ? (
						<g key={i} opacity={Math.min(1, k)}>
							<Person x={p.x} y={p.y} s={0.9 * k} color={p.c} />
							<g transform={`translate(${p.x + 22} ${p.y - 40}) scale(${k})`}>
								<rect x={0} y={-30} width={4} height={44} fill={NAVY} />
								<path d="M 4 -30 L 40 -22 L 4 -12 Z" fill={RED} />
							</g>
						</g>
					) : null;
				})}
			</svg>

			{/* glow on the dongle while a call reaches it */}
			{t >= fan && t < fan + 1.2 ? (
				<div style={{
					position: 'absolute', left: SCREEN.x - 340, top: SCREEN.y - 190, width: 680, height: 380, zIndex: 3,
					background: `radial-gradient(closest-side, ${callColor}55, transparent)`, opacity: Math.sin(Math.PI * (t - fan) / 1.2),
				}} />
			) : null}

			<Dongle x={dTip.x} y={dTip.y} s={ds} lcd={lcd} led={led} ledGlow={0.5}
				rot={(1 - enter) * -8} z={5} />
			<Router x={ROUTER.x} y={ROUTER.y} s={ROUTER.s * routerIn} t={t} opacity={Math.min(1, routerIn)} z={6} />
			{priceO > 0 ? (
				<div style={{
					position: 'absolute', left: bigTip.x + 2.2 * 400, top: bigTip.y + 40, transformOrigin: '0 0',
					transform: `rotate(${swing + 10}deg) scale(${priceO})`, zIndex: 8,
				}}>
					<div style={{ position: 'absolute', left: -2, top: 0, width: 4, height: 70, background: '#8D99AA' }} />
					<div style={{
						position: 'absolute', left: -110, top: 66, width: 220, padding: '18px 0', textAlign: 'center',
						background: '#FCD34D', color: NAVY, fontFamily: FONT, fontWeight: 900, fontSize: 48, borderRadius: 16,
						boxShadow: '0 10px 24px rgba(16,24,40,.2)',
					}}>ca. 10 €</div>
				</div>
			) : null}

			{phonesIn > 0 ? <>
				<Phone x={PHONE1.x} y={PHONE1.y} s={phonesIn} angle={ringE} waves={ringE ? 1 : 0} screen={ringing ? '0711 9876543' : undefined} z={6} />
				<Phone x={PHONE2.x} y={PHONE2.y} s={phonesIn} angle={-ringE} waves={ringE ? 1 : 0} screen={ringing ? '0711 9876543' : undefined} z={6} />
				<Label x={PHONE1.x} y={PHONE1.y + 34} opacity={Math.min(1, phonesIn)} size={28}>Wohnzimmer</Label>
				<Label x={PHONE2.x} y={PHONE2.y + 34} opacity={Math.min(1, phonesIn)} size={28}>Küche</Label>
			</> : null}

			{[PHONE1, PHONE2].map((p, i) => <React.Fragment key={i}>
				<Label x={p.x} y={p.y - 290} opacity={Math.max(waitB, waitE)} bg="#fff" color="#5B6576" size={26}>⏳ klingelt noch nicht</Label>
				<Label x={p.x} y={p.y - 290} opacity={notRang} bg={GREEN} color="#fff" size={26}>✓ nicht geklingelt</Label>
				<Label x={p.x} y={p.y - 290} opacity={through} bg={GREEN} color="#fff" size={26}>✓ Anruf kommt durch</Label>
			</React.Fragment>)}

			<DeviceList o={devO} neu={neu} />
			<Caller o={Math.min(1, callerIn) * callerOut} k={callerIn} spammer={!callE} number={callE ? '0711 9876543' : '030 12345678'} hungUp={hungUp} />
			<Cloud o={Math.min(1, cloudIn)} k={cloudIn} count={count} />

			<Packet w={W_CLOUD} u={easeOut(up)} opacity={window_(t, T.hashUp, T.hashUp + 1.25, 0.15)} bg={NAVY}>🔒 #7f3a9c…</Packet>
			<Packet w={W_CLOUD} u={1 - easeOut(down)} opacity={window_(t, T.answer, T.answer + 0.75, 0.12)} bg={RED}>SPAM</Packet>

			{(() => {
				const k = window_(t, T.hint, T.callE - 0.3, 0.3);
				return k > 0 ? (
					<div style={{
						position: 'absolute', left: 70, top: 80, width: 520, zIndex: 45, opacity: k,
						transform: `rotate(-3deg) scale(${0.85 + 0.15 * back(ramp(t, T.hint, 0.4))})`,
						background: '#FCD34D', color: NAVY, fontFamily: FONT, borderRadius: 20, padding: '22px 28px',
						boxShadow: '0 12px 30px rgba(16,24,40,.2)',
					}}>
						<div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 1, opacity: 0.7 }}>ÜBRIGENS</div>
						<div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1.2, marginTop: 6 }}>
							Statt der Ansage kann der Dongle Spammer auch in ein Gespräch verwickeln.
						</div>
						<div style={{ fontSize: 28, fontWeight: 800, marginTop: 10, color: RED }}>Mehr dazu am Ende ▸</div>
					</div>
				) : null;
			})()}
			<Bubble x={70} y={250} w={560} tx={CALLER.x + 20} ty={CALLER.y - 90} opacity={ann} scale={0.85 + 0.15 * back(ramp(t, T.ann, 0.3))} size={32}>
				<span style={{ fontSize: 22, color: '#5B6576', display: 'block', marginBottom: 6 }}>🔊 Ansage vom Dongle</span>
				„Lieber Anrufer, Sie wurden leider gephoneblockt …“
			</Bubble>
			<Bubble x={SCREEN.x - 120} y={400} w={240} tx={SCREEN.x} ty={SCREEN.y - 95} opacity={shrug} size={30}>
				<div style={{ textAlign: 'center' }}>kein Spam –<br />nichts zu tun</div>
			</Bubble>
		</AbsoluteFill>
	);
};

export const EndCard: React.FC<{ t: number; a: number }> = ({ t, a }) => {
	const o = ramp(t, a, 0.5);
	return (
		<AbsoluteFill style={{ background: NAVY, opacity: o, alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: '#fff', textAlign: 'center' }}>
			<div style={{ fontSize: 44, fontWeight: 700, opacity: 0.8 }}>Gleich im nächsten Teil:</div>
			<div style={{ fontSize: 96, fontWeight: 900, marginTop: 12, transform: `scale(${0.9 + 0.1 * back(ramp(t, a + 0.2, 0.5))})` }}>
				Einrichten in wenigen Minuten
			</div>
			<div style={{ fontSize: 48, fontWeight: 800, marginTop: 40, color: '#FCA5A5' }}>phoneblock.net/dongle</div>
			<div style={{ position: 'absolute', bottom: 40, right: 60, fontSize: 24, opacity: 0.5 }}>Prototyp · Szene 0 + 1</div>
		</AbsoluteFill>
	);
};
