import {
	Outlet,
	Route,
	BrowserRouter as Router,
	Routes,
} from "react-router-dom";
import { MultiStepProvider } from "./contexts/MultiStepContext";
import { PaymentProvider } from "./contexts/PaymentContext";
import { SurveyProvider } from "./contexts/SurveyContext";
import {
	CreateForm,
	DatePage,
	Home,
	Intro,
	LocationSelectPage,
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
	TitleAndDescriptionEditPage,
} from "./pages";
import { Mypage } from "./pages/Mypage";
import OrderDetail from "./pages/mypage/OrderDetail";
import OrderHistory from "./pages/mypage/OrderHistory";
import RefundPolicy from "./pages/mypage/RefundPolicy";
import { SurveyResponseDetail } from "./pages/mysurvey/SurveyResponseDetail";
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
				<Route element={<SurveyProviderLayout />}>
					<Route element={<MultiStepProviderWrapper />}>
						<Route element={<PaymentProviderLayout />}>
							<Route path="/createForm" element={<CreateForm />} />
							<Route
								path="/payment/location"
								element={<LocationSelectPage />}
							/>
						</Route>
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
						<Route
							path="/createForm/shortAnswer"
							element={<ShortAnswerPage />}
						/>
						<Route path="/createForm/longAnswer" element={<LongAnswerPage />} />
						<Route path="/createForm/date" element={<DatePage />} />
						<Route path="/createForm/number" element={<NumberPage />} />
					</Route>

					<Route
						path="/createForm/:questionType/edit"
						element={<TitleAndDescriptionEditPage />}
					/>
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

const PaymentProviderLayout = () => (
	<PaymentProvider>
		<Outlet />
	</PaymentProvider>
);

const MultiStepProviderWrapper = () => (
	<MultiStepProvider>
		<Outlet />
	</MultiStepProvider>
);
