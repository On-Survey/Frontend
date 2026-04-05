/** `/payment/google-form-conversion-preview` 로 `navigate` 시 전달하는 `location.state` */
export type GoogleFormConversionPreviewLocationState = {
	previewFrom?: "options" | "flow";
	/** 부분 성공 바텀시트 등: 첫 미변환 문항 섹션·행으로 초기 스크롤 */
	focusFirstInconvertible?: boolean;
};
