import {
	useRequestEntryContext,
	useRequestFormContext,
} from "@features/google-form-conversion/context/RequestEntryContext";
import { getInconvertibleReasonStringsForFormLink } from "@features/google-form-conversion/lib/pickValidationPreviewForFormLink";
import { useSurveyHelpRequestMutation } from "@features/survey/hooks/useSurveyHelpRequestMutation";
import { useUserInfo } from "@shared/contexts/UserContext";
import { adaptive } from "@toss/tds-colors";
import { Asset, FixedBottomCTA, Text, TextArea, Top } from "@toss/tds-mobile";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/** 반려 문항이 없거나(검증 전부 성공)·사유를 뽑을 수 없을 때 — 서버는 빈 배열 불가 */
const DEFAULT_REJECTION_REASONS = ["기타"] as const;

export const InquiryPage = () => {
	const [inquiry, setInquiry] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const navigate = useNavigate();
	const { validationResult } = useRequestEntryContext();
	const { email: emailFromFlow, formLink: formLinkFromFlow } =
		useRequestFormContext();
	const { userInfo } = useUserInfo();
	const helpRequest = useSurveyHelpRequestMutation();

	const email = emailFromFlow?.trim() ?? "";
	const name = userInfo?.result?.name?.trim() ?? "";
	const formLink = formLinkFromFlow?.trim() ?? "";

	const rejectionReasons = useMemo(() => {
		if (!validationResult || !formLink) return [...DEFAULT_REJECTION_REASONS];
		const fromValidation = getInconvertibleReasonStringsForFormLink(
			validationResult,
			formLink,
		);
		return fromValidation.length > 0
			? fromValidation
			: [...DEFAULT_REJECTION_REASONS];
	}, [validationResult, formLink]);

	const handleNext = useCallback(async () => {
		const content = inquiry.trim();
		if (content.length === 0) return;
		if (!email) {
			navigate("/payment/google-form-conversion", { replace: true });
			return;
		}
		setErrorMessage(null);
		try {
			await helpRequest.mutateAsync({
				email,
				name,
				rejectionReasons,
				content,
			});
			navigate("/payment/google-form-conversion-inquiry-success");
		} catch (e) {
			const message =
				e instanceof Error
					? e.message
					: "요청을 보내지 못했어요. 잠시 후 다시 시도해주세요";
			setErrorMessage(message);
		}
	}, [email, inquiry, name, helpRequest, navigate, rejectionReasons]);

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						어떤 도움이 필요하세요?
					</Top.TitleParagraph>
				}
				upper={
					<Top.UpperAssetContent
						content={
							<Asset.Lottie
								frameShape={Asset.frameShape.CleanW60}
								backgroundColor="transparent"
								src="https://static.toss.im/lotties-common/siren-2-spot.json"
								loop={true}
								speed={1}
								aria-hidden={true}
								style={{ aspectRatio: "1/1" }}
							/>
						}
					/>
				}
				lowerGap={0}
			/>

			<TextArea
				variant="box"
				hasError={!!errorMessage}
				label=""
				labelOption="sustain"
				value={inquiry}
				placeholder="50자 이내로 작성해주세요"
				maxLength={50}
				onChange={(e) => {
					setInquiry(e.target.value);
					if (errorMessage) setErrorMessage(null);
				}}
			/>
			{errorMessage ? (
				<div className="px-2">
					<Text
						display="block"
						color={adaptive.red500}
						typography="t6"
						fontWeight="medium"
						className="mt-2 px-2"
					>
						{errorMessage}
					</Text>
				</div>
			) : null}

			<FixedBottomCTA
				disabled={inquiry.trim().length === 0 || helpRequest.isPending}
				loading={helpRequest.isPending}
				onClick={() => void handleNext()}
			>
				다음
			</FixedBottomCTA>
		</>
	);
};
