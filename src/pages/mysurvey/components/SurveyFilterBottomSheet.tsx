import { adaptive } from "@toss/tds-colors";
import { BottomSheet, Button, Tab } from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import type { SurveyInfo } from "../../../service/mysurvey/types";
import { FilterContent } from "./FilterContent";

interface SurveyFilterBottomSheetProps {
	open: boolean;
	onClose: () => void;
	surveyInfo?: SurveyInfo;
	initialAges?: string[];
	initialGenders?: string[];
	initialLocations?: string[];
	onApplyFilters: (
		ages: string[],
		genders: string[],
		locations: string[],
	) => void;
}

type FilterTab = "age" | "gender" | "location";

export const SurveyFilterBottomSheet = ({
	open,
	onClose,
	surveyInfo,
	initialAges = [],
	initialGenders = [],
	initialLocations = [],
	onApplyFilters,
}: SurveyFilterBottomSheetProps) => {
	const [activeTab, setActiveTab] = useState<FilterTab>("age");
	const [selectedAges, setSelectedAges] = useState<string[]>(initialAges);
	const [selectedGenders, setSelectedGenders] =
		useState<string[]>(initialGenders);
	const [selectedLocations, setSelectedLocations] =
		useState<string[]>(initialLocations);

	// 바텀시트가 열릴 때 초기값 설정
	useEffect(() => {
		if (open) {
			setSelectedAges(initialAges);
			setSelectedGenders(initialGenders);
			setSelectedLocations(initialLocations);
		}
	}, [open, initialAges, initialGenders, initialLocations]);

	const handleTabChange = (index: number) => {
		// const tabs: FilterTab[] = ["age", "gender", "location"];
		const tabs: FilterTab[] = ["age", "gender"];
		setActiveTab(tabs[index] || "age");
	};

	const handleConfirm = () => {
		// // 거주지 탭 임시 제거로 인해 항상 빈 배열 전달
		// onApplyFilters(selectedAges, selectedGenders, []);
		onApplyFilters(selectedAges, selectedGenders, []);
		onClose();
	};

	return (
		<BottomSheet
			header={<BottomSheet.Header>필터</BottomSheet.Header>}
			open={open}
			onClose={onClose}
			cta={
				<BottomSheet.DoubleCTA
					leftButton={
						<Button color="dark" variant="weak" onClick={onClose}>
							닫기
						</Button>
					}
					rightButton={<Button onClick={handleConfirm}>확인</Button>}
				/>
			}
		>
			<div className="flex flex-col h-full">
				<div className="shrink-0 sticky top-0 z-10">
					<Tab
						fluid={false}
						size="large"
						style={{ backgroundColor: adaptive.background }}
						onChange={handleTabChange}
					>
						<Tab.Item selected={activeTab === "age"}>연령대</Tab.Item>
						<Tab.Item selected={activeTab === "gender"}>성별</Tab.Item>
						{/* <Tab.Item selected={activeTab === "location"}>거주지</Tab.Item> */}
					</Tab>
				</div>
				<div className="flex-1 overflow-y-auto min-h-0">
					<FilterContent
						activeTab={activeTab}
						selectedAges={selectedAges}
						selectedGenders={selectedGenders}
						selectedLocations={selectedLocations}
						onAgeChange={(age) => {
							setSelectedAges((prev) =>
								prev.includes(age)
									? prev.filter((a) => a !== age)
									: [...prev, age],
							);
						}}
						onGenderChange={(gender) => {
							setSelectedGenders((prev) =>
								prev.includes(gender)
									? prev.filter((g) => g !== gender)
									: [...prev, gender],
							);
						}}
						onLocationChange={(location) => {
							setSelectedLocations((prev) =>
								prev.includes(location)
									? prev.filter((l) => l !== location)
									: [...prev, location],
							);
						}}
						surveyInfo={surveyInfo}
					/>
				</div>
			</div>
		</BottomSheet>
	);
};
