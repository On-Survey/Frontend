import { adaptive } from "@toss/tds-colors";
import { FixedBottomCTA, TextArea, Top } from "@toss/tds-mobile";
import { useCreateForm } from "../../contexts/CreateFormContext";
import { useSurvey } from "../../contexts/SurveyContext";

function FormTitleStep() {
	const { state, setTitle, setDescription, setTitleStepCompleted } =
		useSurvey();
	const { handleStepChange } = useCreateForm();

	const step = state.titleStepCompleted;

	const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setTitle(e.target.value);
	};
	const handleDescriptionChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		setDescription(e.target.value);
	};

	const handleNext = () => {
		setTitleStepCompleted(true);
	};
	const handleNextPage = () => {
		handleStepChange(1);
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
					hasError={false}
					label="상세 설명"
					help="50자 이내로 작성할 수 있어요"
					value={state.formData.description}
					placeholder="상세 설명"
					onChange={handleDescriptionChange}
					autoFocus={step}
				/>
			</div>

			<div
				className={`transition-transform duration-300 ease-in-out ${
					step ? "-translate-y-1" : "translate-y-0"
				}`}
			>
				<TextArea
					variant="line"
					hasError={false}
					label="제목"
					value={state.formData.title}
					placeholder="제목"
					onChange={handleTitleChange}
				/>
			</div>

			{!step && <FixedBottomCTA onClick={handleNext}>확인</FixedBottomCTA>}
			{step && <FixedBottomCTA onClick={handleNextPage}>확인</FixedBottomCTA>}
		</>
	);
}

export default FormTitleStep;
