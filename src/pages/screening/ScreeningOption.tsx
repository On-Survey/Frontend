import { adaptive } from "@toss/tds-colors";
import { Asset, FixedBottomCTA, Top } from "@toss/tds-mobile";
import { useLocation } from "react-router-dom";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { useSurvey } from "../../contexts/SurveyContext";
import { useBackEventListener } from "../../hooks/useBackEventListener";
import { pushGtmEvent } from "../../utils/gtm";
import { useCreateScreenings } from "../QuestionForm/hooks/useQuestionMutations";

export const ScreeningOption = () => {
	const { goNextScreening, goPrevScreening } = useMultiStep();
	const { state, setScreeningAnswerType } = useSurvey();
	const { mutate: createScreenings } = useCreateScreenings();
	const location = useLocation();
	const selected = state.screening.answerType;

	const locationState = location.state as
		| { source?: "main_cta" | "mysurvey_button" | "mysurvey_edit" }
		| undefined;

	const handleSelectedChange = (answerType: "O" | "X") => {
		setScreeningAnswerType(answerType);
	};

	const handleNext = () => {
		if (!selected) return;
		createScreenings(
			{
				surveyId: state.surveyId ?? 0,
				content: state.screening.question,
				answer: selected === "O",
			},
			{
				onSuccess: (result) => {
					if (result.success) {
						const source = locationState?.source ?? "main_cta";

						pushGtmEvent({
							event: "screening_question",
							pagePath: "/createForm",
							source,
							step: "confirm",
							...(state.surveyId && { survey_id: String(state.surveyId) }),
							screening_condition: selected,
						});

						goNextScreening();
					}
				},
				onError: (error) => {
					console.error("스크리닝 생성 실패:", error);
				},
			},
		);
	};

	useBackEventListener(goPrevScreening);

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						참여 조건 설정하기
					</Top.TitleParagraph>
				}
				subtitleBottom={
					<Top.SubtitleParagraph size={15}>
						이 질문에 대해 참여 가능한 답변(O/X)을 선택해주세요. 선택한 답변을
						한 응답자만 다음 단계로 진행해요.
					</Top.SubtitleParagraph>
				}
			/>

			<div className="flex gap-4 w-full px-6">
				<div className="flex justify-center w-full items-center gap-2">
					<button
						type="button"
						aria-label="O"
						onClick={() => handleSelectedChange("O")}
						className={`flex justify-center  items-center p-4 transition-colors gap-3 cursor-pointer w-full rounded-2xl! ${
							selected === "O" ? "bg-blue-200" : "bg-blue-100 hover:bg-blue-200"
						}`}
					>
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW24}
							backgroundColor="transparent"
							name="icon-o-mono"
							color={adaptive.blue500}
							aria-hidden={true}
							ratio="1/1"
						/>
					</button>
				</div>

				<div className="flex justify-center w-full items-center gap-2">
					<button
						type="button"
						aria-label="X"
						onClick={() => handleSelectedChange("X")}
						className={`flex justify-center items-center p-4 transition-colors gap-3 cursor-pointer w-full rounded-2xl! ${
							selected === "X" ? "bg-red-200" : "bg-red-100 hover:bg-red-200"
						}`}
					>
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW24}
							backgroundColor="transparent"
							name="icon-x-mono"
							color={adaptive.red500}
							aria-hidden={true}
							ratio="1/1"
						/>
					</button>
				</div>
			</div>

			<FixedBottomCTA loading={false} disabled={!selected} onClick={handleNext}>
				다음
			</FixedBottomCTA>
		</>
	);
};
