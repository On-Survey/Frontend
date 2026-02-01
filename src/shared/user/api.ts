import { api } from "../api/axios";
import type { createUserResponse } from "./type";

export const getUserInfo = async (): Promise<createUserResponse> => {
	const response = await api.get<createUserResponse>("/v1/members");
	return response.data;
};
