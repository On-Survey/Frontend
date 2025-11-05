import { BottomSheet } from "@toss/tds-mobile";
import type { Estimate } from "../../../pages/payment";

interface PaymentBottomSheetProps {
	estimate: Estimate;
	handleEstimateChange: (estimate: Estimate) => void;
	isOpen: boolean;
	handleClose: () => void;
	options: { name: string; value: string; hideUnCheckedCheckBox?: boolean }[];
	value: string;
	title: string;
	field: keyof Estimate;
}

export const PaymentBottomSheet = ({
	estimate,
	isOpen,
	handleClose,
	handleEstimateChange,
	options,
	value,
	title,
	field,
}: PaymentBottomSheetProps) => {
	const computedOptions = options.map((option) => ({
		...option,
		hideUnCheckedCheckBox: option.value !== value,
	}));
	return (
		<BottomSheet
			header={<BottomSheet.Header>{title}</BottomSheet.Header>}
			open={isOpen}
			onClose={handleClose}
			cta={[]}
		>
			<BottomSheet.Select
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					handleEstimateChange({ ...estimate, [field]: e.target.value })
				}
				value={value}
				options={computedOptions}
			/>
		</BottomSheet>
	);
};
