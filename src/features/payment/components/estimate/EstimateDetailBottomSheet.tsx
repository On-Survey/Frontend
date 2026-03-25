import type { Estimate } from "@shared/contexts/PaymentContext";
import { calculateEstimatePrice } from "@shared/lib/estimatePrice";
import { adaptive } from "@toss/tds-colors";
import { BottomSheet, Text } from "@toss/tds-mobile";

interface EstimateDetailBottomSheetProps {
	isOpen: boolean;
	handleClose: () => void;
	estimate: Estimate;
}

export const EstimateDetailBottomSheet = ({
	isOpen,
	handleClose,
	estimate,
}: EstimateDetailBottomSheetProps) => {
	const breakdown = calculateEstimatePrice(estimate);

	const rows: { label: string; value: string }[] = [
		{
			label: "희망 응답자 수",
			value: breakdown.desiredParticipants.label,
		},
		{ label: "문항 수", value: breakdown.questionCount.label },
		{
			label: "성별 / 연령대",
			value: breakdown.targetingSummary,
		},
		{ label: "거주지", value: breakdown.location.label },
	];

	return (
		<BottomSheet
			open={isOpen}
			onClose={handleClose}
			cta={
				<BottomSheet.CTA
					color="primary"
					variant="fill"
					onClick={handleClose}
					style={
						{ "--button-background-color": "#15c67f" } as React.CSSProperties
					}
				>
					확인
				</BottomSheet.CTA>
			}
		>
			<div className="p-4">
				<div className="flex flex-col gap-4">
					{rows.map((row) => (
						<div key={row.label}>
							<Text
								color={adaptive.grey700}
								typography="t5"
								fontWeight="regular"
							>
								{row.label} - {row.value}
							</Text>
						</div>
					))}
				</div>

				<div className="flex justify-between items-center mt-4">
					<Text color={adaptive.grey700} typography="t5" fontWeight="regular">
						총액
					</Text>
					<Text
						color={adaptive.green500}
						typography="st8"
						fontWeight="semibold"
					>
						{breakdown.total.toLocaleString()}원
					</Text>
				</div>
			</div>
		</BottomSheet>
	);
};
