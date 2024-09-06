import React from "react";
import { ReceivedEventData } from "@azure/event-hubs";
import { Text } from "ink";
import { TitledPanel } from "./TitledPanel.js";
import { CloudEvent } from "cloudevents";


export type AzureEventDetailsProps = {
    azureEvent: ReceivedEventData
}
export const AzureEventDetails = ({ azureEvent }: AzureEventDetailsProps) => {

	return (
		<TitledPanel title="Azure Event Details">
			<Text>{JSON.stringify(azureEvent, null, 2)}</Text>
		</TitledPanel>
	);
};
