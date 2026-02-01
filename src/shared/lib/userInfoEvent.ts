import { getPaymentStats } from "../../features/payment/service/payments";
import { getMemberInfo } from "../service/userInfo/api";
import { pushGtmEvent } from "./gtm";

/**
 * user_info 이벤트를 GA4에 전송하는 함수
 * 로그인 완료 시 또는 구매 전환 시 호출
 */
export const sendUserInfoEvent = async (
	loginMethod: string = "Toss",
): Promise<void> => {
	try {
		// 사용자 정보와 결제 통계를 병렬로 가져오기
		const [memberInfo, paymentStats] = await Promise.all([
			getMemberInfo(),
			getPaymentStats(),
		]);

		pushGtmEvent({
			event: "user_info",
			login_method: loginMethod,
			user_region: memberInfo.residence ?? "",
			user_age: memberInfo.age ?? "",
			user_gender: memberInfo.gender ?? "",
			purchase_price: String(paymentStats.totalAmount),
			purchase_count: String(paymentStats.totalCount),
		});
	} catch (error) {
		console.error("user_info 이벤트 전송 실패:", error);
	}
};
