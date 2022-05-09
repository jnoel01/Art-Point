$(function ($) {
  $("#rating-form-button").on("click", function (event) {

    event.preventDefault();
    console.log("right here in ajax")
    let rating = $("#rating-input").val();
    let artId = $("#artId-input").val();
    $.post(
      "http://localhost:3000/item/rateArt",
      {
        rating: rating,
        artId: artId,
      },
      function (data, status) {
          window.location.reload();
      }
    );
  });
})(window.jQuery);
