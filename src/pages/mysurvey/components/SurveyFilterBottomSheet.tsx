import { adaptive } from "@toss/tds-colors";
import { BottomSheet, Button, Tab } from "@toss/tds-mobile";
import { useState } from "react";
import { FilterContent } from "./FilterContent";

interface SurveyFilterBottomSheetProps {
	open: boolean;
	onClose: () => void;
}

type FilterTab = "age" | "gender" | "location";

export const SurveyFilterBottomSheet = ({
	open,
	onClose,
}: SurveyFilterBottomSheetProps) => {
	const [activeTab, setActiveTab] = useState<FilterTab>("age");
	const [selectedAge, setSelectedAge] = useState<string | null>(null);
	const [selectedGender, setSelectedGender] = useState<string | null>(null);
	const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

	const handleTabChange = (index: number) => {
		const tabs: FilterTab[] = ["age", "gender", "location"];
		setActiveTab(tabs[index] || "age");
	};

	const handleConfirm = () => {
		console.log("Selected filters:", {
			selectedAge,
			selectedGender,
			selectedLocation,
		});
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
				<div className="flex-shrink-0 sticky top-0 z-10">
					<Tab
						fluid={false}
						size="large"
						style={{ backgroundColor: adaptive.background }}
						onChange={handleTabChange}
					>
						<Tab.Item selected={activeTab === "age"}>연령대</Tab.Item>
						<Tab.Item selected={activeTab === "gender"}>성별</Tab.Item>
						<Tab.Item selected={activeTab === "location"}>거주지</Tab.Item>
					</Tab>
				</div>
				<div className="flex-1 overflow-y-auto min-h-0">
					<FilterContent
						activeTab={activeTab}
						selectedAge={selectedAge}
						selectedGender={selectedGender}
						selectedLocation={selectedLocation}
						onAgeChange={setSelectedAge}
						onGenderChange={setSelectedGender}
						onLocationChange={setSelectedLocation}
					/>
				</div>
			</div>
		</BottomSheet>
	);
};
