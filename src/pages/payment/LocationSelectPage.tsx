import { adaptive } from "@toss/tds-colors";
import {
	Checkbox,
	FixedBottomCTA,
	ListHeader,
	ListRow,
	Top,
} from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import { usePaymentEstimate } from "../../contexts/PaymentEstimateContext";

export const LocationSelectPage = () => {
	const { estimate, handleEstimateChange } = usePaymentEstimate();

	const navigate = useNavigate();

	const setLocation = (value: string) => {
		handleEstimateChange({ ...estimate, location: value });
	};

	const isChecked = (value: string) => estimate.location === value;

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
			{["전체"].map((region) => (
				<ListRow
					key={region}
					role="checkbox"
					aria-checked={isChecked(region)}
					onClick={() => setLocation(region)}
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top={region}
							topProps={{ color: adaptive.grey700 }}
						/>
					}
					right={
						<Checkbox.Line checked={isChecked(region)} aria-hidden={true} />
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
				{["서울", "경기"].map((region) => (
					<ListRow
						key={region}
						role="checkbox"
						aria-checked={isChecked(region)}
						onClick={() => setLocation(region)}
						contents={
							<ListRow.Texts
								type="1RowTypeA"
								top={region}
								topProps={{ color: adaptive.grey700 }}
							/>
						}
						right={
							<Checkbox.Line checked={isChecked(region)} aria-hidden={true} />
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
				{["인천", "대전", "세종", "부산", "울산", "대구", "광주"].map(
					(region) => (
						<ListRow
							key={region}
							role="checkbox"
							aria-checked={isChecked(region)}
							onClick={() => setLocation(region)}
							contents={
								<ListRow.Texts
									type="1RowTypeA"
									top={region}
									topProps={{ color: adaptive.grey700 }}
								/>
							}
							right={
								<Checkbox.Line checked={isChecked(region)} aria-hidden={true} />
							}
						/>
					),
				)}
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
				{["강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"].map(
					(region) => (
						<ListRow
							key={region}
							role="checkbox"
							aria-checked={isChecked(region)}
							onClick={() => setLocation(region)}
							contents={
								<ListRow.Texts
									type="1RowTypeA"
									top={region}
									topProps={{ color: adaptive.grey700 }}
								/>
							}
							right={
								<Checkbox.Line checked={isChecked(region)} aria-hidden={true} />
							}
						/>
					),
				)}
			</div>
			<FixedBottomCTA loading={false} onClick={() => navigate("/createForm")}>
				다음
			</FixedBottomCTA>
		</>
	);
};
