//숫자 입력값의 유효성을 검사 함수
export const validateNumberInput = (
	value: string,
	options: { min?: number; max?: number } = {},
): boolean => {
	const { min = 1, max = 100 } = options;

	if (value === "" || /^\d+$/.test(value)) {
		if (value === "") {
			return true;
		}
		const num = parseInt(value, 10);
		return num >= min && num <= max;
	}
	return false;
};

//이메일 입력값의 유효성을 검사 함수
export const validateEmail = (email: string): boolean => {
	if (email === "") {
		return true;
	}
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};
