module.exports = {
  // 對所有支援的文件運行 Prettier
  '**/*.{css,md,json}': ['prettier --write'],
  // 對 JS/JSX 文件運行 ESLint 和 Prettier
  '**/*.{js,jsx}': filenames => [
    `eslint --fix ${filenames.join(' ')}`,
    `prettier --write ${filenames.join(' ')}`,
  ],
};
