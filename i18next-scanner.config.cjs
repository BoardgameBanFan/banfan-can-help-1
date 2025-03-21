module.exports = {
	input: ["app/**/*.{js,ts,jsx,tsx}", "components/**/*.{js,ts,jsx,tsx}"],
	output: "./",
	options: {
		defaultLng: "en",
		lngs: [
			"en",
			// , "zh-TW", "de"
		],
		ns: ["common"],
		defaultNs: "common",
		defaultValue: (lng, ns, key) => {
			if (lng === "en") {
				return key;
			}
		},
		resource: {
			loadPath: "public/locales/{{lng}}/{{ns}}.json",
			savePath: "public/locales/{{lng}}/{{ns}}.json",
		},
		func: {
			list: ["t"],
			extensions: [".js", ".ts", ".jsx", ".tsx"],
		},
	},
};
