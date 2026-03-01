import { adaptive } from "@toss/tds-colors";
import { Text, TextButton } from "@toss/tds-mobile";

const URL_REGEX = /(https?:\/\/\S+)/g;

function trimTrailingPunctuation(url: string): string {
	return url.replace(/[.,;:)\]\s]+$/, "");
}

export type TextWithLinksProps = {
	text: string;
	variant?: "inline" | "block";
	textProps?: React.ComponentProps<typeof Text>;
	linkProps?: Partial<React.ComponentProps<typeof TextButton>>;
};

export function TextWithLinks({
	text,
	variant = "block",
	textProps = {},
	linkProps = {},
}: TextWithLinksProps) {
	const parts = text.split(URL_REGEX);
	const hasLinks = parts.length > 1;

	const content = hasLinks ? (
		parts.map((part) => {
			const isUrl = part.startsWith("http://") || part.startsWith("https://");
			if (isUrl) {
				const href = trimTrailingPunctuation(part);
				return (
					<TextButton
						key={`link-${href}`}
						{...linkProps}
						size="medium"
						variant="underline"
						color={adaptive.blue400}
						onClick={() => window.open(href, "_blank", "noopener,noreferrer")}
					>
						{part}
					</TextButton>
				);
			}
			return <span key={`text-${part}`}>{part}</span>;
		})
	) : (
		<>{text}</>
	);

	if (variant === "inline") {
		return <>{content}</>;
	}

	return (
		<Text
			display="block"
			color={adaptive.grey700}
			typography="t6"
			fontWeight="regular"
			{...textProps}
		>
			{content}
		</Text>
	);
}
