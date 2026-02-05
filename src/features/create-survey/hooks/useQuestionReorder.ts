import type { Question } from "@shared/types/survey";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseQuestionReorderProps {
	questions: Question[];
	onReorder: (questions: Question[]) => void;
	delay?: number;
}

export const useQuestionReorder = ({
	questions,
	onReorder,
	delay = 600,
}: UseQuestionReorderProps) => {
	const sortedQuestions = useMemo(
		() => [...questions].sort((a, b) => a.questionOrder - b.questionOrder),
		[questions],
	);

	const [displayOrderMap, setDisplayOrderMap] = useState<
		Record<number, number>
	>({});
	const hasInitialized = useRef(false);

	useEffect(() => {
		const newOrderMap: Record<number, number> = {};
		sortedQuestions.forEach((question, index) => {
			newOrderMap[question.questionId] = index;
		});

		if (!hasInitialized.current) {
			setDisplayOrderMap(newOrderMap);
			hasInitialized.current = true;
			return;
		}

		const timer = window.setTimeout(() => {
			setDisplayOrderMap(newOrderMap);
		}, delay);

		return () => {
			window.clearTimeout(timer);
		};
	}, [sortedQuestions, delay]);

	const handleMoveUp = useCallback(
		(e: React.MouseEvent, currentIndex: number) => {
			e.stopPropagation();
			if (currentIndex === 0) return;

			const newQuestions = [...sortedQuestions];
			const temp = newQuestions[currentIndex];
			newQuestions[currentIndex] = newQuestions[currentIndex - 1];
			newQuestions[currentIndex - 1] = temp;

			const updatedQuestions = newQuestions.map((question, index) => ({
				...question,
				questionOrder: index,
			}));

			onReorder(updatedQuestions);
		},
		[sortedQuestions, onReorder],
	);

	const handleMoveDown = useCallback(
		(e: React.MouseEvent, currentIndex: number) => {
			e.stopPropagation();
			if (currentIndex === sortedQuestions.length - 1) return;

			const newQuestions = [...sortedQuestions];
			const temp = newQuestions[currentIndex];
			newQuestions[currentIndex] = newQuestions[currentIndex + 1];
			newQuestions[currentIndex + 1] = temp;

			const updatedQuestions = newQuestions.map((question, index) => ({
				...question,
				questionOrder: index,
			}));

			onReorder(updatedQuestions);
		},
		[sortedQuestions, onReorder],
	);

	return {
		sortedQuestions,
		displayOrderMap,
		handleMoveUp,
		handleMoveDown,
	};
};
