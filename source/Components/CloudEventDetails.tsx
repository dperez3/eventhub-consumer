import React from 'react';
import {ReceivedEventData} from '@azure/event-hubs';
import {Box, Text} from 'ink';
import {TitledPanel} from './TitledPanel.js';
import {CloudEvent} from 'cloudevents';
import {KeyValueList} from './KeyValueList.js';
import {
	cloudEventsAttrPrefix,
	translateToCloudEvent,
} from '../services/cloudEventTranslator.js';

export type CloudEventDetailsProps = {
	azureEvent: ReceivedEventData;
};
export const CloudEventDetails = ({azureEvent}: CloudEventDetailsProps) => {
	const cloudEventAttributes = azureEvent
		? getCloudEventAttributes(azureEvent)
		: [];

	const cloudEvent = azureEvent ? translateToCloudEvent(azureEvent) : null;

	return (
		<Box flexDirection="column" gap={1}>
			<Box alignSelf="center">
				<Text color={'gray'}>{cloudEvent?.type}</Text>
			</Box>
			<Box flexDirection="column">
				<KeyValueList map={cloudEventAttributes} />
			</Box>
			<Box flexDirection={'column'}>
				{cloudEvent ? (
					<Text color={'cyan'} dimColor={true}>
						{JSON.stringify(cloudEvent.data, null, 2)}
					</Text>
				) : (
					<Text dimColor={true}>Waiting for message...</Text>
				)}
			</Box>
		</Box>
	);
};

function getCloudEventAttributes(cloudEvent: ReceivedEventData) {
	const props = Object.entries(cloudEvent.properties ?? {}).filter(x =>
		x[0].startsWith(cloudEventsAttrPrefix),
	);

	return Object.fromEntries(props);
}
