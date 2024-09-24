import React, {PropsWithChildren} from 'react';
import {Text, Box, TextProps, BoxProps} from 'ink';

export type TitledPanelProps = PropsWithChildren<{
	title: string;
	titleProps?: TextProps;
	boxProps?: BoxProps;
}>;
export const TitledPanel = ({
	title,
	titleProps,
	boxProps,
	children,
}: TitledPanelProps) => {
	return (
		<Box flexDirection="column">
			<Box alignSelf="center">
				<Text underline={true} bold={true} color={'green'}>
					{title}
				</Text>
			</Box>
			<Box
				flexDirection="column"
				borderStyle={'round'}
				borderColor={'green'}
				borderRightColor={'greenBright'}
				padding={1}
				gap={1}
			>
				{children}
			</Box>
		</Box>
	);
};
