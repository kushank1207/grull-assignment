export function levenshteinDistance(a, b) {
    const matrix = [];
  
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
  
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
  
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
  
    return matrix[b.length][a.length];
  }
  
  function getRelatedKeywords(searchTerm) {
    if (searchTerm.toLowerCase() === 'orange farming') {
      return ['citrus', 'fruit', 'agriculture'];
    }
    return [];
  }
  
  function keywordPreFilter(searchTerm, searchArray) {
    const relatedKeywords = [searchTerm, ...getRelatedKeywords(searchTerm)];
    return searchArray.filter(item =>
      relatedKeywords.some(keyword =>
        item.description.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }
  
  export function fuzzySearchEnhanced(searchTerm, searchArray) {
    const preFilteredArray = keywordPreFilter(searchTerm, searchArray);
    return preFilteredArray
      .map(item => ({
        ...item,
        rank: levenshteinDistance(searchTerm.toLowerCase(), item.description.toLowerCase()),
      }))
      .sort((a, b) => a.rank - b.rank);
  }
  
  // Example
//   const quests = [
//     { description: 'Participate in our Orange Farming Initiative to revolutionize the way we cultivate citrus fruits. This quest involves hands-on activities in an orange orchard, learning sustainable farming practices, and helping with the harvest. Ideal for those passionate about agriculture and looking to make a real difference in local farming communities.' },
//     { description: 'Join our Citrus Grove Cultivation quest for a refreshing experience in agronomy. The quest covers various aspects of cultivating citrus varieties, with a focus on innovative techniques to boost yield and sustainability. While it encompasses more than just oranges, it\'s a perfect fit for enthusiasts eager to broaden their horticultural horizons.' }
//   ];
//   const searchTerm = 'orange';
//   const rankedResults = fuzzySearchEnhanced(searchTerm, quests);
  
//   console.log(rankedResults);
  