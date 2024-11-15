#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import App from './app.js';
import {loadConfiguration} from './configuration-loader.js';

//npm run build && export NODE_TLS_REJECT_UNAUTHORIZED=0 && export NODE_NO_WARNINGS=1 && node dist/cli.js

const clientConfiguration = await loadConfiguration();

render(<App clientConfiguration={clientConfiguration} />);
