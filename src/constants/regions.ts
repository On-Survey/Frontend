// 지역 데이터 타입 정의
export interface RegionData {
	id: string;
	name: string;
	checked: boolean;
	value: string;
}

// 지역 데이터 배열
export const regions: RegionData[] = [
	{ id: "seoul", name: "서울", checked: false, value: "SEOUL" },
	{ id: "gyeonggi", name: "경기", checked: false, value: "GYEONGGI" },
	{ id: "incheon", name: "인천", checked: false, value: "INCHEON" },
	{ id: "gangwon", name: "강원", checked: false, value: "GANGWON" },
	{ id: "chungbuk", name: "충북", checked: false, value: "CHUNGBUK" },
	{ id: "chungnam", name: "충남", checked: false, value: "CHUNGNAM" },
	{ id: "daejeon", name: "대전", checked: false, value: "DAEJEON" },
	{ id: "sejong", name: "세종", checked: false, value: "SEJONG" },
	{ id: "jeonbuk", name: "전북", checked: false, value: "JEONBUK" },
	{ id: "jeonnam", name: "전남", checked: false, value: "JEONNAM" },
	{ id: "gyeongbuk", name: "경북", checked: false, value: "GYEONGBUK" },
	{ id: "gyeongnam", name: "경남", checked: false, value: "GYEONGNAM" },
	{ id: "gwangju", name: "광주", checked: false, value: "GWANGJU" },
	{ id: "ulsan", name: "울산", checked: false, value: "ULSAN" },
	{ id: "daegu", name: "대구", checked: false, value: "DAEGU" },
	{ id: "busan", name: "부산", checked: false, value: "BUSAN" },
	{ id: "jeju", name: "제주", checked: false, value: "JEJU" },
];
