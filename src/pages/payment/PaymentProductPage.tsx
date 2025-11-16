import {
	graniteEvent,
	IAP,
	type IapProductListItem,
} from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import {
	Border,
	Checkbox,
	FixedBottomCTA,
	List,
	ListRow,
	Paragraph,
	Text,
	Top,
} from "@toss/tds-mobile";
import { useEffect, useMemo, useState } from "react";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { usePaymentEstimate } from "../../contexts/PaymentContext";
import { type createUserResponse, getUserInfo } from "../../service/user";
import { calculateRequiredCoinAmount } from "../../utils/paymentCalculator";

export const PaymentProductPage = () => {
	const { goNextPayment, goPrevPayment } = useMultiStep();
	const { selectedCoinAmount, handleSelectedCoinAmountChange, totalPrice } =
		usePaymentEstimate();

	const [products, setProducts] = useState<IapProductListItem[]>([]);
	const [userInfo, setUserInfo] = useState<createUserResponse | null>(null);

	const displayAmount = useMemo(() => {
		if (!userInfo) {
			return totalPrice;
		}
		return calculateRequiredCoinAmount(userInfo.result.coin, totalPrice);
	}, [userInfo, totalPrice]);

	const handleNext = () => {
		goNextPayment();
	};

	useEffect(() => {
		async function fetchProducts() {
			try {
				const response = await IAP.getProductItemList();
				setProducts(response?.products ?? []);
				const userInfoResult = await getUserInfo();
				setUserInfo(userInfoResult);
			} catch (error) {
				console.error("상품 목록을 가져오는 데 실패했어요:", error);
			}
		}

		fetchProducts();
	}, []);

	useEffect(() => {
		const unsubscription = graniteEvent.addEventListener("backEvent", {
			onEvent: () => {
				goPrevPayment();
			},
			onError: (error) => {
				alert(`에러가 발생했어요: ${error}`);
			},
		});

		return unsubscription;
	}, [goPrevPayment]);

	return (
		<div className="flex flex-col h-screen">
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
			<div className="px-4 flex flex-col gap-2 bg-gray-100 rounded-2xl p-4 mx-6 mb-4">
				<div className="flex justify-between items-center gap-1">
					<Text color={adaptive.grey700} typography="t6" fontWeight="regular">
						총 필요 코인
					</Text>
					<Text color={adaptive.grey700} typography="t5" fontWeight="semibold">
						{totalPrice.toLocaleString()} 코인
					</Text>
				</div>
				<div className="flex justify-between items-center gap-1">
					<Text color={adaptive.grey700} typography="t6" fontWeight="regular">
						현재 보유한 코인
					</Text>
					<Text color={adaptive.grey700} typography="t5" fontWeight="semibold">
						{userInfo?.result.coin.toLocaleString()} 코인
					</Text>
				</div>
				<div className="flex justify-between items-center gap-1">
					<Text color={adaptive.grey700} typography="t6" fontWeight="regular">
						충전 필요 코인
					</Text>
					<Text color={adaptive.blue500} typography="t5" fontWeight="semibold">
						{calculateRequiredCoinAmount(
							userInfo?.result.coin ?? 0,
							totalPrice,
						).toLocaleString()}
						코인
					</Text>
				</div>
			</div>
			<Border variant="height16" />
			<div className="flex-1 overflow-y-auto mt-4">
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
			</div>
			<FixedBottomCTA
				disabled={!selectedCoinAmount}
				loading={false}
				onClick={handleNext}
			>
				다음
			</FixedBottomCTA>
		</div>
	);
};
