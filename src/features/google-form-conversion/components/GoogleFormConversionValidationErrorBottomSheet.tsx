import { Asset, BottomSheet } from "@toss/tds-mobile";

type GoogleFormConversionValidationErrorBottomSheetProps = {
	open: boolean;
	message: string;
	onClose: () => void;
};

export const GoogleFormConversionValidationErrorBottomSheet = ({
	open,
	message,
	onClose,
}: GoogleFormConversionValidationErrorBottomSheetProps) => {
	return (
		<BottomSheet
			header={<BottomSheet.Header>폼을 확인할 수 없어요</BottomSheet.Header>}
			headerDescription={
				<BottomSheet.HeaderDescription>{message}</BottomSheet.HeaderDescription>
			}
			open={open}
			onClose={onClose}
			cta={
				<BottomSheet.CTA
					color="primary"
					variant="fill"
					disabled={false}
					onClick={onClose}
				>
					확인
				</BottomSheet.CTA>
			}
		>
			<div style={{ height: "16px" }} />
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Asset.Icon
					frameShape={{ width: 100 }}
					name="icon-error-circle-mono"
					aria-hidden={true}
				/>
			</div>
		</BottomSheet>
	);
};
