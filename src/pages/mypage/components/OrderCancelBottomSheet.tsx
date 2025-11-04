import { Asset, BottomSheet, Button, Text } from "@toss/tds-mobile";

interface OrderCancelBottomSheetProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	platform: "android" | "ios";
}

export const OrderCancelBottomSheet = ({
	open,
	onClose,
	onConfirm,
	platform,
}: OrderCancelBottomSheetProps) => {
	if (platform === "android") {
		// android
		return (
			<BottomSheet
				header={
					<BottomSheet.Header>정말 주문을 취소하시나요?</BottomSheet.Header>
				}
				headerDescription={
					<BottomSheet.HeaderDescription>
						주문을 취소하면 해당 설문은 다시 복구할 수 없습니다.
					</BottomSheet.HeaderDescription>
				}
				open={open}
				onClose={onClose}
				cta={
					<BottomSheet.DoubleCTA
						leftButton={
							<Button color="dark" variant="weak" onClick={onClose}>
								닫기
							</Button>
						}
						rightButton={<Button onClick={onConfirm}>환불</Button>}
					/>
				}
			>
				<div className="flex justify-center items-center">
					<Asset.Icon
						frameShape={{ width: 100, height: 100 }}
						name="icon-loudspeaker-1-fill"
						aria-hidden={true}
					/>
				</div>
			</BottomSheet>
		);
	}

	// iOS
	return (
		<BottomSheet
			header={<BottomSheet.Header>환불 전에 확인해 주세요</BottomSheet.Header>}
			open={open}
			onClose={onClose}
			cta={
				<BottomSheet.CTA
					color="primary"
					variant="fill"
					disabled={false}
					onClick={onConfirm}
				>
					확인했어요
				</BottomSheet.CTA>
			}
		>
			<Text style={{ margin: "0 24px" }}>
				1. 환불 여부는 앱스토어에서 결정한 후, 애플 계정 이메일로 안내드려요.{" "}
				<br />
				2. 앱스토어에서 환불 거절했는지 토스에서는 알 수 없어요. 메일을 꼭
				확인해주세요.
			</Text>
		</BottomSheet>
	);
};
