import { adaptive } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";

const URL_REGEX = /(https?:\/\/\S+)/g;

function trimTrailingPunctuation(url: string): string {
	return url.replace(/[.,;:)\]\s]+$/, "");
}

export type TextWithLinksProps = {
	text: string;
	variant?: "inline" | "block";
	textProps?: React.ComponentProps<typeof Text>;
	linkProps?: React.ComponentProps<typeof Text>;
};

const linkStyle = {
	color: adaptive.blue400,
	textDecoration: "underline" as const,
	fontWeight: 400,
};

export function TextWithLinks({
	text,
	variant = "block",
	textProps = {},
}: TextWithLinksProps) {
	const parts = text.split(URL_REGEX);
	const hasLinks = parts.length > 1;

	const content = hasLinks ? (
		parts.map((part) => {
			const isUrl = part.startsWith("http://") || part.startsWith("https://");
			if (isUrl) {
				const href = trimTrailingPunctuation(part);
				return (
					<a
						key={`link-${href}`}
						href={href}
						target="_blank"
						rel="noopener noreferrer"
						style={linkStyle}
					>
						{part}
					</a>
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
