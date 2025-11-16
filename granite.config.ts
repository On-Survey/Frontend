import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
	appName: "onsurvey",
	navigationBar: {
		withBackButton: true,
		withHomeButton: true,
		initialAccessoryButton: {
			id: "heart",
			title: "하트",
			icon: {
				name: "icon-heart-mono",
			},
		},
	},
	brand: {
		displayName: "onsurvey", // 화면에 노출될 앱의 한글 이름으로 바꿔주세요.
		primaryColor: "#4593FC", // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
		icon: "https://toss-storegroup.s3.us-east-1.amazonaws.com/Frame_1.png", // 화면에 노출될 앱의 아이콘 이미지 주소로 바꿔주세요.
		bridgeColorMode: "basic",
	},
	web: {
		host: "localhost",
		port: 5173,
		commands: {
			dev: "vite",
			build: "tsc -b && vite build",
		},
	},
	// Provide safe defaults for plugin hooks to avoid undefined access during build
	// @ts-expect-error: pluginHooks may not be typed in current version but used at runtime
	pluginHooks: {
		preHandlers: [],
		devServer: {
			preHandlers: [],
		},
	},
	permissions: [],
	outdir: "dist",
});
