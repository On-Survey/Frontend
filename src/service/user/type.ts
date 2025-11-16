export interface createUserResponse {
	code: number;
	message: string;
	result: {
		name: string;
		profileUrl: string;
		coin: number;
		promotionPoint: number;
	};
	success: boolean;
}
