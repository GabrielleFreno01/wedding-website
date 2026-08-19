const DIACRITICS = new RegExp('[̀-ͯ]', 'g');
const NON_ALNUM = new RegExp('[^a-z0-9]', 'g');

function normalizeName(value) {
  return (value || '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .replace(NON_ALNUM, '');
}

module.exports = { normalizeName };
