import type { InterestId } from "@shared/constants/topics";
import { topics } from "@shared/constants/topics";
import { adaptive } from "@toss/tds-colors";
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
			open={open}
			onClose={onClose}
			maxHeight="90vh"
			cta={
				<BottomSheet.CTA
					loading={false}
					disabled={selectedIds.length === 0}
					onClick={handleConfirm}
					style={{ "--button-background-color": "#15c67f" } as CSSProperties}
				>
					확인
				</BottomSheet.CTA>
			}
		>
			<List>
				{topics.map((topic) => {
					const isSelected = selectedIds.includes(topic.id);
					return (
						<ListRow
							key={topic.id}
							role="checkbox"
							aria-checked={isSelected}
							onClick={() => toggle(topic.id)}
							contents={
								<ListRow.Texts
									type="1RowTypeA"
									top={topic.name}
									topProps={{
										color: adaptive.grey800,
										fontWeight: "semibold",
									}}
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
		</BottomSheet>
	);
};
