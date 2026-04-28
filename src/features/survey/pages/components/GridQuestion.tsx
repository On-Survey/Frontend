import { TextWithLinks } from "@features/survey/components/TextWithLinks";
import type { TransformedSurveyQuestion } from "@features/survey/service/surveyParticipation";
import { adaptive } from "@toss/tds-colors";
import { Asset, ListHeader, Spacing, Text } from "@toss/tds-mobile";
import { useMemo } from "react";

const ANSWER_SEPARATOR = "|||";

interface GridQuestionProps {
	question: TransformedSurveyQuestion;
	answer?: string;
	onAnswerChange: (questionId: number, answer: string) => void;
	error?: boolean;
	errorMessage?: string;
	isExpanded?: boolean;
	onToggleExpand?: () => void;
}

const parseGridAnswers = (
	answer: string | undefined,
): Record<string, string> => {
	if (!answer) return {};
	try {
		return JSON.parse(answer) as Record<string, string>;
	} catch {
		return {};
	}
};

const isColumnSelected = (
	gridAnswers: Record<string, string>,
	rowLabel: string,
	colLabel: string,
): boolean => {
	const val = gridAnswers[rowLabel] ?? "";
	return val.split(ANSWER_SEPARATOR).includes(colLabel);
};

const COLUMN_VIOLATION_MESSAGE = "열당 응답을 두개 이상 선택하지 마세요";

const buildStableKeys = (items: string[]) => {
	const counts = new Map<string, number>();
	return items.map((label) => {
		const nextCount = (counts.get(label) ?? 0) + 1;
		counts.set(label, nextCount);
		return { label, key: `${label}-${nextCount}` };
	});
};

