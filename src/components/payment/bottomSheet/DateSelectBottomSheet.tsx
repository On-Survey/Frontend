import { WheelDatePicker } from "@toss/tds-mobile";

interface DateSelectBottomSheetProps {
	value: Date;
	onChange: (date: Date) => void;
	triggerLabel?: string;
}

export const DateSelectBottomSheet = ({
	value,
	onChange,
	triggerLabel = "설문조사 마감일",
}: DateSelectBottomSheetProps) => {
	return (
		<WheelDatePicker
			title={"날짜를 선택해주세요"}
			value={value}
			onChange={onChange}
			triggerLabel={triggerLabel}
			buttonText={"확인"}
			description="선택일 자정에 설문이 마감돼요"
		/>
	);
};
