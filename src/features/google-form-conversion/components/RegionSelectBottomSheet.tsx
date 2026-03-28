import {
	REGIONS_5_PERCENT_SURCHARGE,
	REGIONS_10_PERCENT_SURCHARGE,
	REGIONS_15_PERCENT_SURCHARGE,
	REGIONS_NO_SURCHARGE,
	type RegionCode,
} from "@features/payment/constants/payment";
import { adaptive } from "@toss/tds-colors";
import { BottomSheet, Checkbox, ListRow } from "@toss/tds-mobile";

const REGION_OPTIONS = [
	...REGIONS_NO_SURCHARGE,
	...REGIONS_5_PERCENT_SURCHARGE,
	...REGIONS_10_PERCENT_SURCHARGE,
	...REGIONS_15_PERCENT_SURCHARGE,
];

type RegionSelectBottomSheetProps = {
	open: boolean;
	onClose: () => void;
	value: RegionCode;
	onChange: (value: RegionCode) => void;
};

export const RegionSelectBottomSheet = ({
	open,
	onClose,
	value,
	onChange,
}: RegionSelectBottomSheetProps) => {
	const select = (code: RegionCode) => {
		onChange(code);
		onClose();
	};

	const isChecked = (code: RegionCode) => value === code;

	return (
		<BottomSheet
			header={<BottomSheet.Header>거주지를 선택해 주세요</BottomSheet.Header>}
			open={open}
			onClose={onClose}
			cta={[]}
		>
			<div className="pb-4">
				{REGION_OPTIONS.map((region) => (
					<ListRow
						key={region.value}
						role="checkbox"
						aria-checked={isChecked(region.value)}
						onClick={() => select(region.value)}
						contents={
							<ListRow.Texts
								type="1RowTypeA"
								top={region.label}
								topProps={{ color: adaptive.grey700 }}
							/>
						}
						right={
							<Checkbox.Line
								checked={isChecked(region.value)}
								aria-hidden={true}
							/>
						}
					/>
				))}
			</div>
		</BottomSheet>
	);
};
