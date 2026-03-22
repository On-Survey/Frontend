import type { GoogleFormConversionFlowState } from "@features/google-form-conversion/types";
import { adaptive } from "@toss/tds-colors";
import { Asset, Button, ListRow } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";

type GoogleFormConversionScreeningListRowProps = {
	flowState: GoogleFormConversionFlowState;
};

export const GoogleFormConversionScreeningListRow = ({
	flowState,
}: GoogleFormConversionScreeningListRowProps) => {
	const navigate = useNavigate();
	const hasScreening = Boolean(
		flowState.screening?.question?.trim() &&
			typeof flowState.screening.answer === "boolean",
	);

	const goToScreening = () => {
		navigate("/payment/google-form-conversion-screening", {
			state: flowState,
		});
	};

	return hasScreening ? (
		<ListRow
			left={
				<ListRow.ImageContainer>
					<Asset.Icon
						frameShape={Asset.frameShape.CircleMedium}
						accPosition="bottom-right"
						acc={
							<Asset.Image src="https://static.toss.im/icons/svg/icon-check-circle-green.svg" />
						}
						accMasking="circle"
						name="icon-document-check-lines-fill"
						aria-hidden={true}
					/>
				</ListRow.ImageContainer>
			}
			contents={
				<ListRow.Texts
					type="2RowTypeA"
					top="스크리닝 질문"
					topProps={{ color: adaptive.grey700, fontWeight: "bold" }}
					bottom="적합한 응답자를 선별하는 질문"
					bottomProps={{ color: adaptive.grey600 }}
				/>
			}
			right={
				<Button size="medium" variant="weak" onClick={goToScreening}>
					수정
				</Button>
			}
			verticalPadding="large"
			leftAlignment="top"
		/>
	) : (
		<ListRow
			left={
				<ListRow.FillIcon
					shape="squircle"
					name="icon-document-check-lines-fill"
					size="large"
				/>
			}
			contents={
				<ListRow.Texts
					type="2RowTypeA"
					top="스크리닝 질문"
					topProps={{ color: adaptive.grey700, fontWeight: "bold" }}
					bottom="적합한 응답자를 선별하는 질문"
					bottomProps={{ color: adaptive.grey600 }}
				/>
			}
			right={
				<Button size="medium" variant="weak" onClick={goToScreening}>
					추가
				</Button>
			}
			verticalPadding="large"
		/>
	);
};
