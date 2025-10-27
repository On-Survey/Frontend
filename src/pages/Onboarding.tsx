import { colors } from "@toss/tds-colors";
import {
	Checkbox,
	FixedBottomCTA,
	List,
	ListRow,
	ProgressBar,
	Top,
} from "@toss/tds-mobile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { regions } from "../constants/regions";
import { topics } from "../constants/topics";

const OnboardingStep1 = ({ onNext }: { onNext: () => void }) => {
	const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

	const handleRegionSelect = (regionId: string) => {
		setSelectedRegion(regionId);
	};

	return (
		<div className="flex-1 flex flex-col">
			<div className="flex-1 overflow-y-auto">
				<List>
					{regions.map((region) => {
						const isSelected = selectedRegion === region.id;
						return (
							<ListRow
								key={region.id}
								role="checkbox"
								aria-checked={isSelected}
								onClick={() => handleRegionSelect(region.id)}
								contents={
									<ListRow.Texts
										type="1RowTypeA"
										top={region.name}
										topProps={{ color: colors.grey700 }}
									/>
								}
								right={
									isSelected ? (
										<Checkbox.Line
											checked={true}
											size={20}
											aria-hidden={true}
											style={{ pointerEvents: "none" }}
										/>
									) : null
								}
							/>
						);
					})}
				</List>
			</div>

			<FixedBottomCTA
				disabled={selectedRegion === null}
				onClick={onNext}
				loading={false}
			>
				다음
			</FixedBottomCTA>
		</div>
	);
};

const OnboardingStep2 = () => {
	const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
	const navigate = useNavigate();

	const handleTopicToggle = (topicId: string) => {
		setSelectedTopics((prev) =>
			prev.includes(topicId)
				? prev.filter((id) => id !== topicId)
				: [...prev, topicId],
		);
	};

	const handleToMainPage = () => {
		navigate("/home");
	};

	return (
		<div className="flex-1 flex flex-col">
			<div className="flex-1 overflow-y-auto">
				<List>
					{topics.map((topic) => {
						const isSelected = selectedTopics.includes(topic.id);
						return (
							<ListRow
								key={topic.id}
								role="checkbox"
								aria-checked={isSelected}
								onClick={() => handleTopicToggle(topic.id)}
								left={
									topic.icon.type === "image" ? (
										<ListRow.AssetImage
											src={topic.icon.src || ""}
											shape="original"
											className="w-5.5 ml-1"
										/>
									) : (
										<ListRow.AssetIcon name={topic.icon.name || ""} />
									)
								}
								contents={
									<ListRow.Texts
										type="2RowTypeA"
										top={topic.name}
										topProps={{ color: colors.grey800, fontWeight: "semibold" }}
										bottom={topic.description}
										bottomProps={{ color: colors.grey500 }}
									/>
								}
								right={
									<Checkbox.Line
										checked={selectedTopics.includes(topic.id)}
										size={20}
										aria-hidden={true}
										style={{ pointerEvents: "none" }}
									/>
								}
								verticalPadding="large"
							/>
						);
					})}
				</List>
			</div>

			<FixedBottomCTA
				disabled={selectedTopics.length === 0}
				loading={false}
				onClick={handleToMainPage}
			>
				모두 선택했어요
			</FixedBottomCTA>
		</div>
	);
};

// 프로그레스바 컴포넌트
const OnboardingProgressBar = ({
	step,
	totalSteps,
}: {
	step: number;
	totalSteps: number;
}) => {
	const progress = (step - 1) / (totalSteps - 1) - 0.5;
	return <ProgressBar size="normal" color="#3182f6" progress={progress} />;
};

export const Onboarding = () => {
	const [step, setStep] = useState(1);
	const totalSteps = 2;

	const handleNext = () => {
		setStep(step + 1);
	};

	const getTitleText = () => {
		switch (step) {
			case 1:
				return "거주지를 선택해 주세요";
			case 2:
				return "평소 관심있는 주제를 모두 선택해 주세요";
			default:
				return "";
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<div className="sticky top-0 z-20 bg-white">
				<OnboardingProgressBar step={step} totalSteps={totalSteps} />
				<Top
					title={
						<Top.TitleParagraph size={22} color={colors.grey900}>
							{getTitleText()}
						</Top.TitleParagraph>
					}
					lowerGap={step === 2 ? 0 : undefined}
				/>
				{step === 2 && <div className="h-4" />}
			</div>
			<div className="flex-1 flex flex-col">
				{step === 1 && <OnboardingStep1 onNext={handleNext} />}
				{step === 2 && <OnboardingStep2 />}
			</div>
		</div>
	);
};
