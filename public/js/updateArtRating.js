(function ($) {
	console.log("i'm here");
	$("#rating-form-button").on("click", function (event) {
		event.preventDefault();
		let rating = $("#rating-input").val();
		let artId = $("#artId-input").val();
		console.log(artId, ":", rating);
		$.post(
			"http://localhost:3000/item/rateArt",
			{
				rating: rating,
				artId: artId,
			},
			function (data, status) {
				console.log("data", data);
				console.log("status", status);
			}
		);
	});
})(window.jQuery);
