import { DateSelectBottomSheet } from "@features/payment/components/payment";
import {
	DESIRED_PARTICIPANTS,
	QUESTION_COUNT_OPTIONS,
	type QuestionCountRange,
} from "@features/payment/constants/payment";
import {
	getGoogleFormConversionTablePrice,
	type ParticipantTier,
} from "@shared/lib/estimatePricingTable";
import { pushGtmEvent } from "@shared/lib/gtm";
import { validateEmail } from "@shared/lib/validators";
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

const QUESTION_RANGE_OPTIONS: {
	label: string;
	value: QuestionCountRange;
	display: string;
}[] = QUESTION_COUNT_OPTIONS.filter((o) => !o.disabled).map((o) => ({
	label: o.name,
	value: o.value,
	display: o.name,
}));

const RESPONDENT_OPTIONS: {
	label: string;
	value: ParticipantTier;
	display: string;
}[] = DESIRED_PARTICIPANTS.filter((o) => !o.disabled).map((o) => ({
	label: o.name,
	value: Number(o.value) as ParticipantTier,
	display: o.name,
}));

const formatPrice = (price: number) =>
	price.toLocaleString("ko-KR", { maximumFractionDigits: 0 });

const formatDate = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}.${month}.${day}`;
};

const formatDateToISO = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

const getDefaultDeadline = (): Date => {
	const today = new Date();
	const sevenDaysLater = new Date(today);
	sevenDaysLater.setDate(today.getDate() + 7);
	return sevenDaysLater;
};

export const GoogleFormConversionRequestPage = () => {
	const navigate = useNavigate();

	const [formLink, setFormLink] = useState("");
	const [isFormLinkTouched, setIsFormLinkTouched] = useState(false);
	const [email, setEmail] = useState("");
	const [isEmailTouched, setIsEmailTouched] = useState(false);
	const [questionCountRange, setQuestionCountRange] =
		useState<QuestionCountRange>("1~30");
	const [respondentCount, setRespondentCount] = useState<ParticipantTier>(50);
	const [deadline, setDeadline] = useState<Date>(getDefaultDeadline());

	const [isQuestionRangeSheetOpen, setIsQuestionRangeSheetOpen] =
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

	const isValidEmail = useMemo(() => validateEmail(email), [email]);

	const price = useMemo(
		() =>
			getGoogleFormConversionTablePrice(respondentCount, questionCountRange),
		[respondentCount, questionCountRange],
	);

	const handleSubmit = () => {
		pushGtmEvent({
			event: "form_payment_button_click",
			pagePath: "/payment/google-form-conversion",
		});
		navigate("/payment/google-form-conversion-check", {
			state: {
				formLink,
				email,
				questionCountRange,
				respondentCount,
				deadlineText: formatDate(deadline),
				deadline: formatDateToISO(deadline),
				price,
			},
		});
	};

	const handleDateChange = (date: Date) => {
		setDeadline(date);
	};

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						설문 정보를 입력해주세요
					</Top.TitleParagraph>
				}
				lowerGap={0}
			/>

			<div className="flex flex-col gap-4 px-2 pt-4">
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

				<TextField.Clearable
					variant="line"
					hasError={isEmailTouched && !isValidEmail}
					label="이메일"
					labelOption="sustain"
					help={
						isEmailTouched && !isValidEmail
							? "올바른 이메일 형식을 입력해주세요"
							: "설문 등록 과정을 안내받으실 이메일을 입력해주세요"
					}
					value={email}
					placeholder="example@toss.im"
					suffix=""
					prefix=""
					onChange={(e) => {
						if (!isEmailTouched) {
							setIsEmailTouched(true);
						}
						setEmail(e.target.value);
					}}
				/>

				<TextField.Button
					variant="line"
					hasError={false}
					label="설문 문항 수"
					value={
						QUESTION_RANGE_OPTIONS.find(
							(option) => option.value === questionCountRange,
						)?.display ?? ""
					}
					placeholder="설문 문항 수"
					help="표시된 금액은 VAT 포함 금액이에요"
					right={
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW24}
							name="icon-arrow-down-mono"
							color={adaptive.grey400}
							aria-hidden={true}
						/>
					}
					onClick={() => setIsQuestionRangeSheetOpen(true)}
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

				<DateSelectBottomSheet value={deadline} onChange={handleDateChange} />
			</div>

			<BottomSheet
				header={
					<BottomSheet.Header>설문 문항 수를 선택해주세요</BottomSheet.Header>
				}
				open={isQuestionRangeSheetOpen}
				onClose={() => setIsQuestionRangeSheetOpen(false)}
				cta={[]}
			>
				<div className="mb-4">
					<BottomSheet.Select
						value={questionCountRange}
						options={QUESTION_RANGE_OPTIONS.map((option) => ({
							name: option.label,
							value: option.value,
							hideUnCheckedCheckBox: option.value !== questionCountRange,
						}))}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							const value = e.target.value as QuestionCountRange;
							setQuestionCountRange(value);
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
				<div>
					<BottomSheet.Select
						value={String(respondentCount)}
						options={RESPONDENT_OPTIONS.map((option) => ({
							name: option.label,
							value: String(option.value),
							hideUnCheckedCheckBox: option.value !== respondentCount,
						}))}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							const value = Number(e.target.value) as ParticipantTier;
							setRespondentCount(value);
						}}
					/>
				</div>
			</BottomSheet>

			<FixedBottomCTA
				loading={false}
				onClick={handleSubmit}
				disabled={!formLink || !isGoogleFormLink || !email || !isValidEmail}
			>
				{formatPrice(price)}원 결제하기
			</FixedBottomCTA>
		</>
	);
};
