import { BottomSheet, TextField } from "@toss/tds-mobile";

interface RatingLabelEditBottomSheeteProps {
	label: string;
	isOpen: boolean;
	handleClose: () => void;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function RatingLabelEditBottomSheete({
	label,
	isOpen,
	handleClose,
	value,
	onChange,
}: RatingLabelEditBottomSheeteProps) {
	return (
		<BottomSheet
			open={isOpen}
			onClose={handleClose}
			hasTextField={true}
			cta={
				<BottomSheet.CTA
					color="primary"
					variant="fill"
					disabled={!value.trim()}
					onClick={handleClose}
				>
					확인
				</BottomSheet.CTA>
			}
			ctaContentGap={0}
		>
			<TextField.Clearable
				variant="line"
				hasError={false}
				label={label}
				help="6글자까지 입력할 수 있어요"
				value={value}
				placeholder="좌측 라벨"
				onChange={onChange}
				autoFocus={true}
				maxLength={6}
			/>
		</BottomSheet>
	);
}

export default RatingLabelEditBottomSheete;
