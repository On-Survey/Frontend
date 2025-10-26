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
	Survey,
	SurveyContextType,
	SurveyFormAction,
	SurveyFormState,
} from "../types/survey";

// 초기 상태
const initialState: SurveyFormState = {
	formData: {
		title: "",
		description: "",
		questions: [],
	},
	isDirty: false,
	isSubmitting: false,
	isLoading: false,
	error: null,
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
				formData: {
					...state.formData,
					title: action.payload,
				},
				isDirty: true,
			};

		case "SET_DESCRIPTION":
			return {
				...state,
				formData: {
					...state.formData,
					description: action.payload,
				},
				isDirty: true,
			};

		case "ADD_QUESTION":
			return {
				...state,
				formData: {
					...state.formData,
					questions: [...state.formData.questions, action.payload],
				},
				isDirty: true,
			};

		case "UPDATE_QUESTION":
			return {
				...state,
				formData: {
					...state.formData,
					questions: state.formData.questions.map((question) =>
						question.id === action.payload.id
							? { ...question, ...action.payload.question }
							: question,
					),
				},
				isDirty: true,
			};

		case "DELETE_QUESTION":
			return {
				...state,
				formData: {
					...state.formData,
					questions: state.formData.questions.filter(
						(question) => question.id !== action.payload,
					),
				},
				isDirty: true,
			};

		case "REORDER_QUESTIONS":
			return {
				...state,
				formData: {
					...state.formData,
					questions: action.payload,
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

		case "RESET_FORM":
			return initialState;

		case "LOAD_SURVEY":
			return {
				...state,
				formData: {
					title: action.payload.title,
					description: action.payload.description || "",
					questions: action.payload.questions,
				},
				isDirty: false,
				error: null,
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
	const addQuestion = useCallback((question: Question) => {
		dispatch({ type: "ADD_QUESTION", payload: question });
	}, []);

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

	const resetForm = useCallback(() => {
		dispatch({ type: "RESET_FORM" });
	}, []);

	const loadSurvey = useCallback((survey: Survey) => {
		dispatch({ type: "LOAD_SURVEY", payload: survey });
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
		resetForm,
		loadSurvey,
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
