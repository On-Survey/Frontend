export const parseDateLocal = (dateStr: string): Date => {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
		return new Date(NaN);
	}

	const [yearStr, monthStr, dayStr] = dateStr.split("-");

	const year = Number(yearStr);
	const month = Number(monthStr);
	const day = Number(dayStr);

	if (
		!Number.isInteger(year) ||
		!Number.isInteger(month) ||
		!Number.isInteger(day)
	) {
		return new Date(NaN);
	}

	const parsed = new Date(year, month - 1, day);

	if (
		parsed.getFullYear() !== year ||
		parsed.getMonth() !== month - 1 ||
		parsed.getDate() !== day
	) {
		return new Date(NaN);
	}

	return parsed;
};

export const formatDate = (date: Date): string =>
	date.toLocaleDateString("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

export const formatDateDisplay = (value: Date | string): string => {
	let date: Date;

	if (value instanceof Date) {
		date = value;
	} else {
		date = parseDateLocal(value);
		if (Number.isNaN(date.getTime())) {
			date = new Date(value);
		}
	}

	if (Number.isNaN(date.getTime())) {
		return "";
	}

	return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export const formatDateToISO = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

/** `YYYY-MM-DD` → 해당 날짜 로컬 23:59:59 (API 마감일 시각 문자열용) */
export const isoDateToEndOfDayLocal = (isoDate: string): string => {
	const trimmed = isoDate.trim();
	if (!trimmed) return trimmed;
	return `${trimmed}T23:59:59`;
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
