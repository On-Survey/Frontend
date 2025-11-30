import { useCallback, useMemo } from "react";
import type { Question } from "../../../types/survey";

interface UseQuestionReorderProps {
	questions: Question[];
	onReorder: (questions: Question[]) => void;
}

export const useQuestionReorder = ({
	questions,
	onReorder,
}: UseQuestionReorderProps) => {
	const sortedQuestions = useMemo(
		() => [...questions].sort((a, b) => a.questionOrder - b.questionOrder),
		[questions],
	);

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
		handleMoveUp,
		handleMoveDown,
	};
};
