module.exports = {
  '**/*.{js,jsx,ts,tsx}': (files) => `ts-standard --fix ${files.join(' ')}`
};
