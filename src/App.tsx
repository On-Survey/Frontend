import { tdsEvent } from "@apps-in-toss/web-framework";
import type { ReactNode } from "react";
import { useEffect } from "react";
import {
	Outlet,
	Route,
	BrowserRouter as Router,
	Routes,
	useNavigate,
} from "react-router-dom";
import { MultiStepProvider } from "./contexts/MultiStepContext";
import { PaymentProvider } from "./contexts/PaymentContext";
import { SurveyProvider } from "./contexts/SurveyContext";
import {
	CreateForm,
	CreateFormStart,
	DatePage,
	EstimatePage,
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
	QuestionListPage,
	QuestionOptionsPage,
	RatingPage,
	ShortAnswerPage,
	Survey,
	SurveyListPage,
	TitleAndDescriptionEditPage,
} from "./pages";
import EstimateNavigationPage from "./pages/estimate/EstimatePage";
import { LocationSelectPage as EstimateLocationSelectPage } from "./pages/estimate/LocationSelectPage";
import { Mypage } from "./pages/Mypage";
import OrderDetail from "./pages/mypage/OrderDetail";
import OrderHistory from "./pages/mypage/OrderHistory";
import RefundPolicy from "./pages/mypage/RefundPolicy";
import { SurveyResponseDetail } from "./pages/mysurvey/SurveyResponseDetail";
import { OxScreening } from "./pages/OxScreening";
import DateResultPage from "./pages/result/DateResultPage";
import LongAnswerResultPage from "./pages/result/LongAnswerResultPage";
import MultipleChoiceResultPage from "./pages/result/MultipleChoiceResultPage";
import NpsResultPage from "./pages/result/NpsResultPage";
import NumberResultPage from "./pages/result/NumberResultPage";
import RatingResultPage from "./pages/result/RatingResultPage";
import ShortAnswerResultPage from "./pages/result/ShortAnswerResultPage";
import SurveyComplete from "./pages/survey/Complete";
import SurveyDate from "./pages/survey/Date";
import SurveyEssay from "./pages/survey/Essay";
import SurveyNPS from "./pages/survey/NPS";
import SurveyNumber from "./pages/survey/Number";
import SurveyRating from "./pages/survey/Rating";
import SurveyShortAnswer from "./pages/survey/ShortAnswer";
import SurveySingleChoice from "./pages/survey/SingleChoice";

// 전역 네비게이션 바 이벤트 리스너 레이아웃 (granite.config.ts에서 설정한 하트 버튼 이벤트 처리)
const GlobalNavigationLayout = ({ children }: { children: ReactNode }) => {
	const navigate = useNavigate();

	useEffect(() => {
		console.log("GlobalNavigationLayout: 이벤트 리스너 등록 중...");

		const cleanup = tdsEvent.addEventListener("navigationAccessoryEvent", {
			onEvent: ({ id }) => {
				if (id === "heart") {
					navigate("/estimateNavigation");
				}
			},
		});

		return cleanup;
	}, [navigate]);

	return <>{children}</>;
};

export const App = () => {
	return (
		<Router>
			<GlobalNavigationLayout>
				<Routes>
					<Route path="/" element={<Intro />} />
					<Route path="/home" element={<Home />} />
					<Route path="/onboarding" element={<Onboarding />} />
					<Route path="/main" element={<Main />} />
					<Route path="/createFormStart" element={<CreateFormStart />} />
					<Route path="/mysurvey" element={<MySurvey />} />
					<Route
						path="/mysurvey/:surveyId"
						element={<SurveyResponseDetail />}
					/>
					<Route path="/mypage" element={<Mypage />} />
					<Route path="/mypage/orderHistory" element={<OrderHistory />} />
					<Route
						path="/mypage/orderHistory/:orderId"
						element={<OrderDetail />}
					/>
					<Route path="/mypage/refundPolicy" element={<RefundPolicy />} />
					<Route path="/oxScreening" element={<OxScreening />} />
					<Route path="/survey" element={<Survey />} />
					<Route path="/surveyList" element={<SurveyListPage />} />
					<Route path="/survey/singleChoice" element={<SurveySingleChoice />} />
					<Route path="/survey/essay" element={<SurveyEssay />} />
					<Route path="/survey/shortAnswer" element={<SurveyShortAnswer />} />
					<Route path="/survey/rating" element={<SurveyRating />} />
					<Route path="/survey/nps" element={<SurveyNPS />} />
					<Route path="/survey/number" element={<SurveyNumber />} />
					<Route path="/survey/date" element={<SurveyDate />} />
					<Route path="/survey/complete" element={<SurveyComplete />} />
					<Route
						path="/result/shortAnswer"
						element={<ShortAnswerResultPage />}
					/>
					<Route path="/result/longAnswer" element={<LongAnswerResultPage />} />
					<Route
						path="/result/multipleChoice"
						element={<MultipleChoiceResultPage />}
					/>
					<Route path="/result/rating" element={<RatingResultPage />} />
					<Route path="/result/nps" element={<NpsResultPage />} />
					<Route path="/result/date" element={<DateResultPage />} />
					<Route path="/result/number" element={<NumberResultPage />} />
					<Route path="/estimate" element={<EstimatePage />} />
					<Route element={<SurveyProviderLayout />}>
						<Route element={<MultiStepProviderWrapper />}>
							<Route element={<PaymentProviderLayout />}>
								<Route path="/createForm" element={<CreateForm />} />
								<Route
									path="/payment/location"
									element={<LocationSelectPage />}
								/>
								<Route
									path="/estimate/location"
									element={<EstimateLocationSelectPage />}
								/>
								<Route
									path="/estimateNavigation"
									element={<EstimateNavigationPage />}
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
							<Route
								path="/createForm/longAnswer"
								element={<LongAnswerPage />}
							/>
							<Route path="/createForm/date" element={<DatePage />} />
							<Route path="/createForm/number" element={<NumberPage />} />
						</Route>

						<Route
							path="/createForm/:questionType/edit"
							element={<TitleAndDescriptionEditPage />}
						/>
					</Route>
				</Routes>
			</GlobalNavigationLayout>
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
