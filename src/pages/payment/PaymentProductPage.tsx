import { adaptive } from "@toss/tds-colors";
import {
	Checkbox,
	FixedBottomCTA,
	List,
	ListRow,
	Paragraph,
	Top,
} from "@toss/tds-mobile";
import { COIN_OPTIONS } from "../../constants/payment";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { usePaymentEstimate } from "../../contexts/PaymentContext";

export const PaymentProductPage = () => {
	const { goNextPayment } = useMultiStep();

	const { selectedCoinAmount, handleSelectedCoinAmountChange } =
		usePaymentEstimate();

	const displayAmount = selectedCoinAmount ?? 30000;

	const handleNext = () => {
		goNextPayment();
	};

	return (
		<>
			<ListRow
				contents={
					<ListRow.Texts
						type="2RowTypeA"
						top="현재 보유 코인"
						topProps={{ color: adaptive.grey700, fontWeight: `bold` }}
						bottom="10000코인"
						bottomProps={{ color: adaptive.grey600 }}
					/>
				}
				leftAlignment="center"
				className="mx-auto"
			/>
			<Top
				title={
					<Top.TitleParagraph size={28}>
						{displayAmount.toLocaleString()}코인
					</Top.TitleParagraph>
				}
				subtitleTop={
					<Top.SubtitleParagraph size={13}>충전 필요금액</Top.SubtitleParagraph>
				}
				upperGap={40}
				rightVerticalAlign="end"
			/>
			<List>
				{COIN_OPTIONS.map((option) => {
					const isSelected = selectedCoinAmount === option.amount;
					return (
						<ListRow
							key={option.amount}
							role="checkbox"
							aria-checked={isSelected}
							contents={
								<ListRow.Texts
									type="2RowTypeA"
									top={`${option.amount.toLocaleString()}코인`}
									topProps={{ color: adaptive.grey700, fontWeight: "bold" }}
									bottom={<Paragraph.Text>{option.price}</Paragraph.Text>}
									bottomProps={{ color: adaptive.grey600 }}
								/>
							}
							right={
								<Checkbox.Line
									checked={isSelected}
									size={30}
									aria-hidden={true}
								/>
							}
							verticalPadding="large"
							onClick={() => handleSelectedCoinAmountChange(option.amount)}
						/>
					);
				})}
			</List>
			<FixedBottomCTA loading={false} onClick={handleNext}>
				다음
			</FixedBottomCTA>
		</>
	);
};
