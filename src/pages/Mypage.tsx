import { colors } from "@toss/tds-colors";
import { List, ListRow } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "../components/BottomNavigation";

export const Mypage = () => {
	const navigate = useNavigate();

	const handleHome = () => {
		navigate("/home");
	};

	const handleMySurvey = () => {
		navigate("/mysurvey");
	};

	const handleOrderHistory = () => {
		navigate("/mypage/orderHistory");
	};

	const handleRefundPolicy = () => {
		navigate("/mypage/refundPolicy");
	};

	return (
		<div className="flex flex-col w-full h-screen">
			<div className="flex-1 overflow-y-auto p-2 pb-20">
				<List>
					<ListRow
						contents={
							<ListRow.Texts
								type="1RowTypeA"
								top="주문내역"
								topProps={{ color: colors.grey700 }}
							/>
						}
						arrowType="right"
						onClick={handleOrderHistory}
					/>
					<ListRow
						contents={
							<ListRow.Texts
								type="1RowTypeA"
								top="환불 정책"
								topProps={{ color: colors.grey700 }}
							/>
						}
						arrowType="right"
						onClick={handleRefundPolicy}
					/>
					<ListRow
						contents={
							<ListRow.Texts
								type="1RowTypeA"
								top="서비스 이용약관"
								topProps={{ color: colors.grey700 }}
							/>
						}
						arrowType="right"
					/>
					<ListRow
						contents={
							<ListRow.Texts
								type="1RowTypeA"
								top="개인 정보 처리 방침"
								topProps={{ color: colors.grey700 }}
							/>
						}
						arrowType="right"
					/>
					<ListRow
						contents={
							<ListRow.Texts
								type="1RowTypeA"
								top="사업자 정보"
								topProps={{ color: colors.grey700 }}
							/>
						}
						arrowType="right"
					/>
				</List>
			</div>

			<BottomNavigation
				currentPage="more"
				onHomeClick={handleHome}
				onMySurveyClick={handleMySurvey}
			/>
		</div>
	);
};
