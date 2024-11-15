- [eventhub-consumer](#eventhub-consumer)
  - [CLI](#cli)
    - [Config File](#config-file)
      - [Example Configuration File](#example-configuration-file)
  - [Install](#install)
  - [Troubleshooting](#troubleshooting)

# eventhub-consumer

Browse your Azure Event Hub events with a terminal-based UI.

> _**Why a terminal?**_
>
> Azure requires different auth strategies depending on what kind of software is requesting access. A terminal requires less up front requirements than a web app - allowing you to peruse events faster.

## CLI

Targeted event hub details can be supplied via a [cosmic config file](https://github.com/cosmiconfig/cosmiconfig?tab=readme-ov-file#usage-for-end-users) or directly in CLI arguments.

```bash
$ az login
$ npx eventhub-consumer --help

 Usage
 	$ eventhub-consumer

 Options
 	------------------------------------------------------------------------------------------------
 	(No arguments)			Searches for a default config file. See 'cosmicconfig'.
 	------------------------------------------------------------------------------------------------
	{config filepath}		The path to the config file to use. See 'cosmicconfig'.
 	------------------------------------------------------------------------------------------------
 	--eventHubsResourceName		The first part of the host name (without ".servicebus.windows.net").
 	--eventHubName			The name of the event hub.
 	------------------------------------------------------------------------------------------------

 Examples
 	$ eventhub-consumer
 	$ eventhub-consumer eventhub-consumer.dev.config.ts
 	$ eventhub-consumer eventhub-consumer.qa.config.ts
 	$ eventhub-consumer --eventHubsResourceName my-namespace --eventHubName myeventhub
```

### Config File

- The config file is based on **cosmic config** and can be [written in many ways](https://github.com/cosmiconfig/cosmiconfig?tab=readme-ov-file#usage-for-end-users).
- The **expected schema** for the configuration file is [found here](source\Components\client.ts).

#### Example Configuration File

`eventhub-consumer.config.ts`

```ts
import {ClientConfiguration} from 'eventhub-consumer/dist/Components/client';

export default {
	eventHubs: {
		eventHubsResourceName: 'my-namespace',
		eventHubName: 'myeventhub',
	},
} as ClientConfiguration;
```

## Install

Alternatively, you may install the package instead of using npx...

```bash
$ npm install --global eventhub-consumer
...
```

## Troubleshooting

If you encounter issues, you may need to login into azure and/or disable a few NODE settings...

```bash
az login && export NODE_TLS_REJECT_UNAUTHORIZED=0 && export NODE_NO_WARNINGS=1 && npx eventhub-consumer
```

---

> _This project is made with [create-ink-app](https://github.com/vadimdemedes/create-ink-app)._
