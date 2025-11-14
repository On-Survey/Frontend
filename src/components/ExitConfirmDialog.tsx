import { ConfirmDialog } from "@toss/tds-mobile";

export const ExitConfirmDialog = ({
	open,
	onCancel,
	onConfirm,
}: {
	open: boolean;
	onCancel: () => void;
	onConfirm: () => void;
}) => {
	return (
		<ConfirmDialog
			open={open}
			onClose={onCancel}
			title="온서베이를 종료할까요?"
			cancelButton={
				<ConfirmDialog.CancelButton size="xlarge" onClick={onCancel}>
					취소
				</ConfirmDialog.CancelButton>
			}
			confirmButton={
				<ConfirmDialog.ConfirmButton size="xlarge" onClick={onConfirm}>
					종료하기
				</ConfirmDialog.ConfirmButton>
			}
		/>
	);
};
