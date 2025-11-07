import {
	Outlet,
	Route,
	BrowserRouter as Router,
	Routes,
} from "react-router-dom";
import { CreateFormProvider } from "./contexts/CreateFormContext";
import { SurveyProvider } from "./contexts/SurveyContext";
import { CreateForm } from "./pages/CreateForm";
import EstimatePage from "./pages/estimate/EstimatePage";
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
import TitleAndDescriptionEditPage from "./pages/form/TitleAndDescriptionEditPage";
import { Home } from "./pages/Home";
import { Intro } from "./pages/Intro";
import { Main } from "./pages/Main";
import { Mypage } from "./pages/Mypage";
import OrderDetail from "./pages/mypage/OrderDetail";
import OrderHistory from "./pages/mypage/OrderHistory";
import RefundPolicy from "./pages/mypage/RefundPolicy";
import { MySurvey } from "./pages/mysurvey";
import { SurveyResponseDetail } from "./pages/mysurvey/SurveyResponseDetail";
import { Onboarding } from "./pages/Onboarding";
import { OXquiz } from "./pages/OXquiz";
import { OXquizDetail } from "./pages/OXquizDetail";
import DateResultPage from "./pages/result/DateResultPage";
import LongAnswerResultPage from "./pages/result/LongAnswerResultPage";
import MultipleChoiceResultPage from "./pages/result/MultipleChoiceResultPage";
import NpsResultPage from "./pages/result/NpsResultPage";
import NumberResultPage from "./pages/result/NumberResultPage";
import RatingResultPage from "./pages/result/RatingResultPage";
import ShortAnswerResultPage from "./pages/result/ShortAnswerResultPage";
import { Survey } from "./pages/Survey";
import SurveyDate from "./pages/survey/Date";
import SurveyEssay from "./pages/survey/Essay";
import SurveyNPS from "./pages/survey/NPS";
import SurveyNumber from "./pages/survey/Number";
import SurveyRating from "./pages/survey/Rating";
import SurveyShortAnswer from "./pages/survey/ShortAnswer";
import SurveySingleChoice from "./pages/survey/SingleChoice";

export const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Intro />} />
				<Route path="/home" element={<Home />} />
				<Route path="/onboarding" element={<Onboarding />} />
				<Route path="/main" element={<Main />} />
				<Route path="/mysurvey" element={<MySurvey />} />
				<Route path="/mysurvey/:surveyId" element={<SurveyResponseDetail />} />
				<Route path="/mypage" element={<Mypage />} />
				<Route path="/mypage/orderHistory" element={<OrderHistory />} />
				<Route path="/mypage/orderHistory/:orderId" element={<OrderDetail />} />
				<Route path="/mypage/refundPolicy" element={<RefundPolicy />} />
				<Route path="/OXquiz" element={<OXquiz />} />
				<Route path="/oxquiz-detail" element={<OXquizDetail />} />
				<Route path="/survey" element={<Survey />} />
				<Route path="/survey/singleChoice" element={<SurveySingleChoice />} />
				<Route path="/survey/essay" element={<SurveyEssay />} />
				<Route path="/survey/shortAnswer" element={<SurveyShortAnswer />} />
				<Route path="/survey/rating" element={<SurveyRating />} />
				<Route path="/survey/nps" element={<SurveyNPS />} />
				<Route path="/survey/number" element={<SurveyNumber />} />
				<Route path="/survey/date" element={<SurveyDate />} />
				<Route
					path="/result/short-answer"
					element={<ShortAnswerResultPage />}
				/>
				<Route path="/result/long-answer" element={<LongAnswerResultPage />} />
				<Route
					path="/result/multiple-choice"
					element={<MultipleChoiceResultPage />}
				/>
				<Route path="/result/rating" element={<RatingResultPage />} />
				<Route path="/result/nps" element={<NpsResultPage />} />
				<Route path="/result/date" element={<DateResultPage />} />
				<Route path="/result/number" element={<NumberResultPage />} />
				<Route path="/estimate" element={<EstimatePage />} />
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
					<Route
						path="/createForm/:questionType/edit"
						element={<TitleAndDescriptionEditPage />}
					/>
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
