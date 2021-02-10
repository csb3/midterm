$(() => {

  const listingID = $('main').attr('id');

  const clearButton = (selector) => {
    $('.titleBanner').off(selector);
    $(selector).remove();
  };

  const makeButton = (style) => {
    return $button = $(`<button class='favourite><i class="${style} fa-heart"></i></button>`);
  };

  const isFavourite = (listingID) => {

    clearButton('.favourite');
    $('.titleBanner').append(makeButton('fas'));

    $('.titleBanner').on('click', '.favourite', listingID, function(event) {
      // unfavourites the item
      const listing = event.data;
      $.post('/unfavourite', { listingID: listing })
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
      $.post('/makeFavourite', listing)
        .done(data => {
          if (data) {
            isFavourite($('main').attr('id'));
          }
        })
    });
  }

  $.get('/checkfavourite', listingID)
    .done(data => {
      if (data) {
        isFavourite($('main').attr('id'));
      } else {
        notFavourite($('main').attr('id'));
      }
    })
    .fail(err => {
      console.error(err);
    })
});
