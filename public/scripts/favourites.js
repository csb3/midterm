$(() => {

  const listingID = $('main').attr('id');

  const clearButton = (selector) => {
    $('.titleBanner').off();
    $(selector).remove();
  };

  const makeButton = (style) => {
    const text = style === 'fas' ? 'UNFAVOURITE' : 'FAVOURITE';
    return $button = $(`<button class='favourite'><i class="${style} fa-heart"></i> ${text}</button>`);
  };

  const isFavourite = (listingID) => {

    clearButton('.favourite');
    $('.titleBanner').append(makeButton('fas'));

    $('.titleBanner').on('click', '.favourite', listingID, function(event) {
      // unfavourites the item
      const listing = event.data;
      $.post('/api/listings/removeFavorite', { listingID: listing })
        .done(data => {
          if (data) {
            notFavourite($('main').attr('id'));
          }
        })
        .fail(err => console.error(err));
    });
  };


  const notFavourite = (listingID) => {
    clearButton('.favourite');
    $('.titleBanner').append(makeButton('far'));

    $('.titleBanner').on('click', '.favourite', listingID, function (event) {
      //favourites the item
      const listing = event.data;
      $.post('/api/listings/addFavorite', {listingID: listing})
        .done(data => {
          if (data) {
            isFavourite($('main').attr('id'));
          }
        })
    });
  }

  $.post('/api/listings/checkFavorite', { listingID })
    .done(data => {
      if (data.favorited) {
        isFavourite($('main').attr('id'));
      } else {
        notFavourite($('main').attr('id'));
      }
    })
    .fail(err => {
      console.error(err);
    })
});
