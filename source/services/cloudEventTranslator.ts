import {ReceivedEventData} from '@azure/event-hubs';
import {CloudEvent, CloudEventV1} from 'cloudevents';

export const cloudEventsAttrPrefix = 'cloudEvents:';

export type JSONValue = {
	[x: string]: JSONValue | string | number | boolean | Array<JSONValue>;
};

export function translateToCloudEvent(
	azEvent: ReceivedEventData,
): CloudEvent<JSONValue> | null {
	if (!azEvent.properties) return null;
	// const a = Object.entries(azEvent.properties);

	const cloudEventAttributes = Object.keys(azEvent.properties)
		.filter(x => x.startsWith(cloudEventsAttrPrefix))
		.map(x => {
			return {
				attribute: x.substring(cloudEventsAttrPrefix.length),
				value: azEvent.properties![x],
			};
		});

	const cloudEvent: Partial<CloudEventV1<JSONValue>> = {};

	cloudEventAttributes.forEach(x => {
		try {
			switch (x.attribute) {
				// case 'source':
				// 	cloudEvent.source = x.value;
				// 	break;

				// case 'time':
				// 	cloudEvent.time = x.value
				// 	break;

				default:
					cloudEvent[x.attribute] = x.value;
					break;
			}
		} catch (error) {
			// TODO: add to errors result
		}
	});

	// toReturn.data = JsonDocument.Parse(partitionEvent.Data.EventBody.ToStream());
	cloudEvent.data = azEvent.body;

	return new CloudEvent<JSONValue>(cloudEvent, false);
}
