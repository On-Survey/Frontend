import { useMultiStep } from "@shared/contexts/MultiStepContext";
import { usePaymentEstimate } from "@shared/contexts/PaymentContext";
import type { MypageData } from "@shared/types/mypage";
import { adaptive } from "@toss/tds-colors";
import { Border, Button, Text } from "@toss/tds-mobile";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMemberInfo } from "../hooks/useMemberInfo";

export const MypageContent = () => {
	const navigate = useNavigate();
	const { setPaymentStep } = useMultiStep();
	const { handleTotalPriceChange } = usePaymentEstimate();
	const { data: memberInfo } = useMemberInfo();

	const mypageData = useMemo<MypageData>(() => {
		return {
			profileImage:
				memberInfo.profileUrl ||
				"https://static.toss.im/illusts/img-profile-03.png",
			chargeCash: memberInfo.coin,
			points: memberInfo.promotionPoint,
		};
	}, [memberInfo]);

	const handleCharge = () => {
		handleTotalPriceChange(0);
		setPaymentStep(1);
		navigate("/payment/charge");
	};

	return (
		<div className="px-4">
			<div className="bg-gray-100 rounded-xl p-4 mt-4">
				<div className="flex justify-between items-center">
					<Text
						display="block"
						color={adaptive.grey900}
						typography="t5"
						fontWeight="semibold"
					>
						충전 코인
					</Text>
					<div className="flex items-center gap-2">
						<Text
							display="block"
							color={adaptive.grey900}
							typography="t5"
							fontWeight="bold"
							textAlign="right"
						>
							{mypageData.chargeCash.toLocaleString()}원
						</Text>
						<Button
							size="small"
							onClick={handleCharge}
							style={
								{
									"--button-background-color": "#15c67f",
								} as React.CSSProperties
							}
						>
							충전하기
						</Button>
					</div>
				</div>
				<div className="h-[13px]" />
				<Border />
				<div className="flex justify-between items-center mt-4">
					<Text
						display="block"
						color={adaptive.grey900}
						typography="t5"
						fontWeight="semibold"
					>
						내 포인트
					</Text>
					<Text
						display="block"
						color={adaptive.grey900}
						typography="t5"
						fontWeight="bold"
						textAlign="right"
					>
						{mypageData.points.toLocaleString()}원
					</Text>
				</div>
			</div>
		</div>
	);
};
