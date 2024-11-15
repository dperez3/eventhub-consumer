import meow from 'meow';
import {ClientConfiguration} from './Components/client.js';
import {cosmiconfig} from 'cosmiconfig';

export async function loadConfiguration(): Promise<ClientConfiguration> {
	return (await loadFromConfigFile()) ?? loadFromCli();
}

async function loadFromConfigFile(): Promise<ClientConfiguration | null> {
	const configFileName = checkConfigPathArgument();

	const explorer = cosmiconfig('eventhub-consumer');
	const config =
		configFileName == null
			? await explorer.search()
			: await explorer.load(configFileName);

	if (config == null) return null;

	console.log(`Found configuration in ${config?.filepath}`);
	if (config?.isEmpty) {
		console.warn(`Configuration file is empty`);
		return null;
	}

	// TODO: Write validator

	return Promise.resolve(config?.config);
}

function checkConfigPathArgument(): string | null {
	const args = process.argv.slice(2);

	if (args.length == 1 && !args.includes('--help')) {
		return args[0] ?? null;
	}

	return null;
}

function loadFromCli(): ClientConfiguration {
	const cli = meow(
		`
		Usage
		  $ eventhub-consumer

		Options
			------------------------------------------------------------------------------------------------
			(No arguments)				Searches for a default config file. See 'cosmicconfig'.
			------------------------------------------------------------------------------------------------
			{config filepath}			The path to the config file to use. See 'cosmicconfig'.
			------------------------------------------------------------------------------------------------
			--eventHubsResourceName		The first part of the host name (without ".servicebus.windows.net").
			--eventHubName				The name of the event hub.
			------------------------------------------------------------------------------------------------

		Examples
		  $ eventhub-consumer
		  $ eventhub-consumer eventhub-consumer.dev.config.ts
		  $ eventhub-consumer eventhub-consumer.qa.config.ts
		  $ eventhub-consumer --eventHubsResourceName my-namespace --eventHubName myeventhub
	`,
		{
			importMeta: import.meta,
			flags: {
				eventHubsResourceName: {
					alias: 'resourceName',
					type: 'string',
					isRequired: true,
				},
				eventHubName: {
					alias: 'hubName',
					type: 'string',
					isRequired: true,
				},
				consumerGroup: {
					alias: 'grpName',
					type: 'string',
					isRequired: true,
					default: '$Default',
				},
			},
		},
	);

	const clientConfiguration: ClientConfiguration = {
		eventHubs: {
			eventHubsResourceName: cli.flags.eventHubsResourceName,
			eventHubName: cli.flags.eventHubName,
			consumerGroup: cli.flags.consumerGroup,
		},
		storage: undefined,
	};

	return clientConfiguration;
}
