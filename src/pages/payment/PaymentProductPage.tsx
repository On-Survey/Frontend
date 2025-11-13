import { IAP, type IapProductListItem } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import {
	Checkbox,
	FixedBottomCTA,
	List,
	ListRow,
	Paragraph,
	Top,
} from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { usePaymentEstimate } from "../../contexts/PaymentContext";

export const PaymentProductPage = () => {
	const { goNextPayment } = useMultiStep();
	const { selectedCoinAmount, handleSelectedCoinAmountChange } =
		usePaymentEstimate();

	const [products, setProducts] = useState<IapProductListItem[]>([]);

	const displayAmount = selectedCoinAmount ?? 30000;

	const handleNext = () => {
		goNextPayment();
	};

	useEffect(() => {
		async function fetchProducts() {
			try {
				const response = await IAP.getProductItemList();
				setProducts(response?.products ?? []);
			} catch (error) {
				console.error("상품 목록을 가져오는 데 실패했어요:", error);
			}
		}

		fetchProducts();
	}, []);

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
				{products.map((product) => {
					const isSelected = selectedCoinAmount?.sku === product.sku;
					return (
						<ListRow
							key={product.sku}
							role="checkbox"
							aria-checked={isSelected}
							contents={
								<ListRow.Texts
									type="2RowTypeA"
									top={product.displayName}
									topProps={{ color: adaptive.grey700, fontWeight: "bold" }}
									bottom={
										<Paragraph.Text>{product.displayAmount}</Paragraph.Text>
									}
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
							onClick={() =>
								handleSelectedCoinAmountChange({
									sku: product.sku,
									displayName: product.displayName,
									displayAmount: product.displayAmount,
								})
							}
						/>
					);
				})}
			</List>
			<FixedBottomCTA
				disabled={!selectedCoinAmount}
				loading={false}
				onClick={handleNext}
			>
				다음
			</FixedBottomCTA>
		</>
	);
};
