// The same text always gives the same number, so flight times and fares stay the same between requests.
export const hash = (text) => {
  return [...text].reduce((total, character) => (total * 31 + character.charCodeAt(0)) % 100_003, 7);
};
