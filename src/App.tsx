import {
	Outlet,
	Route,
	BrowserRouter as Router,
	Routes,
} from "react-router-dom";
import { CreateFormProvider } from "./contexts/CreateFormContext";
import { SurveyProvider } from "./contexts/SurveyContext";
import { CreateForm } from "./pages/CreateForm";
import { CreateFormStart } from "./pages/CreateFormStart";
import DatePage from "./pages/form/DatePage";
import LongAnswerPage from "./pages/form/LongAnswerPage";
import MultipleChoiceMain from "./pages/form/multipleChoice/MultipleChoiceMain";
import MultipleChoicePage from "./pages/form/multipleChoice/MultipleChoicePage";
import QuestionListPage from "./pages/form/multipleChoice/QuestionListPage";
import QuestionOptionsPage from "./pages/form/multipleChoice/QuestionOptionsPage";
import NPSPage from "./pages/form/NPSPage";
import NumberPage from "./pages/form/NumberPage";
import RatingPage from "./pages/form/RatingPage";
import ShortAnswerPage from "./pages/form/ShortAnswerPage";
import { Home } from "./pages/Home";
import { Intro } from "./pages/Intro";
import { Main } from "./pages/Main";
import { MySurvey } from "./pages/mysurvey";
import { Onboarding } from "./pages/Onboarding";
import { OxScreening } from "./pages/OxScreening";
import { Survey } from "./pages/Survey";
import { SurveyListPage } from "./pages/SurveyList";

export const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Intro />} />
				<Route path="/home" element={<Home />} />
				<Route path="/onboarding" element={<Onboarding />} />
				<Route path="/main" element={<Main />} />
				<Route path="/createFormStart" element={<CreateFormStart />} />
				<Route path="/mysurvey" element={<MySurvey />} />
				<Route path="/oxScreening" element={<OxScreening />} />
				<Route path="/survey" element={<Survey />} />
				<Route path="/surveyList" element={<SurveyListPage />} />
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
