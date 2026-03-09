import { openURL } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import { Text, TextButton } from "@toss/tds-mobile";
import {
	isSafeHref,
	parseSegments,
	trimTrailingPunctuation,
	URL_REGEX,
} from "../../lib/parseTextSegments";
import { LinkSpan } from "./LinkSpan";
import { LinkStyleOnlySpan } from "./LinkStyleOnlySpan";

function openLink(href: string) {
	if (!isSafeHref(href)) return;
	openURL(href).catch(() => {
		window.open(href, "_blank", "noopener,noreferrer");
	});
}

function handleLinkClick(e: React.MouseEvent, href: string) {
	e.preventDefault();
	e.stopPropagation();
	openLink(href);
}

function renderTextWithRawUrls(
	content: string,
	linkProps: TextWithLinksProps["linkProps"],
	inheritLinkSize: boolean,
	linksClickable: boolean,
) {
	const parts = content.split(URL_REGEX);
	if (parts.length === 1) return <>{content}</>;
	return (
		<>
			{parts.map((part, i) => {
				const isUrl = part.startsWith("http://") || part.startsWith("https://");
				if (isUrl) {
					const href = trimTrailingPunctuation(part);
					if (!linksClickable) {
						return (
							<LinkStyleOnlySpan key={`raw-${i}-${href}`}>
								{part}
							</LinkStyleOnlySpan>
						);
					}
					if (inheritLinkSize) {
						return (
							<LinkSpan
								key={`raw-${i}-${href}`}
								href={href}
								onClick={(e: React.MouseEvent) => handleLinkClick(e, href)}
							>
								{part}
							</LinkSpan>
						);
					}
					return (
						<TextButton
							key={`raw-${i}-${href}`}
							{...linkProps}
							size="medium"
							variant="underline"
							color={adaptive.blue400}
							onClick={(e: React.MouseEvent) => handleLinkClick(e, href)}
						>
							{part}
						</TextButton>
					);
				}
				return <span key={`text-${i}-${part}`}>{part}</span>;
			})}
		</>
	);
}

export type TextWithLinksProps = {
	text: string;
	variant?: "inline" | "block";
	inheritLinkSize?: boolean;
	linksClickable?: boolean;
	textProps?: React.ComponentProps<typeof Text>;
	linkProps?: Partial<React.ComponentProps<typeof TextButton>>;
};

export function TextWithLinks({
	text,
	variant = "block",
	inheritLinkSize = false,
	linksClickable = true,
	textProps = {},
	linkProps = {},
}: TextWithLinksProps) {
	const segments = parseSegments(text);

	const content = (
		<>
			{segments.map((seg) => {
				if (seg.type === "link") {
					if (!linksClickable) {
						return (
							<LinkStyleOnlySpan key={seg.id}>
								{seg.displayText}
							</LinkStyleOnlySpan>
						);
					}
					if (inheritLinkSize) {
						return (
							<LinkSpan
								key={seg.id}
								href={seg.href}
								onClick={(e: React.MouseEvent) => handleLinkClick(e, seg.href)}
							>
								{seg.displayText}
							</LinkSpan>
						);
					}
					return (
						<TextButton
							key={seg.id}
							{...linkProps}
							size="medium"
							variant="underline"
							color={adaptive.blue400}
							onClick={(e: React.MouseEvent) => handleLinkClick(e, seg.href)}
						>
							{seg.displayText}
						</TextButton>
					);
				}
				return (
					<span key={seg.id}>
						{renderTextWithRawUrls(
							seg.content,
							linkProps,
							inheritLinkSize,
							linksClickable,
						)}
					</span>
				);
			})}
		</>
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
