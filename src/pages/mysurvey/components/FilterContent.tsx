import { adaptive } from "@toss/tds-colors";
import { Asset, Button, Text } from "@toss/tds-mobile";
import { AGE_RANGES } from "../../../constants/demographics";
import { regions } from "../../../constants/regions";

type FilterTab = "age" | "gender" | "location";

interface FilterContentProps {
	activeTab: FilterTab;
	selectedAge: string | null;
	selectedGender: string | null;
	selectedLocation: string | null;
	onAgeChange: (age: string) => void;
	onGenderChange: (gender: string) => void;
	onLocationChange: (location: string) => void;
}

export const FilterContent = ({
	activeTab,
	selectedAge,
	selectedGender,
	selectedLocation,
	onAgeChange,
	onGenderChange,
	onLocationChange,
}: FilterContentProps) => {
	if (!activeTab) {
		return null;
	}

	switch (activeTab) {
		case "age":
			return (
				<div className="p-4 grid grid-cols-3 gap-2">
					{AGE_RANGES.map((ageRange) => (
						<Button
							key={ageRange}
							size="large"
							color={selectedAge === ageRange ? "primary" : "dark"}
							variant={selectedAge === ageRange ? "fill" : "weak"}
							onClick={() => onAgeChange(ageRange)}
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
						onClick={() => onGenderChange("전체")}
					>
						전체
					</Button>
					<div className="grid grid-cols-2 gap-4 mt-4 rounded-lg">
						<button
							type="button"
							onClick={() => onGenderChange("남성")}
							className={`flex flex-col items-center justify-center p-4 rounded-xl!  ${selectedGender === "남성" ? " bg-blue-500" : "bg-gray-100"}`}
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
							onClick={() => onGenderChange("여성")}
							className={`flex flex-col items-center justify-center p-4 rounded-xl! transition-colors ${
								selectedGender === "여성" ? " bg-blue-500" : " bg-gray-100"
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
						onClick={() => onLocationChange("전체")}
					>
						전체
					</Button>
					{regions.map((region) => (
						<Button
							key={region.id}
							size="large"
							color={selectedLocation === region.name ? "primary" : "dark"}
							variant={selectedLocation === region.name ? "fill" : "weak"}
							onClick={() => onLocationChange(region.name)}
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
