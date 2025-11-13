import { colors } from "@toss/tds-colors";
import { Asset, Badge, Button, ProgressBar, Text } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import type { ActiveSurvey, ClosedSurvey, DraftSurvey } from "./types";

type SurveyState = "draft" | "active" | "closed";
type BadgeColor = "green" | "blue" | "elephant";

interface SurveyCardProps {
	survey: DraftSurvey | ActiveSurvey | ClosedSurvey;
	type: SurveyState;
}

export const SurveyCard = ({ survey, type }: SurveyCardProps) => {
	const navigate = useNavigate();
	const badgeConfig: Record<SurveyState, { color: BadgeColor; label: string }> =
		{
			draft: { color: "green", label: "작성중" },
			active: { color: "blue", label: "노출중" },
			closed: { color: "elephant", label: "마감" },
		};

	const config = badgeConfig[type];

	const handleDetailClick = () => {
		if (type !== "draft") {
			navigate(`/mysurvey/${survey.id}`);
		}
	};

	return (
		<div className="bg-gray-50 rounded-xl p-4 relative">
			<div className="flex items-start justify-between mb-2">
				<Badge variant="weak" color={config.color} size="small">
					{config.label}
				</Badge>
				<button
					type="button"
					className="cursor-pointer"
					aria-label="더보기"
					onClick={handleDetailClick}
					disabled={type === "draft"}
				>
					<Asset.Icon
						frameShape={{ width: 24, height: 24 }}
						name="icn-arrow-rightwards"
						backgroundColor="transparent"
						color={colors.grey600}
						aria-hidden={true}
					/>
				</button>
			</div>
			<Text
				display="block"
				color={colors.grey800}
				typography="st8"
				fontWeight="semibold"
				className={type === "active" ? "mb-3" : ""}
			>
				{survey.title}
			</Text>

			{type === "active" && "progress" in survey && (
				<>
					<div className="flex items-center justify-between mb-2">
						<Text color={colors.grey700} typography="t7" fontWeight="medium">
							{survey.progress}/{survey.total}
						</Text>
						<Text color={colors.grey700} typography="t7" fontWeight="medium">
							{survey.deadline}
						</Text>
					</div>
					<div className="mb-4">
						<ProgressBar
							size="normal"
							color={colors.blue500}
							progress={survey.progress / survey.total}
						/>
					</div>
					<div className="h-4" />
					<Button size="medium" variant="weak" display="block">
						친구에게 공유하기
					</Button>
				</>
			)}
		</div>
	);
};
