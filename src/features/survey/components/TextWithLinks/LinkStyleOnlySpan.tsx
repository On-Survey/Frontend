import { linkStyleOnlySpanStyle } from "./linkStyles";

export function LinkStyleOnlySpan({ children }: { children: React.ReactNode }) {
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
