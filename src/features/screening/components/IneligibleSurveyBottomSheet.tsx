import { Asset, BottomSheet } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";

interface IneligibleSurveyBottomSheetProps {
	open: boolean;
	onClose: () => void;
	/** 미입력 시 목록에서 단일 설문 비대상 안내 문구 */
	title?: string;
	description?: string;
	/** false면 확인 시 홈으로 이동하지 않고 닫기만 (인트로 등) */
	confirmNavigatesHome?: boolean;
}

const DEFAULT_TITLE = "해당 설문에 참여할 수 없어요";
const DEFAULT_DESCRIPTION = "조건이 맞지 않아 설문 참여가 불가능해요";

export const IneligibleSurveyBottomSheet = ({
	open,
	onClose,
	title = DEFAULT_TITLE,
	description = DEFAULT_DESCRIPTION,
	confirmNavigatesHome = true,
}: IneligibleSurveyBottomSheetProps) => {
	const navigate = useNavigate();

	const handleConfirm = () => {
		if (confirmNavigatesHome) {
			navigate("/home");
		}
		onClose();
	};

	return (
		<BottomSheet
			header={<BottomSheet.Header>{title}</BottomSheet.Header>}
			headerDescription={
				<BottomSheet.HeaderDescription>
					{description}
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
