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

	const items = [
		{
			label: "희망 응답자 수",
			value: breakdown.desiredParticipants.label,
			price: breakdown.desiredParticipants.price,
			showCondition: true,
		},
		{
			label: "성별",
			value: breakdown.gender.label,
			price: breakdown.gender.price,
			showCondition: true,
		},
		{
			label: "연령대",
			value: breakdown.age.label,
			price: breakdown.age.price,
			showCondition: true,
		},
		{
			label: "거주지",
			value: breakdown.location.label,
			price: breakdown.location.price,
			showCondition: true,
		},
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
				{items
					.filter((item) => item.showCondition)
					.map((item, index, filteredItems) => (
						<div key={item.label}>
							<div className="flex justify-between items-center">
								<Text
									color={adaptive.grey700}
									typography="t5"
									fontWeight="regular"
								>
									{item.label} - {item.value}
								</Text>
								<Text
									color={adaptive.grey800}
									typography="t5"
									fontWeight="medium"
								>
									{item.price.toLocaleString()}원
								</Text>
							</div>
							{index < filteredItems.length - 1 && <div className="h-6" />}
						</div>
					))}

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
