$(() => {

  const $searchForm = $(`
  <form method="GET" action="/api/listings/search">
    <input name="name" type="text" id="name">
    <input name="city" type="text" id="city">
    <input name="minPrice" type="number" id="minPrice">
    <input name="maxPrice" type="number" id="maxPrice">
    <button type="submit">Submit</button>
  </form>`);

  const filterButton = $('.initialFilter')
  filterButton.click(event => {
    const $container = $('.filter-options');
    $container.append($searchForm).hide().slideDown();
    filterButton.detach();
  });
});
