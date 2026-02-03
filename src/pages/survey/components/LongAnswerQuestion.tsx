import { adaptive } from "@toss/tds-colors";
import { Asset, ListHeader, Spacing, Text, TextArea } from "@toss/tds-mobile";
import { useEffect, useRef, useState } from "react";
import type { TransformedSurveyQuestion } from "../../../service/surveyParticipation";

interface LongAnswerQuestionProps {
	question: TransformedSurveyQuestion;
	answer?: string;
	onAnswerChange: (questionId: number, answer: string) => void;
	error?: boolean;
	errorMessage?: string;
	isExpanded?: boolean;
	onToggleExpand?: () => void;
}

const MAX_LENGTH = 500;

export const LongAnswerQuestion = ({
	question,
	answer = "",
	onAnswerChange,
	error,
	errorMessage,
	isExpanded = true,
	onToggleExpand,
}: LongAnswerQuestionProps) => {
	const [localAnswer, setLocalAnswer] = useState(answer);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setLocalAnswer(answer);
	}, [answer]);

	const handleChange = (value: string) => {
		const trimmedValue = value.slice(0, MAX_LENGTH);
		setLocalAnswer(trimmedValue);
		onAnswerChange(question.questionId, trimmedValue);
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
					<TextArea
						variant="box"
						hasError={error}
						label=""
						labelOption="sustain"
						help={`최대 ${MAX_LENGTH}글자까지 쓸 수 있어요`}
						value={localAnswer}
						placeholder="내용을 입력해주세요"
						height={128}
						onChange={(e) => handleChange(e.target.value)}
						onFocus={handleFocus}
					/>
					{error && errorMessage && (
						<Text
							display="block"
							color={adaptive.red500}
							typography="t7"
							fontWeight="regular"
							className="px-6! mt-2!"
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
