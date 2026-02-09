import { adaptive } from "@toss/tds-colors";
import { Border, Text } from "@toss/tds-mobile";

export const MypageContentLoading = () => {
	return (
		<div className="px-4">
			<div className="bg-gray-100 rounded-xl p-4 mt-4">
				<div className="flex justify-between items-center">
					<Text
						display="block"
						color={adaptive.grey900}
						typography="t5"
						fontWeight="semibold"
					>
						충전 코인
					</Text>
					<div className="flex items-center gap-2">
						<div className="h-5 w-16 rounded bg-gray-200 animate-pulse" />
						<div className="h-8 w-20 rounded bg-gray-200 animate-pulse" />
					</div>
				</div>
				<div className="h-[13px]" />
				<Border />
				<div className="flex justify-between items-center mt-4">
					<Text
						display="block"
						color={adaptive.grey900}
						typography="t5"
						fontWeight="semibold"
					>
						내 포인트
					</Text>
					<div className="h-5 w-12 rounded bg-gray-200 animate-pulse" />
				</div>
			</div>
		</div>
	);
};
