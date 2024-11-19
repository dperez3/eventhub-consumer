import React, {useState} from 'react';
import {ReceivedEventData} from '@azure/event-hubs';
import {TitledPanel} from './TitledPanel.js';
import {CloudEventDetails} from './CloudEventDetails.js';
import {useInput, Text, Box} from 'ink';
import {AzureEventDetails} from './AzureEventDetails.js';

export type EventDetailsProps = {
	event: ReceivedEventData | undefined;
};
export const EventDetails = ({event}: EventDetailsProps) => {
	if (!event) return <></>;

	const [mode, setMode] = useState<'azure' | 'cloud'>('azure');
	const nextMode =
		mode == 'azure' ? 'see Cloud Event' : 'see raw Azure message';

	useInput((i, k) => {
		if (k.leftArrow || k.rightArrow) {
			if (mode == 'azure') {
				setMode('cloud');
			} else {
				setMode('azure');
			}
		}
	});

	return (
		<TitledPanel title="Last Message Details">
			<Box>
				<Text bold={true}>
					{'<-'} Press arrow key to {nextMode} {'->'}
				</Text>
			</Box>
			{mode == 'azure' ? (
				<AzureEventDetails azureEvent={event} />
			) : (
				<CloudEventDetails azureEvent={event} />
			)}
		</TitledPanel>
	);
};
