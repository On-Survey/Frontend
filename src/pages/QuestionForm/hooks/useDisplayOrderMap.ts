import { useEffect, useRef, useState } from "react";
import type { Question } from "../../../types/survey";

interface UseDelayedDisplayOrderMapProps {
	questions: Question[];
	delay?: number;
}

export const useDelayedDisplayOrderMap = ({
	questions,
	delay = 600,
}: UseDelayedDisplayOrderMapProps) => {
	const [displayOrderMap, setDisplayOrderMap] = useState<
		Record<number, number>
	>({});
	const hasInitialized = useRef(false);

	useEffect(() => {
		const sortedQuestionsList = [...questions].sort(
			(a, b) => a.questionOrder - b.questionOrder,
		);

		const newOrderMap: Record<number, number> = {};
		sortedQuestionsList.forEach((question, index) => {
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
	}, [questions, delay]);

	return displayOrderMap;
};
