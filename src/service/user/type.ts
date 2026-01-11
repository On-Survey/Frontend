export interface createUserResponse {
	code: number;
	message: string;
	result: {
		name: string;
		profileUrl: string;
		coin: number;
		promotionPoint: number;
		isOnboardingCompleted: boolean;
		residence?: string;
		age?: string;
		gender?: string;
	};
	success: boolean;
}
