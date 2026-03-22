import type { GoogleFormConversionRequestEntryState } from "@features/google-form-conversion/types";
import {
	isGoogleFormConversionContactEmail,
	isGoogleFormLinkUrl,
} from "@features/google-form-conversion/utils";
import { useBackEventListener } from "@shared/hooks/useBackEventListener";
import { adaptive } from "@toss/tds-colors";
import { Asset, Top } from "@toss/tds-mobile";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LOADING_DURATION_MS = 3000;

export const GoogleFormConversionLoadingPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const entryState = location.state as
		| GoogleFormConversionRequestEntryState
		| undefined;

	const formLinkFromState = entryState?.formLink?.trim() ?? "";
	const emailFromState = entryState?.email ?? "";
	const isValidEntry =
		!!formLinkFromState &&
		isGoogleFormLinkUrl(formLinkFromState) &&
		isGoogleFormConversionContactEmail(emailFromState);

	useEffect(() => {
		if (!isValidEntry) {
			navigate("/payment/google-form-conversion", { replace: true });
			return;
		}

		const id = window.setTimeout(() => {
			navigate("/payment/google-form-conversion-options", {
				state: {
					formLink: formLinkFromState,
					email: emailFromState,
				},
			});
		}, LOADING_DURATION_MS);

		return () => window.clearTimeout(id);
	}, [emailFromState, formLinkFromState, isValidEntry, navigate]);

	useBackEventListener(() => {});

	if (!isValidEntry) {
		return null;
	}

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						구글폼의 내용을 온서베이에 맞게 변환하고 있어요
					</Top.TitleParagraph>
				}
				subtitleBottom={
					<Top.SubtitleParagraph color={adaptive.grey500}>
						잠시만 기다려주세요.
					</Top.SubtitleParagraph>
				}
			/>

			<Asset.Lottie
				frameShape={{ width: 375 }}
				src="https://static.toss.im/lotties/loading/load-ripple.json"
				loop={true}
				speed={1}
				aria-hidden={true}
			/>
		</>
	);
};
