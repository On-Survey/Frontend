import { colors } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";

export const PromotionNotice = () => {
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
					프로모션 안내 및 유의사항
				</Text>

				<Text
					display="block"
					color={colors.grey700}
					typography="t7"
					fontWeight="regular"
					className="mb-6"
				>
					온서베이에서는 설문 참여를 통해 다양한 리워드(프로모션 보상)를
					제공하고 있습니다.
					<br />
					<br />
					아래 유의사항을 꼭 확인하신 후 참여해 주세요.
				</Text>

				<div className="h-6" />

				{/* 지급 시점 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						지급 시점
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
						className="ml-4"
					>
						- 설문을 <strong>끝까지 완료하면 즉시 지급</strong>됩니다.
						<br />- 시스템 오류 등으로 지급이 지연될 경우,{" "}
						<strong>최대 7일 이내</strong> 지급될 수 있습니다.
					</Text>
				</div>

				{/* 지급 조건 및 제한 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						지급 조건 및 제한
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
						className="ml-4"
					>
						- 설문에{" "}
						<strong>끝까지 참여하고, 설문 종료 화면이 표시되어야</strong> 설문이
						완료로 인정됩니다.
						<br />- 설문을 완료하지 않고 중도 이탈한 경우, 리워드가 지급되지
						않습니다.
					</Text>
				</div>

				{/* 기타 안내 */}
				<div className="mb-8">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						기타 안내
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
						className="ml-4"
					>
						- 프로모션 금액은 온서베이의 운영 상황에 따라 달라질 수 있습니다.
						변경이 필요한 경우, 이용자분들께 미리 안내드리며 불이익이 없도록
						처리됩니다.
						<br />- 리워드는{" "}
						<strong>랜덤 지급이 불가하며, 고정 금액으로만</strong> 지급됩니다.
					</Text>
				</div>

				<div className="h-6" />

				<Text
					display="block"
					color={colors.grey700}
					typography="t7"
					fontWeight="regular"
					className="mb-3"
				>
					문의사항이 있으시다면 온서베이 고객센터(onsurveycs@gmail.com)으로
					연락해 주세요.
				</Text>

				<Text
					display="block"
					color={colors.grey700}
					typography="t7"
					fontWeight="regular"
				>
					항상 신뢰할 수 있는 보상 경험을 제공하기 위해 노력하겠습니다.
				</Text>
			</div>
		</div>
	);
};

export default PromotionNotice;
