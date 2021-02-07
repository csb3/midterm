$(() => {

  const $searchForm = $(`
  <form>
    <label for="name">Name:</label>
    <input type="text" id="name">
    <label for="city">City:</label>
    <input type="text" id="city">
    <label for="date_posted">Posted after:</label>
    <input type="date" id="date_posted">
  </form>`);

  const filterButton = $('.listingsLabel button')
  filterButton.click(event => {
    const $container = $('.filter-options');
    const $form = $('.filter-options form');
    if ($form.is(':visible')) {
      $container.slideUp(() => {$container.empty();})
    } else {
      $container.append($searchForm).hide().slideDown();
    }
  });
});
