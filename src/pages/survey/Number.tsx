import { colors } from "@toss/tds-colors";
import {
	CTAButton,
	FixedBottomCTA,
	ProgressBar,
	TextField,
	Top,
} from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { validateNumberInput } from "../../utils/validators";

type FormData = {
	number: string;
};

type Question = {
	id: number;
	title: string;
	required: boolean;
};

export const SurveyNumber = () => {
	const navigate = useNavigate();
	const [question, setQuestion] = useState<Question | null>(null);

	const {
		control,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormData>({
		mode: "onChange",
		defaultValues: {
			number: "",
		},
	});

	useEffect(() => {
		const mock: Question = {
			id: 601,
			title: "추석 당일, 오늘의 날씨 몇 도일까요?",
			required: true,
		};
		setQuestion(mock);
	}, []);

	const watchedValue = watch("number");
	const isRequired = question?.required ?? false;
	const isInvalid =
		isRequired && (!watchedValue || watchedValue.trim().length === 0);

	const onSubmit = () => {
		navigate("/survey/date");
	};

	return (
		<div className="flex flex-col w-full h-screen">
			<ProgressBar size="normal" color={colors.blue500} progress={0.25} />

			<Top
				title={
					<Top.TitleParagraph size={22} color={colors.grey900}>
						{question?.title ?? ""}
					</Top.TitleParagraph>
				}
				subtitleTop={
					question?.required ? (
						<Top.SubtitleBadges
							badges={[{ text: "선택", color: "blue", variant: "weak" }]}
						/>
					) : undefined
				}
				subtitleBottom={
					<Top.SubtitleParagraph size={15}>문항 설명</Top.SubtitleParagraph>
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
						onClick={() => navigate(-1)}
					>
						이전
					</CTAButton>
				}
				rightButton={
					<CTAButton
						display="block"
						disabled={isInvalid}
						onClick={handleSubmit(onSubmit)}
					>
						확인
					</CTAButton>
				}
			/>
		</div>
	);
};

export default SurveyNumber;
