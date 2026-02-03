import type { TransformedSurveyQuestion } from "@features/survey/service/surveyParticipation";
import { adaptive } from "@toss/tds-colors";
import { Asset, ListHeader, Spacing, Text, TextField } from "@toss/tds-mobile";
import { useEffect, useRef, useState } from "react";

interface NumberQuestionProps {
	question: TransformedSurveyQuestion;
	answer?: string;
	onAnswerChange: (questionId: number, answer: string) => void;
	error?: boolean;
	errorMessage?: string;
	isExpanded?: boolean;
	onToggleExpand?: () => void;
}

export const NumberQuestion = ({
	question,
	answer = "",
	onAnswerChange,
	error,
	errorMessage,
	isExpanded = true,
	onToggleExpand,
}: NumberQuestionProps) => {
	const [localAnswer, setLocalAnswer] = useState(answer);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setLocalAnswer(answer);
	}, [answer]);

	const handleChange = (value: string) => {
		// 숫자만 입력 가능하도록 제한
		const numericValue = value.replace(/[^\d]/g, "");
		setLocalAnswer(numericValue);
		onAnswerChange(question.questionId, numericValue);
	};

	const handleFocus = () => {
		// 포커스 시 스크롤 이동 (상단 30% 지점)
		setTimeout(() => {
			if (containerRef.current) {
				const element = containerRef.current;
				const elementTop = element.getBoundingClientRect().top;
				const viewportHeight = window.innerHeight;
				const targetPosition = viewportHeight * 0.3;
				const scrollOffset = elementTop - targetPosition;

				window.scrollBy({
					top: scrollOffset,
					behavior: "smooth",
				});
			}
		}, 100);
	};

	const getDescriptionText = () => {
		return question.isRequired ? "필수" : "선택";
	};

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
						{question.title}
					</ListHeader.TitleParagraph>
				}
				description={
					<ListHeader.DescriptionParagraph>
						{getDescriptionText()}
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
				<Text
					display="block"
					color={adaptive.grey700}
					typography="t6"
					fontWeight="regular"
					className="px-6! mb-2!"
				>
					{question.description}
				</Text>
			)}
			{isExpanded && (
				<div ref={containerRef}>
					<TextField.Clearable
						variant="line"
						hasError={error}
						label="숫자형"
						labelOption="sustain"
						value={localAnswer}
						placeholder="1부터 100까지 입력할 수 있어요"
						type="tel"
						inputMode="numeric"
						onChange={(e) => handleChange(e.target.value)}
						onFocus={handleFocus}
					/>
					{error && errorMessage && (
						<Text
							display="block"
							color={adaptive.red500}
							typography="t7"
							fontWeight="regular"
							className="ml-5 px-4 mt-2"
						>
							{errorMessage}
						</Text>
					)}
				</div>
			)}
			<Spacing size={32} />
		</>
	);
};
