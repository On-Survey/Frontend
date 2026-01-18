import { appLogin } from "@apps-in-toss/web-framework";
import { colors } from "@toss/tds-colors";
import { Asset, FixedBottomCTA, StepperRow, Top } from "@toss/tds-mobile";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginApi } from "../service/login";
import { getMemberInfo } from "../service/userInfo/api";
import type { LocationStateWithReturnTo } from "../types/navigation";
import { pushGtmEvent } from "../utils/gtm";
import { saveTokens } from "../utils/tokenManager";
import { sendUserInfoEvent } from "../utils/userInfoEvent";

export const Intro = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const returnTo = (location.state as LocationStateWithReturnTo)?.returnTo;

	// 이전에 로그인한 사용자인지 확인
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const memberInfo = await getMemberInfo();

				// 자동 로그인 완료 시 user_info 이벤트 전송
				void sendUserInfoEvent("Toss");

				// isOnboardingCompleted 상태에 따라 분기
				if (memberInfo.isOnboardingCompleted) {
					// 원래 페이지로 돌아가거나 홈으로 이동
					if (returnTo) {
						navigate(returnTo.path, {
							replace: true,
							state: returnTo.state,
						});
					} else {
						navigate("/home", {
							replace: true,
							state: { isAutoLogin: true },
						});
					}
				} else {
					// 온보딩으로 이동 (returnTo 정보 전달)
					navigate("/onboarding", {
						replace: true,
						state: returnTo ? { returnTo } : undefined,
					});
				}
			} catch (error) {
				// 인증 실패 (토큰 없거나 만료 등) 시에는 로그인 페이지 유지
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
		<section className="flex flex-col w-full mx-auto">
			<Top
				title={
					<Top.TitleParagraph size={22} color={colors.grey900}>
						설문조사 참여하고 포인트 받아가세요
					</Top.TitleParagraph>
				}
			/>
			<div className="flex justify-center items-center my-10">
				<Asset.Image
					frameShape={{ width: 160, height: 160 }}
					backgroundColor="transparent"
					src="https://static.toss.im/ml-product/typing-laptop-apng.png"
					aria-hidden={true}
				/>
			</div>
			<StepperRow
				left={<StepperRow.NumberIcon number={1} />}
				center={
					<StepperRow.Texts
						type="B"
						title="설문조사에 참여해요"
						description=""
					/>
				}
			/>
			<StepperRow
				left={<StepperRow.NumberIcon number={2} />}
				center={
					<StepperRow.Texts type="B" title="성실하게 응답하고" description="" />
				}
			/>
			<StepperRow
				left={<StepperRow.NumberIcon number={3} />}
				center={
					<StepperRow.Texts type="B" title="포인트를 적립해요" description="" />
				}
				hideLine={true}
			/>
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
