import { BottomNavigation } from "@shared/components/BottomNavigation";
import { useMultiStep } from "@shared/contexts/MultiStepContext";
import { usePaymentEstimate } from "@shared/contexts/PaymentContext";
import { getMemberInfo } from "@shared/service/userInfo";
import type { MypageData } from "@shared/types/mypage";
import { useQuery } from "@tanstack/react-query";
import { adaptive } from "@toss/tds-colors";
import { Border, Button, List, ListRow, Text } from "@toss/tds-mobile";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export const Mypage = () => {
	const navigate = useNavigate();
	const { setPaymentStep } = useMultiStep();
	const { handleTotalPriceChange } = usePaymentEstimate();

	const { data: memberInfo, error } = useQuery({
		queryKey: ["memberInfo"],
		queryFn: getMemberInfo,
		staleTime: 2 * 60 * 1000,
		gcTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
	});

	const mypageData = useMemo<MypageData | null>(() => {
		if (!memberInfo) return null;
		return {
			profileImage:
				memberInfo.profileUrl ||
				"https://static.toss.im/illusts/img-profile-03.png",
			chargeCash: memberInfo.coin,
			points: memberInfo.promotionPoint,
		};
	}, [memberInfo]);

	const handleHome = () => {
		navigate("/home");
	};

	const handleMySurvey = () => {
		navigate("/mysurvey");
	};

	const handleOrderHistory = () => {
		navigate("/mypage/orderHistory");
	};

	const handleRefundPolicy = () => {
		navigate("/mypage/refundPolicy");
	};

	const handlePrivacyPolicy = () => {
		navigate("/mypage/privacyPolicy");
	};

	const handleTermsOfService = () => {
		navigate("/mypage/termsOfService");
	};

	const handleBusinessInfo = () => {
		navigate("/mypage/businessInfo");
	};

	const handlePromotionNotice = () => {
		navigate("/mypage/promotionNotice");
	};

	const handleCoinHistory = () => {
		navigate("/mypage/coinHistory");
	};

	const handleCharge = () => {
		// 충전 전용 플로우: totalPrice를 0으로 설정하고 상품 선택 페이지부터 시작
		handleTotalPriceChange(0);
		setPaymentStep(1);
		navigate("/payment/charge");
	};

	if (error) {
		console.error("회원 정보 조회 실패:", error);
	}

	if (!mypageData) {
		return null;
	}

	return (
		<div className="flex flex-col w-full h-screen">
			<div className="flex-1 overflow-y-auto p-2 pb-20">
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
				<div className="h-4" />
				<List>
					<ListRow
						contents={
							<ListRow.Texts
								type="1RowTypeA"
								top="코인 사용 내역"
								topProps={{ color: adaptive.grey700 }}
							/>
						}
						arrowType="right"
						onClick={handleOrderHistory}
					/>
					<ListRow
						contents={
							<ListRow.Texts
								type="1RowTypeA"
								top="결제내역"
								topProps={{ color: adaptive.grey700 }}
							/>
						}
						arrowType="right"
						onClick={handleCoinHistory}
					/>
					<ListRow
						contents={
							<ListRow.Texts
								type="1RowTypeA"
								top="프로모션 안내 및 유의사항"
								topProps={{ color: adaptive.grey700 }}
							/>
						}
						arrowType="right"
						onClick={handlePromotionNotice}
					/>
					<ListRow
						contents={
							<ListRow.Texts
								type="1RowTypeA"
								top="환불 정책"
								topProps={{ color: adaptive.grey700 }}
							/>
						}
						arrowType="right"
						onClick={handleRefundPolicy}
					/>
					<ListRow
						contents={
							<ListRow.Texts
								type="1RowTypeA"
								top="서비스 이용약관"
								topProps={{ color: adaptive.grey700 }}
							/>
						}
						arrowType="right"
						onClick={handleTermsOfService}
					/>
					<ListRow
						contents={
							<ListRow.Texts
								type="1RowTypeA"
								top="개인 정보 처리 방침"
								topProps={{ color: adaptive.grey700 }}
							/>
						}
						arrowType="right"
						onClick={handlePrivacyPolicy}
					/>
					<ListRow
						contents={
							<ListRow.Texts
								type="1RowTypeA"
								top="사업자 정보"
								topProps={{ color: adaptive.grey700 }}
							/>
						}
						arrowType="right"
						onClick={handleBusinessInfo}
					/>
				</List>
			</div>

			<BottomNavigation
				currentPage="more"
				onHomeClick={handleHome}
				onMySurveyClick={handleMySurvey}
			/>
		</div>
	);
};
