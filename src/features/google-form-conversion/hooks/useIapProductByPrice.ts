import { IAP, type IapProductListItem } from "@apps-in-toss/web-framework";
import { useCallback, useState } from "react";

const parseDisplayAmount = (displayAmount: string): number =>
	parseInt(displayAmount.replace(/[^\d]/g, ""), 10);
const toMarkedUpPrice = (basePrice: number): number =>
	Math.round(basePrice * 1.1);

export const useIapProductByPrice = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const findProductByPrice = useCallback(
		async (price: number): Promise<IapProductListItem | null> => {
			const markedUpPrice = toMarkedUpPrice(price);
			console.log("[IAP][match] requested price:", price);
			console.log("[IAP][match] marked-up target price:", markedUpPrice);
			if (!Number.isFinite(price) || price <= 0) {
				setError("결제 금액이 올바르지 않아요");
				console.warn("[IAP][match] invalid price:", price);
				return null;
			}

			setIsLoading(true);
			setError(null);

			try {
				const response = await IAP.getProductItemList();
				const products = response?.products ?? [];
				const parsedProducts = products.map((product) => ({
					product,
					parsedPrice: parseDisplayAmount(product.displayAmount),
				}));

				// IAP 상품은 가격표 기준가에 약 10%가 반영된 값으로 등록되어 있어
				// 10% 반영 목표값에 가장 가까운 상품을 선택한다.
				const nearest = [...parsedProducts].sort((a, b) => {
					const diffA = Math.abs(a.parsedPrice - markedUpPrice);
					const diffB = Math.abs(b.parsedPrice - markedUpPrice);
					return diffA - diffB;
				})[0];

				if (!nearest) {
					setError("요청 금액(10% 반영)에 가까운 결제 상품이 없어요");
					console.warn("[IAP][match] no nearest product:", {
						basePrice: price,
						markedUpPrice,
					});
					return null;
				}

				console.log("[IAP][match] nearest match selected:", {
					targetPrice: markedUpPrice,
					sku: nearest.product.sku,
					displayAmount: nearest.product.displayAmount,
					displayName: nearest.product.displayName,
					parsedPrice: nearest.parsedPrice,
					diff: Math.abs(nearest.parsedPrice - markedUpPrice),
				});

				return nearest.product;
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
