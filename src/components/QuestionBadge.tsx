import { Top } from "@toss/tds-mobile";

interface QuestionBadgeProps {
	isRequired?: boolean;
}

export const QuestionBadge = ({ isRequired }: QuestionBadgeProps) => {
	return (
		<Top.SubtitleBadges
			badges={[
				{
					text: isRequired ? "필수문항" : "선택문항",
					color: isRequired ? "blue" : "elephant",
					variant: "fill",
				},
			]}
		/>
	);
};
