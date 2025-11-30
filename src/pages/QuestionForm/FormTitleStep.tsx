import { adaptive } from "@toss/tds-colors";
import { FixedBottomCTA, TextArea, Top } from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { useSurvey } from "../../contexts/SurveyContext";
import { useCreateSurvey, usePatchSurvey } from "./hooks/useSurveyMutation";

export const FormTitleStep = () => {
	const { state, setTitle, setDescription, setSurveyId } = useSurvey();
	const { setSurveyStep } = useMultiStep();
	const { mutate: createSurvey, isPending: isCreateSurveyPending } =
		useCreateSurvey();
	const { mutate: patchSurvey, isPending: isPatchSurveyPending } =
		usePatchSurvey();

	const [step, setStep] = useState(false);

	useEffect(() => {
		if (!step && state.survey.title.trim() && state.survey.description.trim()) {
			setStep(true);
		}
	}, [step, state.survey.title, state.survey.description]);

	const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setTitle(e.target.value);
	};
	const handleDescriptionChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		setDescription(e.target.value);
	};

	const handleNext = () => {
		setStep(true);
	};

	const handleNextPage = async () => {
		if (isCreateSurveyPending || isPatchSurveyPending) return;

		if (state.surveyId) {
			// 수정 모드
			patchSurvey(
				{
					surveyId: state.surveyId,
					title: state.survey.title,
					description: state.survey.description,
				},
				{
					onSuccess: (data) => {
						setSurveyId(data.result.surveyId);
						setSurveyStep(1);
					},
					onError: (error) => {
						console.error("설문 수정 실패:", error);
					},
				},
			);
		} else {
			// 생성 모드
			createSurvey(
				{
					title: state.survey.title,
					description: state.survey.description,
				},
				{
					onSuccess: (data) => {
						setSurveyId(data.result.surveyId);
						setSurveyStep(1);
					},
					onError: (error) => {
						console.error("설문 생성 실패:", error);
					},
				},
			);
		}
	};

	return (
		<>
			<div
				className={`transition-all duration-300 ease-in-out ${
					step ? "-translate-y-3 opacity-80" : "translate-y-0 opacity-100"
				}`}
			>
				<Top
					title={
						<Top.TitleParagraph size={22} color={adaptive.grey900}>
							시작 정보를 입력해주세요
						</Top.TitleParagraph>
					}
					subtitleBottom={
						<Top.SubtitleParagraph size={15}>
							고객이 설문의 목표를 명확하게 인지할 수 있도록 짧지만 간결한
							설명을 작성해주세요.
						</Top.SubtitleParagraph>
					}
					lowerGap={0}
				/>
			</div>

			<div
				className={`transition-all duration-300 ease-out overflow-hidden ${
					step
						? "translate-y-0 opacity-100 max-h-96"
						: "translate-y-4 opacity-0 max-h-0"
				}`}
			>
				<TextArea
					variant="line"
					label="상세 설명"
					help="200자 이내로 작성할 수 있어요"
					value={state.survey.description}
					placeholder="상세 설명"
					onChange={handleDescriptionChange}
					autoFocus={step}
					maxLength={200}
				/>
			</div>

			<div
				className={`transition-transform duration-300 ease-in-out ${
					step ? "-translate-y-1" : "translate-y-0"
				}`}
			>
				<TextArea
					variant="line"
					label="제목"
					value={state.survey.title}
					placeholder="제목"
					onChange={handleTitleChange}
					maxLength={50}
					autoFocus={!step}
				/>
			</div>

			{!step && (
				<FixedBottomCTA
					disabled={!state.survey.title.trim()}
					onClick={handleNext}
				>
					확인
				</FixedBottomCTA>
			)}
			{step && (
				<FixedBottomCTA
					disabled={
						isCreateSurveyPending ||
						isPatchSurveyPending ||
						!state.survey.description.trim()
					}
					onClick={handleNextPage}
				>
					확인
				</FixedBottomCTA>
			)}
		</>
	);
};
