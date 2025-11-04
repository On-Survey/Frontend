import { colors } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";

export const RefundPolicy = () => {
	const sections = [
		{
			id: "section-01",
			number: "01",
			numberFontWeight: "semibold",
			title: "설문 검수 전 주문건의 환불 정책",
			titleFontWeight: "semibold",
			description:
				"설문 응답 수집이 시작 되기 전에, 주문을 취소하실 경우 전액 환불 진행 (영업일 기준 3일 이내에 카드 자동환불)",
			items: [],
		},
		{
			id: "section-02",
			number: "02",
			numberFontWeight: "medium",
			title: "설문 응답 수집 시작 후 주문건의 환불 정책",
			titleFontWeight: "medium",
			description:
				"설문 응답이 시작 된 이후에는 아래 경우, 부분 환불 진행 (영업일 기준 3일 이내에 카드 자동 환불)",
			items: [
				{
					id: "refund-1",
					text: "1) 설문 마감일까지 응답을 수집하는데, 요청 응답수만큼 응답이 모이지 않은 경우",
				},
				{
					id: "refund-2",
					text: "2) 설문 진행 중 고객이 주문을 취소하여, 요청 응답수만큼 응답이 모이지 않은 경우",
				},
				{
					id: "refund-3",
					lines: [
						"✱ 부분 환불 금액 산정 기준 주문 금액",
						"✱ 요청 응답 수 / 부족한 응답 수",
						"= 해당 금액에 대해 부분 환불 진행",
					],
				},
			],
		},
	];

	return (
		<div className="flex flex-col w-full h-screen">
			<div className="flex-1 overflow-y-auto px-4 py-6">
				{sections.map((section, index) => (
					<div
						key={section.id}
						className={index > 0 ? "flex gap-4 mt-8" : "flex gap-4"}
					>
						<Text
							display="block"
							color={colors.grey800}
							typography="t6"
							fontWeight={section.numberFontWeight}
						>
							{section.number}
						</Text>
						<div className="flex-1">
							<Text
								display="block"
								color={colors.grey700}
								typography="t6"
								fontWeight={section.titleFontWeight}
							>
								{section.title}
							</Text>
							<Text
								color={colors.grey600}
								typography="t7"
								fontWeight="medium"
								className="mt-2"
							>
								{section.description}
							</Text>
							{section.items.length > 0 &&
								section.items.map((item) => (
									<div key={item.id} className="mt-6">
										{"lines" in item && item.lines ? (
											item.lines.map((line) => (
												<Text
													key={line}
													display="block"
													color={colors.grey600}
													typography="t7"
													fontWeight="medium"
												>
													{line}
												</Text>
											))
										) : (
											<Text
												display="block"
												color={colors.grey600}
												typography="t7"
												fontWeight="medium"
											>
												{"text" in item ? item.text : ""}
											</Text>
										)}
									</div>
								))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default RefundPolicy;
