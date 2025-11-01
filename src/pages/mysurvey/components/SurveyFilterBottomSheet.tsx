import { adaptive } from "@toss/tds-colors";
import { Asset, BottomSheet, Button, Tab, Text } from "@toss/tds-mobile";
import { useState } from "react";
import { ageRanges } from "../../../constants/demographics";
import { regions } from "../../../constants/regions";

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

	const renderFilterContent = () => {
		switch (activeTab) {
			case "age":
				return (
					<div className="p-4 grid grid-cols-3 gap-2">
						{ageRanges.map((ageRange) => (
							<Button
								key={ageRange}
								size="large"
								color={selectedAge === ageRange ? "primary" : "dark"}
								variant={selectedAge === ageRange ? "fill" : "weak"}
								onClick={() => setSelectedAge(ageRange)}
							>
								{ageRange}
							</Button>
						))}
					</div>
				);
			case "gender":
				return (
					<div className="p-4 space-y-2">
						<Button
							size="large"
							color={selectedGender === "전체" ? "primary" : "dark"}
							variant={selectedGender === "전체" ? "fill" : "weak"}
							display="block"
							onClick={() => setSelectedGender("전체")}
						>
							전체
						</Button>
						<div className="grid grid-cols-2 gap-4 mt-4 rounded-lg">
							<button
								type="button"
								onClick={() => setSelectedGender("남성")}
								className={`flex flex-col items-center justify-center p-4 rounded-xl!  ${selectedGender === "남성" ? " bg-blue-500" : "bg-gray-50"}`}
								aria-label="남성"
							>
								<Asset.Image
									frameShape={Asset.frameShape.CleanW40}
									backgroundColor="transparent"
									src="https://static.toss.im/2d-emojis/png/4x/u1F466_u1F3FB.png"
									aria-hidden={true}
									className="aspect-square"
								/>
								<Text
									color={
										selectedGender === "남성"
											? adaptive.grey100
											: adaptive.grey700
									}
									typography="t6"
									fontWeight={selectedGender === "남성" ? "bold" : "medium"}
									className="mt-1"
								>
									남성
								</Text>
							</button>
							<button
								type="button"
								onClick={() => setSelectedGender("여성")}
								className={`flex flex-col items-center justify-center p-4 rounded-xl! transition-colors ${
									selectedGender === "여성" ? " bg-blue-500" : " bg-gray-50"
								}`}
								aria-label="여성"
							>
								<Asset.Image
									frameShape={Asset.frameShape.CleanW40}
									backgroundColor="transparent"
									src="https://static.toss.im/2d-emojis/png/4x/u1F467_u1F3FB.png"
									aria-hidden={true}
									className="aspect-square"
								/>
								<Text
									color={
										selectedGender === "여성"
											? adaptive.grey100
											: adaptive.grey700
									}
									typography="t6"
									fontWeight={selectedGender === "여성" ? "bold" : "medium"}
									className="mt-1"
								>
									여성
								</Text>
							</button>
						</div>
					</div>
				);
			case "location":
				return (
					<div className="p-4 grid grid-cols-3 gap-2">
						<Button
							size="large"
							color={selectedLocation === "전체" ? "primary" : "dark"}
							variant={selectedLocation === "전체" ? "fill" : "weak"}
							onClick={() => setSelectedLocation("전체")}
						>
							전체
						</Button>
						{regions.map((region) => (
							<Button
								key={region.id}
								size="large"
								color={selectedLocation === region.name ? "primary" : "dark"}
								variant={selectedLocation === region.name ? "fill" : "weak"}
								onClick={() => setSelectedLocation(region.name)}
							>
								{region.name}
							</Button>
						))}
					</div>
				);
			default:
				return null;
		}
	};

	const handleConfirm = () => {
		// 필터 적용 로직
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
			<div className="flex flex-col">
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
				<div className="flex-1 overflow-y-auto max-h-96">
					{renderFilterContent()}
				</div>
			</div>
		</BottomSheet>
	);
};
