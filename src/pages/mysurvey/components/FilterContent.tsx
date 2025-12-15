import { adaptive } from "@toss/tds-colors";
import { Asset, Button, Text } from "@toss/tds-mobile";
import { AGE_RANGES } from "../../../constants/demographics";
import {
	type AgeCode,
	type GenderCode,
	getAgeLabelSimple,
	getGenderLabel,
} from "../../../constants/payment";
import type { SurveyInfo } from "../../../service/mysurvey/types";

type FilterTab = "age" | "gender" | "location";

interface FilterContentProps {
	activeTab: FilterTab;
	selectedAges: string[];
	selectedGenders: string[];
	selectedLocations: string[];
	onAgeChange: (age: string) => void;
	onGenderChange: (gender: string) => void;
	onLocationChange: (location: string) => void;
	surveyInfo?: SurveyInfo;
}

export const FilterContent = ({
	activeTab,
	selectedAges,
	selectedGenders,
	selectedLocations,
	onAgeChange,
	onGenderChange,
	onLocationChange,
	surveyInfo,
}: FilterContentProps) => {
	// 거주지 탭 임시 제거로 인해 사용하지 않는 props를 소거
	void selectedLocations;
	void onLocationChange;
	if (!activeTab) {
		return null;
	}

	const getAvailableAges = () => {
		if (!surveyInfo) return AGE_RANGES;

		if (surveyInfo.ages.includes("ALL")) {
			return AGE_RANGES;
		}
		const availableAgeLabels = surveyInfo.ages
			.map((age) => getAgeLabelSimple(age as AgeCode))
			.filter((label) => label !== "");
		const sortedAges = availableAgeLabels.sort((a, b) => {
			const indexA = AGE_RANGES.indexOf(a);
			const indexB = AGE_RANGES.indexOf(b);
			return indexA - indexB;
		});
		return ["전체", ...sortedAges];
	};

	const getAvailableGenders = () => {
		if (!surveyInfo || surveyInfo.gender === "ALL") {
			return ["전체", "남성", "여성"];
		}
		return ["전체", getGenderLabel(surveyInfo.gender as GenderCode)];
	};

	// 거주지 탭 임시 제거
	// const getAvailableLocations = () => {
	// 	if (!surveyInfo || surveyInfo.residence === "ALL") {
	// 		return ["전체", ...regions.map((r) => r.name)];
	// 	}
	// 	return ["전체", getRegionLabelFromCode(surveyInfo.residence)];
	// };

	switch (activeTab) {
		case "age": {
			const availableAges = getAvailableAges();
			return (
				<div className="p-4 grid grid-cols-3 gap-2">
					{availableAges.map((ageRange) => {
						const isSelected = selectedAges.includes(ageRange);
						return (
							<Button
								key={ageRange}
								size="large"
								color={isSelected ? "primary" : "dark"}
								variant={isSelected ? "fill" : "weak"}
								onClick={() => onAgeChange(ageRange)}
							>
								{ageRange}
							</Button>
						);
					})}
				</div>
			);
		}
		case "gender": {
			const availableGenders = getAvailableGenders();
			return (
				<div className="p-4 space-y-2">
					{availableGenders.includes("전체") && (
						<Button
							size="large"
							color={selectedGenders.includes("전체") ? "primary" : "dark"}
							variant={selectedGenders.includes("전체") ? "fill" : "weak"}
							display="block"
							onClick={() => onGenderChange("전체")}
						>
							전체
						</Button>
					)}
					<div className="grid grid-cols-2 gap-4 mt-4 rounded-lg">
						{availableGenders.includes("남성") && (
							<button
								type="button"
								onClick={() => onGenderChange("남성")}
								className={`flex flex-col items-center justify-center p-4 rounded-xl!  ${selectedGenders.includes("남성") ? " bg-blue-500" : "bg-gray-100"}`}
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
										selectedGenders.includes("남성")
											? adaptive.grey100
											: adaptive.grey700
									}
									typography="t6"
									fontWeight={
										selectedGenders.includes("남성") ? "bold" : "medium"
									}
									className="mt-1"
								>
									남성
								</Text>
							</button>
						)}
						{availableGenders.includes("여성") && (
							<button
								type="button"
								onClick={() => onGenderChange("여성")}
								className={`flex flex-col items-center justify-center p-4 rounded-xl! transition-colors ${
									selectedGenders.includes("여성")
										? " bg-blue-500"
										: " bg-gray-100"
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
										selectedGenders.includes("여성")
											? adaptive.grey100
											: adaptive.grey700
									}
									typography="t6"
									fontWeight={
										selectedGenders.includes("여성") ? "bold" : "medium"
									}
									className="mt-1"
								>
									여성
								</Text>
							</button>
						)}
					</div>
				</div>
			);
		}
		// 거주지 탭 임시 제거
		// case "location": {
		// 	const availableLocations = getAvailableLocations();
		// 	return (
		// 		<div className="p-4 grid grid-cols-3 gap-2">
		// 			{availableLocations.map((location) => {
		// 				const isSelected = selectedLocations.includes(location);
		// 				return (
		// 					<Button
		// 						key={location}
		// 						size="large"
		// 						color={isSelected ? "primary" : "dark"}
		// 						variant={isSelected ? "fill" : "weak"}
		// 						onClick={() => onLocationChange(location)}
		// 					>
		// 						{location}
		// 					</Button>
		// 				);
		// 			})}
		// 		</div>
		// 	);
		// }
		default:
			return null;
	}
};
