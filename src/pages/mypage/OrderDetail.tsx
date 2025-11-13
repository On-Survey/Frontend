import { getPlatformOS } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import { Button, Text, Top, useToast } from "@toss/tds-mobile";
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
	const { openToast } = useToast();

	useEffect(() => {
		// mock
		const mockOrderDetail: OrderDetailType = {
			id: Number(orderId) || 1,
			title: "반려동물 외모 취향에 관한 설문",
			status: "active",
			orderDate: "2024 . 10. 21",
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
			approvalNumber: "303503544",
			paymentStatus: "승인",
			paymentDateTime: "2020년 7월 29일 15:14",
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
		if (platform === "android") {
			openToast("환불접수가 완료됐어요.", {
				type: "bottom",
				lottie: "https://static.toss.im/lotties-common/check-green-spot.json",
				higherThanCTA: false,
			});
		}
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
			<div className="p-4">
				<Button
					size="medium"
					color="dark"
					variant="weak"
					onClick={handleCancelOrderClick}
				>
					{platform === "ios" ? "앱스토어에서 환불 신청" : "환불 받기"}
				</Button>
			</div>
			<div className="flex-1 px-6 overflow-y-auto">
				{[
					{
						label: "승인번호",
						value: orderDetail.approvalNumber || "",
					},
					{
						label: "결제상태",
						value: orderDetail.paymentStatus || "",
					},
					{
						label: "결제일시",
						value: orderDetail.paymentDateTime || "",
					},
					{
						label: "최종 결제 금액",
						value: orderDetail.totalPrice,
					},
				].map((item) => (
					<div
						key={item.label}
						className="flex justify-between items-center mb-5"
					>
						<Text
							display="block"
							color={adaptive.grey600}
							typography="st8"
							fontWeight="medium"
						>
							{item.label}
						</Text>
						<Text
							display="block"
							color={adaptive.grey900}
							typography="st8"
							fontWeight="medium"
						>
							{item.value}
						</Text>
					</div>
				))}

				<Text
					display="block"
					color={adaptive.grey600}
					typography="st8"
					fontWeight="medium"
				>
					결제정보
				</Text>

				<div className="mt-4 bg-gray-50 rounded-2xl p-4">
					{[
						{
							label: "희망 응답자 수",
							value: `${orderDetail.paymentInfo.responseCount}명`,
							price: orderDetail.paymentInfo.responseCountPrice,
						},
						{
							label: "성별",
							value: orderDetail.paymentInfo.gender,
							price: orderDetail.paymentInfo.genderPrice,
						},
						{
							label: "연령대",
							value: orderDetail.paymentInfo.ageRange,
							price: orderDetail.paymentInfo.ageRangePrice,
						},
						{
							label: "거주지",
							value: orderDetail.paymentInfo.location,
							price: orderDetail.paymentInfo.locationPrice,
						},
					].map((item) => (
						<div
							key={item.label}
							className="flex justify-between items-center mb-4 last:mb-0"
						>
							<Text
								display="block"
								color={adaptive.grey600}
								typography="t5"
								fontWeight="semibold"
							>
								{item.label} - {item.value}
							</Text>
							<Text
								display="block"
								color={adaptive.grey800}
								typography="t5"
								fontWeight="semibold"
								textAlign="right"
							>
								{item.price.toLocaleString()}원
							</Text>
						</div>
					))}
				</div>
			</div>

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
