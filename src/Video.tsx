import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { FPS, T, dlg, f, vo } from './timeline';
import { Bonus } from './Bonus';
import { FONT, window_ } from './art';
import { Scene0, TitleCard } from './Scene0';
import { Scene1 } from './Scene1';
import { FinalCard, Install } from './Install';

const Sfx: React.FC<{ at: number; src: string; vol?: number; max?: number }> = ({ at, src, vol = 0.5, max }) => (
	<Sequence from={f(at)} durationInFrames={max ? f(max) : undefined}>
		<Audio src={staticFile(`sfx/${src}.wav`)} volume={vol} />
	</Sequence>
);

const Subtitles: React.FC<{ t: number }> = ({ t }) => {
	const cue = Object.values(vo).find((c) => t >= c.start - 0.1 && t < c.end + 0.25);
	if (!cue) return null;
	return (
		<div style={{ position: 'absolute', left: 0, right: 0, bottom: 42, display: 'flex', justifyContent: 'center', zIndex: 100 }}>
			<div style={{
				maxWidth: 1180, background: 'rgba(16,24,40,.78)', color: '#fff', fontFamily: FONT, fontWeight: 700,
				fontSize: 36, lineHeight: 1.3, padding: '12px 28px', borderRadius: 14, textAlign: 'center',
				opacity: window_(t, cue.start - 0.1, cue.end + 0.25, 0.12),
			}}>{cue.text}</div>
		</div>
	);
};

export const Prototype: React.FC<{ subtitles: boolean }> = ({ subtitles }) => {
	const t = useCurrentFrame() / FPS;
	return (
		<AbsoluteFill style={{ background: '#101828' }}>
			{t < T.title + 0.8 ? <Scene0 t={t} /> : null}
			{t >= T.title - 0.2 && t < T.s1 + 0.6 ? <TitleCard t={t} a={T.title} b={T.s1 + 0.4} /> : null}
			{t >= T.s1 - 0.1 && t < T.s1end + 0.6 ? <Scene1 t={t} /> : null}
			{t >= T.inst - 0.1 && t < T.instEnd + 0.6 ? <Install t={t} /> : null}
			{t >= T.bonus - 0.1 && t < T.end + 0.6 ? <Bonus t={t} /> : null}
			{t >= T.end ? <FinalCard t={t} a={T.end} /> : null}
			{subtitles ? <Subtitles t={t} /> : null}

			{Object.values(vo).map((c) => (
				<Sequence key={c.key} from={f(c.start)}>
					<Audio src={staticFile(`${c.dir}/${c.key}.wav`)} volume={1} />
				</Sequence>
			))}
			{[T.ring1, T.ring1 + 1.6, T.ring1 + 3.2].map((a, i) => (
				<Sfx key={i} at={a} src="ring" vol={0.35} max={Math.max(0.1, Math.min(1.6, T.pickup - a))} />
			))}
			<Sfx at={T.pickup} src="pop" vol={0.4} />
			<Sfx at={T.rewind} src="rewind" vol={0.55} />
			<Sfx at={T.donglePop} src="pop" vol={0.5} />
			<Sfx at={T.zoom} src="whoosh" vol={0.35} />
			<Sfx at={T.call0} src="pop" vol={0.4} />
			<Sfx at={T.spam0} src="pling" vol={0.45} />
			<Sfx at={T.title} src="pling" vol={0.3} />
			<Sfx at={T.s1 + 0.1} src="whoosh" vol={0.3} />
			<Sfx at={T.price} src="pop" vol={0.4} />
			<Sfx at={T.plug} src="whoosh" vol={0.3} />
			<Sfx at={T.devlist + 0.6} src="pop" vol={0.4} />
			<Sfx at={T.callB} src="pop" vol={0.4} />
			<Sfx at={T.hashUp} src="whoosh" vol={0.3} />
			<Sfx at={T.answer + 0.6} src="pling" vol={0.45} />
			<Sfx at={T.ann} src="announcement" vol={0.9} />
			<Sfx at={T.hangup} src="busy" vol={0.18} />
			<Sfx at={T.callE} src="pop" vol={0.4} />
			<Sfx at={T.ringE} src="ring" vol={0.3} max={1.6} />
			<Sfx at={T.ringE + 1.6} src="ring" vol={0.3} max={1.0} />
			{dlg.map((l) => (
				<Sequence key={l.key} from={f(l.start)}>
					<Audio src={staticFile(`bonus/${l.key}.wav`)} volume={l.who === 'bot' ? 0.95 : 0.9} />
				</Sequence>
			))}
			<Sfx at={T.bonus + 0.2} src="whoosh" vol={0.3} />
			{[T.chk1, T.chk2, T.chk3, T.price1, T.ship, T.s3, T.chips, T.chips + 0.9, T.chips + 1.8, T.clickFlash, T.connect, T.confirm, T.tap1, T.tap2, T.tap3, T.tap4, T.tap5, T.tap6].map((a, i) => (
				<Sfx key={'p' + i} at={a} src="pop" vol={0.3} />
			))}
			<Sfx at={T.chk4} src="busy" vol={0.12} max={0.3} />
			{[T.st1, T.st2, T.st3, T.st4, T.st5, T.toRouter].map((a, i) => <Sfx key={'w' + i} at={a} src="whoosh" vol={0.28} />)}
			{[T.complete, T.sipOk, T.done, T.stamp].map((a, i) => <Sfx key={'g' + i} at={a} src="pling" vol={0.35} />)}
			<Sfx at={T.wps} src="pop" vol={0.45} />
			<Sfx at={T.talk - 0.3} src="pop" vol={0.35} />
			<Sfx at={T.hangupB} src="pop" vol={0.9} />
			<Sfx at={T.hangupB + 0.5} src="busy" vol={0.18} />
			<Sfx at={T.settings} src="pop" vol={0.4} />
			<Sfx at={T.end} src="pling" vol={0.3} />
		</AbsoluteFill>
	);
};
