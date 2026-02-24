// app.js
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('results-container');
  let searchData = [];

  if (searchInput && resultsContainer) {
    // 1. Load data
    fetch('/search.json')
      .then(res => res.json())
      .then(data => {
        searchData = data;
      })
      .catch(err => console.error('Search data load error:', err));

    // 2. Perform search on typing
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      resultsContainer.innerHTML = '';

      if (!term) return;

      const results = searchData.filter(post =>
        (post.title && post.title.toLowerCase().includes(term)) ||
        (post.tags && post.tags.toLowerCase().includes(term))
      ).slice(0, 10);

      if (results.length === 0) {
        resultsContainer.innerHTML = '<li class="no-results">검색 결과가 없습니다.</li>';
        return;
      }

      results.forEach(post => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${post.url}">${post.title}</a><span class="search-date">${post.date}</span>`;
        resultsContainer.appendChild(li);
      });
    });

    // 3. Close search results when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
        resultsContainer.innerHTML = '';
      }
    });
  }
});
