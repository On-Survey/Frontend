import { closeView } from "@apps-in-toss/web-framework";
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
import { useLocation, useNavigate } from "react-router-dom";
import { ExitConfirmDialog } from "../components/ExitConfirmDialog";
import { type RegionData, regions } from "../constants/regions";
import { type TopicData, topics } from "../constants/topics";
import { useUserInfo } from "../contexts/UserContext";
import { useModal } from "../hooks/UseToggle";
import { useBackEventListener } from "../hooks/useBackEventListener";
import { OnboardingApi } from "../service/onboading";
import type { LocationStateWithReturnTo } from "../types/navigation";
import { pushGtmEvent } from "../utils/gtm";

const OnboardingStep1 = ({
	onNext,
	selectedRegion,
	handleRegionSelect,
}: {
	onNext: () => void;
	selectedRegion: RegionData | null;
	handleRegionSelect: (region: RegionData) => void;
}) => {
	const {
		isOpen: isConfirmDialogOpen,
		handleOpen: handleConfirmDialogOpen,
		handleClose: handleConfirmDialogClose,
	} = useModal(false);

	const handleConfirmDialogCancel = () => {
		handleConfirmDialogClose();
	};

	const handleConfirmDialogConfirm = () => {
		handleConfirmDialogClose();
		closeView();
	};

	useBackEventListener(handleConfirmDialogOpen);

	return (
		<>
			<ExitConfirmDialog
				open={isConfirmDialogOpen}
				onCancel={handleConfirmDialogCancel}
				onConfirm={handleConfirmDialogConfirm}
			/>
			<div className="flex-1 flex flex-col">
				<div className="flex-1 overflow-y-auto">
					<List>
						{regions.map((region) => {
							const isSelected = selectedRegion?.id === region.id;
							return (
								<ListRow
									key={region.id}
									role="checkbox"
									aria-checked={isSelected}
									onClick={() => handleRegionSelect(region)}
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
					className="button-background-color-green"
				>
					다음
				</FixedBottomCTA>
			</div>
		</>
	);
};

const OnboardingStep2 = ({
	selectedRegion,
	selectedTopics,
	handleTopicToggle,
}: {
	selectedRegion: RegionData | null;
	selectedTopics: TopicData[];
	handleTopicToggle: (topic: TopicData) => void;
}) => {
	const navigate = useNavigate();
	const location = useLocation();
	const { fetchUserInfo } = useUserInfo();
	const returnTo = (location.state as LocationStateWithReturnTo)?.returnTo;

	const handleSubmit = async () => {
		if (!selectedRegion) return;

		const regionValue = selectedRegion.value;

		const topicValues = selectedTopics.map((topic) => topic.value);

		const response = await OnboardingApi({
			residence: regionValue,
			interests: topicValues,
		});

		if (response.success) {
			// 온보딩 완료 후 사용자 정보 갱신
			await fetchUserInfo();
			pushGtmEvent({
				event: "signup",
				pagePath: "/onboarding",
				signup: "로그인 유무",
			});

			// 원래 페이지로 돌아가거나 홈으로 이동
			if (returnTo) {
				navigate(returnTo.path, {
					replace: true,
					state: returnTo.state,
				});
			} else {
				navigate("/home", { replace: true });
			}
		}
	};

	return (
		<div className="flex-1 flex flex-col">
			<div className="flex-1 overflow-y-auto">
				<List>
					{topics.map((topic) => {
						const isSelected = selectedTopics.some(
							(selectedTopic) => selectedTopic.id === topic.id,
						);
						return (
							<ListRow
								key={topic.id}
								role="checkbox"
								aria-checked={isSelected}
								onClick={() => handleTopicToggle(topic)}
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
										checked={isSelected}
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
				onClick={handleSubmit}
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
	return <ProgressBar size="normal" color="#15c67f" progress={progress} />;
};

export const Onboarding = () => {
	const [step, setStep] = useState(1);
	const totalSteps = 2;

	const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
	const [selectedTopics, setSelectedTopics] = useState<TopicData[]>([]);

	const handleRegionSelect = (region: RegionData) => {
		setSelectedRegion(region);
	};

	const handleTopicToggle = (topic: TopicData) => {
		setSelectedTopics((prev) =>
			prev.some((selectedTopic) => selectedTopic.id === topic.id)
				? prev.filter((selectedTopic) => selectedTopic.id !== topic.id)
				: [...prev, topic],
		);
	};

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
				{step === 1 && (
					<OnboardingStep1
						onNext={handleNext}
						selectedRegion={selectedRegion}
						handleRegionSelect={handleRegionSelect}
					/>
				)}
				{step === 2 && (
					<OnboardingStep2
						selectedRegion={selectedRegion}
						selectedTopics={selectedTopics}
						handleTopicToggle={handleTopicToggle}
					/>
				)}
			</div>
		</div>
	);
};
