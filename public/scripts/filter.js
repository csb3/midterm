$(() => {

  const $searchForm = $(`
  <form method="GET" action="/api/listings/search">
    <label for="name">Name:</label>
    <input type="text" id="name">
    <label for="city">City:</label>
    <input type="text" id="city">
    <span>
    <label>Price Range:</label>
    <input type="number" id="minPrice">
    <label> to </label>
    <input type="number" id="maxPrice">
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
