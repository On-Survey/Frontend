import { LINK_STYLE_INHERIT } from "./linkStyles";

/** 부모 글자 크기를 따르는 링크용 버튼 (제목 등에서 사용) */
export function LinkSpan({
	href,
	children,
	onClick,
}: {
	href: string;
	children: React.ReactNode;
	onClick: (e: React.MouseEvent) => void;
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
			data-href={href}
			onClick={onClick}
		>
			{children}
		</button>
	);
}
