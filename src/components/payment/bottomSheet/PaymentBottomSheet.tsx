import { BottomSheet } from "@toss/tds-mobile";
import type { Estimate } from "../../../contexts/PaymentContext";
import { usePaymentEstimate } from "../../../contexts/PaymentContext";

interface PaymentBottomSheetProps {
	isOpen: boolean;
	handleClose: () => void;
	options: { name: string; value: string; hideUnCheckedCheckBox?: boolean }[];
	value: string;
	title: string;
	field: keyof Estimate;
}

export const PaymentBottomSheet = ({
	isOpen,
	handleClose,
	options,
	value,
	title,
	field,
}: PaymentBottomSheetProps) => {
	const { estimate, handleEstimateChange } = usePaymentEstimate();
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
