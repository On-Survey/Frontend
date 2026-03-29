import { Asset, BottomSheet, Button } from "@toss/tds-mobile";
import type { CSSProperties } from "react";

type ValidationSuccessBottomSheetProps = {
	open: boolean;
	convertibleCount: number;
	onClose: () => void;
	onContinue: () => void;
};

export const ValidationSuccessBottomSheet = ({
	open,
	convertibleCount,
	onClose,
	onContinue,
}: ValidationSuccessBottomSheetProps) => {
	return (
		<BottomSheet
			header={
				<BottomSheet.Header>소중한 설문 링크 감사해요</BottomSheet.Header>
			}
			headerDescription={
				<BottomSheet.HeaderDescription>
					설문에 있는 {convertibleCount}문항이 성공적으로 변환됐어요
				</BottomSheet.HeaderDescription>
			}
			open={open}
			onClose={onClose}
			cta={
				<BottomSheet.DoubleCTA
					leftButton={
						<Button color="dark" variant="weak" onClick={onClose}>
							수정하기
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
							다음
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
					name="icon-security-check"
					aria-hidden={true}
				/>
			</div>
		</BottomSheet>
	);
};
