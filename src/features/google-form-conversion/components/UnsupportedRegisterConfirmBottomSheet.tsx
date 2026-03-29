import { Asset, BottomSheet, Button } from "@toss/tds-mobile";
import type { CSSProperties } from "react";

type UnsupportedRegisterConfirmBottomSheetProps = {
	open: boolean;
	onClose: () => void;
	onContinue: () => void;
};

export const UnsupportedRegisterConfirmBottomSheet = ({
	open,
	onClose,
	onContinue,
}: UnsupportedRegisterConfirmBottomSheetProps) => {
	return (
		<BottomSheet
			header={
				<BottomSheet.Header>
					미지원 문항이 남아 있어요 그대로 등록할까요?
				</BottomSheet.Header>
			}
			headerDescription={
				<BottomSheet.HeaderDescription>
					미지원된 문항은 등록 시 반영되지 않아요
				</BottomSheet.HeaderDescription>
			}
			open={open}
			onClose={onClose}
			cta={
				<BottomSheet.DoubleCTA
					leftButton={
						<Button color="dark" variant="weak" onClick={onClose}>
							뒤로가기
						</Button>
					}
					rightButton={
						<Button
							onClick={onContinue}
							style={
								{
									"--button-background-color": "#15c67f",
								} as CSSProperties
							}
						>
							진행하기
						</Button>
					}
				/>
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
					name="icon-siren-red400"
					aria-hidden={true}
				/>
			</div>
		</BottomSheet>
	);
};
