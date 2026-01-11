import { adaptive } from "@toss/tds-colors";
import {
	Checkbox,
	FixedBottomCTA,
	ListHeader,
	ListRow,
	Top,
} from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import {
	REGIONS_5_PERCENT_SURCHARGE,
	REGIONS_10_PERCENT_SURCHARGE,
	REGIONS_15_PERCENT_SURCHARGE,
	REGIONS_NO_SURCHARGE,
	type RegionCode,
} from "../../constants/payment";
import { usePaymentEstimate } from "../../contexts/PaymentContext";

export const LocationSelectPage = () => {
	const { estimate, handleEstimateChange } = usePaymentEstimate();

	const navigate = useNavigate();

	const setLocation = (value: RegionCode) => {
		handleEstimateChange({ ...estimate, location: value });
	};

	const isChecked = (value: RegionCode) => estimate.location === value;

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						거주지를 선택해 주세요
					</Top.TitleParagraph>
				}
			/>
			<ListHeader
				title={
					<ListHeader.TitleParagraph
						color={adaptive.grey800}
						fontWeight="regular"
						typography="t7"
					>
						추가요금이 부가되지 않아요
					</ListHeader.TitleParagraph>
				}
				descriptionPosition="bottom"
			/>
			{REGIONS_NO_SURCHARGE.map((region) => (
				<ListRow
					key={region.value}
					role="checkbox"
					aria-checked={isChecked(region.value)}
					onClick={() => setLocation(region.value)}
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
			<ListHeader
				title={
					<ListHeader.TitleParagraph
						color={adaptive.grey800}
						fontWeight="regular"
						typography="t7"
					>
						5%의 추가요금이 부과돼요
					</ListHeader.TitleParagraph>
				}
				descriptionPosition="bottom"
			/>
			<div>
				{REGIONS_5_PERCENT_SURCHARGE.map((region) => (
					<ListRow
						key={region.value}
						role="checkbox"
						aria-checked={isChecked(region.value)}
						onClick={() => setLocation(region.value)}
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
			<ListHeader
				title={
					<ListHeader.TitleParagraph
						color={adaptive.grey800}
						fontWeight="regular"
						typography="t7"
					>
						10%의 추가요금이 부과돼요
					</ListHeader.TitleParagraph>
				}
				descriptionPosition="bottom"
			/>
			<div>
				{REGIONS_10_PERCENT_SURCHARGE.map((region) => (
					<ListRow
						key={region.value}
						role="checkbox"
						aria-checked={isChecked(region.value)}
						onClick={() => setLocation(region.value)}
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
			<ListHeader
				title={
					<ListHeader.TitleParagraph
						color={adaptive.grey800}
						fontWeight="regular"
						typography="t7"
					>
						15%의 추가요금이 부과돼요
					</ListHeader.TitleParagraph>
				}
				descriptionPosition="bottom"
			/>
			<div>
				{REGIONS_15_PERCENT_SURCHARGE.map((region) => (
					<ListRow
						key={region.value}
						role="checkbox"
						aria-checked={isChecked(region.value)}
						onClick={() => setLocation(region.value)}
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
			<FixedBottomCTA
				loading={false}
				onClick={() => navigate("/createForm")}
				style={
					{ "--button-background-color": "#15c67f" } as React.CSSProperties
				}
			>
				다음
			</FixedBottomCTA>
		</>
	);
};
