import { Asset, BottomSheet, Button } from "@toss/tds-mobile";
import { useMultiStep } from "../../../contexts/MultiStepContext";

interface CoinAlertBottomSheetProps {
	isOpen: boolean;
	handleClose: () => void;
}

export const CoinAlertBottomSheet = ({
	isOpen,
	handleClose,
}: CoinAlertBottomSheetProps) => {
	const { goNextPayment } = useMultiStep();

	const handleNextPayment = () => {
		goNextPayment();
		handleClose();
	};

	return (
		<BottomSheet
			header={<BottomSheet.Header>보유 코인이 부족해요</BottomSheet.Header>}
			headerDescription={
				<BottomSheet.HeaderDescription>
					설문 등록을 위해 코인을 충전할게요
				</BottomSheet.HeaderDescription>
			}
			open={isOpen}
			onClose={handleClose}
			cta={
				<BottomSheet.DoubleCTA
					leftButton={
						<Button color="dark" variant="weak" onClick={handleClose}>
							닫기
						</Button>
					}
					rightButton={<Button onClick={handleNextPayment}>충전하기</Button>}
				/>
			}
		>
			<div className="h-4" />
			<div className="flex justify-center items-center">
				<Asset.Icon
					frameShape={{ width: 100 }}
					name="icon-coin-yellow"
					aria-hidden={true}
				/>
			</div>
		</BottomSheet>
	);
};
