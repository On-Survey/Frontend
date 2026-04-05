import { IAP, type IapProductListItem } from "@apps-in-toss/web-framework";
import { useCallback, useState } from "react";

/** IAP `displayAmount` 문자열 → 정수 원화 (결제 확인·옵션 CTA 표시에 공통 사용) */
export const parseIapDisplayAmount = (displayAmount: string): number =>
	parseInt(displayAmount.replace(/[^\d]/g, ""), 10);

const toMarkedUpPrice = (basePrice: number): number =>
	Math.round(basePrice * 1.1);

/**
 * 가격표 기준가에 대해 App Store IAP에 등록된 금액(목표 ≈ 기준가×1.1)과 가장 가까운 상품을 고른다.
 * (로딩/에러 상태 없음 — 미리보기 표시·훅 내부에서 공통 사용)
 */
export const fetchNearestIapProductForTablePrice = async (
	baseTablePrice: number,
): Promise<IapProductListItem | null> => {
	if (!Number.isFinite(baseTablePrice) || baseTablePrice <= 0) {
		return null;
	}
	const markedUpPrice = toMarkedUpPrice(baseTablePrice);
	const response = await IAP.getProductItemList();
	const products = response?.products ?? [];
	const parsedProducts = products.map((product) => ({
		product,
		parsedPrice: parseIapDisplayAmount(product.displayAmount),
	}));

	const nearest = [...parsedProducts].sort((a, b) => {
		const diffA = Math.abs(a.parsedPrice - markedUpPrice);
		const diffB = Math.abs(b.parsedPrice - markedUpPrice);
		return diffA - diffB;
	})[0];

	return nearest?.product ?? null;
};

export const useIapProductByPrice = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const findProductByPrice = useCallback(
		async (price: number): Promise<IapProductListItem | null> => {
			console.log("[IAP][match] requested price:", price);
			console.log(
				"[IAP][match] marked-up target price:",
				Math.round(price * 1.1),
			);
			if (!Number.isFinite(price) || price <= 0) {
				setError("결제 금액이 올바르지 않아요");
				console.warn("[IAP][match] invalid price:", price);
				return null;
			}

			setIsLoading(true);
			setError(null);

			try {
				const product = await fetchNearestIapProductForTablePrice(price);
				if (!product) {
					setError("요청 금액(10% 반영)에 가까운 결제 상품이 없어요");
					console.warn("[IAP][match] no nearest product:", {
						basePrice: price,
						markedUpPrice: Math.round(price * 1.1),
					});
					return null;
				}

				const parsedPrice = parseIapDisplayAmount(product.displayAmount);
				console.log("[IAP][match] nearest match selected:", {
					targetPrice: Math.round(price * 1.1),
					sku: product.sku,
					displayAmount: product.displayAmount,
					displayName: product.displayName,
					parsedPrice,
					diff: Math.abs(parsedPrice - Math.round(price * 1.1)),
				});

				return product;
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
