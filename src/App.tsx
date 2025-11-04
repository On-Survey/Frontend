import {
	Outlet,
	Route,
	BrowserRouter as Router,
	Routes,
} from "react-router-dom";
import { CreateFormProvider } from "./contexts/CreateFormContext";
import { SurveyProvider } from "./contexts/SurveyContext";
import {
	CreateForm,
	DatePage,
	Home,
	Intro,
	LongAnswerPage,
	Main,
	MultipleChoiceMain,
	MultipleChoicePage,
	MySurvey,
	NPSPage,
	NumberPage,
	Onboarding,
	OXquiz,
	OXquizDetail,
	QuestionListPage,
	QuestionOptionsPage,
	RatingPage,
	ShortAnswerPage,
	Survey,
} from "./pages";

export const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Intro />} />
				<Route path="/home" element={<Home />} />
				<Route path="/onboarding" element={<Onboarding />} />
				<Route path="/main" element={<Main />} />
				<Route path="/mysurvey" element={<MySurvey />} />
				<Route path="/OXquiz" element={<OXquiz />} />
				<Route path="/oxquiz-detail" element={<OXquizDetail />} />
				<Route path="/survey" element={<Survey />} />
				<Route element={<SurveyProviderLayout />}>
					<Route path="/createForm" element={<CreateFormProviderWrapper />} />
					<Route
						path="/createForm/multipleChoice"
						element={<MultipleChoicePage />}
					>
						<Route index element={<MultipleChoiceMain />} />
						<Route path="questions" element={<QuestionListPage />} />
						<Route
							path="questions/:questionId"
							element={<QuestionOptionsPage />}
						/>
					</Route>
					<Route path="/createForm/rating" element={<RatingPage />} />
					<Route path="/createForm/nps" element={<NPSPage />} />
					<Route path="/createForm/shortAnswer" element={<ShortAnswerPage />} />
					<Route path="/createForm/longAnswer" element={<LongAnswerPage />} />
					<Route path="/createForm/date" element={<DatePage />} />
					<Route path="/createForm/number" element={<NumberPage />} />
					<Route path="/form" element={<CreateFormProviderWrapper />} />
				</Route>
			</Routes>
		</Router>
	);
};

const SurveyProviderLayout = () => (
	<SurveyProvider>
		<Outlet />
	</SurveyProvider>
);

const CreateFormProviderWrapper = () => (
	<CreateFormProvider>
		<CreateForm />
	</CreateFormProvider>
);
