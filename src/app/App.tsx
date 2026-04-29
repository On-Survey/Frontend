import { tdsEvent } from "@apps-in-toss/web-framework";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useEffect } from "react";
import {
	Navigate,
	Outlet,
	Route,
	BrowserRouter as Router,
	Routes,
	useLocation,
	useNavigate,
} from "react-router-dom";
import { AdPage } from "../features/ad-page/AdPage";
import {
	DatePage,
	LongAnswerPage,
	MultipleChoiceMain,
	MultipleChoicePage,
	NPSPage,
	NumberPage,
	QuestionListPage,
	QuestionOptionsPage,
	QuestionTitleAndDescriptionEditPage,
	RatingPage,
	ShortAnswerPage,
	SurveyMain,
	SurveyStart,
} from "../features/create-survey";
import { OptionsFormProvider } from "../features/google-form-conversion/context/OptionsFormContext";
import { RequestEntryProvider } from "../features/google-form-conversion/context/RequestEntryContext";
import {
	PaymentSuccessPage as ConversionPaymentSuccessPage,
	InquiryPage,
	InquirySuccessPage,
	LandingPage,
	OptionsPage,
	PaymentConfirmPage,
	PreviewPage,
	PrivacyConsentPage,
	RequestPage,
	ScreeningPage,
} from "../features/google-form-conversion/pages";
import BusinessInfo from "../features/mypage/pages/BusinessInfo";
import CoinDetail from "../features/mypage/pages/CoinDetail";
import CoinHistory from "../features/mypage/pages/CoinHistory";
import { Mypage } from "../features/mypage/pages/Mypage";
import OrderDetail from "../features/mypage/pages/OrderDetail";
import OrderHistory from "../features/mypage/pages/OrderHistory";
import PrivacyPolicy from "../features/mypage/pages/PrivacyPolicy";
import PromotionNotice from "../features/mypage/pages/PromotionNotice";
import RefundPolicy from "../features/mypage/pages/RefundPolicy";
import TermsOfService from "../features/mypage/pages/TermsOfService";
import { MySurvey } from "../features/mysurvey/pages";
import { SurveyResponseDetail } from "../features/mysurvey/pages/SurveyResponseDetail";
import { Onboarding } from "../features/onboarding/pages/Onboarding";
import {
	LocationSelectPage as EstimateLocationSelectPage,
	EstimatePage as EstimateNavigationPage,
	EstimatePage,
	FreeRegistrationNotice,
	LocationSelectPage,
	PaymentLoading,
	PaymentMain,
	PaymentSuccessPage,
} from "../features/payment/pages";
import { OxScreening } from "../features/screening/pages/OxScreening";
import SurveyComplete from "../features/survey/pages/Complete";
import SurveyDate from "../features/survey/pages/Date";
import SurveyEssay from "../features/survey/pages/Essay";
import { Ineligible } from "../features/survey/pages/Ineligible";
import SurveyNPS from "../features/survey/pages/NPS";
import SurveyNumber from "../features/survey/pages/Number";
import SurveyRating from "../features/survey/pages/Rating";
import { SectionBasedSurvey } from "../features/survey/pages/SectionBasedSurvey";
import SurveyShortAnswer from "../features/survey/pages/ShortAnswer";
import SurveySingleChoice from "../features/survey/pages/SingleChoice";
import { Survey } from "../features/survey/pages/Survey";
import { Home } from "../features/survey-list/pages/Home";
import { SurveyListPage } from "../features/survey-list/pages/SurveyList";
import DateResultPage from "../features/survey-result/pages/DateResultPage";
import GridResultPage from "../features/survey-result/pages/GridResultPage";
import LongAnswerResultPage from "../features/survey-result/pages/LongAnswerResultPage";
import MultipleChoiceResultPage from "../features/survey-result/pages/MultipleChoiceResultPage";
import NpsResultPage from "../features/survey-result/pages/NpsResultPage";
import NumberResultPage from "../features/survey-result/pages/NumberResultPage";
import RatingResultPage from "../features/survey-result/pages/RatingResultPage";
import ShortAnswerResultPage from "../features/survey-result/pages/ShortAnswerResultPage";
import TimeResultPage from "../features/survey-result/pages/TimeResultPage";
import { MultiStepProvider } from "../shared/contexts/MultiStepContext";
import { PaymentProvider } from "../shared/contexts/PaymentContext";
import { queryClient } from "../shared/contexts/queryClient";
import { SurveyProvider } from "../shared/contexts/SurveyContext";
import { UserProvider } from "../shared/contexts/UserContext";
import { logPageView } from "../shared/lib/firebase";
import { getPageScreenName } from "../shared/lib/pageScreenNames";
import { Intro } from "./Intro";

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

const DeepLinkHandler = () => {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const href = window.location.href;

		const match = href.match(/intoss:\/\/[^/]+(\/.+)$/);
		const targetPath = match?.[1];

		if (targetPath && location.pathname !== targetPath) {
			navigate(targetPath, { replace: true });
		}
	}, [navigate, location.pathname]);

	return null;
};

