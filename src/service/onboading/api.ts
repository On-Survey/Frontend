import { api } from "../axios";
import type { OnboardingResponse } from "./types";

export const OnboardingApi = async ({
	residence,
	interests,
}: {
	residence: string;
	interests: string[];
}) => {
	const response = await api.patch<
		OnboardingResponse,
		{ residence: string; interests: string[] }
	>("/v1/members/onboarding", {
		residence,
		interests,
	});
	return response.data;
};
