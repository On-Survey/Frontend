import { colors } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";

export const TermsOfService = () => {
	return (
		<div className="flex flex-col w-full h-screen">
			<div className="flex-1 overflow-y-auto px-4 py-6">
				<Text
					display="block"
					color={colors.grey900}
					typography="t5"
					fontWeight="bold"
					className="mb-4"
				>
					서비스 이용약관
				</Text>

				{/* 제1조 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						제1조 (목적)
					</Text>
					<Text
						display="block"
						color={colors.grey700}
						typography="t7"
						fontWeight="regular"
					>
						본 약관은 "온서베이"에서 제공하는 인터넷 관련 서비스(이하 "콘텐츠"라
						한다)를 이용함에 있어 사이버 몰과 이용자의 권리, 의무 및 책임사항을
						규정함을 목적으로 합니다.
					</Text>
				</div>

				{/* 제2조 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						제2조 (정의)
					</Text>
					<Text
						display="block"
						color={colors.grey700}
						typography="t7"
						fontWeight="regular"
						className="mb-3"
					>
						본 약관에서 사용하는 용어는 다음과 같이 정의한다.
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
						className="ml-4"
					>
						1. "온서베이"이라 함은 "콘텐츠" 산업과 관련된 경제활동을 영위하는
						자로서 컴퓨터 및 모바일 애플리케이션을 통한 콘텐츠 및 제반 서비스를
						제공하는 자를 말합니다.
						<br />
						<br />
						2. "이용자"란 "온서베이"의 서비스에 접속하여 이 약관에 따라
						"온서베이"가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
						<br />
						<br />
						3. "회원"이라 함은 "온서베이"와 이용계약을 체결하고 "이용자"
						아이디(ID)를 부여 받은 사람으로서 "온서베이"의 정보와 서비스를
						지속적으로 이용 할 수 있으며, "회원"이 아이디(ID)를 정하고
						"온서베이"가 이를 승인한 자를 말합니다.
						<br />
						<br />
						4. '비회원'이라 함은 회원에 가입하지 않고 "온서베이"가 제공하는
						서비스를 이용하는 자를 말합니다.
						<br />
						<br />
						5. "콘텐츠"라 함은 정보통신망이용촉진 및 정보보호 등에 관한 법률
						제2조 제1항 제1호의 규정에 의한 정보통신망에서 사용되는 부호, 문자,
						음성, 음향, 이미지 또는 영상 등으로 표현된 자료 또는 정보로서, 그
						보존 및 이용에 있어서 효용을 높일 수 있도록 전자적 형태로 처리된
						것을 말하며, 이를 정보통신을 이용하여 설정한 가상의 중개장(플랫폼)을
						의미합니다.
						<br />
						<br />
						6. 아이디(ID)라 함은 회원의 식별과 서비스 이용을 위하여 회원이
						설정하고 "온서베이"가 승인한 이메일 주소를 말합니다.
						<br />
						<br />
						7. 비밀번호(PASSWORD)라 함은 회원의 동일성 확인과 회원정보의 보호를
						위하여 회원이 설정하고 "온서베이"가 승인한 문자나 숫자의 조합을
						말합니다.
						<br />
						<br />
						8. "의뢰자"는 "회원"이 "서비스"를 통해 참여하는 조사의 의뢰 주체를
						의미합니다.
						<br />
						<br />
						9. "게시물"이라 함은 "회원"이 "서비스"를 이용함에 있어 "회원"이
						"서비스"에 게시한 문자, 문서, 그림, 음성, 링크, 파일 혹은 이들의
						조합으로 이루어진 정보 등 모든 정보나 자료를 의미합니다.
						<br />
						<br />
						10. "토스포인트"라 함은 "회원"이 "콘텐츠"에 종속된 활동을 통해
						부여받은 것으로, 현금으로 출금 또는 토스서비스 이용 전반에 사용할 수
						있는 가상의 화폐를 의미합니다.
						<br />
						<br />
						11. "설문응답결과"란 "의뢰자"의 의뢰를 통해 "회원"의 응답을 통해
						수집된 정보로서, "이용자"의 응답을 통해 정량,정성적 정보를 제공하는
						것을 의미합니다.
						<br />
						<br />
						12. 위 항에서 정의되지 않은 이 약관상의 용어의 의미는 일반적인 거래
						관행에 의합니다.
					</Text>
				</div>

				{/* 제3조 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						제3조 (약관 등의 명시 및 개정)
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
					>
						1. "온서베이"는 본 약관의 내용을 이용자가 쉽게 알수 있도록
						"온서베이"의 인터넷 사이트 및 모바일 애플리케이션에 게시합니다. 다만
						약관은 이용자가 연결화면을 통하여 볼 수 있도록 합니다. 또한
						"온서베이"의 사업자등록번호, 전자우편주소 등 관련정보를 이용자가
						쉽게 알 수 있도록 온라인 서비스 화면에 게시합니다.
						<br />
						<br />
						2. "온서베이"는 콘텐츠산업 진흥법, 전자상거래 등에서의 소비자보호에
						관한 법률, 약관의 규제에 관한 법률 등 관련법을 위배하지 않는
						범위에서 이 약관을 개정할 수 있습니다.
						<br />
						<br />
						3. "온서베이" 약관을 개정할 경우에는 적용 일자 및 개정사유를
						명시하여 서비스 초기화면에 게시하며, 변경된 약관은 게시한 날로부터
						7일 후부터 효력이 발생합니다. 변경된 약관을 게시한 날로부터 효력이
						발생되는 날까지 약관변경에 대한 이용자의 의견이 접수되지 않으면
						변경된 약관에 동의 하는것으로 보겠습니다. 이용자가 변경된 약관에
						동의하지 않는 경우 해당 서비스의 제공이 더 이상 불가능하게 됩니다.
					</Text>
				</div>

				{/* 제4조 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						제4조 (약관의 해석)
					</Text>
					<Text
						display="block"
						color={colors.grey700}
						typography="t7"
						fontWeight="regular"
					>
						본 약관에 정하지 아니한 사항과 이 약관의 해석에 관하여는 콘텐츠산업
						진흥법, 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제에
						관한 법률, 정보통신부장관이 정하는 디지털콘텐츠 이용자보호지침, 기타
						관계법령 또는 상관례에 따릅니다.
					</Text>
				</div>

				{/* 제5조 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						제5조 ("온서베이"의 의무)
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
					>
						1. "온서베이"는 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를
						하지 않으며 이 약관이 정하는 바에 따라 지속적이고, 안정적으로 재화,
						용역을 제공하는데 최선을 다하여야 합니다.
						<br />
						<br />
						2. "온서베이"는 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록
						이용자의 개인정보(신용정보 포함)보호를 위한 보안 시스템을 갖추어야
						합니다.
						<br />
						<br />
						3. "온서베이"가 상품이나 용역에 대하여 「표시․광고의 공정화에 관한
						법률」 제3조 소정의 부당한 표시․광고행위를 함으로써 이용자가 손해를
						입은 때에는 이를 배상할 책임을 집니다.
						<br />
						<br />
						4. "온서베이"는 이용자가 원하지 않는 영리목적의 광고성 전자우편을
						발송하지 않습니다.
					</Text>
				</div>

				{/* 제6조 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						제6조 (이용자의 의무)
					</Text>
					<Text
						display="block"
						color={colors.grey700}
						typography="t7"
						fontWeight="regular"
						className="mb-3"
					>
						이용자는 다음 행위를 하여서는 안 됩니다.
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
						className="ml-4"
					>
						1. 회원 가입 시에 요구되는 정보는 정확하게 기입하여야 합니다. 또한
						이미 제공된 귀하에 대한 정보가 정확한 정보가 되도록 유지, 갱신하여야
						하며, 회원은 자신의 ID 및 비밀번호를 제3자에게 이용하게 해서는
						안됩니다.
						<br />
						<br />
						2. 회원은 "온서베이"의 사전 승낙 없이 서비스를 이용하여 어떠한
						영리행위도 할 수 없습니다.
						<br />
						<br />
						3. 회원은 "온서베이"을 이용하여 얻은 정보를 당 사이트의 사전승낙
						없이 복사, 복제, 변경, 번역, 출판, 방송 기타의 방법으로 사용하거나
						이를 타인에게 제공할 수 없습니다.
						<br />
						<br />
						4. 회원은 "온서베이" 서비스 이용과 관련하여 다음 각 호의 행위를
						하여서는 안됩니다.
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- 다른 회원의 ID를 부정 사용하는 행위
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- "토스포인트"를 부정한 방법으로 적립하거나
						사용한 행위
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- 선량한 풍속, 기타 사회질서를 해하는 행위
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- 타인의 명예를 훼손하거나 모욕하는 행위
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- 타인의 지적재산권 등의 권리를 침해하는
						행위
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- 해킹행위 또는 컴퓨터바이러스의 유포행위
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- 타인의 의사에 반하여 광고성 정보 등 일정한
						내용을 지속적으로 전송하는 행위
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- 서비스의 안전적인 운영에 지장을 주거나 줄
						우려가 있는 일체의 행위
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- 당 사이트에 게시된 정보의 변경.
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- 기타 전기통신법 제53조와 전기통신사업법
						시행령 16조(불온통신), 통신사업법 제53조3항에 위배되는 행위
					</Text>
				</div>

				{/* 제7조 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						제7조 ("서비스"의 내용)
					</Text>
					<Text
						display="block"
						color={colors.grey700}
						typography="t7"
						fontWeight="regular"
						className="mb-3"
					>
						"온서베이"는 "회원"에게 아래와 같은 서비스를 제공합니다.
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
						className="ml-4"
					>
						- 설문조사에 대해 응답할 수 있는 자격과 이에 따른 "토스포인트" 제공
						<br />- 설문조사를 의뢰할 수 있는 자격과 이에 따른 응답데이터 제공
						<br />
						<br />
						이외 제공하는 모든 부가 서비스
					</Text>
				</div>

				{/* 제8조 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						제8조 (정보의 제공 및 광고의 게재)
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
					>
						1. "온서베이"는 "회원"이 "온서베이" 이용 중 필요하다고 인정되는
						다양한 정보를 공지사항, 전자우편 등의 방법으로 "회원"에게 제공할 수
						있습니다. 다만, "회원"은 관련법에 따른 거래관련 정보 및 고객문의
						등에 대한 답변 등을 제외하고는 언제든지 전자우편 등에 대해서 수신
						거절을 할 수 있습니다.
						<br />
						<br />
						2. 제1항의 정보를 전화 및 팩스전송기기에 의하여 전송하려고 하는
						경우에는 "회원"의 사전 동의를 받아서 전송합니다. 다만, "회원"의
						거래관련 정보 및 고객문의 등에 대한 회신에 있어서는 제외됩니다.
						<br />
						<br />
						3. "온서베이"는 운영과 관련하여 "콘텐츠" 화면, 홈페이지, 전자우편
						등에 광고를 게재할 수 있습니다. 광고가 게재된 전자우편 등을 수신한
						"회원"은 수신거절을 "온서베이"에게 할 수 있습니다.
						<br />
						<br />
						4. "회원"의 정보는 "의뢰자"에게 아래와 같은 기준에 의해 제공됩니다.
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- "온서베이"는 "회원"의 설문응답 결과와
						"회원"이 설문조사에 응할 당시의 일부 정보(성별, 나이, 직업, 지역에
						한하며, 이름이나 연락처 등의 정보는 포함되지 않음)을 "의뢰자"에게
						제공하고, 해당 정보는 설문조사의 결과에 대한 통계 조사 자료로만
						활용됩니다. "온서베이"는 이와 같은 "회원" 정보를 제공함에 있어서
						"회원" 으로부터 개인정보 보호법에서 정하는 개인정보 제공 동의를 받는
						등 관련 법령에서 정하는 절차를 준수합니다.
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- "온서베이"가 제공한 "회원"의
						설문응답결과는 "의뢰자"에게 위 호와 같은 형태로 제공되며, "의뢰자"는
						해당 설문응답결과를 2차 가공 및 활용할 수 있는 권리가 있습니다.
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- "회원"에 대하여 "의뢰자"가 인터뷰 또는
						개별 연락을 원할 경우, "회원"과 "온서베이"의 동의 하에 모든 과정이
						진행됩니다.
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- "의뢰자"는 "온서베이"로부터 "회원"의
						개인정보를 제공받지 않고 직접 "회원"으로부터 동의를 받아 "회원"의
						개인정보를 수집하여 이용할 수 있으며, 이러한 처리는 "온서베이"와
						무관하며 해당 "회원"의 개인정보 처리에 관한 법령 등 준수의 책임은
						"의뢰자"에게 있습니다.
					</Text>
				</div>

				{/* 제9조 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						제9조 (구매신청 및 개인정보 제공 동의 등)
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
					>
						1. "온서베이"이용자는 "온서베이"상에서 다음 또는 이와 유사한 방법에
						의하여 구매를 신청하며, "온서베이"은 이용자가 구매신청을 함에 있어서
						다음의 각 내용을 알기 쉽게 제공하여야 합니다.
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- 재화 등의 검색 및 선택
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- 약관내용, 청약철회권이 제한되는 서비스,
						비용부담과 관련한 내용에 대한 확인
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- 이 약관에 동의하고 위 2.호의 사항을
						확인하거나 거부하는 표시(예, 마우스 클릭)
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- 재화등의 구매신청 및 이에 관한 확인 또는
						"온서베이"의 확인에 대한 동의
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- 결제방법의 선택
					</Text>
				</div>

				{/* 제10조 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						제10조 (서비스의 중단)
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
					>
						1. "온서베이"는 컴퓨터 등 정보통신설비의 보수점검․교체 및 고장,
						통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로
						중단할 수 있습니다.
						<br />
						<br />
						2. "온서베이"는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로
						인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다. 단,
						"온서베이"가 고의 또는 과실이 없음을 입증하는 경우에는 그러하지
						아니합니다.
						<br />
						<br />
						3. 사업종목의 전환, 사업의 포기, 업체 간의 통합 등으로 서비스 제공이
						불가능하게 되는 경우 "온서베이"는 제3조에 정한 방법으로 이용자에게
						사전 통지합니다. 단, 별도의 금전적 보상이나 현물 제공은 하지 않으며,
						서비스의 종료 또는 중단에 따라 발생하는 이용자의 데이터 관리 책임은
						최종적으로 이용자에게 있습니다.
					</Text>
				</div>

				{/* 제11조 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						제11조 (저작권 등의 귀속)
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
					>
						1. "온서베이"는 "이용자"가 제공한 데이터의 보관 및 데이터베이스
						권리를 가집니다. 즉 제공되는 데이터를 다른 형태로 디지털화하여
						다양하게 제공 할 수 있는 권리가 있습니다.
						<br />
						<br />
						2. 디지털화 활용 범위는 다음과 같습니다.
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- 온라인(PC/MOBIL)웹 홈페이지
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- 각종 SNS(인스타그램, 페이스북, 블로그,
						유투브 등)
						<br />
						<br />
						3. "온서베이"가 작성한 "게시물"에 대한 저작권 및 기타 지적재산권은
						"온서베이"에 귀속합니다.
						<br />
						<br />
						4. "온서베이"가 제공한 "회원"의 "설문응답결과"는 "의뢰자"에게
						제8조와 같은 형태로 제공되며, "의뢰자"는 해당 "설문응답결과"를 2차
						가공 및 활용할 수 있는 권리가 있습니다.
						<br />
						<br />
						5. "온서베이"가 제공하는 서비스 중 제휴계약에 의해 제공되는 저작물에
						대한 저작권 및 기타 지적재산권 은 해당 제공업체에 귀속합니다.
						<br />
						<br />
						6. "이용자"는 "온서베이"가 제공하는 서비스를 이용함으로써 얻은 정보
						중 "온서베이" 또는 제공업체에 지적재산권이 귀속된 정보를
						"온서베이"의 사전승낙 없이 복제, 전송,출판, 배포, 방송 기타 방법에
						의하여 영리 목적으로 이용하거나 제3자에게 이용하게 하여서는
						안됩니다.
						<br />
						<br />
						7. "회원"의 "게시물"이 "정보통신망법" 및 "저작권법"등 관련법에
						위반되는 내용을 포함하는 경우, 권리자는 관련법이 정한 절차에 따라
						해당 "게시물"의 게시중단 및 삭제 등을 요청할 수 있으며, "회사"는
						관련법에 따라 조치를 취하여야 합니다.
						<br />
						<br />
						8. "온서베이"는 전항에 따른 권리자의 요청이 없는 경우라도 권리침해가
						인정될 만한 사유가 있거나 기타 회사 정책 및 관련법에 위반되는
						경우에는 관련법에 따라 해당 "게시물"에 대해 임시조치 등을 취할 수
						있습니다.
						<br />
						<br />
						9. 설문조사 결과를 비롯하여 "콘텐츠" 및 "콘텐츠"로부터 발생한
						결과물에 대한 소유권 및 지적재산권(저작권 포함)은 "온서베이"에
						귀속됩니다. 단, 제휴계약에 따라 제공된 저작물 등은 제외합니다.
						<br />
						<br />
						10. "온서베이"는 서비스와 관련하여 "회원"에게 "온서베이"가 정한
						이용조건에 따라 "계정", "콘텐츠", "토스포인트" 등을 이용할 수 있는
						이용권만을 부여하며, "회원"은 이를 양도, 판매, 담보제공 등의
						처분행위를 할 수 없습니다.
					</Text>
				</div>

				{/* 제12조 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						제12조 (구매취소 및 환불)
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
						className="mb-3"
					>
						<strong>1. 환불 원칙</strong>
						<br />
						"회원"의 결제 및 환불은 각 앱마켓(Apple App Store, Google Play)의
						정책을 따릅니다. 결제 플랫폼의 환불 심사 및 승인 절차는 "온서베이"
						또는 "앱인토스"가 직접 관여할 수 없으며, 각 마켓의 정책과 심사
						결과에 따라 환불 가능 여부가 최종 결정됩니다.
						<br />
						<br />
						<strong>2. iOS(앱스토어) 이용자 환불 정책</strong>
						<br />
						환불에 대한 모든 권한은 Apple에 있습니다. "온서베이"와 "토스"는 환불
						승인 권한을 보유하지 않으며, 고객님의 환불 요청은 Apple이 직접
						심사합니다. 승인 여부와 결과는 고객님의 Apple 계정 이메일로
						안내되며, 토스 또는 온서베이에서는 환불 확정 여부를 확인할 수
						없습니다. Apple의 환불 정책 및 전자상거래법에 따라 결제 후 7일
						이내에 요청할 수 있으며, 관련 문의는 Apple 고객지원센터 또는 이메일
						영수증 내 링크를 통해 진행해주시기 바랍니다.
						<br />
						<br />
						<strong>3. Android(구글플레이) 이용자 환불 정책</strong>
						<br />
						최종 환불 승인은 Google Play 스토어에서 이루어집니다. 사용자가
						환불을 요청하면, "온서베이"는 <strong>본 약관 제12조 4항을</strong>{" "}
						근거로 환불 사유를 검토하여 승인 또는 반려할 수 있습니다.
						"온서베이"에서 환불을 승인할 경우, Google Play 스토어에 환불 심사가
						자동으로 요청되며, 최종 환불 여부는 Google의 심사 결과에 따라
						결정됩니다. Google의 환불 정책에 따라 결제 후 48시간 이내에 환불
						요청이 가능합니다.
						<br />
						<br />
						<strong>4. 환불 가능 시점</strong>
						<br />
						설문 노출 이전(=설문 응답 모집 시작 전)에는 단순 변심을 포함하여
						전액 환불이 가능합니다. 설문이 노출되어 응답 모집이 시작된 이후에는
						참여자에게 보상이 지급되기 때문에 어떠한 사유로도 환불이
						불가능합니다.
						<br />
						<br />
						<strong>5. 부분 환불 불가</strong>
						<br />
						현재 시스템상 부분 환불은 지원되지 않으며, 전체 환불만 가능합니다.
					</Text>
				</div>

				{/* 제13조 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						제13조 (분쟁의 해결)
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
					>
						1. "온서베이"는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그
						피해를 보상처리하기 위하여 피해보상처리기구를 설치, 운영합니다.
						<br />
						<br />
						2. "온서베이"는 이용자로부터 제출되는 불만사항 및 의견은 우선적으로
						그 사항을 처리합니다. 다만, 신속한 처리가 곤란한 경우에는 이용자에게
						그 사유와 처리일정을 즉시 통보해 드립니다.
						<br />
						<br />
						3. "온서베이"와 이용자 간에 발생한 전자상거래 분쟁과 관련하여
						이용자의 피해구제신청이 있는 경우에는 공정거래위원회 또는
						시·도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.
					</Text>
				</div>

				{/* 제14조 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						제14조 (재판권 및 준거법)
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
					>
						1. "온서베이"와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은
						제소 당시의 이용자의 주소에 의하고, 주소가 없는 경우에는 거소를
						관할하는 지방법원의 전속관할로 합니다. 다만, 제소 당시 이용자의 주소
						또는 거소가 분명하지 않거나 외국 거주자의 경우에는 민사소송법상의
						관할법원에 제기합니다.
						<br />
						<br />
						2. "온서베이"와 이용자 간에 제기된 전자상거래 소송에는 한국법을
						적용합니다.
					</Text>
				</div>
			</div>
		</div>
	);
};

export default TermsOfService;
