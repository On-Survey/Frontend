import { adaptive } from "@toss/tds-colors";
import { ListHeader, Spacing, Text, TextField } from "@toss/tds-mobile";
import { useEffect, useRef, useState } from "react";
import type { TransformedSurveyQuestion } from "../../../service/surveyParticipation";

interface NumberQuestionProps {
	question: TransformedSurveyQuestion;
	answer?: string;
	onAnswerChange: (questionId: number, answer: string) => void;
	error?: boolean;
	errorMessage?: string;
}

export const NumberQuestion = ({
	question,
	answer = "",
	onAnswerChange,
	error,
	errorMessage,
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

	const isExpanded = true; // TODO: 접기/펼치기 상태 관리

	return (
		<>
			<ListHeader
				size="large"
				horizontalPadding="medium"
				verticalPadding="small"
				descriptionPosition="top"
				rightAlignment="center"
				a11yRightReflow={false}
				titleWidthRatio="fill"
				title={
					<ListHeader.TitleParagraph color={adaptive.grey800}>
						{question.title}
					</ListHeader.TitleParagraph>
				}
				description={
					<ListHeader.DescriptionParagraph>
						{getDescriptionText()}
					</ListHeader.DescriptionParagraph>
				}
				right={
					<ListHeader.RightIconButton
						aria-label={isExpanded ? "접기" : "펼치기"}
						src={
							isExpanded
								? "https://static.toss.im/icons/png/4x/icon-system-arrow-up-outlined.png"
								: "https://static.toss.im/icons/png/4x/icon-system-arrow-down-outlined.png"
						}
					/>
				}
			/>
			{question.description && (
				<Text
					display="block"
					color={adaptive.grey700}
					typography="t6"
					fontWeight="regular"
					className="px-4 mb-2"
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
						format="{textFieldFormat.price}"
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
							className="px-4 mt-2"
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
