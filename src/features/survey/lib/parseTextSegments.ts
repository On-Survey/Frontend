const URL_REGEX = /(https?:\/\/\S+)/g;

/** http/https만 허용 */
export function isSafeHref(href: string): boolean {
	const trimmed = href.trim();
	return /^https?:\/\//i.test(trimmed);
}

/** <a href="...">...</a> 형태 파싱 */
const ANCHOR_REGEX = /<a\s+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

export type Segment =
	| { type: "link"; href: string; displayText: string }
	| { type: "text"; content: string };

export type SegmentWithId = Segment & { id: string };

export function trimTrailingPunctuation(url: string): string {
	return url.replace(/[.,;:)\]\s]+$/, "");
}

/** <a> 링크와 일반 텍스트 세그먼트 나눔 */
export function parseSegments(
	html: string | null | undefined,
): SegmentWithId[] {
	const safe = html ?? "";
	const segments: SegmentWithId[] = [];
	let lastIndex = 0;
	let segId = 0;

	ANCHOR_REGEX.lastIndex = 0;
	let match = ANCHOR_REGEX.exec(safe);
	while (match !== null) {
		if (match.index > lastIndex) {
			segments.push({
				id: `t-${segId++}`,
				type: "text",
				content: safe.slice(lastIndex, match.index),
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
		match = ANCHOR_REGEX.exec(safe);
	}
	if (lastIndex < safe.length) {
		segments.push({
			id: `t-${segId}`,
			type: "text",
			content: safe.slice(lastIndex),
		});
	}
	return segments.length > 0
		? segments
		: [{ id: "t-0", type: "text", content: safe }];
}

export { URL_REGEX };
