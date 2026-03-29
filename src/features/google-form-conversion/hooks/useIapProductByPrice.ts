import { IAP, type IapProductListItem } from "@apps-in-toss/web-framework";
import { useEffect, useState } from "react";

const parseDisplayAmount = (displayAmount: string): number =>
	parseInt(displayAmount.replace(/[^\d]/g, ""), 10);

export const useIapProductByPrice = (price: number) => {
	const [selectedProduct, setSelectedProduct] =
		useState<IapProductListItem | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		const fetchProducts = async () => {
			if (!Number.isFinite(price) || price <= 0) {
				if (!isMounted) return;
				setSelectedProduct(null);
				setError("결제 금액이 올바르지 않아요");
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				const response = await IAP.getProductItemList();
				const products = response?.products ?? [];

				const matchingProduct = products.find(
					(product) => parseDisplayAmount(product.displayAmount) === price,
				);

				const fallbackProduct =
					matchingProduct ??
					[...products].sort((a, b) => {
						const diffA = Math.abs(parseDisplayAmount(a.displayAmount) - price);
						const diffB = Math.abs(parseDisplayAmount(b.displayAmount) - price);
						return diffA - diffB;
					})[0] ??
					null;

				if (!isMounted) return;

				if (!fallbackProduct) {
					setSelectedProduct(null);
					setError("결제 가능한 상품을 찾지 못했어요");
					return;
				}

				setSelectedProduct(fallbackProduct);
			} catch (e) {
				console.error("상품 목록을 가져오는 데 실패했어요:", e);
				if (!isMounted) return;
				setSelectedProduct(null);
				setError("상품 정보를 불러오지 못했어요");
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		void fetchProducts();

		return () => {
			isMounted = false;
		};
	}, [price]);
	console.log("selectedProduct", selectedProduct);
	return { selectedProduct, isLoading, error };
};
