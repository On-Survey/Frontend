// 지역 데이터 타입 정의
export interface RegionData {
	id: string;
	name: string;
	checked: boolean;
}

// 지역 데이터 배열
export const regions: RegionData[] = [
	{ id: "seoul", name: "서울", checked: false },
	{ id: "gyeonggi", name: "경기", checked: false },
	{ id: "incheon", name: "인천", checked: false },
	{ id: "gangwon", name: "강원", checked: false },
	{ id: "chungbuk", name: "충북", checked: false },
	{ id: "chungnam", name: "충남", checked: false },
	{ id: "daejeon", name: "대전", checked: false },
	{ id: "sejong", name: "세종", checked: false },
	{ id: "jeonbuk", name: "전북", checked: false },
	{ id: "jeonnam", name: "전남", checked: false },
	{ id: "gyeongbuk", name: "경북", checked: false },
	{ id: "gyeongnam", name: "경남", checked: false },
	{ id: "gwangju", name: "광주", checked: false },
	{ id: "ulsan", name: "울산", checked: false },
	{ id: "daegu", name: "대구", checked: false },
	{ id: "busan", name: "부산", checked: false },
	{ id: "jeju", name: "제주", checked: false },
];
