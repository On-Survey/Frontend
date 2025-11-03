import {
	Outlet,
	Route,
	BrowserRouter as Router,
	Routes,
} from "react-router-dom";
import { CreateFormProvider } from "./contexts/CreateFormContext";
import { SurveyProvider } from "./contexts/SurveyContext";
import { CreateForm } from "./pages/CreateForm";
import DatePage from "./pages/form/DatePage";
import EssayPage from "./pages/form/EssayPage";
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
import { Mypage } from "./pages/Mypage";
import OrderDetail from "./pages/mypage/OrderDetail";
import OrderHistory from "./pages/mypage/OrderHistory";
import RefundPolicy from "./pages/mypage/RefundPolicy";
import { MySurvey } from "./pages/mysurvey";
import { Onboarding } from "./pages/Onboarding";
import { OXquiz } from "./pages/OXquiz";
import { OXquizDetail } from "./pages/OXquizDetail";
import { Survey } from "./pages/Survey";
export const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Intro />} />
				<Route path="/home" element={<Home />} />
				<Route path="/onboarding" element={<Onboarding />} />
				<Route path="/main" element={<Main />} />
				<Route path="/mysurvey" element={<MySurvey />} />
				<Route path="/mypage" element={<Mypage />} />
				<Route path="/mypage/orderHistory" element={<OrderHistory />} />
				<Route
						path="/mypage/orderHistory/:orderId"
						element={<OrderDetail />}
					/>
				<Route path="/mypage/refundPolicy" element={<RefundPolicy />} />
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
					<Route path="/createForm/essay" element={<EssayPage />} />
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
