// 문항 타입 버튼 데이터
export const QUESTION_TYPES = [
	{
		id: "multipleChoice",
		label: "객관식",
		icon: "icon-line-three-dots-mono",
	},
	{
		id: "rating",
		label: "평가형",
		icon: "icon-star-mono",
	},
	{
		id: "nps",
		label: "NPS",
		icon: "icon-circle-piece-mono",
	},
	{
		id: "shortAnswer",
		label: "단답형",
		icon: "icon-2-list-line-mono",
	},
	{
		id: "longAnswer",
		label: "장문형",
		icon: "icon-chat-bubble-text-square-mono",
	},
	{
		id: "number",
		label: "숫자형",
		icon: "icon-123-mono",
	},
	{
		id: "date",
		label: "날짜형",
		icon: "icon-calendar-square-mono",
	},
];

// 메인 컨트롤러 버튼 데이터
export const MAIN_CONTROLS = [
	{
		id: "save",
		label: "임시 저장",
		icon: "icon-cloud-download-mono",
		action: "handleSave",
	},
	{
		id: "add_question",
		label: "문항 추가",
		icon: "icon-line-three-dots-mono",
		action: "handleAddQuestion",
	},
	{
		id: "reorder",
		label: "순서 변경",
		icon: "icon-arrow-up-down-mono",
		action: "handleReorderQuestion",
	},
] as const;

// 공통 버튼 스타일
export const BUTTON_STYLES = {
	questionType:
		"flex flex-col items-center gap-1 transition-transform duration-150 ease-in-out active:scale-95 cursor-pointer select-none bg-transparent border-none p-0 min-w-[60px] shrink-0",
	backButton:
		"flex flex-col items-center gap-1 transition-transform duration-150 ease-in-out active:scale-95 cursor-pointer select-none border-none p-0 shrink-0 bg-gray-200 rounded-full! w-[40px] h-[40px] justify-center",
	mainControl:
		"flex flex-col items-center gap-1 transition-transform duration-150 ease-in-out active:scale-95 cursor-pointer select-none bg-transparent border-none p-0 min-w-[60px] shrink-0",
	nextButton:
		"flex flex-col justify-center items-center bg-[#3E8CF5] rounded-full! w-[75px] h-[60px] transition-all duration-150 ease-in-out active:bg-[#2D6BC7] active:scale-95 hover:bg-[#4A9AFF] select-none border-none p-0",
};

// 아이콘 공통 속성
export const ICON_PROPS = {
	frameShape: "CleanW24" as const,
	backgroundColor: "transparent" as const,
	ariaHidden: true,
	ratio: "1/1" as const,
};

// 텍스트 공통 속성
export const TEXT_PROPS = {
	typography: "st13" as const,
	fontWeight: "medium" as const,
};
