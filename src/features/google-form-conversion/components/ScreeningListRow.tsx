import type { FlowState } from "@features/google-form-conversion/types";
import { adaptive } from "@toss/tds-colors";
import { Button, ListHeader, ListRow } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";

type ScreeningListRowProps = {
	flowState: FlowState;
};

export const ScreeningListRow = ({ flowState }: ScreeningListRowProps) => {
	const navigate = useNavigate();
	const hasScreening = Boolean(
		flowState.screening?.question?.trim() &&
			typeof flowState.screening.answer === "boolean",
	);
	const screeningQuestion = flowState.screening?.question?.trim() ?? "";
	const screeningAnswer =
		typeof flowState.screening?.answer === "boolean"
			? `${flowState.screening.answer ? "O" : "X"}를 선택한 사용자`
			: "";

	const goToScreening = () => {
		navigate("/payment/google-form-conversion-screening");
	};

	return hasScreening ? (
		<>
			<ListHeader
				descriptionPosition="bottom"
				titleWidthRatio={0.8}
				title={
					<ListHeader.TitleParagraph
						color={adaptive.grey800}
						fontWeight="bold"
						typography="t4"
					>
						스크리닝 질문
					</ListHeader.TitleParagraph>
				}
				style={{ marginBottom: "-24px" }}
			/>
			<ListRow
				contents={
					<ListRow.Texts
						type="2RowTypeA"
						top={screeningQuestion}
						topProps={{ color: adaptive.grey700, fontWeight: "bold" }}
						bottom={screeningAnswer}
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
		</>
	) : (
		<>
			<ListHeader
				descriptionPosition="bottom"
				titleWidthRatio={0.8}
				title={
					<ListHeader.TitleParagraph
						color={adaptive.grey800}
						fontWeight="bold"
						typography="t4"
					>
						스크리닝 질문
					</ListHeader.TitleParagraph>
				}
				style={{ marginBottom: "-24px" }}
			/>
			<ListRow
				contents={
					<ListRow.Texts
						type="2RowTypeA"
						top="스크리닝 질문을 추가해보세요"
						topProps={{ color: adaptive.grey700, fontWeight: "bold" }}
						bottom="적합한 사람을 찾기 위해 사전 질문이에요"
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
		</>
	);
};
