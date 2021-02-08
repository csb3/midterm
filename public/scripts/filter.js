$(() => {

  const $searchForm = $(`
  <form method="GET" action="/api/listings/search">
    <label for="name">Name:</label>
    <input type="text" id="name">
    <label for="city">City:</label>
    <input type="text" id="city">
    <label>Price Range:</label>
    <span>
    <input type="number" id="minPrice" placeholder="$">
    <label> to </label>
    <input type="number" id="maxPrice" placeholder="$">
    </span>
    <button type="submit">Submit</button>
  </form>`);

  const filterButton = $('.initialFilter')
  filterButton.click(event => {
    const $container = $('.filter-options');
    $container.append($searchForm).hide().slideDown();
    filterButton.detach();
  });
});
