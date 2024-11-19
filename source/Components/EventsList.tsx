import React, {useEffect, useMemo, useState} from 'react';
import {Box, Text, useInput} from 'ink';
import {ReceivedEventData} from '@azure/event-hubs';
import Table, {ScalarDict} from './Table.js';
import {TitledPanel} from './TitledPanel.js';

export type EventsListProps = {
	events: ReceivedEventData[];
	onSelectedEventChanged: (selectedEvent: ReceivedEventData) => Promise<void>;
};
export const EventsList = ({
	events,
	onSelectedEventChanged,
}: EventsListProps) => {
	const [selectedIndex, setSelectedIndex] = useState<number>(0);

	useEffect(() => {
		const selectedEvent = events[selectedIndex];
		if (selectedEvent) {
			onSelectedEventChanged(selectedEvent);
		}
	}, [selectedIndex]);

	useInput((i, k) => {
		if (k.upArrow && selectedIndex > 0) {
			setSelectedIndex(selectedIndex - 1);
		} else if (k.downArrow && selectedIndex < events.length - 1) {
			setSelectedIndex(selectedIndex + 1);
		}
	});

	const partialEvents = events.map(x => {
		return {
			enqueuedTimeUtc: x.enqueuedTimeUtc.toISOString(),
			messageId: x.messageId,
			partitionKey: x.partitionKey,
		} as ScalarDict;
	});

	return (
		<TitledPanel title="Event Hub Messages">
			<Box>
				<Text bold={true}>
					Press 'up' or 'down' arrow key to select an event
				</Text>
			</Box>
			<Table selectedIndex={selectedIndex} data={partialEvents} />
		</TitledPanel>
	);
};
