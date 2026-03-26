import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	FixedBottomCTA,
	Spacing,
	TextArea,
	Top,
} from "@toss/tds-mobile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const GoogleFormConversionInquiryPage = () => {
	const [inquiry, setInquiry] = useState("");
	const navigate = useNavigate();

	const handleNext = () => {
		if (inquiry.trim().length === 0) return;
		navigate("/payment/google-form-conversion-inquiry-success");
	};

	return (
		<>
			<div className="flex items-center justify-between px-4 pt-4 pb-2">
				<div className="flex items-center gap-2">
					<Asset.Icon
						frameShape={Asset.frameShape.CleanW20}
						backgroundColor="transparent"
						name="icon-heart-mono"
						color={adaptive.greyOpacity600}
						aria-hidden={true}
						ratio="1/1"
					/>
					<Asset.Icon
						frameShape={Asset.frameShape.CleanW20}
						backgroundColor="transparent"
						name="icon-dots-mono"
						color={adaptive.greyOpacity600}
						aria-hidden={true}
						ratio="1/1"
					/>
					<Asset.Icon
						frameShape={Asset.frameShape.CleanW20}
						backgroundColor="transparent"
						name="icon-x-mono"
						color={adaptive.greyOpacity600}
						aria-hidden={true}
						ratio="1/1"
					/>
				</div>
			</div>

			<Spacing size={12} />

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
				hasError={false}
				label=""
				labelOption="sustain"
				value={inquiry}
				placeholder="50자 이내로 작성해주세요"
				maxLength={50}
				onChange={(e) => setInquiry(e.target.value)}
			/>

			<FixedBottomCTA
				disabled={inquiry.trim().length === 0}
				loading={false}
				onClick={handleNext}
			>
				다음
			</FixedBottomCTA>
		</>
	);
};
