import { colors } from "@toss/tds-colors";
import { Tab } from "@toss/tds-mobile";

interface SurveyTabNavigationProps {
	selectedTab: number;
	onTabChange: (index: number) => void;
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
				onChange={(index) => onTabChange(index)}
			>
				<Tab.Item selected={selectedTab === 0}>전체</Tab.Item>
				<Tab.Item selected={selectedTab === 1}>작성중</Tab.Item>
				<Tab.Item selected={selectedTab === 2}>수집중</Tab.Item>
				<Tab.Item selected={selectedTab === 3}>마감</Tab.Item>
			</Tab>
		</div>
	);
};
