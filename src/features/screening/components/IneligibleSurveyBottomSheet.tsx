import { adaptive } from "@toss/tds-colors";
import { Asset, BottomSheet } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";

interface IneligibleSurveyBottomSheetProps {
	open: boolean;
	onClose: () => void;
}

export const IneligibleSurveyBottomSheet = ({
	open,
	onClose,
}: IneligibleSurveyBottomSheetProps) => {
	const navigate = useNavigate();

	const handleConfirm = () => {
		onClose();
		navigate("/home");
	};

	return (
		<BottomSheet
			header={
				<BottomSheet.Header>해당 설문에 참여할 수 없어요</BottomSheet.Header>
			}
			headerDescription={
				<BottomSheet.HeaderDescription>
					조건이 맞지 않아 설문 참여가 불가능해요
				</BottomSheet.HeaderDescription>
			}
			open={open}
			onClose={handleConfirm}
			cta={
				<BottomSheet.CTA
					color="primary"
					variant="fill"
					disabled={false}
					onClick={handleConfirm}
				>
					확인
				</BottomSheet.CTA>
			}
		>
			<div style={{ height: `16px` }} />
			<div
				style={{
					display: `flex`,
					justifyContent: `center`,
					alignItems: `center`,
				}}
			>
				<Asset.Image
					frameShape={{ width: 100 }}
					src="https://static.toss.im/2d-emojis/png/4x/u1F622.png"
					aria-hidden={true}
				/>
			</div>
		</BottomSheet>
	);
};
