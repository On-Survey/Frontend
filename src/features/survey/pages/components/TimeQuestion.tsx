import { SurveyImage } from "@features/survey/components/SurveyImage";
import { TextWithLinks } from "@features/survey/components/TextWithLinks";
import type { TransformedSurveyQuestion } from "@features/survey/service/surveyParticipation";
import { adaptive } from "@toss/tds-colors";
import { Asset, ListHeader, Spacing, Text, TextField } from "@toss/tds-mobile";
import { useEffect, useMemo, useState } from "react";

interface TimeQuestionProps {
	question: TransformedSurveyQuestion;
	answer?: string;
	onAnswerChange: (questionId: number, answer: string) => void;
	error?: boolean;
	errorMessage?: string;
	isExpanded?: boolean;
	onToggleExpand?: () => void;
}

export const TimeQuestion = ({
	question,
	answer = "",
	onAnswerChange,
	error,
	errorMessage,
	isExpanded = true,
	onToggleExpand,
}: TimeQuestionProps) => {
	const [localAnswer, setLocalAnswer] = useState(answer);
	const [period, setPeriod] = useState<"AM" | "PM">("AM");
	const isInterval = question.isInterval === true;

	useEffect(() => {
		if (isInterval) {
			setLocalAnswer(answer);
			return;
		}

		if (!answer.trim()) {
			setLocalAnswer("");
			setPeriod("AM");
			return;
		}

		const normalized = answer.replace(/^오전/, "AM").replace(/^오후/, "PM");
		if (normalized.startsWith("AM ") || normalized.startsWith("PM ")) {
			const [nextPeriod, timePart = ""] = normalized.split(" ");
			setPeriod(nextPeriod === "PM" ? "PM" : "AM");
			setLocalAnswer(timePart);
			return;
		}

		setLocalAnswer(normalized);
	}, [answer, isInterval]);

	const formatTimeInput = (raw: string) => {
		const maxDigits = isInterval ? 6 : 4;
		const digitsOnly = raw.replace(/\D/g, "").slice(0, maxDigits);
		if (!digitsOnly) return "";
		if (!isInterval) {
			if (digitsOnly.length <= 2) return digitsOnly;
			return `${digitsOnly.slice(0, 2)}:${digitsOnly.slice(2)}`;
		}
		if (digitsOnly.length <= 2) return digitsOnly;
		if (digitsOnly.length <= 4) {
			return `${digitsOnly.slice(0, 2)}:${digitsOnly.slice(2)}`;
		}
		return `${digitsOnly.slice(0, 2)}:${digitsOnly.slice(2, 4)}:${digitsOnly.slice(4)}`;
	};

	const handleChange = (nextValue: string) => {
		const formatted = formatTimeInput(nextValue);
		setLocalAnswer(formatted);
		if (isInterval) {
			onAnswerChange(question.questionId, formatted);
			return;
		}
		onAnswerChange(
			question.questionId,
			formatted ? `${period} ${formatted}` : "",
		);
	};

	const handlePeriodChange = (nextPeriod: "AM" | "PM") => {
		setPeriod(nextPeriod);
		if (!isInterval && localAnswer) {
			onAnswerChange(question.questionId, `${nextPeriod} ${localAnswer}`);
		}
	};

	const localValidationMessage = useMemo(() => {
		if (!localAnswer) return "";

		const parts = localAnswer.split(":");
		if (isInterval) {
			if (parts.length < 3) return "";
			if (parts.some((part) => part.length !== 2)) {
				return "HH:MM:SS 형식으로 입력해 주세요";
			}
			const [hourStr, minuteStr, secondStr] = parts;
			const hour = Number.parseInt(hourStr, 10);
			const minute = Number.parseInt(minuteStr, 10);
			const second = Number.parseInt(secondStr, 10);
			if (hour < 0 || hour > 23) return "시는 00~23 범위로 입력해 주세요";
			if (minute < 0 || minute > 59) return "분은 00~59 범위로 입력해 주세요";
			if (second < 0 || second > 59) return "초는 00~59 범위로 입력해 주세요";
			return "";
		}

		if (parts.length < 2) return "";
		if (parts.some((part) => part.length !== 2)) {
			return "HH:MM 형식으로 입력해 주세요";
		}
		const [hourStr, minuteStr] = parts;
		const hour = Number.parseInt(hourStr, 10);
		const minute = Number.parseInt(minuteStr, 10);
		if (hour < 1 || hour > 12) return "시는 01~12 범위로 입력해 주세요";
		if (minute < 0 || minute > 59) return "분은 00~59 범위로 입력해 주세요";
		return "";
	}, [isInterval, localAnswer]);

	return (
		<>
			<ListHeader
				descriptionPosition="top"
				title={
					<ListHeader.TitleParagraph
						color={adaptive.grey800}
						fontWeight="bold"
						typography="t4"
					>
						<TextWithLinks
							text={question.title}
							variant="inline"
							inheritLinkSize
						/>
					</ListHeader.TitleParagraph>
				}
				description={
					<ListHeader.DescriptionParagraph>
						{question.isRequired ? "필수" : "선택"}
					</ListHeader.DescriptionParagraph>
				}
				right={
					<div style={{ marginRight: "20px" }}>
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW24}
							name={isExpanded ? "icon-arrow-up-mono" : "icon-arrow-down-mono"}
							color={adaptive.grey600}
							aria-label={isExpanded ? "접기" : "펼치기"}
							onClick={onToggleExpand}
						/>
					</div>
				}
			/>
			{question.description && (
				<div className="px-6! mb-2!">
					<TextWithLinks text={question.description} />
				</div>
			)}
			{isExpanded && question.imageUrl && (
				<div className="px-6 mt-2 mb-2">
					<SurveyImage
						src={question.imageUrl}
						alt={question.title}
						variant="square"
					/>
				</div>
			)}
			{isExpanded && (
				<>
					{!isInterval && (
						<div className="px-6! mb-2!">
							<div className="inline-flex rounded-lg bg-gray-100 p-1">
								<button
									type="button"
									className={`h-8 px-4 rounded-md text-sm ${
										period === "AM" ? "bg-white text-gray-900" : "text-gray-500"
									}`}
									onClick={() => handlePeriodChange("AM")}
								>
									AM
								</button>
								<button
									type="button"
									className={`h-8 px-4 rounded-md text-sm ${
										period === "PM" ? "bg-white text-gray-900" : "text-gray-500"
									}`}
									onClick={() => handlePeriodChange("PM")}
								>
									PM
								</button>
							</div>
						</div>
					)}
					<TextField.Clearable
						variant="line"
						hasError={Boolean(error || localValidationMessage)}
						label="시간"
						labelOption="sustain"
						value={localAnswer}
						placeholder={isInterval ? "HH:MM:SS" : "HH:MM"}
						type="tel"
						inputMode="numeric"
						onChange={(e) => handleChange(e.target.value)}
					/>
					{(localValidationMessage || (error && errorMessage)) && (
						<Text
							display="block"
							color={adaptive.red500}
							typography="t7"
							fontWeight="regular"
							className="px-6! mt-2!"
						>
							{localValidationMessage || errorMessage}
						</Text>
					)}
				</>
			)}
			<Spacing size={32} />
		</>
	);
};
