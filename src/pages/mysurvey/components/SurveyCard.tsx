import { colors } from "@toss/tds-colors";
import {
	Asset,
	Badge,
	Button,
	ProgressBar,
	Text,
	useToast,
} from "@toss/tds-mobile";
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
	const { openToast } = useToast();
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

		await shareSurveyById(survey.id, () => {
			openToast("공유 링크가 생성되었어요", {
				type: "bottom",
				higherThanCTA: true,
			});
		});
	};

	const handleDetailClick = () => {
		console.log("SurveyCard handleDetailClick called", {
			type,
			surveyId: survey.id,
			hasOnClick: !!onClick,
		});
		if (type === "draft") {
			if (onClick) {
				console.log("Calling onClick with surveyId:", survey.id);
				onClick(survey.id);
			} else {
				console.warn("onClick is not provided for draft survey");
			}
			return;
		}
		if (type === "active") {
			// 노출 중인 설문은 설문 시작 페이지로 이동
			navigate(`/survey?surveyId=${survey.id}`, {
				state: { surveyId: survey.id },
			});
			return;
		}
		// 마감된 설문은 상세 페이지로 이동
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

			{type === "active" && activeSurvey && (
				<>
					{hasProgress && (
						<div className="mb-2">
							<Text color={colors.grey700} typography="t7" fontWeight="medium">
								{activeSurvey.progress}/{activeSurvey.total}
							</Text>
						</div>
					)}
					{(activeDescription || deadlineText) && (
						<div className="flex items-center justify-between gap-2 mb-4">
							{activeDescription && (
								<Text color={colors.grey700} typography="t7" className="flex-1">
									{activeDescription}
								</Text>
							)}
							{deadlineText && (
								<Text
									color={colors.grey700}
									typography="t7"
									fontWeight="medium"
									className="shrink-0"
								>
									{deadlineText}
								</Text>
							)}
						</div>
					)}
					<div className="mb-4">
						<ProgressBar
							size="normal"
							color={colors.blue500}
							progress={
								hasProgress
									? (activeSurvey.progress ?? 0) / (activeSurvey.total ?? 1)
									: 0
							}
						/>
					</div>
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
		</div>
	);
};
