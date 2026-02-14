import { adaptive } from "@toss/tds-colors";
import { Asset, Text } from "@toss/tds-mobile";
import { useGlobalStats } from "../hooks/useGlobalStats";

export const HomeGlobalStatsSection = () => {
	const { data: globalStats } = useGlobalStats();

	return (
		<div className="p-4">
			<div className="w-full h-fit rounded-[24px] p-4 backdrop-blur-none flex items-center gap-2 bg-gray-100">
				<Asset.Image
					frameShape={Asset.frameShape.CleanW24}
					backgroundColor="transparent"
					src="https://static.toss.im/2d-emojis/png/4x/u1F440.png"
					aria-hidden={true}
					style={{ aspectRatio: "1/1" }}
				/>
				<Text color={adaptive.grey800} typography="t6" fontWeight="medium">
					현재
				</Text>
				<Text color={adaptive.green400} typography="t6" fontWeight="semibold">
					{globalStats ? globalStats.dailyUserCount.toLocaleString() : 0}명
				</Text>
				<Text color={adaptive.grey800} typography="t6" fontWeight="medium">
					이 설문을 보고 있어요
				</Text>
			</div>
		</div>
	);
};
