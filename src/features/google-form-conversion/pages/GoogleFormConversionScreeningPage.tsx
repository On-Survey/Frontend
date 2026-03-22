import type { GoogleFormConversionFlowState } from "@features/google-form-conversion/types";
import {
	isGoogleFormConversionContactEmail,
	isGoogleFormLinkUrl,
} from "@features/google-form-conversion/utils";
import { useBackEventListener } from "@shared/hooks/useBackEventListener";
import { adaptive } from "@toss/tds-colors";
import { Asset, FixedBottomCTA, Text, TextField, Top } from "@toss/tds-mobile";
import { type CSSProperties, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const GoogleFormConversionScreeningPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const flowState = location.state as GoogleFormConversionFlowState | undefined;

	const formLink = flowState?.formLink?.trim() ?? "";
	const email = flowState?.email ?? "";
	const isValidEntry =
		!!formLink &&
		isGoogleFormLinkUrl(formLink) &&
		isGoogleFormConversionContactEmail(email);

	const [question, setQuestion] = useState(
		flowState?.screening?.question ?? "",
	);
	const [answerType, setAnswerType] = useState<"O" | "X" | null>(
		flowState?.screening?.answerType ?? null,
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
		if (!question.trim() || !answerType || !flowState) return;
		navigate("/payment/google-form-conversion-options", {
			state: {
				formLink: flowState.formLink,
				email: flowState.email,
				screening: {
					question: question.trim(),
					answerType,
				},
			},
		});
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
						적합한 응답자를 매칭하기 위해 OX 질문을 구성해요.
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
						설문에 참여 가능한 답변(O/X)을 선택해주세요.
					</Text>
				</div>

				<div className="flex w-full gap-4">
					<button
						type="button"
						aria-label="O"
						onClick={() => setAnswerType("O")}
						className={`flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl! p-4 transition-colors ${
							answerType === "O"
								? "bg-green-200"
								: "bg-green-100 hover:bg-green-200"
						}`}
					>
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW24}
							backgroundColor="transparent"
							name="icon-o-mono"
							color={adaptive.green500}
							aria-hidden={true}
							ratio="1/1"
						/>
					</button>
					<button
						type="button"
						aria-label="X"
						onClick={() => setAnswerType("X")}
						className={`flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl! p-4 transition-colors ${
							answerType === "X" ? "bg-red-200" : "bg-red-100 hover:bg-red-200"
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

			<FixedBottomCTA
				loading={false}
				disabled={!question.trim() || !answerType}
				onClick={handleNext}
				style={{ "--button-background-color": "#15c67f" } as CSSProperties}
			>
				다음
			</FixedBottomCTA>
		</>
	);
};
