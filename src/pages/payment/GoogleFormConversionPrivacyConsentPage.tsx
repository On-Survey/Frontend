import { adaptive } from "@toss/tds-colors";
import { Paragraph, Post, Top } from "@toss/tds-mobile";

export const GoogleFormConversionPrivacyConsentPage = () => {
	return (
		<div className="px-2 py-6">
			<Post.Paragraph paddingBottom={8}>
				<Paragraph.Text>
					온서베이(OnSurvey)의 서비스를 이용해주셔서 감사합니다.
					<br />
					<br />더 좋은 서비스를 만들기 위해, 관련 법령✱에 따라 개인정보
					수집·이용 동의를 받고 있습니다.
					<br />✱ 관련 법령: 개인정보 보호법, 신용정보법
					<br />
					<br />
					[개인정보 수집∙이용 동의]
					<br />
					개인정보 수집∙이용에 동의하지 않을 권리가 있으며, 동의를 거부 할 경우
					<br />
					설문 등록 프로모션 서비스 이용이 제한됩니다.
					<br />
					[수집 및 이용 목적]
				</Paragraph.Text>
			</Post.Paragraph>

			<Post.Ul paddingBottom={8}>
				<Post.Li>설문 등록 프로모션 서비스 운영 관련 안내</Post.Li>
				<Post.Li>이메일 기반 고객 커뮤니케이션</Post.Li>
				<Post.Li>서비스 기능·이용 관련 정보 제공</Post.Li>
				<Post.Li>이용 편의 증진을 위한 정보 전달</Post.Li>
			</Post.Ul>

			<Post.Paragraph paddingBottom={24}>
				<Paragraph.Text>
					[수집 및 이용 항목]
					<br />
					이름, 거래정보, 단말기 정보, 이메일
					<br />
					이용 및 보유기간
					<br />
					동의 철회시 또는 회원 탈퇴시까지 보유 및 이용
				</Paragraph.Text>
			</Post.Paragraph>
		</div>
	);
};
