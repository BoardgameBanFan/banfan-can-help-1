export default {
  input: ['app/**/*.{js,ts,jsx,tsx}', 'components/**/*.{js,ts,jsx,tsx}'],
  output: './',
  options: {
    defaultLng: 'de',
    lngs: ['zh-TW', 'en', 'de'],
    ns: ['common'],
    defaultNs: 'common',
    resource: {
      loadPath: 'public/locales/{{lng}}/{{ns}}.json',
      savePath: 'public/locales/{{lng}}/{{ns}}.json',
    },
    func: {
      list: ['t'],
      extensions: ['.js', '.ts', '.jsx', '.tsx'],
    },
  },
};
