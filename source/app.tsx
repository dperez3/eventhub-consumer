import React, {useEffect, useState} from 'react';
import {Box, Static, Text, useApp, useInput} from 'ink';
import {ReceivedEventData} from '@azure/event-hubs';
import {DefaultAzureCredential} from '@azure/identity';
import {ClientConfiguration, ClientOptions, mainNew} from './Components/client.js';
import {EventDetails} from './Components/EventDetails.js';
import {EventsList} from './Components/EventsList.js';

type Props = {
	clientConfiguration: ClientConfiguration
};

export default function App({ clientConfiguration }: Props) {
	const {exit} = useApp();
	const [events, setEvents] = useState<ReceivedEventData[]>([]);

	const lastEvent = events.length > 0 ? events[events.length - 1] : undefined;

	useInput((i, k) => {
		if (i == 'q') {
			exit();
		}
	});

	useEffect(() => {
		const clientOptions: ClientOptions = {
			...clientConfiguration,
			credential: new DefaultAzureCredential(),
			eventsUpdated: async newEventsMap => {
				const newOrderedEvents = Array.from(newEventsMap.values()).sort(
					(a, b) => {
						// negative if first val is less than
						return (a.enqueuedTimeUtc as any) - (b.enqueuedTimeUtc as any);
					},
				);
				setEvents(newOrderedEvents);
			}
		};
		const r = mainNew(clientOptions);

		return () => {
			// end?
		};
	}, []);

	if (events.length == 0) {
		return <Text dimColor={true} italic={true}>Looking for messages...</Text>
	}

	return (
		<Box flexWrap='wrap' flexDirection='row' minWidth={'100%'}>
			<Box minWidth={100} width={'50%'} alignItems='flex-end'>
				<EventsList events={events} />
			</Box>
			<Box width={'50%'}>
				<EventDetails event={lastEvent} />
			</Box>
		</Box>
	);
}
