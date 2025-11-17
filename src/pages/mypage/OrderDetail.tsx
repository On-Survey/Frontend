import { getPlatformOS } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	BottomSheet,
	Button,
	FixedBottomCTA,
	Text,
	Top,
	useToast,
} from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSurveyDetail, refundSurvey } from "../../service/order";
import type { OrderDetail as OrderDetailType } from "../../types/order";
import { mapSurveyDetailToOrderDetail } from "../../utils/orderUtils";
import { OrderCancelBottomSheet } from "./components/OrderCancelBottomSheet";

// Mock 데이터 - 추후 삭제 예정
const getMockOrderDetail = (orderId: string | undefined): OrderDetailType => ({
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
});

export const OrderDetail = () => {
	const navigate = useNavigate();
	const { orderId } = useParams<{ orderId: string }>();
	const [orderDetail, setOrderDetail] = useState<OrderDetailType | null>(null);
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
	const [isCancelBottomSheetOpen, setIsCancelBottomSheetOpen] = useState(false);
	const [isSurveyCancelled, setIsSurveyCancelled] = useState(false);
	const platform = getPlatformOS();
	const { openToast } = useToast();

	useEffect(() => {
		const fetchOrderDetail = async () => {
			try {
				const surveyId = Number(orderId);
				if (!surveyId) {
					setOrderDetail(getMockOrderDetail(orderId));
					return;
				}

				const data = await getSurveyDetail(surveyId);
				const orderDetail = mapSurveyDetailToOrderDetail(data);
				setOrderDetail(orderDetail);
			} catch (error) {
				console.error("설문 상세 조회 실패:", error);
				setOrderDetail(getMockOrderDetail(orderId));
			}
		};

		fetchOrderDetail();
	}, [orderId]);

	if (!orderDetail) {
		return null;
	}

	const handleCancelOrder = async () => {
		setIsBottomSheetOpen(false);
		try {
			const surveyId = Number(orderId);
			if (Number.isNaN(surveyId) || surveyId <= 0) {
				throw new Error("잘못된 설문 ID 입니다.");
			}
			// 코인 환불 API 호출
			await refundSurvey(surveyId);
			openToast("설문 취소가 완료됐어요.", {
				type: "bottom",
				lottie: "https://static.toss.im/lotties-common/check-green-spot.json",
				higherThanCTA: true,
			});
			// 환불 완료 후 목록으로 이동
			navigate("/mypage/orderHistory");
		} catch (error) {
			openToast("환불 처리에 실패했어요. 잠시 후 다시 시도해주세요.", {
				type: "bottom",
				lottie: "https://static.toss.im/lotties-common/warning.json",
				higherThanCTA: true,
			});
			console.error(error);
		}
	};

	const handleCloseBottomSheet = () => {
		setIsBottomSheetOpen(false);
	};

	const handleCancelSurveyClick = () => {
		setIsCancelBottomSheetOpen(true);
	};

	const handleCancelSurveyConfirm = async () => {
		setIsCancelBottomSheetOpen(false);
		try {
			const surveyId = Number(orderId);
			if (Number.isNaN(surveyId) || surveyId <= 0) {
				throw new Error("잘못된 설문 ID 입니다.");
			}
			await refundSurvey(surveyId);
			openToast("설문 취소가 완료됐어요.", {
				type: "bottom",
				lottie: "https://static.toss.im/lotties-common/check-green-spot.json",
				higherThanCTA: true,
			});
			setIsSurveyCancelled(true);
			navigate("/mypage/orderHistory");
		} catch (error) {
			openToast("환불 처리에 실패했어요. 잠시 후 다시 시도해주세요.", {
				type: "bottom",
				higherThanCTA: true,
			});
			console.error(error);
		}
	};

	const handleCancelSurveyClose = () => {
		setIsCancelBottomSheetOpen(false);
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
			<div className="flex-1 px-6 overflow-y-auto pb-24">
				<Text
					display="block"
					color={adaptive.grey600}
					typography="t6"
					fontWeight="medium"
				>
					코인 결제정보
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

			<FixedBottomCTA
				color="danger"
				loading={false}
				disabled={isSurveyCancelled}
				onClick={isSurveyCancelled ? undefined : handleCancelSurveyClick}
			>
				{isSurveyCancelled ? "설문 취소 완료" : "설문 취소하기"}
			</FixedBottomCTA>

			<OrderCancelBottomSheet
				open={isBottomSheetOpen}
				onClose={handleCloseBottomSheet}
				onConfirm={handleCancelOrder}
				platform={platform}
			/>

			<BottomSheet
				header={
					<BottomSheet.Header>정말 설문을 취소하시나요?</BottomSheet.Header>
				}
				headerDescription={
					<BottomSheet.HeaderDescription>
						취소할 시 다시 복구할 수 없고, 코인이 즉시 환불돼요
					</BottomSheet.HeaderDescription>
				}
				open={isCancelBottomSheetOpen}
				onClose={handleCancelSurveyClose}
				cta={
					<BottomSheet.DoubleCTA
						leftButton={
							<Button
								color="dark"
								variant="weak"
								onClick={handleCancelSurveyClose}
							>
								닫기
							</Button>
						}
						rightButton={
							<Button color="danger" onClick={handleCancelSurveyConfirm}>
								확인
							</Button>
						}
					/>
				}
			>
				<div className="flex justify-center items-center">
					<Asset.Icon
						frameShape={{ width: 100 }}
						name="icon-loudspeaker-1-fill"
						aria-hidden={true}
					/>
				</div>
			</BottomSheet>
		</div>
	);
};

export default OrderDetail;
