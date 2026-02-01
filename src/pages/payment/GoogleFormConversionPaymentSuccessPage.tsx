import { adaptive } from "@toss/tds-colors";
import { Asset, FixedBottomCTA, Spacing, Text } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";

export const GoogleFormConversionPaymentSuccessPage = () => {
	const navigate = useNavigate();

	const handleConfirm = () => {
		navigate("/home");
	};

	return (
		<div className="flex flex-col items-center justify-center p-4">
			<Spacing size={160} />
			<Asset.Image
				frameShape={Asset.frameShape.CleanW100}
				backgroundColor="transparent"
				src="https://static.toss.im/lotties/check-spot-apng.png"
				aria-hidden={true}
				style={{ aspectRatio: "1/1" }}
			/>
			<Spacing size={24} />
			<Text
				display="block"
				color={adaptive.grey800}
				typography="t2"
				fontWeight="bold"
				textAlign="center"
			>
				결제가 완료됐어요
			</Text>
			<Text
				display="block"
				color={adaptive.grey700}
				typography="t5"
				fontWeight="medium"
				textAlign="center"
			>
				등록해주신 폼은 빠르게 검토해 이메일로 안내해 드릴게요.
			</Text>
			<FixedBottomCTA loading={false} onClick={handleConfirm}>
				확인했어요
			</FixedBottomCTA>
		</div>
	);
};
