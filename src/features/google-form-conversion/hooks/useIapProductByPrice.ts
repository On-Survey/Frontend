import { IAP, type IapProductListItem } from "@apps-in-toss/web-framework";
import { useCallback, useState } from "react";

const parseDisplayAmount = (displayAmount: string): number =>
	parseInt(displayAmount.replace(/[^\d]/g, ""), 10);

export const useIapProductByPrice = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const findProductByPrice = useCallback(
		async (price: number): Promise<IapProductListItem | null> => {
			if (!Number.isFinite(price) || price <= 0) {
				setError("결제 금액이 올바르지 않아요");
				return null;
			}

			setIsLoading(true);
			setError(null);

			try {
				const response = await IAP.getProductItemList();
				const products = response?.products ?? [];

				const exact = products.find(
					(product) => parseDisplayAmount(product.displayAmount) === price,
				);

				const nearest =
					exact ??
					[...products].sort((a, b) => {
						const diffA = Math.abs(parseDisplayAmount(a.displayAmount) - price);
						const diffB = Math.abs(parseDisplayAmount(b.displayAmount) - price);
						return diffA - diffB;
					})[0] ??
					null;

				if (!nearest) {
					setError("결제 가능한 상품을 찾지 못했어요");
					return null;
				}

				return nearest;
			} catch (e) {
				console.error("상품 목록을 가져오는 데 실패했어요:", e);
				setError("상품 정보를 불러오지 못했어요");
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	return { findProductByPrice, isLoading, error };
};
