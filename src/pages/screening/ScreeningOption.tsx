import { adaptive } from "@toss/tds-colors";
import { Asset, FixedBottomCTA, Top } from "@toss/tds-mobile";
import { useCreateForm } from "../../contexts/CreateFormContext";

interface ScreeningOptionProps {
	selected: "O" | "X" | null;
	handleSelectedChange: (selected: "O" | "X") => void;
}

export const ScreeningOption = ({
	selected,
	handleSelectedChange,
}: ScreeningOptionProps) => {
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
				<div className="flex justify-center w-full items-center gap-2">
					<button
						type="button"
						aria-label="O"
						onClick={() => handleSelectedChange("O")}
						className={`flex justify-center  items-center p-4 transition-colors gap-3 cursor-pointer w-full rounded-2xl! ${
							selected === "O" ? "bg-blue-200" : "bg-blue-100 hover:bg-blue-200"
						}`}
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
				</div>

				<div className="flex justify-center w-full items-center gap-2">
					<button
						type="button"
						aria-label="X"
						onClick={() => handleSelectedChange("X")}
						className={`flex justify-center items-center p-4 transition-colors gap-3 cursor-pointer w-full rounded-2xl! ${
							selected === "X" ? "bg-red-200" : "bg-red-100 hover:bg-red-200"
						}`}
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
			</div>

			<FixedBottomCTA loading={false} disabled={!selected} onClick={handleNext}>
				다음
			</FixedBottomCTA>
		</>
	);
};
