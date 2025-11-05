import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	BottomInfo,
	FixedBottomCTA,
	Paragraph,
	Post,
	Top,
} from "@toss/tds-mobile";
import { useMultiStep } from "../../contexts/MultiStepContext";

export const PaymentConfirmationPage = () => {
	const { goNextPayment } = useMultiStep();

	const handleNext = () => {
		goNextPayment();
	};

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						50,000원 결제하고,
						<br />
						50000코인을 살까요?
					</Top.TitleParagraph>
				}
				upper={
					<Top.UpperAssetContent
						content={
							<Asset.Lottie
								frameShape={Asset.frameShape.CleanW60}
								src="https://static.toss.im/lotties-common/check-spot.json"
								loop={false}
								aria-hidden={true}
							/>
						}
					/>
				}
			/>
			<div className="h-25" />
			<BottomInfo>
				<Post.Paragraph paddingBottom={8} typography="t7">
					<Paragraph.Text>
						<b style={{}}>안내사항</b>
					</Paragraph.Text>
				</Post.Paragraph>

				<Post.Paragraph paddingBottom={8} typography="t7">
					<Paragraph.Text>
						토스는 해당 서비스 제휴사이며, 결제는 애플 앱스토어를 통해서
						진행돼요.
					</Paragraph.Text>
				</Post.Paragraph>

				<Post.Paragraph paddingBottom={8} typography="t7">
					<Paragraph.Text>
						환불 신청은 애플 앱스토어에서만 가능해요. 토스를 통한 환불 신청은
						불가해요.
					</Paragraph.Text>
				</Post.Paragraph>

				<Post.Paragraph paddingBottom={24} typography="t7">
					<Paragraph.Text></Paragraph.Text>
				</Post.Paragraph>
			</BottomInfo>

			<FixedBottomCTA loading={false} onClick={handleNext}>
				다음
			</FixedBottomCTA>
		</>
	);
};
