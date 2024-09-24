import React from 'react';
import {Box, Text} from 'ink';

export type KeyValueList = {
	[k: string]: any;
};

export function KeyValueList({map}: {map: KeyValueList}) {
	const Attrs = () => {
		return Object.entries(map).map((x, i) => (
			<Box key={i}>
				<Text color={'cyan'}>{x[0]}</Text>
				<Text>{' > '}</Text>
				<Text>{toString(x[1])}</Text>
			</Box>
		));
	};

	return (
		<Box flexDirection="column">
			<Attrs />
		</Box>
	);
}

function toString(val: any): string {
	const normalVal = val + '';

	if (normalVal == '[object Object]') {
		return JSON.stringify(val);
	}

	return normalVal;
}
