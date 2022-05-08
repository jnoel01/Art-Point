$(function ($) {
  console.log("i'm here");
  $("#rating-form-button").on("click", function (event) {
    event.preventDefault();
    let rating = $("#rating-input").val();
    let artId = $("#artId-input").val();
    console.log("here in ajax");
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
  // $("#comment-button").on("click", function (event) {
  //   event.preventDefault();
  //   let comment = $("#comment-input").val();
  //   let artId = $("#artId-input").val();
  //   let userId = ("#userId-input").val();
  //   if (!userId) {
  //     console.log("not logged in")
  //   }
  //   console.log(userId)
  //   console.log("here in ajax");
  //   $.post(
  //     "http://localhost:3000/item/comment",
  //     {
  //       comment: comment,
  //       artId: artId,
  //       userId: userId,
  //     },
  //     function (data, status) {
  //         window.location.reload();
  //     }
  //   );
  // });
})(window.jQuery);
