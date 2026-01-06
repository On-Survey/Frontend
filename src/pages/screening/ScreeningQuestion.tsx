import { adaptive } from "@toss/tds-colors";
import { FixedBottomCTA, TextField, Top } from "@toss/tds-mobile";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { useSurvey } from "../../contexts/SurveyContext";
import { useBackEventListener } from "../../hooks/useBackEventListener";

export const ScreeningQuestion = () => {
	const { goNextScreening, setSurveyStep } = useMultiStep();
	const { state, setScreeningQuestion } = useSurvey();

	const question = state.screening.question;

	const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setScreeningQuestion(e.target.value);
	};

	useBackEventListener(() => setSurveyStep(1));

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						스크리닝 질문 구성하기
					</Top.TitleParagraph>
				}
				subtitleBottom={
					<Top.SubtitleParagraph size={15}>
						설문에 맞는 참여자를 선별할 수 있도록 OX 질문을 만들어주세요.
					</Top.SubtitleParagraph>
				}
			/>
			<TextField.Clearable
				variant="line"
				hasError={false}
				label="질문"
				labelOption="sustain"
				help="짧고 명확한 질문일수록 효과적이에요"
				value={question}
				placeholder="질문을 입력해주세요"
				autoFocus={true}
				onChange={handleQuestionChange}
			/>
			<FixedBottomCTA
				disabled={!question.trim()}
				onClick={goNextScreening}
				style={
					{ "--button-background-color": "#15c67f" } as React.CSSProperties
				}
			>
				다음
			</FixedBottomCTA>
		</>
	);
};
