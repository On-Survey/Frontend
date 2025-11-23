import {
	graniteEvent,
	setIosSwipeGestureEnabled,
} from "@apps-in-toss/web-framework";
import { useEffect } from "react";

/**
 * graniteEvent의 backEvent를 리스닝하는 커스텀 훅
 * @param onBack - 뒤로가기 버튼이 눌렸을 때 실행할 콜백 함수
 * @param onError - 에러 발생 시 실행할 콜백 함수 (선택적)
 */
export const useBackEventListener = (
	onBack: () => void,
	onError?: (error: unknown) => void,
) => {
	useEffect(() => {
		setIosSwipeGestureEnabled({ isEnabled: false });
		const unsubscription = graniteEvent.addEventListener("backEvent", {
			onEvent: () => {
				onBack();
			},
			onError: (error) => {
				if (onError) {
					onError(error);
				} else {
					alert(`에러가 발생했어요: ${error}`);
				}
			},
		});

		return unsubscription;
	}, [onBack, onError]);
};
