import type { InterestId } from "@shared/constants/topics";
import { topics } from "@shared/constants/topics";
import { colors } from "@toss/tds-colors";
import { BottomSheet, Checkbox, List, ListRow } from "@toss/tds-mobile";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

type InterestSelectBottomSheetProps = {
	open: boolean;
	onClose: () => void;
	value: InterestId[];
	onConfirm: (value: InterestId[]) => void;
};

export const InterestSelectBottomSheet = ({
	open,
	onClose,
	value,
	onConfirm,
}: InterestSelectBottomSheetProps) => {
	const [selectedIds, setSelectedIds] = useState<InterestId[]>(value);

	useEffect(() => {
		if (open) {
			setSelectedIds(value);
		}
	}, [open, value]);

	const toggle = (id: InterestId) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
		);
	};

	const handleConfirm = () => {
		onConfirm(selectedIds);
		onClose();
	};

	return (
		<BottomSheet
			header={
				<BottomSheet.Header>관련 관심사를 선택해 주세요</BottomSheet.Header>
			}
			headerDescription={
				<BottomSheet.HeaderDescription>
					더욱 맞는 대상을 찾기 위한 질문이에요.
				</BottomSheet.HeaderDescription>
			}
			open={open}
			onClose={onClose}
			cta={[]}
		>
			<div className="pb-4">
				<List>
					{topics.map((topic) => {
						const isSelected = selectedIds.includes(topic.id);
						return (
							<ListRow
								key={topic.id}
								role="checkbox"
								aria-checked={isSelected}
								onClick={() => toggle(topic.id)}
								left={
									topic.icon.type === "image" ? (
										<ListRow.AssetImage
											src={topic.icon.src || ""}
											shape="original"
											className="w-5.5 ml-1"
										/>
									) : (
										<ListRow.AssetIcon name={topic.icon.name || ""} />
									)
								}
								contents={
									<ListRow.Texts
										type="2RowTypeA"
										top={topic.name}
										topProps={{
											color: colors.grey800,
											fontWeight: "semibold",
										}}
										bottom={topic.description}
										bottomProps={{ color: colors.grey500 }}
									/>
								}
								right={
									<Checkbox.Line
										checked={isSelected}
										size={20}
										aria-hidden={true}
										style={{ pointerEvents: "none" }}
									/>
								}
								verticalPadding="large"
							/>
						);
					})}
				</List>
			</div>

			<BottomSheet.CTA
				loading={false}
				disabled={selectedIds.length === 0}
				onClick={handleConfirm}
				style={{ "--button-background-color": "#15c67f" } as CSSProperties}
			>
				확인
			</BottomSheet.CTA>
		</BottomSheet>
	);
};
