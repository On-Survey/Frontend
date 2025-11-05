import { adaptive } from "@toss/tds-colors";
import {
	Checkbox,
	FixedBottomCTA,
	ListHeader,
	ListRow,
	Top,
} from "@toss/tds-mobile";

export const LocationSelectPage = () => {
	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						거주지를 선택해 주세요
					</Top.TitleParagraph>
				}
			/>
			<ListHeader
				title={
					<ListHeader.TitleParagraph
						color={adaptive.grey800}
						fontWeight="regular"
						typography="t7"
					>
						추가요금이 부가되지 않아요
					</ListHeader.TitleParagraph>
				}
				descriptionPosition="bottom"
			/>
			<ListRow
				role="checkbox"
				aria-checked={false}
				contents={
					<ListRow.Texts
						type="1RowTypeA"
						top="전체"
						topProps={{ color: adaptive.grey700 }}
					/>
				}
				right={<Checkbox.Line aria-hidden={true} />}
			/>
			<ListHeader
				title={
					<ListHeader.TitleParagraph
						color={adaptive.grey800}
						fontWeight="regular"
						typography="t7"
					>
						5%의 추가요금이 부과돼요
					</ListHeader.TitleParagraph>
				}
				descriptionPosition="bottom"
			/>
			<div>
				<ListRow
					role="checkbox"
					aria-checked={true}
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top="서울"
							topProps={{ color: adaptive.grey700 }}
						/>
					}
					right={<Checkbox.Line checked={true} aria-hidden={true} />}
				/>
				<ListRow
					role="checkbox"
					aria-checked={false}
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top="경기"
							topProps={{ color: adaptive.grey700 }}
						/>
					}
					right={<Checkbox.Line aria-hidden={true} />}
				/>
				<ListRow
					role="checkbox"
					aria-checked={false}
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top="인천"
							topProps={{ color: adaptive.grey700 }}
						/>
					}
					right={<Checkbox.Line aria-hidden={true} />}
				/>
				<ListRow
					role="checkbox"
					aria-checked={false}
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top="대전"
							topProps={{ color: adaptive.grey700 }}
						/>
					}
					right={<Checkbox.Line aria-hidden={true} />}
				/>
				<ListRow
					role="checkbox"
					aria-checked={false}
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top="세종"
							topProps={{ color: adaptive.grey700 }}
						/>
					}
					right={<Checkbox.Line aria-hidden={true} />}
				/>
				<ListRow
					role="checkbox"
					aria-checked={false}
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top="부산"
							topProps={{ color: adaptive.grey700 }}
						/>
					}
					right={<Checkbox.Line aria-hidden={true} />}
				/>
				<ListRow
					role="checkbox"
					aria-checked={false}
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top="울산"
							topProps={{ color: adaptive.grey700 }}
						/>
					}
					right={<Checkbox.Line aria-hidden={true} />}
				/>
				<ListRow
					role="checkbox"
					aria-checked={false}
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top="대구"
							topProps={{ color: adaptive.grey700 }}
						/>
					}
					right={<Checkbox.Line aria-hidden={true} />}
				/>
				<ListRow
					role="checkbox"
					aria-checked={false}
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top="광주"
							topProps={{ color: adaptive.grey700 }}
						/>
					}
					right={<Checkbox.Line aria-hidden={true} />}
				/>
				<ListRow
					role="checkbox"
					aria-checked={false}
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top="강원"
							topProps={{ color: adaptive.grey700 }}
						/>
					}
					right={<Checkbox.Line aria-hidden={true} />}
				/>
				<ListRow
					role="checkbox"
					aria-checked={false}
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top="충북"
							topProps={{ color: adaptive.grey700 }}
						/>
					}
					right={<Checkbox.Line aria-hidden={true} />}
				/>
				<ListRow
					role="checkbox"
					aria-checked={false}
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top="충남"
							topProps={{ color: adaptive.grey700 }}
						/>
					}
					right={<Checkbox.Line aria-hidden={true} />}
				/>
				<ListRow
					role="checkbox"
					aria-checked={false}
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top="전북"
							topProps={{ color: adaptive.grey700 }}
						/>
					}
					right={<Checkbox.Line aria-hidden={true} />}
				/>
				<ListRow
					role="checkbox"
					aria-checked={false}
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top="전남"
							topProps={{ color: adaptive.grey700 }}
						/>
					}
					right={<Checkbox.Line aria-hidden={true} />}
				/>
				<ListRow
					role="checkbox"
					aria-checked={false}
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top="경북"
							topProps={{ color: adaptive.grey700 }}
						/>
					}
					right={<Checkbox.Line aria-hidden={true} />}
				/>
				<ListRow
					role="checkbox"
					aria-checked={false}
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top="경남"
							topProps={{ color: adaptive.grey700 }}
						/>
					}
					right={<Checkbox.Line aria-hidden={true} />}
				/>
				<ListRow
					role="checkbox"
					aria-checked={false}
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top="제주"
							topProps={{ color: adaptive.grey700 }}
						/>
					}
					right={<Checkbox.Line aria-hidden={true} />}
				/>
			</div>
			<FixedBottomCTA loading={false}>다음</FixedBottomCTA>
		</>
	);
};
