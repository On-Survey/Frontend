// 예시 ) 재사용 가능한 유틸리티 함수 또는 모듈

export const formatDate = (date: Date): string =>
  date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
