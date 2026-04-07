import { useOptionsForm } from "@features/google-form-conversion/context/OptionsFormContext";
import { useRequestFormContext } from "@features/google-form-conversion/context/RequestEntryContext";
import {
	isContactEmail,
	isGoogleFormLinkUrl,
} from "@features/google-form-conversion/utils";
import { useBackEventListener } from "@shared/hooks/useBackEventListener";
import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	CTAButton,
	FixedBottomCTA,
	Text,
	TextField,
	Top,
} from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ScreeningPage = () => {
	const navigate = useNavigate();
	const { formLink: fl, email: em } = useRequestFormContext();
	const { watch, setValue } = useOptionsForm();
	const screening = watch("screening");

	const formLink = fl?.trim() ?? "";
	const email = em ?? "";
	const isValidEntry =
		!!formLink && isGoogleFormLinkUrl(formLink) && isContactEmail(email);

	const [question, setQuestion] = useState(screening?.question ?? "");
	/** O=true, X=false, 미선택=null */
	const [answer, setAnswer] = useState<boolean | null>(() => {
		const a = screening?.answer;
		return typeof a === "boolean" ? a : null;
	});
	const isScreeningComplete = question.trim().length > 0 && answer !== null;
	/** 옵션 폼에 이미 저장된 스크리닝이 있을 때만 삭제 가능 (추가 진입 시에는 비활성) */
	const hasPersistedScreening = Boolean(
		screening?.question?.trim() && typeof screening?.answer === "boolean",
	);

	useEffect(() => {
		if (!isValidEntry) {
			navigate("/payment/google-form-conversion", { replace: true });
		}
	}, [isValidEntry, navigate]);

	useBackEventListener(() => {
		navigate(-1);
	});

	const handleNext = () => {
		if (!question.trim() || answer === null) return;
		setValue("screening", {
			question: question.trim(),
			answer,
		});
		navigate("/payment/google-form-conversion-options");
	};

	const handleDelete = () => {
		setQuestion("");
		setAnswer(null);
		setValue("screening", null);
		navigate("/payment/google-form-conversion-options");
	};

	if (!isValidEntry) {
		return null;
	}

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						스크리닝 질문 구성하기
					</Top.TitleParagraph>
				}
				subtitleBottom={
					<Top.SubtitleParagraph size={15} color={adaptive.grey600}>
						적합한 응답자를 매칭하기 위해 OX 질문을 구성해요
					</Top.SubtitleParagraph>
				}
				lowerGap={0}
			/>
			<TextField.Clearable
				variant="line"
				hasError={false}
				label="질문"
				labelOption="sustain"
				help="짧고 명확한 질문일수록 효과적이에요"
				value={question}
				placeholder="나는 반려동물을 키운다"
				onChange={(e) => setQuestion(e.target.value)}
			/>

			<div className="flex flex-col gap-6 px-6 pt-4">
				<div className="flex flex-col gap-2">
					<Text
						display="block"
						color={adaptive.grey800}
						typography="t4"
						fontWeight="bold"
					>
						참여 조건 설정
					</Text>
					<Text display="block" color={adaptive.grey600} typography="t6">
						설문에 참여 가능한 답변(O/X)을 선택해주세요
					</Text>
				</div>

				<div className="flex w-full gap-4">
					<button
						type="button"
						aria-label="O"
						onClick={() => setAnswer(true)}
						className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl! p-4 transition-colors"
						style={{
							backgroundColor:
								"var(--token-tds-color-adaptive-green-50, var(--adaptiveGreen50, #f0faf6))",
						}}
					>
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW40}
							backgroundColor="transparent"
							name="icon-o-mono"
							color={adaptive.green400}
							aria-hidden={true}
							ratio="1/1"
						/>
					</button>
					<button
						type="button"
						aria-label="X"
						onClick={() => setAnswer(false)}
						className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl! p-4 transition-colors"
						style={{
							backgroundColor:
								"var(--token-tds-color-adaptive-red-50, var(--adaptiveRed50, #ffeeee))",
						}}
					>
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW40}
							backgroundColor="transparent"
							name="icon-x-mono"
							color={adaptive.red500}
							aria-hidden={true}
							ratio="1/1"
						/>
					</button>
				</div>
			</div>

			<FixedBottomCTA.Double
				leftButton={
					<CTAButton
						color="dark"
						variant="weak"
						disabled={!hasPersistedScreening}
						onClick={handleDelete}
					>
						삭제
					</CTAButton>
				}
				rightButton={
					<CTAButton disabled={!isScreeningComplete} onClick={handleNext}>
						다음
					</CTAButton>
				}
			/>
		</>
	);
};
