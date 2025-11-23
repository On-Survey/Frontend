/** @type {Detox.DetoxConfig} */
module.exports = {
	testRunner: {
		args: {
			$0: "jest",
			config: "e2e/jest.config.js",
		},
		jest: {
			setupTimeout: 120000,
		},
	},
	apps: {
		"ios.debug": {
			type: "ios.app",
			binaryPath: "dist/onsurvey.ios.js",
			build: "granite build",
		},
		"android.debug": {
			type: "android.apk",
			binaryPath: "dist/onsurvey.android.js",
			build: "granite build",
		},
	},
	devices: {
		simulator: {
			type: "ios.simulator",
			device: {
				type: "iPhone 15 Pro",
			},
		},
		emulator: {
			type: "android.emulator",
			device: {
				avdName: "Pixel_7_API_34",
			},
		},
	},
	configurations: {
		"ios.sim.debug": {
			device: "simulator",
			app: "ios.debug",
		},
		"android.emu.debug": {
			device: "emulator",
			app: "android.debug",
		},
	},
};
