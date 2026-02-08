import { adaptive } from "@toss/tds-colors";
import { Button, Text } from "@toss/tds-mobile";
import type { FallbackProps } from "react-error-boundary";

export interface OngoingSurveysErrorFallbackProps extends FallbackProps {
	onRetry?: () => void;
}

export const OngoingSurveysErrorFallback = ({
	resetErrorBoundary,
	onRetry,
}: OngoingSurveysErrorFallbackProps) => {
	const handleRetry = () => {
		onRetry?.();
		resetErrorBoundary();
	};

	return (
		<div className="px-4 pb-4">
			<div
				className="rounded-2xl px-4 py-5 flex flex-col items-center justify-center gap-3 min-h-[120px]"
				style={{ backgroundColor: adaptive.grey100 }}
			>
				<Text color={adaptive.grey600} typography="t6" fontWeight="medium">
					노출 중인 설문을 불러오지 못했어요
				</Text>
				<Text color={adaptive.grey500} typography="t7" fontWeight="regular">
					잠시 후 다시 시도해 주세요
				</Text>
				<Button size="small" color="dark" variant="weak" onClick={handleRetry}>
					다시 시도
				</Button>
			</div>
		</div>
	);
};
