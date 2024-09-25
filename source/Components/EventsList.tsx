import React from 'react';
import {Box, Static, Text} from 'ink';
import {ReceivedEventData} from '@azure/event-hubs';
import Table, {ScalarDict} from './Table.js';
import {TitledPanel} from './TitledPanel.js';

export type EventsListProps = {
	events: Pick<
		ReceivedEventData,
		'enqueuedTimeUtc' | 'messageId' | 'partitionKey'
	>[];
};
export const EventsList = ({events}: EventsListProps) => {
	const partialEvents = events.map(x => {
		return {
			enqueuedTimeUtc: x.enqueuedTimeUtc.toISOString(),
			messageId: x.messageId,
			partitionKey: x.partitionKey,
		} as ScalarDict;
	});

	return (
		<TitledPanel title="Event Hub Messages">
			<Table data={partialEvents} />
		</TitledPanel>
	);
};
