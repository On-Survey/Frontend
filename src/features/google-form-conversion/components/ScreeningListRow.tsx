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
	const entryHint =
		flowState.screening?.answer === true
			? "○ 선택 시 설문 진입"
			: "X 선택 시 설문 진입";

	const goToScreening = () => {
		navigate("/payment/google-form-conversion-screening");
	};

	return hasScreening ? (
		<div className="flex flex-col gap-2">
			<ListRow
				contents={
					<ListRow.Texts
						type="2RowTypeA"
						top="스크리닝 질문이 등록됐어요"
						topProps={{ color: adaptive.grey800, fontWeight: "bold" }}
						bottom="수정 및 삭제 필요 시 편집을 눌러주세요"
						bottomProps={{ color: adaptive.grey600 }}
					/>
				}
				right={
					<Button size="medium" variant="weak" onClick={goToScreening}>
						편집
					</Button>
				}
				verticalPadding="large"
				leftAlignment="top"
			/>
			<div className="overflow-hidden rounded-2xl bg-[#F2F4F6] mx-4">
				<ListRow
					contents={
						<ListRow.Texts
							type="2RowTypeA"
							top={screeningQuestion}
							topProps={{ color: adaptive.grey800, fontWeight: "bold" }}
							bottom={entryHint}
							bottomProps={{ color: adaptive.grey600 }}
						/>
					}
					verticalPadding="large"
				/>
			</div>
		</div>
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
