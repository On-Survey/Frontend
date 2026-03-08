import { adaptive } from "@toss/tds-colors";

export const LINK_STYLE_INHERIT = {
	color: adaptive.blue400,
	textDecoration: "underline",
	cursor: "pointer",
} as const;

export const linkStyleOnlySpanStyle = {
	color: LINK_STYLE_INHERIT.color,
	textDecoration: "underline" as const,
	cursor: "default" as const,
};