const AnalyticsTracker = () => {
	const location = useLocation();

	useEffect(() => {
		const pagePath = location.pathname + location.search;
		const pageTitle = getPageScreenName(location.pathname);

		// document.title 설정 (GA4 페이지 제목 캡처용)
		document.title = `${pageTitle} - onsurvey`;

		// Firebase Analytics로 직접 page_view 전송
		void logPageView(pagePath, { page_title: pageTitle });

		// GTM으로 SPA 라우트 변경 이벤트 전송
		if (typeof window === "undefined") return;
		const w = window as unknown as { dataLayer?: unknown[] };
		w.dataLayer = w.dataLayer || [];
		w.dataLayer.push({
			event: "route_change",
			page_path: pagePath,
			page_title: pageTitle,
		});
	}, [location]);

	return null;
};

export const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<DeepLinkHandler />
				<AnalyticsTracker />
				<RequestEntryProvider>
					<OptionsFormProvider>
						<UserProvider>
							<GlobalNavigationLayout>
								<Routes>
									<Route path="/" element={<Intro />} />
									<Route path="/ad" element={<AdPage />} />
									<Route path="/home" element={<Home />} />
									<Route
										path="/google-form-conversion-landing"
										element={<LandingPage />}
									/>
									<Route path="/onboarding" element={<Onboarding />} />
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
									<Route
										path="/mypage/orderHistory"
										element={<OrderHistory />}
									/>
									<Route
										path="/mypage/orderHistory/:orderId"
										element={<OrderDetail />}
									/>
									<Route path="/mypage/coinHistory" element={<CoinHistory />} />
									<Route
										path="/mypage/coinHistory/:coinId"
										element={<CoinDetail />}
									/>
									<Route
										path="/mypage/refundPolicy"
										element={<RefundPolicy />}
									/>
									<Route
										path="/mypage/privacyPolicy"
										element={<PrivacyPolicy />}
									/>
									<Route
										path="/mypage/termsOfService"
										element={<TermsOfService />}
									/>
									<Route
										path="/mypage/businessInfo"
										element={<BusinessInfo />}
									/>
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
										<Route
											path="/survey/section"
											element={<SectionBasedSurvey />}
										/>
										<Route
											path="/survey/complete"
											element={<SurveyComplete />}
										/>
										<Route path="/survey/ineligible" element={<Ineligible />} />
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
									<Route path="/result/time" element={<TimeResultPage />} />
									<Route path="/result/number" element={<NumberResultPage />} />
									<Route path="/result/grid" element={<GridResultPage />} />
									<Route path="/estimate" element={<EstimatePage />} />
									<Route element={<SurveyProviderLayout />}>
										<Route element={<MultiStepProviderWrapper />}>
											<Route element={<PaymentProviderLayout />}>
												<Route path="/createForm" element={<SurveyMain />} />
												<Route
													path="/payment/google-form-conversion"
													element={<RequestPage />}
												/>
												<Route
													path="/payment/google-form-conversion-inquiry"
													element={<InquiryPage />}
												/>
												<Route
													path="/payment/google-form-conversion-inquiry-success"
													element={<InquirySuccessPage />}
												/>
												<Route
													path="/payment/google-form-conversion-preview"
													element={<PreviewPage />}
												/>
												<Route
													path="/payment/google-form-conversion-options"
													element={<OptionsPage />}
												/>
												<Route
													path="/payment/google-form-conversion-screening"
													element={<ScreeningPage />}
												/>
												<Route
													path="/payment/google-form-conversion-check"
													element={
														<Navigate
															to="/payment/google-form-conversion-payment-confirm"
															replace
														/>
													}
												/>
												<Route
													path="/payment/google-form-conversion-payment-confirm"
													element={<PaymentConfirmPage />}
												/>
												<Route
													path="/payment/google-form-conversion-success"
													element={<ConversionPaymentSuccessPage />}
												/>
												<Route
													path="/payment/google-form-conversion-privacy-consent"
													element={<PrivacyConsentPage />}
												/>
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
												<Route
													path="/payment/charge"
													element={<PaymentMain />}
												/>
												<Route
													path="/payment/free-registration-notice"
													element={<FreeRegistrationNotice />}
												/>
												<Route
													path="/payment/loading"
													element={<PaymentLoading />}
												/>
												<Route
													path="/payment/success"
													element={<PaymentSuccessPage />}
												/>
												<Route
													path="/createForm/multipleChoice"
													element={<MultipleChoicePage />}
												>
													<Route index element={<MultipleChoiceMain />} />
													<Route
														path="questions"
														element={<QuestionListPage />}
													/>
													<Route
														path="questions/:questionId"
														element={<QuestionOptionsPage />}
													/>
												</Route>
												<Route
													path="/createForm/rating"
													element={<RatingPage />}
												/>
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
												<Route
													path="/createForm/number"
													element={<NumberPage />}
												/>
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
					</OptionsFormProvider>
				</RequestEntryProvider>
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
