import { WheelDatePicker } from "@toss/tds-mobile";

interface DateSelectBottomSheetProps {
	value: Date;
	onChange: (date: Date) => void;
}

export const DateSelectBottomSheet = ({
	value,
	onChange,
}: DateSelectBottomSheetProps) => {
	return (
		<WheelDatePicker
			title={"날짜를 선택해주세요"}
			value={value}
			onChange={onChange}
			triggerLabel={"설문조사 마감일"}
			buttonText={"확인"}
			description="선택일 자정에 설문이 마감돼요"
		/>
	);
};
