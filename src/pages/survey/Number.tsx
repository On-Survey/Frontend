import { colors } from "@toss/tds-colors";
import {
	CTAButton,
	FixedBottomCTA,
	ProgressBar,
	TextField,
	Top,
} from "@toss/tds-mobile";
import { Controller, useForm } from "react-hook-form";
import { useSurveyNavigation } from "../../hooks/useSurveyNavigation";
import { validateNumberInput } from "../../utils/validators";

type FormData = {
	number: string;
};

export const SurveyNumber = () => {
	const {
		currentQuestion,
		currentAnswer,
		updateAnswer,
		progress,
		totalQuestions,
		currentQuestionIndex,
		submitting,
		handlePrev,
		handleNext,
	} = useSurveyNavigation({
		questionType: "number",
		validateAnswer: (answer) => answer.trim().length > 0,
	});

	const {
		control,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormData>({
		mode: "onChange",
		defaultValues: {
			number: currentAnswer,
		},
	});

	if (!currentQuestion) {
		return null;
	}

	const watchedValue = watch("number");
	const isRequired = currentQuestion.isRequired ?? false;
	const isInvalid =
		isRequired && (!watchedValue || watchedValue.trim().length === 0);

	const onSubmit = async (data: FormData) => {
		updateAnswer(currentQuestion.questionId, data.number);
		await handleNext();
	};

	return (
		<div className="flex flex-col w-full h-screen">
			<ProgressBar size="normal" color={colors.blue500} progress={progress} />

			<Top
				title={
					<Top.TitleParagraph size={22} color={colors.grey900}>
						{currentQuestion.title}
					</Top.TitleParagraph>
				}
				subtitleTop={
					currentQuestion.isRequired ? (
						<Top.SubtitleBadges
							badges={[{ text: "필수문항", color: "blue", variant: "fill" }]}
						/>
					) : undefined
				}
				subtitleBottom={
					currentQuestion.description ? (
						<Top.SubtitleParagraph size={15}>
							{currentQuestion.description}
						</Top.SubtitleParagraph>
					) : undefined
				}
			/>

			<Controller
				name="number"
				control={control}
				rules={{
					validate: (value) => {
						if (isRequired && (!value || value.trim().length === 0)) {
							return "필수 입력 항목입니다";
						}
						if (value && !validateNumberInput(value)) {
							return "1부터 100까지의 숫자만 입력할 수 있습니다";
						}
						return true;
					},
				}}
				render={({ field: { onChange, value } }) => (
					<TextField.Clearable
						variant="line"
						hasError={!!errors.number}
						label="숫자형"
						labelOption="sustain"
						value={value}
						onChange={(e) => {
							const val = e.target.value;
							if (validateNumberInput(val)) {
								onChange(val);
							}
						}}
						placeholder="1부터 100까지 입력할 수 있어요"
						type="tel"
						inputMode="numeric"
					/>
				)}
			/>

			<FixedBottomCTA.Double
				leftButton={
					<CTAButton
						color="dark"
						variant="weak"
						display="block"
						onClick={handlePrev}
					>
						이전
					</CTAButton>
				}
				rightButton={
					<CTAButton
						display="block"
						disabled={isInvalid || submitting}
						loading={submitting}
						onClick={handleSubmit(onSubmit)}
					>
						{currentQuestionIndex < totalQuestions - 1 ? "다음" : "제출"}
					</CTAButton>
				}
			/>
		</div>
	);
};

export default SurveyNumber;
