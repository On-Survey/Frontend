import { adaptive } from "@toss/tds-colors";
import { Asset, FixedBottomCTA, Top } from "@toss/tds-mobile";
import { useCreateForm } from "../../contexts/CreateFormContext";

interface ScreeningOptionProps {
	selected: "O" | "X" | null;
	handleSelectedChange: (selected: "O" | "X") => void;
}

function ScreeningOption({
	selected,
	handleSelectedChange,
}: ScreeningOptionProps) {
	const { goNextScreening } = useCreateForm();

	const handleNext = () => {
		if (!selected) return;
		goNextScreening();
	};

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						참여 조건 설정하기
					</Top.TitleParagraph>
				}
				subtitleBottom={
					<Top.SubtitleParagraph size={15}>
						이 질문에 대해 참여 가능한 답변(O/X)을 선택해주세요. 선택한 답변을
						한 응답자만 다음 단계로 진행해요.
					</Top.SubtitleParagraph>
				}
			/>

			<div className="flex gap-4 w-full px-6">
				<button
					type="button"
					className="flex-1 flex items-center justify-center py-6 transition-all duration-200 bg-blue-100 hover:bg-blue-100 rounded-xl!"
					aria-label="예"
					onClick={() => handleSelectedChange("O")}
				>
					<Asset.Icon
						frameShape={Asset.frameShape.CleanW24}
						backgroundColor="transparent"
						name="icon-o-mono"
						color={adaptive.blue500}
						aria-hidden={true}
						ratio="1/1"
					/>
				</button>

				<button
					type="button"
					className="flex-1 flex items-center justify-center py-6 transition-all duration-200 bg-red-100 hover:bg-red-100 rounded-xl!"
					aria-label="아니오"
					onClick={() => handleSelectedChange("X")}
				>
					<Asset.Icon
						frameShape={Asset.frameShape.CleanW24}
						backgroundColor="transparent"
						name="icon-x-mono"
						color={adaptive.red500}
						aria-hidden={true}
						ratio="1/1"
					/>
				</button>
			</div>

			<FixedBottomCTA loading={false} disabled={!selected} onClick={handleNext}>
				다음
			</FixedBottomCTA>
		</>
	);
}

export default ScreeningOption;
