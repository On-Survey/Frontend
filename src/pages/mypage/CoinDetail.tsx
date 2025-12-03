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
import { useParams } from "react-router-dom";
import { getPaymentHistory } from "../../service/payments";
import type { PaymentHistoryItem } from "../../service/payments/types";
import { OrderCancelBottomSheet } from "./components/OrderCancelBottomSheet";

export const CoinDetail = () => {
	const platform = getPlatformOS();
	const { openToast } = useToast();
	const { coinId } = useParams<{ coinId: string }>();

	const [paymentInfo, setPaymentInfo] = useState<PaymentHistoryItem | null>(
		null,
	);

	const [isRefunded, setIsRefunded] = useState(false);
	const [isAndroidSheetOpen, setIsAndroidSheetOpen] = useState(false);
	const [isIOSSheetOpen, setIsIOSSheetOpen] = useState(false);

	useEffect(() => {
		const fetchPaymentDetail = async () => {
			if (!coinId) return;

			try {
				const paymentId = Number.parseInt(coinId, 10);
				const history = await getPaymentHistory();
				const payment = history.find((item) => item.paymentId === paymentId);

				if (payment) {
					setPaymentInfo(payment);
				} else {
					openToast("결제 내역을 찾을 수 없어요", {
						type: "bottom",
					});
				}
			} catch (err) {
				console.error("결제 내역 조회 실패:", err);
				openToast("결제 내역을 불러오는데 실패했어요", {
					type: "bottom",
				});
			}
		};

		void fetchPaymentDetail();
	}, [coinId, openToast]);

	const handleRefundClick = () => {
		if (platform === "android") {
			setIsAndroidSheetOpen(true);
		} else {
			setIsIOSSheetOpen(true);
		}
	};

	const handleRefundConfirm = () => {
		setIsAndroidSheetOpen(false);
		setIsIOSSheetOpen(false);
		setIsRefunded(true);
		openToast("설문 취소가 완료됐어요.", {
			type: "bottom",
			lottie: "https://static.toss.im/lotties-common/check-green-spot.json",
			higherThanCTA: true,
		});
	};

	const handleRefundClose = () => {
		setIsAndroidSheetOpen(false);
		setIsIOSSheetOpen(false);
	};

	if (!paymentInfo) {
		return null;
	}

	const formattedAmount = `${paymentInfo.totalAmount.toLocaleString()}원`;

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						코인 결제 내역
					</Top.TitleParagraph>
				}
				subtitleTop={<Top.SubtitleParagraph></Top.SubtitleParagraph>}
				subtitleBottom={
					<Top.SubtitleParagraph size={15}>
						주문 일자 : {paymentInfo.paymentDate}
					</Top.SubtitleParagraph>
				}
			/>

			<div className="px-6 py-4">
				<Text
					display="block"
					color={adaptive.grey600}
					typography="t5"
					fontWeight="medium"
				>
					최종 결제 금액
				</Text>
				<Text
					display="block"
					color={adaptive.grey900}
					typography="t5"
					fontWeight="medium"
					textAlign="right"
				>
					{formattedAmount}
				</Text>
			</div>

			{!isRefunded && (
				<FixedBottomCTA
					color="danger"
					loading={false}
					onClick={handleRefundClick}
				>
					{platform === "android"
						? "환불 신청하기"
						: "앱스토어에서 환불 신청하기"}
				</FixedBottomCTA>
			)}

			{/* Android BottomSheet */}
			<BottomSheet
				header={
					<BottomSheet.Header>정말 코인을 환불할까요?</BottomSheet.Header>
				}
				open={isAndroidSheetOpen}
				onClose={handleRefundClose}
				cta={
					<BottomSheet.DoubleCTA
						leftButton={
							<Button color="dark" variant="weak" onClick={handleRefundClose}>
								닫기
							</Button>
						}
						rightButton={
							<Button color="danger" onClick={handleRefundConfirm}>
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

			{/* iOS BottomSheet */}
			<OrderCancelBottomSheet
				open={isIOSSheetOpen}
				onClose={handleRefundClose}
				onConfirm={handleRefundConfirm}
				platform={platform}
			/>
		</>
	);
};

export default CoinDetail;
