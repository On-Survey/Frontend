import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useReducer,
} from "react";
import type {
	Question,
	QuestionUpdateData,
	ScreeningAnswerType,
	ScreeningInfo,
	Survey,
	SurveyContextType,
	SurveyFormAction,
	SurveyFormState,
	TopicInfo,
} from "../types/survey";

// 초기 상태
const initialState: SurveyFormState = {
	surveyId: null,
	survey: {
		title: "",
		description: "",
		question: [],
	},
	isDirty: false,
	isSubmitting: false,
	isLoading: false,
	error: null,
	titleStepCompleted: false,
	screening: {
		enabled: false,
		question: "",
		answerType: null,
	},
	topics: [],
};

// 리듀서 함수
function surveyFormReducer(
	state: SurveyFormState,
	action: SurveyFormAction,
): SurveyFormState {
	switch (action.type) {
		case "SET_TITLE":
			return {
				...state,
				survey: {
					...state.survey,
					title: action.payload,
				},
				isDirty: true,
			};

		case "SET_DESCRIPTION":
			return {
				...state,
				survey: {
					...state.survey,
					description: action.payload,
				},
				isDirty: true,
			};

		case "ADD_QUESTION":
			return {
				...state,
				survey: {
					...state.survey,
					question: [...state.survey.question, action.payload],
				},
				isDirty: true,
			};

		case "UPDATE_QUESTION":
			return {
				...state,
				survey: {
					...state.survey,
					question: state.survey.question.map((question) =>
						question.questionId.toString() === action.payload.id
							? { ...question, ...action.payload.question }
							: question,
					),
				},
				isDirty: true,
			};

		case "DELETE_QUESTION":
			return {
				...state,
				survey: {
					...state.survey,
					question: state.survey.question.filter(
						(question) => question.questionId.toString() !== action.payload,
					),
				},
				isDirty: true,
			};

		case "REORDER_QUESTIONS":
			return {
				...state,
				survey: {
					...state.survey,
					question: action.payload,
				},
				isDirty: true,
			};

		case "SET_LOADING":
			return {
				...state,
				isLoading: action.payload,
			};

		case "SET_SUBMITTING":
			return {
				...state,
				isSubmitting: action.payload,
			};

		case "SET_ERROR":
			return {
				...state,
				error: action.payload,
			};

		case "SET_DIRTY":
			return {
				...state,
				isDirty: action.payload,
			};

		case "SET_TITLE_STEP_COMPLETED":
			return {
				...state,
				titleStepCompleted: action.payload,
			};

		case "SET_SCREENING_ENABLED":
			return {
				...state,
				screening: {
					...state.screening,
					enabled: action.payload,
				},
				isDirty: true,
			};

		case "SET_SCREENING_QUESTION":
			return {
				...state,
				screening: {
					...state.screening,
					question: action.payload,
				},
				isDirty: true,
			};

		case "SET_SCREENING_ANSWER_TYPE":
			return {
				...state,
				screening: {
					...state.screening,
					answerType: action.payload,
				},
				isDirty: true,
			};

		case "SET_SCREENING":
			return {
				...state,
				screening: action.payload,
				isDirty: true,
			};

		case "SET_TOPICS":
			return {
				...state,
				topics: action.payload,
				isDirty: true,
			};

		case "ADD_TOPIC":
			return {
				...state,
				topics: [...state.topics, action.payload],
				isDirty: true,
			};

		case "REMOVE_TOPIC":
			return {
				...state,
				topics: state.topics.filter((topic) => topic.id !== action.payload),
				isDirty: true,
			};
		case "RESET_FORM":
			return initialState;

		case "LOAD_SURVEY":
			return {
				...state,
				survey: action.payload,
				isDirty: false,
				error: null,
			};

		case "SET_SURVEY_ID":
			return {
				...state,
				surveyId: action.payload,
			};

		default:
			return state;
	}
}

// Context 생성
const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

