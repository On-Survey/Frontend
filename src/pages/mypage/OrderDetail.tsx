import { getPlatformOS } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import { FixedBottomCTA, Text, Top } from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { OrderDetail as OrderDetailType } from "../../types/order";
import { OrderCancelBottomSheet } from "./components/OrderCancelBottomSheet";

export const OrderDetail = () => {
	const navigate = useNavigate();
	const { orderId } = useParams<{ orderId: string }>();
	const [orderDetail, setOrderDetail] = useState<OrderDetailType | null>(null);
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
	const platform = getPlatformOS();

	useEffect(() => {
		// mock
		const mockOrderDetail: OrderDetailType = {
			id: Number(orderId) || 1,
			title: "반려동물 외모 취향에 관한 설문",
			status: "active",
			orderDate: "2024. 10. 21",
			paymentInfo: {
				responseCount: 50,
				responseCountPrice: 200,
				gender: "단일",
				genderPrice: 200,
				ageRange: "10대",
				ageRangePrice: 700,
				location: "서울(쉬움)",
				locationPrice: 70,
			},
			totalPrice: "23,400원",
		};
		setOrderDetail(mockOrderDetail);
	}, [orderId]);

	if (!orderDetail) {
		return null;
	}

	const handleCancelOrderClick = () => {
		setIsBottomSheetOpen(true);
	};

	const handleCancelOrder = () => {
		setIsBottomSheetOpen(false);
		navigate("/mypage/orderHistory");
	};

	const handleCloseBottomSheet = () => {
		setIsBottomSheetOpen(false);
	};

	return (
		<div className="flex flex-col w-full h-screen">
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						{orderDetail.title}
					</Top.TitleParagraph>
				}
				subtitleTop={
					<Top.SubtitleBadges
						badges={[{ text: "노출중", color: "blue", variant: "weak" }]}
					/>
				}
				subtitleBottom={
					<Top.SubtitleParagraph size={15}>
						주문 일자 : {orderDetail.orderDate}
					</Top.SubtitleParagraph>
				}
			/>
			<div className="flex-1 p-6">
				<Text
					display="block"
					color={adaptive.grey900}
					typography="st8"
					fontWeight="bold"
				>
					결제 정보
				</Text>

				<div className="mt-4 bg-gray-50 rounded-2xl p-4">
					<div className="flex justify-between items-center mb-4">
						<Text
							display="block"
							color={adaptive.grey600}
							typography="t5"
							fontWeight="semibold"
						>
							희망 응답자 수 - {orderDetail.paymentInfo.responseCount}명
						</Text>
						<Text
							display="block"
							color={adaptive.grey800}
							typography="t5"
							fontWeight="semibold"
						>
							{orderDetail.paymentInfo.responseCountPrice.toLocaleString()}원
						</Text>
					</div>

					<div className="flex justify-between items-center mb-4">
						<Text
							display="block"
							color={adaptive.grey600}
							typography="t5"
							fontWeight="semibold"
						>
							성별 - {orderDetail.paymentInfo.gender}
						</Text>
						<Text
							display="block"
							color={adaptive.grey800}
							typography="t5"
							fontWeight="semibold"
							textAlign="right"
						>
							{orderDetail.paymentInfo.genderPrice.toLocaleString()}원
						</Text>
					</div>

					<div className="flex justify-between items-center mb-4">
						<Text
							display="block"
							color={adaptive.grey600}
							typography="t5"
							fontWeight="semibold"
						>
							연령대 - {orderDetail.paymentInfo.ageRange}
						</Text>
						<Text
							display="block"
							color={adaptive.grey800}
							typography="t5"
							fontWeight="semibold"
							textAlign="right"
						>
							{orderDetail.paymentInfo.ageRangePrice.toLocaleString()}원
						</Text>
					</div>

					<div className="flex justify-between items-center mb-4">
						<Text
							display="block"
							color={adaptive.grey600}
							typography="t5"
							fontWeight="semibold"
						>
							거주지 - {orderDetail.paymentInfo.location}
						</Text>
						<Text
							display="block"
							color={adaptive.grey800}
							typography="t5"
							fontWeight="semibold"
							textAlign="right"
						>
							{orderDetail.paymentInfo.locationPrice.toLocaleString()}원
						</Text>
					</div>
				</div>

				<div className="mt-8 flex justify-between items-center">
					<Text
						display="block"
						color={adaptive.grey900}
						typography="st8"
						fontWeight="bold"
					>
						최종 결제 금액
					</Text>
					<Text
						display="block"
						color={adaptive.blue500}
						typography="st8"
						fontWeight="bold"
					>
						{orderDetail.totalPrice}
					</Text>
				</div>
			</div>
			<FixedBottomCTA loading={false} onClick={handleCancelOrderClick}>
				주문 취소
			</FixedBottomCTA>

			<OrderCancelBottomSheet
				open={isBottomSheetOpen}
				onClose={handleCloseBottomSheet}
				onConfirm={handleCancelOrder}
				platform={platform}
			/>
		</div>
	);
};

export default OrderDetail;
