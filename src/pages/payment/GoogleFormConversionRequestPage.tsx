import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	BottomSheet,
	FixedBottomCTA,
	TextField,
	Top,
} from "@toss/tds-mobile";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type QuestionPackage = "light" | "standard" | "plus";
type RespondentCount = 50 | 100;

const QUESTION_PACKAGE_OPTIONS: {
	label: string;
	value: QuestionPackage;
	display: string;
}[] = [
	{
		label: "라이트 (15문항 이내)",
		value: "light",
		display: "라이트 (15문항 이내)",
	},
	{
		label: "스탠다드 (25문항 이내)",
		value: "standard",
		display: "스탠다드 (25문항 이내)",
	},
	{
		label: "플러스 (30문항 이내)",
		value: "plus",
		display: "플러스 (30문항 이내)",
	},
];

const RESPONDENT_OPTIONS: {
	label: string;
	value: RespondentCount;
	display: string;
}[] = [
	{ label: "50명", value: 50, display: "50명" },
	{ label: "100명", value: 100, display: "100명" },
];

const PRICE_TABLE: Record<QuestionPackage, Record<RespondentCount, number>> = {
	light: {
		50: 9900,
		100: 17900,
	},
	standard: {
		50: 14900,
		100: 26900,
	},
	plus: {
		50: 19900,
		100: 35900,
	},
};

const formatPrice = (price: number) =>
	price.toLocaleString("ko-KR", { maximumFractionDigits: 0 });

export const GoogleFormConversionRequestPage = () => {
	const navigate = useNavigate();

	const [formLink, setFormLink] = useState("");
	const [isFormLinkTouched, setIsFormLinkTouched] = useState(false);
	const [questionPackage, setQuestionPackage] =
		useState<QuestionPackage>("light");
	const [respondentCount, setRespondentCount] = useState<RespondentCount>(50);
	const [deadlineText, setDeadlineText] = useState("");

	const [isQuestionPackageSheetOpen, setIsQuestionPackageSheetOpen] =
		useState(false);
	const [isRespondentSheetOpen, setIsRespondentSheetOpen] = useState(false);

	const isGoogleFormLink = useMemo(
		() =>
			formLink === "" ||
			formLink.startsWith("https://docs.google.com/forms") ||
			formLink.startsWith("https://docs.google.com/forms/") ||
			formLink.startsWith("https://docs.google.com/"),
		[formLink],
	);

	const price = useMemo(
		() => PRICE_TABLE[questionPackage][respondentCount],
		[questionPackage, respondentCount],
	);

	const handleSubmit = () => {
		// TODO: 신청 정보 전송 API 연동 시 활용
		navigate("/payment/google-form-conversion-check");
	};

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						설문 정보를 입력해주세요
					</Top.TitleParagraph>
				}
				subtitleBottom={
					<Top.SubtitleParagraph size={15}></Top.SubtitleParagraph>
				}
				lowerGap={0}
			/>

			<div className="flex flex-col gap-4 px-4 pt-8 pb-28">
				<TextField.Clearable
					variant="line"
					hasError={isFormLinkTouched && !isGoogleFormLink}
					label="폼 링크"
					labelOption="sustain"
					help={
						isFormLinkTouched && !isGoogleFormLink
							? "구글폼 링크가 아니에요"
							: "구글 폼 링크를 등록해주세요"
					}
					value={formLink}
					placeholder="https://docs.google.com/..."
					suffix=""
					prefix=""
					onChange={(e) => {
						if (!isFormLinkTouched) {
							setIsFormLinkTouched(true);
						}
						setFormLink(e.target.value);
					}}
				/>

				<TextField.Button
					variant="line"
					hasError={false}
					label="설문 문항 수"
					value={
						QUESTION_PACKAGE_OPTIONS.find(
							(option) => option.value === questionPackage,
						)?.display ?? ""
					}
					placeholder="설문 문항 수"
					right={
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW24}
							name="icon-arrow-down-mono"
							color={adaptive.grey400}
							aria-hidden={true}
						/>
					}
					onClick={() => setIsQuestionPackageSheetOpen(true)}
				/>

				<TextField.Button
					variant="line"
					hasError={false}
					label="희망 응답자 수"
					value={
						RESPONDENT_OPTIONS.find(
							(option) => option.value === respondentCount,
						)?.display ?? ""
					}
					placeholder="희망 응답자 수"
					right={
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW24}
							name="icon-arrow-down-mono"
							color={adaptive.grey400}
							aria-hidden={true}
						/>
					}
					onClick={() => setIsRespondentSheetOpen(true)}
				/>

				<TextField.Clearable
					variant="line"
					hasError={false}
					label="설문조사 마감일"
					labelOption="sustain"
					help="결제 완료 시점으로부터 영업일 기준 1일 이내에 설문 제작 및 노출이 시작됩니다."
					value={deadlineText}
					placeholder="2026.01.20"
					onChange={(e) => setDeadlineText(e.target.value)}
				/>
			</div>

			<BottomSheet
				header={
					<BottomSheet.Header>설문 문항 수를 선택해주세요</BottomSheet.Header>
				}
				open={isQuestionPackageSheetOpen}
				onClose={() => setIsQuestionPackageSheetOpen(false)}
				cta={[]}
			>
				<div className="mb-4">
					<BottomSheet.Select
						value={questionPackage}
						options={QUESTION_PACKAGE_OPTIONS.map((option) => ({
							name: option.label,
							value: option.value,
							hideUnCheckedCheckBox: option.value !== questionPackage,
						}))}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							const value = e.target.value as QuestionPackage;
							setQuestionPackage(value);
						}}
					/>
				</div>
			</BottomSheet>

			<BottomSheet
				header={
					<BottomSheet.Header>희망 응답자 수를 선택해주세요</BottomSheet.Header>
				}
				open={isRespondentSheetOpen}
				onClose={() => setIsRespondentSheetOpen(false)}
				cta={[]}
			>
				<div className="mb-4">
					<BottomSheet.Select
						value={String(respondentCount)}
						options={RESPONDENT_OPTIONS.map((option) => ({
							name: option.label,
							value: String(option.value),
							hideUnCheckedCheckBox: option.value !== respondentCount,
						}))}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							const value = Number(e.target.value) as RespondentCount;
							setRespondentCount(value);
						}}
					/>
				</div>
			</BottomSheet>

			<FixedBottomCTA
				loading={false}
				onClick={handleSubmit}
				disabled={!formLink || !isGoogleFormLink}
			>
				{formatPrice(price)}원 결제하기
			</FixedBottomCTA>
		</>
	);
};
