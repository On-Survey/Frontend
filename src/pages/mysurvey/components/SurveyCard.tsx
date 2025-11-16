import { colors } from "@toss/tds-colors";
import { Asset, Badge, Button, ProgressBar, Text } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import { formatDateDisplay } from "../../../utils/FormatDate";
import { shareSurveyById } from "../../../utils/shareSurvey";
import type { ActiveSurvey, ClosedSurvey, DraftSurvey } from "./types";

type SurveyState = "draft" | "active" | "closed";
type BadgeColor = "green" | "blue" | "elephant";

interface SurveyCardProps {
	survey: DraftSurvey | ActiveSurvey | ClosedSurvey;
	type: SurveyState;
	onClick?: (id: number) => void;
}

export const SurveyCard = ({ survey, type, onClick }: SurveyCardProps) => {
	const navigate = useNavigate();
	const badgeConfig: Record<SurveyState, { color: BadgeColor; label: string }> =
		{
			draft: { color: "green", label: "작성중" },
			active: { color: "blue", label: "노출중" },
			closed: { color: "elephant", label: "마감" },
		};

	const config = badgeConfig[type];

	const isActiveCard = type === "active";
	const activeSurvey = isActiveCard ? (survey as ActiveSurvey) : null;
	const hasProgress =
		isActiveCard &&
		typeof activeSurvey?.progress === "number" &&
		typeof activeSurvey?.total === "number" &&
		activeSurvey.total !== 0;
	const activeDescription = isActiveCard
		? activeSurvey?.description
		: undefined;

	const deadlineText =
		isActiveCard && activeSurvey?.deadline
			? `${formatDateDisplay(activeSurvey.deadline)}까지`
			: "";

	const handleShareClick = async () => {
		if (!isActiveCard) return;

		await shareSurveyById(survey.id);
	};

	const handleDetailClick = () => {
		if (type === "draft") {
			onClick?.(survey.id);
			return;
		}
		navigate(`/mysurvey/${survey.id}`);
	};

	const cardProps =
		type === "draft"
			? { role: "button" as const, onClick: handleDetailClick }
			: {};

	return (
		<div className="bg-gray-50 rounded-xl p-4 relative" {...cardProps}>
			<div className="flex items-start justify-between mb-2">
				<Badge variant="weak" color={config.color} size="small">
					{config.label}
				</Badge>
				<button
					type="button"
					className="cursor-pointer"
					aria-label="더보기"
					onClick={handleDetailClick}
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

			{type === "active" && hasProgress && activeSurvey && (
				<>
					<div className="flex items-center justify-between mb-2">
						<Text color={colors.grey700} typography="t7" fontWeight="medium">
							{activeSurvey.progress}/{activeSurvey.total}
						</Text>
						<Text color={colors.grey700} typography="t7" fontWeight="medium">
							{deadlineText}
						</Text>
					</div>
					<div className="mb-4">
						<ProgressBar
							size="normal"
							color={colors.blue500}
							progress={
								(activeSurvey.progress ?? 0) / (activeSurvey.total ?? 1)
							}
						/>
					</div>
					<div className="h-4" />
					<Button
						size="medium"
						variant="weak"
						display="block"
						onClick={handleShareClick}
					>
						친구에게 공유하기
					</Button>
				</>
			)}
			{type === "active" && !hasProgress && activeDescription && (
				<Text color={colors.grey700} typography="t7">
					{activeDescription}
				</Text>
			)}
		</div>
	);
};
