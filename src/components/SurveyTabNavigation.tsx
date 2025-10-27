import { colors } from "@toss/tds-colors";
import { Tab } from "@toss/tds-mobile";

interface SurveyTabNavigationProps {
	selectedTab: string;
	onTabChange: (tab: string) => void;
}

export const SurveyTabNavigation = ({
	selectedTab,
	onTabChange,
}: SurveyTabNavigationProps) => {
	return (
		<div className="px-4 pt-4">
			<Tab
				fluid={false}
				size="small"
				style={{ backgroundColor: colors.white }}
				onChange={(key) => onTabChange(String(key))}
			>
				<Tab.Item
					key="0-전체"
					selected={selectedTab === "0-전체"}
					onClick={() => onTabChange("0-전체")}
				>
					전체
				</Tab.Item>
				<Tab.Item
					key="1-작성중"
					selected={selectedTab === "1-작성중"}
					onClick={() => onTabChange("1-작성중")}
				>
					작성중
				</Tab.Item>
				<Tab.Item
					key="2-노출중"
					selected={selectedTab === "2-노출중"}
					onClick={() => onTabChange("2-노출중")}
				>
					노출중
				</Tab.Item>
				<Tab.Item
					key="3-마감"
					selected={selectedTab === "3-마감"}
					onClick={() => onTabChange("3-마감")}
				>
					마감
				</Tab.Item>
			</Tab>
		</div>
	);
};
