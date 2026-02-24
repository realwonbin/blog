// app.js
document.addEventListener('DOMContentLoaded', () => {
  // Initialize SimpleJekyllSearch
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    SimpleJekyllSearch({
      searchInput: searchInput,
      resultsContainer: document.getElementById('results-container'),
      json: '/search.json',
      searchResultTemplate: '<li><a href="{url}">{title}</a><span class="search-date">{date}</span></li>',
      noResultsText: '<li class="no-results">검색 결과가 없습니다.</li>',
      limit: 10,
      fuzzy: false
    });
  }
});
