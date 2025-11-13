import { appLogin } from "@apps-in-toss/web-framework";
import { colors } from "@toss/tds-colors";
import { Asset, FixedBottomCTA, StepperRow, Top } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../service/login";
import { saveTokens } from "../utils/tokenManager";

export const Intro = () => {
	const navigate = useNavigate();

	//@todo: 백엔드랑 로그인 처리 확인 필요
	const handleLogin = async () => {
		try {
			const { authorizationCode, referrer } = await appLogin();
			const loginApiResponse = await loginApi(authorizationCode, referrer);
			// 토큰이 존재하는 경우에만 저장
			if (loginApiResponse.accessToken && loginApiResponse.refreshToken) {
				await saveTokens(
					loginApiResponse.accessToken,
					loginApiResponse.refreshToken,
				);
				// 로그인 성공 시 홈 페이지로 이동
				navigate("/onboarding");
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
				<Asset.Icon
					frameShape={{ width: 160, height: 160 }}
					backgroundColor="transparent"
					name="icon-document-blue-check"
					aria-hidden={true}
					ratio="1/1"
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
			<FixedBottomCTA loading={false} onClick={handleLogin}>
				다음
			</FixedBottomCTA>
		</section>
	);
};
