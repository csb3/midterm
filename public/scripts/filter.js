$(() => {
  // console.log(userCity);
  const $searchForm = $(`
  <form method="GET" action="/api/listings/search">
    <label for="name">Name:</label>
    <input name="name" type="text" id="name">
    <label for="city">City:</label>
    <input name="city" type="text" id="city" value="${userCity}">
    <label>Price Range:</label>
    <span>
    <input name="minPrice" type="number" id="minPrice" step="any" min="0" placeholder="$">
    <label> to </label>
    <input name="maxPrice" type="number" id="maxPrice" step="any" min="0" placeholder="$">
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
