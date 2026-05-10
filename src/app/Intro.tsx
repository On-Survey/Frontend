import { appLogin } from "@apps-in-toss/web-framework";
import { IneligibleSurveyBottomSheet } from "@features/screening/components/IneligibleSurveyBottomSheet";
import { getScreenings } from "@features/survey/service/surveyParticipation/api";
import { mapOngoingSurveySummaryToSurveyListItem } from "@features/survey-list/hooks/useProcessedOngoingSurveys";
import { useSurveyOpenStats } from "@features/survey-list/hooks/useSurveyOpenStats";
import { getAllOngoingSurveys } from "@features/survey-list/service/surveyList";
import type { OngoingSurveySummary } from "@features/survey-list/service/surveyList/types";
import { queryClient } from "@shared/contexts/queryClient";
import { pushGtmEvent } from "@shared/lib/gtm";
import { trackEvent } from "@shared/lib/mixpanel";
import { saveTokens } from "@shared/lib/tokenManager";
import { sendUserInfoEvent } from "@shared/lib/userInfoEvent";
import { loginApi } from "@shared/service/login";
import { getMemberInfo } from "@shared/service/userInfo/api";
import type { LocationStateWithReturnTo } from "@shared/types/navigation";
import { adaptive } from "@toss/tds-colors";
import { Asset, Button, FixedBottomCTA, Text } from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/** 세그먼트 조건을 만족하는 설문만 대상으로 최고 프로모션가 설문 선택 */
function pickHighestPriceAmongEligible(
	list: OngoingSurveySummary[],
): OngoingSurveySummary | undefined {
	const eligible = list.filter((s) => s.isEligible ?? false);
	if (eligible.length === 0) return undefined;
	const maxPrice = Math.max(...eligible.map((s) => s.price ?? 0));
	const tied = eligible.filter((s) => (s.price ?? 0) === maxPrice);
	tied.sort((a, b) => a.surveyId - b.surveyId);
	return tied[0];
}

