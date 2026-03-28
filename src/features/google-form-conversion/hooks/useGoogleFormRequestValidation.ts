import { validateFormRequest } from "@features/google-form-conversion/service/api";
import { useMutation } from "@tanstack/react-query";

export const useGoogleFormRequestValidation = () => {
	return useMutation({
		mutationFn: validateFormRequest,
		retry: 0,
	});
};
