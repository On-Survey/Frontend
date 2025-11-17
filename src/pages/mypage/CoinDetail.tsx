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
import { useState } from "react";
import { useParams } from "react-router-dom";
import { OrderCancelBottomSheet } from "./components/OrderCancelBottomSheet";

export const CoinDetail = () => {
	const platform = getPlatformOS();
	const { openToast } = useToast();
	useParams<{ coinId: string }>();

	// 환불 완료 여부
	const [isRefunded, setIsRefunded] = useState(false);

	// 안드로이드 전용 바텀시트
	const [isAndroidSheetOpen, setIsAndroidSheetOpen] = useState(false);
	// iOS 전용 바텀시트
	const [isIOSSheetOpen, setIsIOSSheetOpen] = useState(false);

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
						주문 일자 : 2024 . 10. 21
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
					23,400원
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
