import React from 'react';
import { Composition } from 'remotion';
import { FPS, H, T, W, f } from './timeline';
import { Prototype } from './Video';

export const Root: React.FC = () => (
	<Composition id="Prototype" component={Prototype} durationInFrames={f(T.total)} fps={FPS} width={W} height={H}
		defaultProps={{ subtitles: true }} />
);
