interface ThrowOnErrorProps {
	error: unknown;
}

/**
 * error가 있으면 throw하여 상위 Error Boundary가 잡을 수 있게 합니다.
 */
export const ThrowOnError = ({ error }: ThrowOnErrorProps) => {
	if (error) {
		throw error;
	}
	return null;
};