// Provider 컴포넌트
interface SurveyProviderProps {
	children: ReactNode;
}

export function SurveyProvider({ children }: SurveyProviderProps) {
	const [state, dispatch] = useReducer(surveyFormReducer, initialState);

	// 편의 함수들
	const addQuestion = useCallback(
		(question: Question) => {
			// 기존 질문들의 최대 questionOrder 값을 찾아서 +1
			const maxOrder = state.survey.question.reduce(
				(max, q) => Math.max(max, q.questionOrder),
				-1,
			);
			const questionWithOrder = { ...question, questionOrder: maxOrder + 1 };
			dispatch({ type: "ADD_QUESTION", payload: questionWithOrder });
		},
		[state.survey.question],
	);

	const updateQuestion = useCallback(
		(id: string, question: QuestionUpdateData) => {
			dispatch({ type: "UPDATE_QUESTION", payload: { id, question } });
		},
		[],
	);

	const deleteQuestion = useCallback((id: string) => {
		dispatch({ type: "DELETE_QUESTION", payload: id });
	}, []);

	const reorderQuestions = useCallback((questions: Question[]) => {
		dispatch({ type: "REORDER_QUESTIONS", payload: questions });
	}, []);

	const setTitle = useCallback((title: string) => {
		dispatch({ type: "SET_TITLE", payload: title });
	}, []);

	const setDescription = useCallback((description: string) => {
		dispatch({ type: "SET_DESCRIPTION", payload: description });
	}, []);

	const setTitleStepCompleted = useCallback((completed: boolean) => {
		dispatch({ type: "SET_TITLE_STEP_COMPLETED", payload: completed });
	}, []);

	const setScreeningEnabled = useCallback((enabled: boolean) => {
		dispatch({ type: "SET_SCREENING_ENABLED", payload: enabled });
	}, []);

	const setScreeningQuestion = useCallback((question: string) => {
		dispatch({ type: "SET_SCREENING_QUESTION", payload: question });
	}, []);

	const setScreeningAnswerType = useCallback(
		(answerType: ScreeningAnswerType | null) => {
			dispatch({ type: "SET_SCREENING_ANSWER_TYPE", payload: answerType });
		},
		[],
	);

	const setScreening = useCallback((screening: ScreeningInfo) => {
		dispatch({ type: "SET_SCREENING", payload: screening });
	}, []);

	const setTopics = useCallback((topics: TopicInfo[]) => {
		dispatch({ type: "SET_TOPICS", payload: topics });
	}, []);

	const addTopic = useCallback((topic: TopicInfo) => {
		dispatch({ type: "ADD_TOPIC", payload: topic });
	}, []);

	const removeTopic = useCallback((topicId: string) => {
		dispatch({ type: "REMOVE_TOPIC", payload: topicId });
	}, []);

	const resetForm = useCallback(() => {
		dispatch({ type: "RESET_FORM" });
	}, []);

	const loadSurvey = useCallback((survey: Survey) => {
		dispatch({ type: "LOAD_SURVEY", payload: survey });
	}, []);

	const setSurveyId = useCallback((surveyId: number) => {
		dispatch({ type: "SET_SURVEY_ID", payload: surveyId });
	}, []);

	const contextValue: SurveyContextType = {
		state,
		dispatch,
		addQuestion,
		updateQuestion,
		deleteQuestion,
		reorderQuestions,
		setTitle,
		setDescription,
		setTitleStepCompleted,
		setScreeningEnabled,
		setScreeningQuestion,
		setScreeningAnswerType,
		setScreening,
		setTopics,
		addTopic,
		removeTopic,
		resetForm,
		loadSurvey,
		setSurveyId,
	};

	return (
		<SurveyContext.Provider value={contextValue}>
			{children}
		</SurveyContext.Provider>
	);
}

// 커스텀 훅
export function useSurvey() {
	const context = useContext(SurveyContext);
	if (context === undefined) {
		throw new Error("useSurvey must be used within a SurveyProvider");
	}
	return context;
}
