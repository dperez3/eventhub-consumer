import React from 'react';
import chalk from 'chalk';
import test from 'ava';
import {render} from 'ink-testing-library';
import App from './source/app.js';

test('no op', t => {
	// const {lastFrame} = render(<App clientConfiguration={{ eventHubs: {} }} />);

	// t.is(lastFrame(), `Hello, ${chalk.green('Stranger')}`);

	t.is(1, 1);
});
