import { adaptive, colors } from "@toss/tds-colors";
import { Checkbox, FixedBottomCTA, List, ListRow, Top } from "@toss/tds-mobile";
import { useState } from "react";
import { topics } from "../../constants/topics";
import { useCreateForm } from "../../contexts/CreateFormContext";

function InterestPage() {
	const { handleStepChange } = useCreateForm();

	const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

	const handleTopicToggle = (topicId: string) => {
		setSelectedTopics((prev) =>
			prev.includes(topicId)
				? prev.filter((id) => id !== topicId)
				: [...prev, topicId],
		);
	};

	const handleNext = () => {
		handleStepChange(4);
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
							const isSelected = selectedTopics.includes(topic.id);
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
											checked={selectedTopics.includes(topic.id)}
											size={20}
											aria-hidden={true}
											style={{ pointerEvents: "none" }}
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
				>
					다음
				</FixedBottomCTA>
			</div>
		</>
	);
}

export default InterestPage;