export const Intro = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const returnTo = (location.state as LocationStateWithReturnTo)?.returnTo;
	const [ineligibleSurveySheet, setIneligibleSurveySheet] = useState<{
		open: boolean;
		title?: string;
		description?: string;
	}>({ open: false });

	const { data: openStats, isPending: isOpenStatsPending } =
		useSurveyOpenStats();

	const openSurveyCount = openStats?.openSurveyCount ?? 0;
	const maxRewardCoin = openStats?.maxRewardCoin ?? 0;

	const hasOngoingSurvey = !isOpenStatsPending && openSurveyCount > 0;

	const surveyPromoText = `${maxRewardCoin.toLocaleString()}코인 설문 ${openSurveyCount}개 오픈,\n바로 설문에 참여해 보세요!`;

	// 이전에 로그인한 사용자인지 확인
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const memberInfo = await getMemberInfo();
				void sendUserInfoEvent("Toss");
				if (memberInfo.isOnboardingCompleted) {
					if (returnTo) {
						navigate(returnTo.path, { replace: true, state: returnTo.state });
					} else {
						navigate("/home", { replace: true, state: { isAutoLogin: true } });
					}
				} else {
					navigate("/onboarding", {
						replace: true,
						state: returnTo ? { returnTo } : undefined,
					});
				}
			} catch (error) {
				console.error("자동 로그인 확인 실패:", error);
			}
		};
		checkAuth();
	}, [navigate, returnTo]);

	const handleLogin = async () => {
		pushGtmEvent({
			event: "login",
			pagePath: "/intro",
			method: "로그인 수단 (Toss)",
		});
		try {
			const { authorizationCode, referrer } = await appLogin();
			const loginApiResponse = await loginApi(authorizationCode, referrer);
			if (loginApiResponse.accessToken && loginApiResponse.refreshToken) {
				await saveTokens(
					loginApiResponse.accessToken,
					loginApiResponse.refreshToken,
				);
				void sendUserInfoEvent("Toss");

				if (loginApiResponse.onboardingCompleted) {
					// 온보딩 완료된 유저 - 원래 페이지로 돌아가거나 홈으로 이동
					if (returnTo) {
						navigate(returnTo.path, {
							replace: true,
							state: returnTo.state,
						});
					} else {
						navigate("/home", { replace: true });
					}
				} else {
					// 온보딩 미완료 - 온보딩으로 이동 (returnTo 정보 전달)
					navigate("/onboarding", {
						replace: true,
						state: returnTo ? { returnTo } : undefined,
					});
				}
			}
		} catch (error) {
			console.error("토스 로그인 실패:", error);
		}
	};

	const navigateToSurveyInfo = (
		surveyItem: ReturnType<typeof mapOngoingSurveySummaryToSurveyListItem>,
	) => {
		pushGtmEvent({
			event: "survey_start",
			pagePath: "/survey",
			survey_id: String(surveyItem.id),
			source: "intro",
		});
		trackEvent("Survey Started", {
			pagePath: "/survey",
			surveyId: String(surveyItem.id),
			source: "intro",
			hasScreening: false,
		});
		const searchParams = new URLSearchParams({ surveyId: surveyItem.id });
		navigate(
			{
				pathname: "/survey",
				search: `?${searchParams.toString()}`,
			},
			{
				replace: true,
				state: { surveyId: surveyItem.id, survey: surveyItem },
			},
		);
	};

	const handleParticipateLogin = async () => {
		pushGtmEvent({
			event: "login",
			pagePath: "/intro",
			method: "로그인 수단 (Toss)",
		});

		try {
			const { authorizationCode, referrer } = await appLogin();
			const loginApiResponse = await loginApi(authorizationCode, referrer);
			if (!loginApiResponse.accessToken || !loginApiResponse.refreshToken) {
				return;
			}

			await saveTokens(
				loginApiResponse.accessToken,
				loginApiResponse.refreshToken,
			);
			void sendUserInfoEvent("Toss");

			let targetSummary: OngoingSurveySummary | undefined;
			try {
				const result = await getAllOngoingSurveys({
					lastSurveyId: 0,
					size: 100,
				});
				const surveys = result.surveys ?? [];
				targetSummary = pickHighestPriceAmongEligible(surveys);
			} catch (error) {
				console.error("진행 설문 목록 조회 실패:", error);
				setIneligibleSurveySheet({
					open: true,
					title: "설문 목록을 불러오지 못했어요",
					description:
						"잠시 후 다시 시도하거나, 하단 다음 버튼으로 홈에서 확인해 주세요.",
				});
				return;
			}

			if (!targetSummary) {
				setIneligibleSurveySheet({
					open: true,
					title: "지금 참여할 수 있는 설문이 없어요",
					description: `로그인 후 조건에 맞는 설문이 없어요. \n새 설문이 열리면 홈에서 참여할 수 있어요.`,
				});
				return;
			}

			const summary = targetSummary;

			void queryClient.invalidateQueries({ queryKey: ["allOngoingSurveys"] });

			const surveyItem = mapOngoingSurveySummaryToSurveyListItem(summary);
			let hasScreening = false;
			try {
				const screeningsData = await getScreenings({
					lastSurveyId: 0,
					size: 100,
				});
				hasScreening = (screeningsData.data ?? []).some(
					(s) => s.surveyId === summary.surveyId,
				);
			} catch (error) {
				console.error("스크리닝 목록 조회 실패:", error);
			}

			const surveyReturnTo = hasScreening
				? {
						path: `/oxScreening?surveyId=${surveyItem.id}`,
						state: undefined,
					}
				: {
						path: `/survey?surveyId=${surveyItem.id}`,
						state: {
							surveyId: surveyItem.id,
							survey: surveyItem,
						} as Record<string, unknown>,
					};

			if (loginApiResponse.onboardingCompleted) {
				if (hasScreening) {
					navigate(`/oxScreening?surveyId=${surveyItem.id}`, {
						replace: true,
					});
				} else {
					navigateToSurveyInfo(surveyItem);
				}
			} else {
				navigate("/onboarding", {
					replace: true,
					state: { returnTo: surveyReturnTo },
				});
			}
		} catch (error) {
			console.error("토스 로그인 실패:", error);
		}
	};

	return (
		<section
			className="flex flex-col w-full mx-auto min-h-screen"
			style={{
				background:
					"linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 15%, #C4E4D8 65%, #FFFFFF 100%)",
			}}
		>
			<div
				className={`px-4 ${hasOngoingSurvey ? "my-8" : "flex-1 flex flex-col justify-center"}`}
			>
				<div className="flex justify-center items-center mb-6">
					<Asset.Image
						frameShape={{ width: 160, height: 160 }}
						backgroundColor="transparent"
						src="https://static.toss.im/ml-product/typing-laptop-apng.png"
						aria-hidden={true}
					/>
				</div>

				<Text
					display="block"
					color={adaptive.grey800}
					typography="st5"
					fontWeight="bold"
					textAlign="center"
				>
					설문 통합 플랫폼 온서베이
				</Text>

				<div className="mt-6 grid grid-cols-3 gap-3">
					<div className="rounded-3xl! bg-white px-3 py-5 flex flex-col items-center gap-3">
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW40}
							backgroundColor="transparent"
							name="icon-document-folder-yellow-check"
							aria-hidden={true}
							ratio="1/1"
						/>
						<Text
							display="block"
							color={adaptive.grey800}
							typography="t5"
							fontWeight="semibold"
							textAlign="center"
						>
							설문 업로드 시 빠른 응답
						</Text>
					</div>
					<div className="rounded-3xl bg-white px-3 py-5 flex flex-col items-center gap-3">
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW40}
							backgroundColor="transparent"
							name="icon-money-bag-green-weak"
							aria-hidden={true}
							ratio="1/1"
						/>
						<Text
							display="block"
							color={adaptive.grey800}
							typography="t5"
							fontWeight="semibold"
							textAlign="center"
						>
							설문 참여 시 리워드
						</Text>
					</div>
					<div className="rounded-3xl bg-white px-3 py-5 flex flex-col items-center gap-3">
						<Asset.Image
							frameShape={Asset.frameShape.CleanW40}
							backgroundColor="transparent"
							src="https://static.toss.im/2d-emojis/png/4x/u1F517.png"
							aria-hidden={true}
							style={{ aspectRatio: "1/1" }}
						/>
						<Text
							display="block"
							color={adaptive.grey800}
							typography="t5"
							fontWeight="semibold"
							textAlign="center"
						>
							부담없는 구글폼 변환
						</Text>
					</div>
				</div>

				{hasOngoingSurvey && (
					<div
						className="mt-6 relative rounded-3xl bg-white px-5 py-5 flex items-center justify-between gap-4"
						style={{ boxShadow: "0 8px 20px #D7EDE4" }}
					>
						<Text
							color={adaptive.grey700}
							typography="t6"
							fontWeight="semibold"
						>
							{surveyPromoText}
						</Text>
						<Button
							variant="weak"
							size="medium"
							style={
								{
									"--button-background-color": "#E8F8F0",
									"--button-text-color": "#15c67f",
								} as React.CSSProperties
							}
							onClick={handleParticipateLogin}
						>
							참여하기
						</Button>
					</div>
				)}
			</div>

			<FixedBottomCTA
				loading={false}
				onClick={handleLogin}
				style={
					{ "--button-background-color": "#15c67f" } as React.CSSProperties
				}
			>
				다음
			</FixedBottomCTA>

			<IneligibleSurveyBottomSheet
				open={ineligibleSurveySheet.open}
				title={ineligibleSurveySheet.title}
				description={ineligibleSurveySheet.description}
				onClose={() => setIneligibleSurveySheet({ open: false })}
			/>
		</section>
	);
};
