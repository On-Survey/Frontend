import { validateFormRequest } from "@features/google-form-conversion/service/api";
import { useMutation } from "@tanstack/react-query";

export const useGoogleFormRequestValidation = () => {
	return useMutation({
		mutationFn: validateFormRequest,
		/** 4xx(예: 400 FORM_REQUEST_003)는 재시도하지 않음 */
		retry: 0,
	});
};
