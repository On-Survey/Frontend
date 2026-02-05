import { useCreateSurveyInterests } from "@features/create-survey/hooks/useQuestionMutations";
import { topics } from "@shared/constants/topics";
import { useMultiStep } from "@shared/contexts/MultiStepContext";
import { useSurvey } from "@shared/contexts/SurveyContext";
import { useBackEventListener } from "@shared/hooks/useBackEventListener";
import { pushGtmEvent } from "@shared/lib/gtm";
import { adaptive, colors } from "@toss/tds-colors";
import { Checkbox, FixedBottomCTA, List, ListRow, Top } from "@toss/tds-mobile";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const InterestPage = () => {
	const { setSurveyStep } = useMultiStep();
	const { state, addTopic, removeTopic } = useSurvey();
	const { mutate: createSurveyInterests } = useCreateSurveyInterests();
	const location = useLocation();
	const selectedTopics = state.topics;
	const hasSentEvent = useRef(false);

	const locationState = location.state as
		| { source?: "main_cta" | "mysurvey_button" | "mysurvey_edit" }
		| undefined;

	useEffect(() => {
		if (hasSentEvent.current) return;

		hasSentEvent.current = true;
		const source = locationState?.source ?? "main_cta";
		const entryType = state.screening.enabled
			? "screening_complete"
			: "screening_skip";

		pushGtmEvent({
			event: "survey_interest",
			pagePath: "/createForm",
			step: "view",
			...(state.surveyId && { survey_id: String(state.surveyId) }),
			source,
			entry_type: entryType,
		});
	}, [locationState?.source, state.surveyId, state.screening.enabled]);

	const handleTopicToggle = (topicId: string) => {
		const topic = topics.find((t) => t.id === topicId);
		if (!topic) return;

		const isSelected = selectedTopics.some((t) => t.id === topicId);

		if (isSelected) {
			removeTopic(topicId);
		} else {
			addTopic({ id: topic.id, name: topic.name, value: topic.value });
		}
	};

	useBackEventListener(() => {
		if (state.screening.enabled) {
			setSurveyStep(2);
		} else {
			setSurveyStep(1);
		}
	});

	const handleNext = () => {
		const interests = selectedTopics.map((topic) => topic.value);
		if (interests.length === 0) return;
		createSurveyInterests(
			{
				surveyId: state.surveyId ?? 0,
				interests: interests,
			},
			{
				onSuccess: (response) => {
					if (response.success) {
						const source = locationState?.source ?? "main_cta";
						const entryType = state.screening.enabled
							? "screening_complete"
							: "screening_skip";

						// 각 interest마다 개별 이벤트 전송
						interests.forEach((interest) => {
							pushGtmEvent({
								event: "survey_interest",
								pagePath: "/createForm",
								step: "confirm",
								...(state.surveyId && { survey_id: String(state.surveyId) }),
								source,
								entry_type: entryType,
								interest_selected: interest,
							});
						});

						setSurveyStep(4);
					}
				},
				onError: (error) => {
					console.error("관심사 생성 실패:", error);
				},
			},
		);
	};

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						관련 관심사를 선택해 주세요
					</Top.TitleParagraph>
				}
				subtitleBottom={
					<Top.SubtitleParagraph size={15}>
						더욱 맞는 대상을 찾기 위한 질문이에요.{" "}
					</Top.SubtitleParagraph>
				}
			/>
			<div className="flex-1 flex flex-col">
				<div className="flex-1 overflow-y-auto">
					<List>
						{topics.map((topic) => {
							const isSelected = selectedTopics.some((t) => t.id === topic.id);
							return (
								<ListRow
									key={topic.id}
									role="checkbox"
									aria-checked={isSelected}
									onClick={() => handleTopicToggle(topic.id)}
									left={
										topic.icon.type === "image" ? (
											<ListRow.AssetImage
												src={topic.icon.src || ""}
												shape="original"
												className="w-5.5 ml-1"
											/>
										) : (
											<ListRow.AssetIcon name={topic.icon.name || ""} />
										)
									}
									contents={
										<ListRow.Texts
											type="2RowTypeA"
											top={topic.name}
											topProps={{
												color: colors.grey800,
												fontWeight: "semibold",
											}}
											bottom={topic.description}
											bottomProps={{ color: colors.grey500 }}
										/>
									}
									right={
										<Checkbox.Line
											checked={isSelected}
											size={20}
											aria-hidden={true}
										/>
									}
									verticalPadding="large"
								/>
							);
						})}
					</List>
				</div>

				<FixedBottomCTA
					loading={false}
					onClick={handleNext}
					disabled={selectedTopics.length === 0}
					style={
						{ "--button-background-color": "#15c67f" } as React.CSSProperties
					}
				>
					다음
				</FixedBottomCTA>
			</div>
		</>
	);
};
