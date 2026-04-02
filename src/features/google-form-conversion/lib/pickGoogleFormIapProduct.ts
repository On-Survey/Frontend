import type { IapProductListItem } from "@apps-in-toss/web-framework";

const parseProductPriceWon = (p: IapProductListItem): number =>
	parseInt(String(p.displayAmount).replace(/[^\d]/g, ""), 10) || 0;

/**
 * 스토어 콘솔에 등록한 상품 SKU를 금액별로 고정할 때 사용.
 * 키는 인앱 표시 금액(판매가) 권장. 예: {"20350":"com.onsurvey.googleform.t50q130"}
 * 공급가 키(18500)만 써둔 기존 설정도 함께 조회한다.
 */
function getSkuOverrideForPrice(
	retailPriceWon: number,
	supplyPriceWon: number,
): string | undefined {
	const raw = import.meta.env.VITE_GOOGLE_FORM_IAP_SKU_BY_PRICE as
		| string
		| undefined;
	if (!raw?.trim()) return undefined;
	try {
		const map = JSON.parse(raw) as Record<string, string>;
		return (
			map[String(retailPriceWon)] ?? map[String(supplyPriceWon)] ?? undefined
		);
	} catch {
		return undefined;
	}
}

/**
 * 인앱 `displayAmount`(판매가)와 정확히 일치하는 상품만 선택한다.
 * (가까운 금액으로 대체하지 않음 — 오과금 방지)
 */
export function pickGoogleFormIapProduct(
	products: IapProductListItem[],
	retailPriceWon: number,
	supplyPriceWon: number,
): IapProductListItem | null {
	const skuOverride = getSkuOverrideForPrice(retailPriceWon, supplyPriceWon);
	if (skuOverride) {
		const bySku = products.find((p) => p.sku === skuOverride);
		if (bySku) return bySku;
	}

	const samePrice = products.filter(
		(p) => parseProductPriceWon(p) === retailPriceWon,
	);
	if (samePrice.length === 0) return null;
	if (samePrice.length === 1) return samePrice[0];

	const preferred =
		samePrice.find(
			(p) =>
				p.displayName?.includes("구글폼") ||
				p.displayName?.includes("Google") ||
				p.displayName?.includes("온서베이"),
		) ?? samePrice[0];
	return preferred;
}
