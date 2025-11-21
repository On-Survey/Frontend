// 예시 ) 재사용 가능한 유틸리티 함수 또는 모듈

export const formatDate = (date: Date): string =>
	date.toLocaleDateString("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

export const formatDateDisplay = (value: Date | string): string => {
	const date = value instanceof Date ? value : new Date(value);

	if (Number.isNaN(date.getTime())) {
		return "";
	}

	return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export const formatRemainingTime = (deadline?: string): string | undefined => {
	if (!deadline) return undefined;

	try {
		const deadlineDate = new Date(deadline);
		const now = new Date();
		const diffMs = deadlineDate.getTime() - now.getTime();
		const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

		if (diffDays < 0) return "마감됨";
		if (diffDays === 0) return "오늘 마감";
		if (diffDays === 1) return "마감 하루 전";
		if (diffDays <= 7) return `마감 ${diffDays}일 전`;
		return `마감 ${Math.ceil(diffDays / 7)}주 전`;
	} catch {
		return undefined;
	}
};
