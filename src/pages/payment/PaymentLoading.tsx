import { adaptive } from "@toss/tds-colors";
import { Asset, Top } from "@toss/tds-mobile";
import { useEffect } from "react";
import { useMultiStep } from "../../contexts/MultiStepContext";

export const PaymentLoading = () => {
	const { goNextPayment } = useMultiStep();

	//TODO: 실제 로딩 시간으로 변경
	useEffect(() => {
		const timer = setTimeout(() => {
			goNextPayment();
		}, 3000);
		return () => clearTimeout(timer);
	}, [goNextPayment]);

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						보유 코인으로
						<br />
						설문을 등록하고 있어요
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
