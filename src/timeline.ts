import clips from './clips.json';
import bonus from './bonus-clips.json';

export const FPS = 30;
export const W = 1920;
export const H = 1080;

type Clip = { text: string; duration: number };
const C = clips as Record<string, Clip>;
export const D = (k: string) => C[k].duration;

export type Cue = { key: string; text: string; start: number; end: number; dir: string };
export const vo: Record<string, Cue> = {};
const say = (key: string, start: number) => {
	vo[key] = { key, text: C[key].text, start, end: start + D(key), dir: 'vo' };
	return vo[key].end;
};

// All times in seconds. Visual events hang off the voice-over cues, so a
// re-recorded line moves everything after it along.
export const T: Record<string, number> = {};
let e: number;

// --- Scene 0: the dinner, the call, rewind, the dongle ------------------
T.ring1 = 0.3;
e = say('s0a', 0.9);
T.pickup = e + 0.15;
e = say('s0b', T.pickup + 0.35);
T.grr = vo.s0b.start + 1.3;
T.rewind = e + 0.6;
T.room2 = T.rewind + 1.3;
e = say('s0c', T.room2 + 0.3);
T.donglePop = vo.s0c.start + D('s0c') * 0.6;
T.zoom = vo.s0c.end - 1.0;
T.call0 = e + 0.1;
e = say('s0d', T.call0 + 0.5);
T.spam0 = T.call0 + 1.0;
T.still0 = vo.s0d.end - 1.9;
T.title = e + 0.7;

// --- Scene 1: how it works ----------------------------------------------
T.s1 = T.title + 3.4;
e = say('s1a', T.s1 + 0.5);
T.price = vo.s1a.start + 1.6;
T.plug = vo.s1a.start + D('s1a') * 0.5;
T.devlist = vo.s1a.start + D('s1a') * 0.68;
T.b = e + 0.3;
e = say('s1b', T.b + 0.3);
T.callB = vo.s1b.start + 0.9;
T.fanout = T.callB + 0.8;
e = say('s1c', e + 0.5);
T.hashUp = vo.s1c.start + 0.7;
T.votes = vo.s1c.start + D('s1c') * 0.6;
T.answer = vo.s1c.end - 0.5;
e = say('s1d1', e + 0.6);
T.pickup1 = vo.s1d1.start + 0.7;
T.ann = e + 0.15;
T.hangup = T.ann + 2.9;
e = say('s1d2', T.hangup + 0.15);
T.notRang = vo.s1d2.start + 1.5;
T.hint = vo.s1d2.start + 2.0;
T.callE = e + 2.6;
e = say('s1e', T.callE + 0.5);
T.normalScreen = T.callE + 0.9;
T.shrug = vo.s1e.end - 1.2;
T.ringE = vo.s1e.end + 0.2;
T.s1end = T.ringE + 2.6;

// --- Bonus: the dongle keeps the caller talking ---------------------------
// Dialogue lines are not narration: they get no subtitle bar, they show as
// chat bubbles (dlg).
const BC = bonus as Record<string, Clip>;
export type Line = { key: string; who: 'bot' | 'caller'; text: string; start: number; end: number };
export const dlg: Line[] = [];
const sayB = (key: string, start: number) => {
	vo[key] = { key, text: BC[key].text, start, end: start + BC[key].duration, dir: 'bonus' };
	return vo[key].end;
};
const line = (key: string, start: number) => {
	const l: Line = { key, who: key.startsWith('b') ? 'bot' : 'caller', text: BC[key].text, start, end: start + BC[key].duration };
	dlg.push(l);
	return l.end;
};
// --- Installation ------------------------------------------------------
const DB = (k: string) => BC[k].duration;
T.inst = T.s1end;
e = sayB('i0', T.inst + 0.6);
e = sayB('i1', e + 0.3);
T.chk1 = vo.i1.start + 0.3;
T.chk2 = vo.i1.start + DB('i1') * 0.5;
e = sayB('i2', e + 0.3);
T.chk3 = vo.i2.start + 0.2;
T.chk4 = vo.i2.start + DB('i2') * 0.6;
T.st1 = e + 0.8;
e = sayB('i3', T.st1 + 0.5);
T.price1 = vo.i3.start + DB('i3') * 0.45;
T.ship = vo.i3.start + DB('i3') * 0.75;
e = sayB('i4', e + 0.4);
T.s3 = vo.i4.start + 0.2;
T.chips = vo.i4.start + DB('i4') * 0.42;
T.st2 = e + 0.7;
e = sayB('i5', T.st2 + 0.5);
T.plugPC = vo.i5.start + DB('i5') * 0.35;
T.page = vo.i5.start + DB('i5') * 0.6;
e = sayB('i6', e + 0.3);
T.clickFlash = vo.i6.start + 0.5;
T.serial = T.clickFlash + 0.3;
T.connect = vo.i6.start + DB('i6') * 0.38;
T.install = T.connect + 0.4;
T.confirm = vo.i6.start + DB('i6') * 0.55;
T.progress = T.confirm + 0.4;
T.complete = vo.i6.end + 0.5;
e = sayB('i7', T.complete + 0.3);
T.stamp = vo.i7.start + 0.3;
T.st3 = e + 0.8;
e = sayB('i8', T.st3 + 0.5);
T.toRouter = vo.i8.start + DB('i8') * 0.25;
T.blue = T.toRouter + 1.0;
e = sayB('i9', e + 0.4);
T.wps = vo.i9.start + 0.5;
T.waves = T.wps + 0.5;
T.white = vo.i9.start + DB('i9') * 0.55;
T.st4 = e + 0.8;
e = sayB('i10', T.st4 + 0.5);
T.tap1 = vo.i10.end - 0.7;
e = sayB('i11', e + 0.3);
T.tap2 = vo.i11.start + 0.5;
T.typing = vo.i11.start + DB('i11') * 0.45;
T.tap3 = vo.i11.end - 0.3;
e = sayB('i12', e + 0.4);
T.fbKey = vo.i12.start + DB('i12') * 0.45;
T.dial = vo.i12.start + DB('i12') * 0.72;
T.sipOk = vo.i12.end + 0.3;
e = sayB('i13', e + 0.8);
T.tap4 = vo.i13.start + 0.3;
T.tap5 = vo.i13.start + DB('i13') * 0.35;
T.tap6 = vo.i13.start + DB('i13') * 0.7;
T.tokOk = vo.i13.end + 0.2;
e = sayB('i14', e + 0.4);
T.done = vo.i14.start + 0.4;
T.st5 = e + 0.8;
e = sayB('i15', T.st5 + 0.5);
T.instEnd = e + 0.8;

// --- Bonus -------------------------------------------------------------
T.bonus = T.instEnd;
e = sayB('n0', T.bonus + 0.6);
T.talk = e + 0.5;
e = T.talk;
for (const k of ['b1', 'p1', 'b2', 'p2', 'b3', 'p3', 'b4', 'p4', 'b5', 'p5', 'b6', 'p6']) {
	e = line(k, e + (k === 'p5' ? 0.15 : k === 'p6' ? 1.1 : 0.4));
}
T.hangupB = e + 0.3;
e = sayB('n1', T.hangupB + 1.6);
T.settings = vo.n1.start + BC.n1.duration * 0.45;
T.end = e + 1.0;
e = sayB('e1', T.end + 0.8);
T.total = e + 2.5;

export const f = (s: number) => Math.round(s * FPS);
