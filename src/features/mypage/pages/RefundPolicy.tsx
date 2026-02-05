import { colors } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";

export const RefundPolicy = () => {
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
					환불 정책
				</Text>

				{/* 환불 가능 시점 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						환불 가능 시점
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
					>
						설문 노출 이전, 즉 설문 응답 모집 이전에는 환불이 가능합니다.
						<br />
						<br />
						그러나 설문이 노출되어 응답 모집이 시작된 이후에는 참여자에게 보상이
						지급되기 때문에{" "}
						<strong>어떠한 사유로도 환불이 불가능합니다.</strong> 또한 현재
						시스템상{" "}
						<strong>부분 환불은 지원되지 않고 전체 환불만 가능합니다.</strong>
					</Text>
				</div>

				{/* 환불 원칙 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						환불 원칙
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
					>
						온서베이의 결제 및 환불은 각 앱마켓(Apple App Store, Google Play)의
						정책을 따릅니다.
						<br />
						<br />
						결제 플랫폼의 환불 심사 및 승인 절차는 온서베이 또는 앱인토스가 직접
						관여할 수 없으며, 각 마켓의 정책과 심사 결과에 따라 환불 가능 여부가
						결정됩니다.
					</Text>
				</div>

				{/* iOS 환불 정책 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						iOS(앱스토어) 이용자 환불 정책
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
					>
						iOS(앱스토어) 이용자의 경우, 환불에 대한 모든 권한은 Apple에
						있습니다.
						<br />
						<br />
						온서베이와 앱인토스는 환불 승인 권한을 보유하지 않으며, 고객님의
						환불 요청은 Apple이 직접 심사합니다. 승인 여부와 결과는 고객님의
						Apple 계정 이메일로 안내되며, 토스나 온서베이에서는 환불 확정 여부를
						확인할 수 없습니다.
						<br />
						<br />
						Apple의 환불 정책과 전자상거래법에 따라 결제 후 7일 이내에 요청할 수
						있으며, 관련 문의는 Apple 고객지원센터 또는 이메일 영수증 내 링크를
						통해 진행해주세요.
					</Text>
				</div>

				{/* Android 환불 정책 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						Android(구글플레이) 이용자 환불 정책
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
					>
						Android(구글플레이) 이용자의 경우, 최종 환불 승인은 Google Play
						스토어에서 이루어집니다.
						<br />
						<br />
						사용자가 환불을 요청하면, 온서베이는 환불 요청 사유를 검토한 후 환불
						요청을 승인하거나 반려합니다. 온서베이에서 환불을 승인할 경우, 구글
						플레이 스토어에 환불 심사가 자동으로 요청되며,{" "}
						<strong>
							최종 환불 여부와 결과는 Google의 심사 후 사용자에게 안내됩니다.
						</strong>
						<br />
						<br />
						구글의 환불 정책에 따라 결제 후 <strong>48시간 이내에</strong> 환불
						요청이 가능합니다.
					</Text>
				</div>
			</div>
		</div>
	);
};

export default RefundPolicy;
