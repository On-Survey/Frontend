/**
 * 견적표·앱 내 안내는 공급가(VAT 별도)이고, 앱스토어 인앱 상품 표시 금액은 판매가(VAT 포함)로 등록되는 경우가 많음.
 * 예: 공급 18,500원 → 판매 20,350원 (×1.1)
 */
export function getGoogleFormIapRetailPriceWon(supplyPriceWon: number): number {
	return Math.round(supplyPriceWon * 1.1);
}