export const GridQuestion = ({
	question,
	answer,
	onAnswerChange,
	error,
	errorMessage,
	isExpanded = true,
	onToggleExpand,
}: GridQuestionProps) => {
	const isCheckbox = question.type === "checkboxGrid";
	const requirementText = question.isRequired ? "필수" : "선택";
	const distinctRuleText =
		question.isRequired && question.isChoiceDistinct
			? " / 1열 당 응답 1개"
			: "";
	const rows = question.rows ?? [];
	const columns = question.columns ?? [];
	const rowItems = useMemo(() => buildStableKeys(rows), [rows]);
	const columnItems = useMemo(() => buildStableKeys(columns), [columns]);

	const gridAnswers = useMemo(() => parseGridAnswers(answer), [answer]);

	/** 체크박스 그리드에서 동일 열이 2행 이상 선택됐는지 실시간 감지 */
	const columnViolation = useMemo(() => {
		if (!isCheckbox) return false;
		return columnItems.some((col) => {
			const count = rowItems.filter((row) =>
				isColumnSelected(gridAnswers, row.label, col.label),
			).length;
			return count > 1;
		});
	}, [isCheckbox, gridAnswers, rowItems, columnItems]);

	/** 표시할 에러: 열 위반 > 부모에서 전달된 에러 순 */
	const displayError = columnViolation
		? COLUMN_VIOLATION_MESSAGE
		: error && errorMessage
			? errorMessage
			: null;

	const handleCellClick = (rowLabel: string, colLabel: string) => {
		const currentVal = gridAnswers[rowLabel] ?? "";

		let newVal: string;

		if (isCheckbox) {
			// 체크박스: 다중 선택 토글
			const selected = currentVal ? currentVal.split(ANSWER_SEPARATOR) : [];
			const idx = selected.indexOf(colLabel);
			if (idx >= 0) {
				selected.splice(idx, 1);
			} else {
				selected.push(colLabel);
			}
			newVal = selected.join(ANSWER_SEPARATOR);
		} else {
			// 객관식: 단일 선택 토글
			newVal = currentVal === colLabel ? "" : colLabel;
		}

		const newAnswers = { ...gridAnswers, [rowLabel]: newVal };
		onAnswerChange(question.questionId, JSON.stringify(newAnswers));
	};

	return (
		<>
			<ListHeader
				descriptionPosition="top"
				title={
					<ListHeader.TitleParagraph
						color={adaptive.grey800}
						fontWeight="bold"
						typography="t4"
					>
						<TextWithLinks
							text={question.title}
							variant="inline"
							inheritLinkSize
						/>
					</ListHeader.TitleParagraph>
				}
				description={
					<ListHeader.DescriptionParagraph>
						{`${requirementText}${distinctRuleText}`}
					</ListHeader.DescriptionParagraph>
				}
				right={
					<div style={{ marginRight: "20px" }}>
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW24}
							name={isExpanded ? "icon-arrow-up-mono" : "icon-arrow-down-mono"}
							color={adaptive.grey600}
							aria-label={isExpanded ? "접기" : "펼치기"}
							onClick={onToggleExpand}
						/>
					</div>
				}
			/>
			{question.description && (
				<div className="px-6! mb-2!">
					<TextWithLinks text={question.description} />
				</div>
			)}

			{isExpanded && (
				<>
					{/* 그리드 영역 */}
					<div
						className="overflow-x-auto w-full"
						style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
					>
						<style>{`.grid-question-scroll::-webkit-scrollbar { display: none }`}</style>
						<div
							className="grid-question-scroll px-6 pb-2"
							style={{
								display: "grid",
								gridTemplateColumns: `minmax(80px, auto) ${columnItems.map(() => "minmax(56px, 1fr)").join(" ")}`,
								minWidth: "fit-content",
								width: "100%",
							}}
						>
							{/* 헤더 행 */}
							<div />
							{columnItems.map((col) => (
								<div
									key={`col-${col.key}`}
									className="flex justify-center items-center py-2 px-1"
								>
									<Text
										color={adaptive.grey600}
										typography="t6"
										fontWeight="semibold"
										textAlign="center"
									>
										{col.label}
									</Text>
								</div>
							))}

							{/* 데이터 행들 */}
							{rowItems.map((row) => (
								<>
									<div
										key={`row-label-${row.key}`}
										className="flex items-center py-3 pr-3"
									>
										<Text
											color={adaptive.grey800}
											typography="t5"
											fontWeight="medium"
										>
											{row.label}
										</Text>
									</div>
									{columnItems.map((col) => {
										const selected = isColumnSelected(
											gridAnswers,
											row.label,
											col.label,
										);
										return (
											<button
												key={`cell-${row.key}-${col.key}`}
												type="button"
												className="flex justify-center items-center py-3 cursor-pointer border-none bg-transparent"
												onClick={() => handleCellClick(row.label, col.label)}
												aria-label={`${row.label} - ${col.label}`}
												aria-pressed={selected}
											>
												{isCheckbox ? (
													// 체크박스 그리드 셀
													<Asset.Icon
														frameShape={Asset.frameShape.CleanW24}
														backgroundColor="transparent"
														name="icon-square-dark-grey-check"
														color={
															selected ? adaptive.green500 : adaptive.grey300
														}
														aria-label={`${row.label} ${col.label} 선택`}
														ratio="1/1"
													/>
												) : (
													// 객관식 그리드 셀
													<Asset.Icon
														frameShape={Asset.frameShape.CleanW24}
														backgroundColor="transparent"
														name="icon-system-check-outlined"
														color={
															selected ? adaptive.green500 : adaptive.grey300
														}
														aria-label={`${row.label} ${col.label} 선택`}
														ratio="1/1"
													/>
												)}
											</button>
										);
									})}
								</>
							))}
						</div>
					</div>

					{/* 에러 메시지 */}
					{displayError && (
						<Text
							display="block"
							color={adaptive.red500}
							typography="t7"
							fontWeight="regular"
							className="px-6! mt-2!"
						>
							{displayError}
						</Text>
					)}
				</>
			)}
			<Spacing size={32} />
		</>
	);
};
