import { extract, ratio } from 'fuzzball';

export function fuzzySearchEnhanced(searchTerm, searchArray) {
  console.log('Search Term:', searchTerm);
  console.log('Search Array:', searchArray);

  const choices = searchArray.map(item => item.description);
  console.log('Choices for Fuzzball:', choices);

  const searchResults = extract(searchTerm, choices, {
    scorer: ratio,
    returnObjects: true,
    cutoff: 50
  });

  console.log('Fuzzy Search Results:', searchResults);

  const filteredResults = searchResults
    .filter(result => result.score >= 50)
    .map(result => {
      const item = searchArray.find(item => item.description === result.choice);
      return {
        ...item,
        score: result.score
      };
    })
    .sort((a, b) => b.score - a.score);

  console.log('Filtered and Sorted Results:', filteredResults);

  return filteredResults;
}
