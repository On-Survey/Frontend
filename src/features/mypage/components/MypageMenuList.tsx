import { adaptive } from "@toss/tds-colors";
import { List, ListRow } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";

const MENU_ITEMS = [
	{ label: "코인 사용 내역", path: "/mypage/orderHistory" },
	{ label: "결제내역", path: "/mypage/coinHistory" },
	{ label: "프로모션 안내 및 유의사항", path: "/mypage/promotionNotice" },
	{ label: "환불 정책", path: "/mypage/refundPolicy" },
	{ label: "서비스 이용약관", path: "/mypage/termsOfService" },
	{ label: "개인 정보 처리 방침", path: "/mypage/privacyPolicy" },
	{ label: "사업자 정보", path: "/mypage/businessInfo" },
] as const;

export const MypageMenuList = () => {
	const navigate = useNavigate();

	return (
		<List>
			{MENU_ITEMS.map(({ label, path }) => (
				<ListRow
					key={path}
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top={label}
							topProps={{ color: adaptive.grey700 }}
						/>
					}
					arrowType="right"
					onClick={() => navigate(path)}
				/>
			))}
		</List>
	);
};
