import { colors } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";

const TableCell = ({ children }: { children: React.ReactNode }) => (
	<td className="border border-gray-300 px-3 py-2">
		<Text color={colors.grey600} typography="t7" fontWeight="regular">
			{children}
		</Text>
	</td>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
	<th className="border border-gray-300 px-3 py-2 text-left">
		<Text color={colors.grey700} typography="t7" fontWeight="semibold">
			{children}
		</Text>
	</th>
);

export const PrivacyPolicy = () => {
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
					온서베이 개인정보 처리방침
				</Text>

				<Text
					display="block"
					color={colors.grey700}
					typography="t7"
					fontWeight="regular"
					className="mb-6"
				>
					<strong>온서베이(OnSurvey)</strong> 는 「개인정보 보호법」,
					「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령에 따라
					이용자의 개인정보를 안전하게 보호하기 위해 최선을 다하고 있습니다. 본
					개인정보 처리방침은 온서베이 서비스 이용과 관련하여 이용자의
					개인정보가 어떻게 수집, 이용, 보관, 제공되는지를 안내하기 위한
					것입니다.
				</Text>

				<div className="h-6" />

				{/* 제1조 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						제1조 (개인정보의 수집 및 이용 목적)
					</Text>
					<Text
						display="block"
						color={colors.grey700}
						typography="t7"
						fontWeight="regular"
						className="mb-3"
					>
						온서베이는 다음의 목적을 위해 이용자의 개인정보를 수집·이용합니다.
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
						className="ml-4"
					>
						1. <strong>회원 관리</strong>
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;본인 확인, 회원 식별, 계정 관리, 서비스 이용
						이력 관리
						<br />
						<br />
						2. <strong>서비스 제공</strong>
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;설문 제작, 응답 관리, 데이터 저장 및 통계
						제공
						<br />
						<br />
						3. <strong>결제 및 환불 처리</strong>
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;유료 서비스 이용 시 결제 확인, 환불 요청
						검토 및 처리
						<br />
						<br />
						4. <strong>고객 상담 및 민원 처리</strong>
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;문의 응대, 서비스 이용 관련 고충 처리
						<br />
						<br />
						5. <strong>법적 의무 이행</strong>
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;전자상거래 관련 법령 등 관계 법규 준수
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
						제2조 (수집하는 개인정보 항목 및 수집 시점)
					</Text>
					<div className="overflow-x-auto mb-3">
						<table className="w-full border-collapse border border-gray-300 text-sm">
							<thead>
								<tr className="bg-gray-50">
									<TableHeader>구분</TableHeader>
									<TableHeader>수집 항목</TableHeader>
									<TableHeader>수집 시점</TableHeader>
								</tr>
							</thead>
							<tbody>
								<tr>
									<TableCell>회원가입 시</TableCell>
									<TableCell>
										이름, 생년월일, 휴대폰 번호, 이메일, 성별, 거주지, 직무
									</TableCell>
									<TableCell>회원가입 시</TableCell>
								</tr>
								<tr>
									<TableCell>설문 제작 시</TableCell>
									<TableCell>이름, 계정 ID</TableCell>
									<TableCell>설문 제작 시</TableCell>
								</tr>
								<tr>
									<TableCell>결제/환불 시</TableCell>
									<TableCell>거래 ID, 결제수단, 스토어 계정정보</TableCell>
									<TableCell>결제 또는 환불 요청 시</TableCell>
								</tr>
							</tbody>
						</table>
					</div>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
						className="mt-2"
					>
						※ 서비스 운영 과정에서 IP 주소, 기기 정보, 이용 기록 등 서비스 이용
						로그가 자동으로 생성·수집될 수 있습니다.
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
						제3조 (개인정보의 보유 및 이용기간)
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
						className="mb-3"
					>
						1. 이용자의 개인정보는 원칙적으로{" "}
						<strong>회원 탈퇴 시 즉시 삭제</strong>됩니다.
						<br />
						<br />
						2. 단, 관련 법령에 따라 다음의 정보는 일정 기간 동안 보관됩니다.
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- 계약 또는 청약철회 등에 관한 기록: 5년
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- 대금 결제 및 재화 등의 공급에 관한 기록:
						5년
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- 소비자 불만 또는 분쟁처리에 관한 기록: 3년
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- 서비스 이용 관련 로그 기록: 3개월
						(통신비밀보호법)
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
						제4조 (개인정보의 제3자 제공)
					</Text>
					<Text
						display="block"
						color={colors.grey700}
						typography="t7"
						fontWeight="regular"
						className="mb-3"
					>
						온서베이는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
						다만, 결제 및 환불 등 서비스 수행을 위해 아래와 같이 제3자에게
						제공할 수 있습니다.
					</Text>
					<div className="overflow-x-auto mb-3">
						<table className="w-full border-collapse border border-gray-300 text-sm">
							<thead>
								<tr className="bg-gray-50">
									<TableHeader>제공받는 자</TableHeader>
									<TableHeader>제공 목적</TableHeader>
									<TableHeader>제공 항목</TableHeader>
									<TableHeader>보유 및 이용기간</TableHeader>
								</tr>
							</thead>
							<tbody>
								<tr>
									<TableCell>Apple App Store / Google Play Store</TableCell>
									<TableCell>결제 및 환불 처리</TableCell>
									<TableCell>거래 ID, 스토어 계정정보, 결제수단</TableCell>
									<TableCell>각 스토어의 정책에 따름</TableCell>
								</tr>
								<tr>
									<TableCell>토스(Toss)</TableCell>
									<TableCell>결제 연동 및 결제 내역 확인</TableCell>
									<TableCell>거래 ID, 결제금액, 결제수단</TableCell>
									<TableCell>관련 법령 및 계약기간 종료 시까지</TableCell>
								</tr>
							</tbody>
						</table>
					</div>
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
						제5조 (개인정보의 처리위탁)
					</Text>
					<Text
						display="block"
						color={colors.grey700}
						typography="t7"
						fontWeight="regular"
						className="mb-3"
					>
						온서베이는 서비스 제공을 위해 아래 업체에 일부 업무를 위탁하고
						있습니다.
					</Text>
					<div className="overflow-x-auto mb-3">
						<table className="w-full border-collapse border border-gray-300 text-sm">
							<thead>
								<tr className="bg-gray-50">
									<TableHeader>수탁업체</TableHeader>
									<TableHeader>위탁 업무 내용</TableHeader>
									<TableHeader>보유 및 이용기간</TableHeader>
								</tr>
							</thead>
							<tbody>
								<tr>
									<TableCell>Naver Cloud, AWS</TableCell>
									<TableCell>데이터 저장 및 서버 운영</TableCell>
									<TableCell>위탁계약 종료 시 또는 회원 탈퇴 시까지</TableCell>
								</tr>
							</tbody>
						</table>
					</div>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
						className="mt-2"
					>
						※ 위탁업체는 개인정보 보호법에 따라 안전하게 관리되며, 위탁 계약 시
						개인정보보호 조항을 명시하고 있습니다.
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
						제6조 (개인정보의 파기 절차 및 방법)
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
					>
						1. <strong>파기 절차</strong>
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;이용 목적 달성 후, 별도의 DB로 옮겨 일정
						기간 보관 후 관련 법령에 따라 파기합니다.
						<br />
						<br />
						2. <strong>파기 방법</strong>
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- 전자적 파일: 복구 불가능한 기술적 방법으로
						삭제
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp;- 종이 문서: 분쇄 또는 소각 처리
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
						제7조 (이용자 및 법정대리인의 권리)
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
					>
						1. 이용자는 언제든지 자신의 개인정보를 조회, 수정, 삭제, 처리정지
						요청할 수 있습니다.
						<br />
						<br />
						2. 개인정보 열람·정정·삭제 요청은 이메일(onsurveycs@gmail.com)을
						통해 가능합니다.
						<br />
						<br />
						3. 법정대리인은 만 14세 미만 아동의 개인정보에 대해 동일한 권리를
						행사할 수 있습니다.
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
						제8조 (개인정보의 안전성 확보 조치)
					</Text>
					<Text
						display="block"
						color={colors.grey700}
						typography="t7"
						fontWeight="regular"
						className="mb-3"
					>
						온서베이는 다음과 같은 기술적·관리적 보호조치를 시행하고 있습니다.
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
						className="ml-4"
					>
						- 개인정보 접근권한 관리 및 최소화
						<br />- 접근 기록의 보관 및 위·변조 방지
						<br />- 암호화를 통한 개인정보 보호
						<br />- 침입 차단 시스템을 통한 외부 접근 통제
						<br />- 정기적인 보안 점검 및 교육 실시
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
						제9조 (개인정보 보호책임자 및 담당자 연락처)
					</Text>
					<Text
						display="block"
						color={colors.grey700}
						typography="t7"
						fontWeight="regular"
						className="mb-3"
					>
						이용자의 개인정보를 보호하고 관련 민원을 처리하기 위하여 아래와 같이
						개인정보 보호책임자를 지정하고 있습니다.
					</Text>
					<div className="overflow-x-auto mb-3">
						<table className="w-full border-collapse border border-gray-300 text-sm">
							<thead>
								<tr className="bg-gray-50">
									<TableHeader>구분</TableHeader>
									<TableHeader>성명</TableHeader>
									<TableHeader>직책</TableHeader>
									<TableHeader>이메일</TableHeader>
								</tr>
							</thead>
							<tbody>
								<tr>
									<TableCell>개인정보 보호책임자</TableCell>
									<TableCell>김현아</TableCell>
									<TableCell>CEO</TableCell>
									<TableCell>hyunakim2080@gmail.com</TableCell>
								</tr>
								<tr>
									<TableCell>고객문의 담당</TableCell>
									<TableCell>온서베이 고객지원팀</TableCell>
									<TableCell>-</TableCell>
									<TableCell>onsurveycs@gmail.com</TableCell>
								</tr>
							</tbody>
						</table>
					</div>
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
						제10조 (개인정보 처리방침의 변경)
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
					>
						- 본 개인정보 처리방침은 관련 법령이나 서비스 정책의 변경에 따라
						수정될 수 있습니다.
						<br />- 변경 시 최소 7일 전 서비스 내 공지사항을 통해 안내합니다.
					</Text>
				</div>

				{/* 시행일자 등 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
					>
						<strong>시행일자:</strong> 2025년 11월 5일
						<br />
						<strong>운영주체:</strong> 원큐(OneQ)
						<br />
						<strong>서비스명:</strong> 온서베이(OnSurvey)
					</Text>
				</div>
			</div>
		</div>
	);
};

export default PrivacyPolicy;
