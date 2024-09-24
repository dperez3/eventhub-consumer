import {TokenCredential} from '@azure/identity';
import {
	EventHubConsumerClient,
	earliestEventPosition,
	RetryMode,
	ReceivedEventData,
} from '@azure/event-hubs';
import {ContainerClient} from '@azure/storage-blob';
import {BlobCheckpointStore} from '@azure/eventhubs-checkpointstore-blob';

export type ClientConfiguration = {
	// Event hubs
	eventHubs: {
		eventHubsResourceName: string;
		//fullyQualifiedNamespace: `${eventHubsResourceName}.servicebus.windows.net`;
		eventHubName: string;
		consumerGroup: '$Default' | string; // name of the default consumer group
	};

	// Azure Storage
	storage?:
		| {
				storageAccountName: string;
				storageContainerName: string;
				//baseUrl: `https://${storageAccountName}.blob.core.windows.net`;
		  }
		| string;
};

export type ClientOptions = ClientConfiguration & {
	// Azure Identity - passwordless authentication
	credential: TokenCredential;
	eventsUpdated: (
		newEventsMap: Map<string, ReceivedEventData>,
	) => Promise<void>;
};

export async function mainOld({
	eventHubs,
	storage,
	credential,
}: ClientOptions): Promise<void> {
	const fullyQualifiedNamespace = `${eventHubs.eventHubsResourceName}.servicebus.windows.net`;

	// Create a blob container client and a blob checkpoint store using the client.
	const containerClient = new ContainerClient(
		getStorageContainerUrl(storage),
		credential,
	);
	const checkpointStore = new BlobCheckpointStore(containerClient);

	// Create a consumer client for the event hub by specifying the checkpoint store.
	const consumerClient = new EventHubConsumerClient(
		eventHubs.consumerGroup,
		fullyQualifiedNamespace,
		eventHubs.eventHubName,
		credential,
		checkpointStore,
	);

	// Subscribe to the events, and specify handlers for processing the events and errors.
	const subscription = consumerClient.subscribe(
		{
			processInitialize: async a => {
				console.log(a);
			},
			processEvents: async (events, context) => {
				if (events.length === 0) {
					console.log(
						`No events received within wait time. Waiting for next interval`,
					);
					return;
				}

				for (const event of events) {
					console.log(
						`Received event: '${event.body}' from partition: '${context.partitionId}' and consumer group: '${context.consumerGroup}'`,
					);
				}
				// Update the checkpoint.
				await context.updateCheckpoint(events[events.length - 1]!);
			},

			processError: async (err, context) => {
				console.log(`Error : ${err}`);
			},
		},
		{startPosition: earliestEventPosition},
	);

	// After 30 seconds, stop processing.
	await new Promise<void>(resolve => {
		setTimeout(async () => {
			await subscription.close();
			await consumerClient.close();
			resolve();
		}, 30000);
	});
}

export async function mainNew({
	eventHubs,
	storage,
	credential,
	eventsUpdated,
}: ClientOptions): Promise<void> {
	const fullyQualifiedNamespace = `${eventHubs.eventHubsResourceName}.servicebus.windows.net`;

	const client = new EventHubConsumerClient(
		eventHubs.consumerGroup,
		fullyQualifiedNamespace,
		eventHubs.eventHubName,
		credential,
		{
			retryOptions: {
				mode: RetryMode.Fixed,
			},
		},
	);

	const eventMap = new Map<string, ReceivedEventData>();

	const subscription = client.subscribe(
		{
			processInitialize: async x => {},
			processEvents: async (events, ctx) => {
				events.forEach(e => {
					eventMap.set(e.messageId as string, e);
				});
				eventsUpdated(eventMap);
			},
			processError: async (err, ctx) => {
				console.error(`Error for partition ${ctx.partitionId}`, err);
			},
			processClose: async (reason, ctx) => {
				console.log(`Closing partition ${ctx.partitionId} because: ${reason}`);
			},
		},
		{startPosition: earliestEventPosition},
	);

	// // After 30 seconds, stop processing.
	// await new Promise<void>((resolve) => {
	//     setTimeout(async () => {
	//         await subscription.close();
	//         await client.close();
	//         resolve();
	//     }, 30000);
	// });
}

function getStorageContainerUrl(
	storageConfig: ClientOptions['storage'],
): string {
	if (typeof storageConfig == 'string') {
		return storageConfig;
	}

	const baseUrl = `https://${
		storageConfig!.storageAccountName
	}.blob.core.windows.net`;

	return `${baseUrl}/${storageConfig!.storageContainerName}`;
}
