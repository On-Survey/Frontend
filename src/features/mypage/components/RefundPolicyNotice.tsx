import { adaptive } from "@toss/tds-colors";
import { Asset, Text } from "@toss/tds-mobile";
import { useState } from "react";

const REFUND_FORMULAS = [
	{
		title: "1) 지급된 리워드 금액",
		formula: "지급리워드 = 실제응답수 × 리워드금액",
	},
	{
		title: "2) 환불 대상 금액",
		formula: "환불대상금액 = 총결제금액 – 지급리워드",
	},
	{
		title: "3) 부족 응답 비율",
		formula: "부족비율 = (요청응답수 - 실제응답수) / 요청응답수",
	},
	{
		title: "4) 최종 환불 금액",
		formula: "환불금액 = 환불대상금액 × 부족비율",
	},
];

export const RefundPolicyNotice = () => {
	const [isFormulaOpen, setIsFormulaOpen] = useState(false);

	return (
		<div className="px-4 py-4 mb-4 bg-green-50 rounded-xl">
			<Text
				color={adaptive.grey800}
				typography="t6"
				fontWeight="bold"
				className="mb-3"
			>
				환불 정책 안내
			</Text>
			<Text
				color={adaptive.grey700}
				typography="t7"
				className="mb-4"
				display="block"
			>
				등록 후 수집중인 설문에 대해서는 다음과 같은 정책에 의거해 코인 환불을
				진행해드립니다. <br />
				1. 설문 마감일까지 응답을 수집하였으나, 요청한 응답 수만큼 모이지 않은
				경우 <br />
				2. 설문 수집중 고객이 설문 등록을 취소하여, 요청한 응답 수만큼 모이지
				않은 경우 <br />
				3. 설문이 수집중이더라도, 응답자 수가 0명이라면 전액 환불됩니다.
			</Text>

			<div className="pt-4">
				<button
					type="button"
					onClick={() => setIsFormulaOpen(!isFormulaOpen)}
					className="flex items-center justify-between w-full"
				>
					<div className="flex flex-col items-start">
						<Text
							color={adaptive.grey800}
							typography="t6"
							fontWeight="bold"
							className="mb-1"
						>
							부분 환불 금액 산정 공식
						</Text>
						<Text color={adaptive.grey600} typography="t7" display="block">
							(리워드 실비 차감 후 비례 환불)
						</Text>
					</div>
					<Asset.Icon
						frameShape={{ width: 24, height: 24 }}
						name={isFormulaOpen ? "icon-arrow-up-mono" : "icon-arrow-down-mono"}
						color={adaptive.grey600}
						aria-hidden={true}
					/>
				</button>

				{isFormulaOpen && (
					<div className="space-y-3 mt-3">
						{REFUND_FORMULAS.map((item) => (
							<div key={item.title}>
								<Text
									color={adaptive.grey800}
									typography="t7"
									fontWeight="semibold"
									className="mb-1"
									display="block"
								>
									{item.title}
								</Text>
								<Text
									color={adaptive.grey700}
									typography="t7"
									display="block"
									className="pl-2"
								>
									{item.formula}
								</Text>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
