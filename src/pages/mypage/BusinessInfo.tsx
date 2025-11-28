import { colors } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";

export const BusinessInfo = () => {
	return (
		<div className="flex flex-col w-full h-screen">
			<div className="flex-1 overflow-y-auto px-4 py-6">
				<div className="mb-4">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						상호명
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
					>
						온서베이
					</Text>
				</div>

				<div className="mb-4">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						주소
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
					>
						경기도 성남시 구미로 144번길 7
					</Text>
				</div>

				<div className="mb-4">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						사업자 등록번호
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
					>
						238-12-02834
					</Text>
				</div>

				<div className="mb-4">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						대표
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
					>
						김현아
					</Text>
				</div>

				<div className="mb-4">
					<Text
						display="block"
						color={colors.grey800}
						typography="t6"
						fontWeight="semibold"
						className="mb-3"
					>
						연락처
					</Text>
					<Text
						display="block"
						color={colors.grey600}
						typography="t7"
						fontWeight="regular"
					>
						010-4620-7935
					</Text>
				</div>
			</div>
		</div>
	);
};

export default BusinessInfo;
