import { by, expect as detoxExpect, device, element } from "detox";

describe("온서베이 앱 E2E 테스트", () => {
	beforeAll(async () => {
		await device.launchApp();
	});

	beforeEach(async () => {
		await device.reloadReactNative();
	});

	it("앱이 정상적으로 실행되어야 함", async () => {
		// 앱이 실행되면 기본 화면이 보여야 함
		await detoxExpect(element(by.id("app-root"))).toBeVisible();
	});

	it("홈 화면이 렌더링되어야 함", async () => {
		// 홈 화면의 주요 요소가 표시되는지 확인
		// testID를 실제 컴포넌트에 추가해야 합니다
		await detoxExpect(element(by.id("home-screen"))).toBeVisible();
	});

	// 예시: 버튼 클릭 테스트
	it("버튼을 클릭하면 다음 화면으로 이동해야 함", async () => {
		// testID가 'create-survey-button'인 버튼을 찾아서 클릭
		await element(by.id("create-survey-button")).tap();

		// 다음 화면이 표시되는지 확인
		await detoxExpect(element(by.id("create-form-screen"))).toBeVisible();
	});

	// 예시: 텍스트 입력 테스트
	it("설문 제목을 입력할 수 있어야 함", async () => {
		await element(by.id("create-survey-button")).tap();
		await element(by.id("survey-title-input")).typeText("테스트 설문");
		await element(by.id("survey-title-input")).clearText();
	});

	// 예시: 스크롤 테스트
	it("설문 목록을 스크롤할 수 있어야 함", async () => {
		await element(by.id("survey-list")).scroll(200, "down");
		await element(by.id("survey-list")).scroll(200, "up");
	});
});
