import { tdsEvent } from "@apps-in-toss/web-framework";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useEffect } from "react";
import {
	Outlet,
	Route,
	BrowserRouter as Router,
	Routes,
	useLocation,
	useNavigate,
} from "react-router-dom";
import { MultiStepProvider } from "./contexts/MultiStepContext";
import { PaymentProvider } from "./contexts/PaymentContext";
import { queryClient } from "./contexts/queryClient";
import { SurveyProvider } from "./contexts/SurveyContext";
import { UserProvider } from "./contexts/UserContext";
import {
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
	PaymentMain,
	QuestionListPage,
	QuestionOptionsPage,
	QuestionTitleAndDescriptionEditPage,
	RatingPage,
	ShortAnswerPage,
	Survey,
	SurveyListPage,
	SurveyMain,
	SurveyStart,
} from "./pages";
import EstimateNavigationPage from "./pages/estimate/EstimatePage";
import { LocationSelectPage as EstimateLocationSelectPage } from "./pages/estimate/LocationSelectPage";
import { Mypage } from "./pages/Mypage";
import BusinessInfo from "./pages/mypage/BusinessInfo";
import CoinDetail from "./pages/mypage/CoinDetail";
import CoinHistory from "./pages/mypage/CoinHistory";
import OrderDetail from "./pages/mypage/OrderDetail";
import OrderHistory from "./pages/mypage/OrderHistory";
import PrivacyPolicy from "./pages/mypage/PrivacyPolicy";
import PromotionNotice from "./pages/mypage/PromotionNotice";
import RefundPolicy from "./pages/mypage/RefundPolicy";
import TermsOfService from "./pages/mypage/TermsOfService";
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
import { logPageView } from "./utils/firebase";

// 전역 네비게이션 바 이벤트 리스너 레이아웃 (granite.config.ts에서 설정한 하트 버튼 이벤트 처리)
const GlobalNavigationLayout = ({ children }: { children: ReactNode }) => {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const cleanup = tdsEvent.addEventListener("navigationAccessoryEvent", {
			onEvent: ({ id }) => {
				if (
					id === "heart" &&
					!location.pathname.startsWith("/createForm") &&
					!location.pathname.startsWith("/payment") &&
					!location.pathname.startsWith("/questions") &&
					!location.pathname.startsWith("/estimate") &&
					!location.pathname.startsWith("/onboarding") &&
					!location.pathname.startsWith("/survey")
				) {
					navigate("/estimateNavigation");
				}
			},
		});

		return cleanup;
	}, [navigate, location.pathname]);

	return <>{children}</>;
};

const AnalyticsTracker = () => {
	const location = useLocation();

	useEffect(() => {
		// Firebase Analytics로 직접 page_view 전송
		void logPageView(location.pathname + location.search);

		// GTM으로 SPA 라우트 변경 이벤트 전송
		if (typeof window === "undefined") return;
		const w = window as unknown as { dataLayer?: unknown[] };
		w.dataLayer = w.dataLayer || [];
		w.dataLayer.push({
			event: "route_change",
			page_path: location.pathname + location.search,
		});
	}, [location]);

	return null;
};

export const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<AnalyticsTracker />
				<UserProvider>
					<GlobalNavigationLayout>
						<Routes>
							<Route path="/" element={<Intro />} />
							<Route path="/home" element={<Home />} />
							<Route path="/onboarding" element={<Onboarding />} />
							<Route path="/main" element={<Main />} />
							<Route path="/createFormStart" element={<SurveyStart />} />
							<Route element={<SurveyProviderLayout />}>
								<Route element={<MultiStepProviderWrapper />}>
									<Route path="/mysurvey" element={<MySurvey />} />
								</Route>
							</Route>
							<Route
								path="/mysurvey/:surveyId"
								element={<SurveyResponseDetail />}
							/>
							<Route element={<MultiStepProviderWrapper />}>
								<Route element={<PaymentProviderLayout />}>
									<Route path="/mypage" element={<Mypage />} />
								</Route>
							</Route>
							<Route path="/mypage/orderHistory" element={<OrderHistory />} />
							<Route
								path="/mypage/orderHistory/:orderId"
								element={<OrderDetail />}
							/>
							<Route path="/mypage/coinHistory" element={<CoinHistory />} />
							<Route
								path="/mypage/coinHistory/:coinId"
								element={<CoinDetail />}
							/>
							<Route path="/mypage/refundPolicy" element={<RefundPolicy />} />
							<Route path="/mypage/privacyPolicy" element={<PrivacyPolicy />} />
							<Route
								path="/mypage/termsOfService"
								element={<TermsOfService />}
							/>
							<Route path="/mypage/businessInfo" element={<BusinessInfo />} />
							<Route
								path="/mypage/promotionNotice"
								element={<PromotionNotice />}
							/>
							<Route path="/oxScreening" element={<OxScreening />} />
							<Route path="/survey" element={<Survey />} />
							<Route path="/surveyList" element={<SurveyListPage />} />
							<Route element={<SurveyProviderLayout />}>
								<Route
									path="/survey/singleChoice"
									element={<SurveySingleChoice />}
								/>
								<Route path="/survey/essay" element={<SurveyEssay />} />
								<Route
									path="/survey/shortAnswer"
									element={<SurveyShortAnswer />}
								/>
								<Route path="/survey/rating" element={<SurveyRating />} />
								<Route path="/survey/nps" element={<SurveyNPS />} />
								<Route path="/survey/number" element={<SurveyNumber />} />
								<Route path="/survey/date" element={<SurveyDate />} />
								<Route path="/survey/complete" element={<SurveyComplete />} />
							</Route>
							<Route
								path="/result/shortAnswer"
								element={<ShortAnswerResultPage />}
							/>
							<Route
								path="/result/longAnswer"
								element={<LongAnswerResultPage />}
							/>
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
										<Route path="/createForm" element={<SurveyMain />} />
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
										<Route path="/payment/charge" element={<PaymentMain />} />
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
										<Route
											path="/createForm/:questionType/edit"
											element={<QuestionTitleAndDescriptionEditPage />}
										/>
									</Route>
								</Route>
							</Route>
						</Routes>
					</GlobalNavigationLayout>
				</UserProvider>
			</Router>
		</QueryClientProvider>
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
