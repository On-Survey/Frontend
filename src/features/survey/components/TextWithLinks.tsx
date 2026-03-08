import { openURL } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import { Text, TextButton } from "@toss/tds-mobile";

const URL_REGEX = /(https?:\/\/\S+)/g;

/** http/https만 허용 (javascript:, data: 등 스킴 차단) */
function isSafeHref(href: string): boolean {
	const trimmed = href.trim();
	return /^https?:\/\//i.test(trimmed);
}

/** <a href="...">...</a> 형태 파싱 */
const ANCHOR_REGEX = /<a\s+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

type Segment =
	| { type: "link"; href: string; displayText: string }
	| { type: "text"; content: string };

function trimTrailingPunctuation(url: string): string {
	return url.replace(/[.,;:)\]\s]+$/, "");
}

/** <a> 링크와 일반 텍스트 세그먼트 나눔 */
function parseSegments(html: string): (Segment & { id: string })[] {
	const segments: (Segment & { id: string })[] = [];
	let lastIndex = 0;
	let segId = 0;

	ANCHOR_REGEX.lastIndex = 0;
	let match = ANCHOR_REGEX.exec(html);
	while (match !== null) {
		if (match.index > lastIndex) {
			segments.push({
				id: `t-${segId++}`,
				type: "text",
				content: html.slice(lastIndex, match.index),
			});
		}
		const href = match[1].trim();
		const displayText = match[2].replace(/<[^>]+>/g, "").trim() || match[1];
		if (isSafeHref(href)) {
			segments.push({
				id: `a-${segId++}`,
				type: "link",
				href,
				displayText,
			});
		} else {
			segments.push({
				id: `t-${segId++}`,
				type: "text",
				content: displayText,
			});
		}
		lastIndex = match.index + match[0].length;
		match = ANCHOR_REGEX.exec(html);
	}
	if (lastIndex < html.length) {
		segments.push({
			id: `t-${segId}`,
			type: "text",
			content: html.slice(lastIndex),
		});
	}
	return segments.length > 0
		? segments
		: [{ id: "t-0", type: "text", content: html }];
}

const LINK_STYLE_INHERIT = {
	color: adaptive.blue400,
	textDecoration: "underline",
	cursor: "pointer",
} as const;

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

/** 부모 글자 크기를 따르는 링크용 버튼 (제목 등에서 사용) */
function LinkSpan({
	href,
	children,
}: {
	href: string;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			className="inline p-0 m-0 border-0 bg-transparent align-baseline cursor-pointer underline"
			style={{
				color: LINK_STYLE_INHERIT.color,
				fontSize: "inherit",
				fontWeight: "inherit",
				lineHeight: "inherit",
			}}
			onClick={(e: React.MouseEvent) => handleLinkClick(e, href)}
		>
			{children}
		</button>
	);
}

const linkStyleOnlySpanStyle = {
	color: LINK_STYLE_INHERIT.color,
	textDecoration: "underline" as const,
	cursor: "default" as const,
};

function LinkStyleOnlySpan({ children }: { children: React.ReactNode }) {
	return (
		<span
			className="inline align-baseline"
			style={{
				...linkStyleOnlySpanStyle,
				fontSize: "inherit",
				fontWeight: "inherit",
				lineHeight: "inherit",
			}}
		>
			{children}
		</span>
	);
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
							<LinkSpan key={`raw-${i}-${href}`} href={href}>
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
							<LinkSpan key={seg.id} href={seg.href}>
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
