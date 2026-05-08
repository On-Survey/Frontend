import { appLogin } from "@apps-in-toss/web-framework";
import { useAllOngoingSurveys } from "@features/survey-list/hooks/useAllOngoingSurveys";
import { pushGtmEvent } from "@shared/lib/gtm";
import { saveTokens } from "@shared/lib/tokenManager";
import { sendUserInfoEvent } from "@shared/lib/userInfoEvent";
import { loginApi } from "@shared/service/login";
import { getMemberInfo } from "@shared/service/userInfo/api";
import type { LocationStateWithReturnTo } from "@shared/types/navigation";
import { adaptive } from "@toss/tds-colors";
import { Asset, Button, FixedBottomCTA, Text } from "@toss/tds-mobile";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const Intro = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const returnTo = (location.state as LocationStateWithReturnTo)?.returnTo;
	const { data: allOngoingSurveysData } = useAllOngoingSurveys();
	const ongoingSurveyCount = allOngoingSurveysData?.surveys?.length ?? 0;
	const hasOngoingSurvey = ongoingSurveyCount > 0;

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

	return (
		<section
			className="flex flex-col w-full mx-auto min-h-screen"
			style={{
				background:
					"linear-gradient(to bottom, #FFFFFF 0%, #D7EDE4 15%, #C4E4D8 100%)",
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
						<Text color={adaptive.grey800} typography="st4" fontWeight="bold">
							{`400원 설문 ${ongoingSurveyCount}개 오픈,\n바로 설문에 참여해 보세요!`}
						</Text>
						<Button
							variant="weak"
							size="small"
							style={
								{
									"--button-background-color": "#E8F8F0",
									"--button-text-color": "#15c67f",
								} as React.CSSProperties
							}
							onClick={handleLogin}
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
		</section>
	);
};
