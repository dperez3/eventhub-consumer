import meow from "meow";
import { ClientConfiguration } from "./Components/client.js";
import { cosmiconfig } from "cosmiconfig";

export async function loadConfiguration(): Promise<ClientConfiguration> {
	return (await loadFromConfigFile()) ?? loadFromCli();
}

async function loadFromConfigFile(): Promise<ClientConfiguration | null> {
	const explorer = cosmiconfig('eventhub-consumer');
	const config = await explorer.search();

	if (config == null) return null;

	console.log(`Found configuration in ${config?.filepath}`);
	if (config?.isEmpty) {
		console.warn(`Configuration file is empty`);
		return null;
	}

	// TODO: Write validator

	return Promise.resolve(config?.config);
}

function loadFromCli(): ClientConfiguration {
	const cli = meow(
		`
		Usage
		  $ eventhub-consumer

		Options
			--eventHubsResourceName		The first part of the host name (without ".servicebus.windows.net").
			--eventHubName				The name of the event hub.

		Examples
		  $ eventhub-consumer --eventHubsResourceName my-namespace --eventHubName myeventhub
	`,
		{
			importMeta: import.meta,
			flags: {
				eventHubsResourceName: {
					alias: 'resourceName',
					type: 'string',
					isRequired: true
				},
				eventHubName: {
					alias: 'hubName',
					type: 'string',
					isRequired: true
				},
				consumerGroup: {
					alias: 'grpName',
					type: 'string',
					isRequired: true,
					default: '$Default'
				}
			},
		},
	);

	const clientConfiguration: ClientConfiguration = {
		eventHubs: {
			eventHubsResourceName: cli.flags.eventHubsResourceName,
			eventHubName: cli.flags.eventHubName,
			consumerGroup: cli.flags.consumerGroup
		},
		storage: undefined
	};

	return clientConfiguration;
}
