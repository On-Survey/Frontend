import { Top } from "@toss/tds-mobile";

interface QuestionBadgeProps {
	isRequired?: boolean;
}

export const QuestionBadge = ({ isRequired }: QuestionBadgeProps) => {
	return (
		<Top.SubtitleBadges
			badges={[
				{
					text: isRequired ? "필수" : "선택",
					color: isRequired ? "green" : "elephant",
					variant: "fill",
				},
			]}
		/>
	);
};
