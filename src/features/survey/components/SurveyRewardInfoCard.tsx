import { colors } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";

const DEFAULT_REWARD_PRICE = 200;

interface SurveyRewardInfoCardProps {
	isFree?: boolean;
	questionCount: number;
	remainingTimeText?: string | null;
	price?: number;
}

const getEstimatedTime = (
	questionCount: number,
	rewardPrice: number,
): number => {
	if (rewardPrice === 500) return 4;
	if (questionCount <= 10) return 2;
	if (questionCount <= 20) return 4;
	return 4;
};

export const SurveyRewardInfoCard = ({
	isFree,
	questionCount,
	remainingTimeText,
	price,
}: SurveyRewardInfoCardProps) => {
	const rewardPrice =
		price != null && Number.isFinite(Number(price))
			? Number(price)
			: DEFAULT_REWARD_PRICE;
	const estimatedTime = getEstimatedTime(questionCount, rewardPrice);

	return (
		<div className="px-4">
			<div className="w-full rounded-2xl border border-green-500 p-5 shadow-sm">
				<Text color={colors.grey900} typography="t5" fontWeight="semibold">
					{isFree === true
						? "참여보상이 없는 설문이에요"
						: `참여 보상 : ${rewardPrice}원`}
				</Text>
				<div className="h-2" />
				<Text color={colors.grey900} typography="t5" fontWeight="semibold">
					소요 시간 : {estimatedTime}분
				</Text>
				{remainingTimeText ? (
					<>
						<div className="h-2" />
						<Text color={colors.grey700} typography="t7" fontWeight="regular">
							{remainingTimeText}
						</Text>
					</>
				) : null}
			</div>
		</div>
	);
};
