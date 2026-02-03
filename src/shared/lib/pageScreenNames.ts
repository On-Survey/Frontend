/**
 * GA4 "페이지 제목 및 화면 이름별 조회수" 리포트용
 * pathname → 화면 이름(한글) 매핑
 */
const PATH_TO_SCREEN_NAME: Record<string, string> = {
	"/": "인트로",
	"/ad": "광고 랜딩",
	"/home": "메인",
	"/google-form-conversion-landing": "구글폼 랜딩",
	"/onboarding": "온보딩",
	"/main": "메인 (레거시)",
	"/createFormStart": "설문 등록 시작",
	"/mysurvey": "내 설문",
	"/mypage": "마이페이지",
	"/mypage/orderHistory": "주문 내역",
	"/mypage/coinHistory": "코인 내역",
	"/mypage/refundPolicy": "환불 정책",
	"/mypage/privacyPolicy": "개인정보 처리방침",
	"/mypage/termsOfService": "이용약관",
	"/mypage/businessInfo": "사업자 정보",
	"/mypage/promotionNotice": "프로모션 안내",
	"/oxScreening": "OX 퀴즈",
	"/survey": "설문 참여",
	"/surveyList": "설문 목록",
	"/survey/singleChoice": "설문 - 객관식",
	"/survey/essay": "설문 - 서술형",
	"/survey/shortAnswer": "설문 - 단답형",
	"/survey/rating": "설문 - 별점",
	"/survey/nps": "설문 - NPS",
	"/survey/number": "설문 - 숫자",
	"/survey/date": "설문 - 날짜",
	"/survey/section": "설문 - 섹션",
	"/survey/complete": "설문 완료",
	"/survey/ineligible": "참여 불가",
	"/result/shortAnswer": "결과 - 단답형",
	"/result/longAnswer": "결과 - 서술형",
	"/result/multipleChoice": "결과 - 객관식",
	"/result/rating": "결과 - 별점",
	"/result/nps": "결과 - NPS",
	"/result/date": "결과 - 날짜",
	"/result/number": "결과 - 숫자",
	"/estimate": "견적",
	"/createForm": "설문 만들기",
	"/payment/google-form-conversion": "구글폼 변환 신청",
	"/payment/google-form-conversion-check": "구글폼 변환 안내",
	"/payment/google-form-conversion-payment-confirm": "구글폼 변환 결제 확인",
	"/payment/google-form-conversion-success": "구글폼 변환 완료",
	"/payment/google-form-conversion-privacy-consent": "개인정보 동의",
	"/payment/location": "지역 선택",
	"/estimate/location": "지역 선택 (견적)",
	"/estimateNavigation": "견적 안내",
	"/payment/charge": "코인 충전",
	"/payment/free-registration-notice": "무료 등록 안내",
	"/payment/loading": "결제 처리 중",
	"/payment/success": "결제 완료",
	"/createForm/multipleChoice": "설문 만들기 - 객관식",
	"/createForm/rating": "설문 만들기 - 별점",
	"/createForm/nps": "설문 만들기 - NPS",
	"/createForm/shortAnswer": "설문 만들기 - 단답형",
	"/createForm/longAnswer": "설문 만들기 - 서술형",
	"/createForm/date": "설문 만들기 - 날짜",
	"/createForm/number": "설문 만들기 - 숫자",
};

/** 동적 경로 패턴 (정확 매칭 실패 시 prefix로 매칭, 더 구체적인 패턴이 먼저 오도록) */
const PATH_PREFIX_TO_SCREEN_NAME: [string, string][] = [
	["/mypage/orderHistory/", "주문 상세"],
	["/mypage/coinHistory/", "코인 상세"],
	["/createForm/multipleChoice/questions/", "문항 편집"],
	["/createForm/multipleChoice/questions", "문항 목록"],
	["/createForm/", "설문 만들기 - 문항 편집"],
	["/mysurvey/", "설문 응답 상세"],
];

/**
 * pathname으로 화면 이름 조회
 * GA4 페이지 제목·화면별 조회수 리포트에서 화면별로 분리되어 표시됨
 */
export const getPageScreenName = (pathname: string): string => {
	// query string 제거
	const path = pathname.split("?")[0];

	// 1. 정확 매칭
	const exact = PATH_TO_SCREEN_NAME[path];
	if (exact) return exact;

	// 2. prefix 매칭 (동적 경로)
	for (const [prefix, name] of PATH_PREFIX_TO_SCREEN_NAME) {
		if (path.startsWith(prefix)) return name;
	}

	// 3. 기본값: path 그대로 사용
	return path || "인트로";
};
