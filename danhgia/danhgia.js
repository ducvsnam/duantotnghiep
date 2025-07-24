document.addEventListener("DOMContentLoaded", function () {
	const btn = document.querySelector(".nut-danhgia");
	const commentInput = document.getElementById("registerComment");

	const currentUser = JSON.parse(localStorage.getItem("currentUser"));

	btn.addEventListener("click", function () {
		const selectedStar = document.querySelector('input[name="star"]:checked');

		if (!selectedStar) {
			showPopup("Vui lòng chọn số sao để đánh giá");
			return;
		}

		const rating = selectedStar.value;
		const comment = commentInput.value.trim();

		const avatar =
			localStorage.getItem("avatarNguoiDung") || "../anh/theme/noava.jpg";

		const newReview = {
			name: currentUser.username || "Ẩn danh",
			email: currentUser.email || "Không rõ",
			image: avatar,
			rating: rating,
			comment: comment,
		};

		const danhGiaList = JSON.parse(localStorage.getItem("danhGiaList")) || [];
		danhGiaList.push(newReview);
		localStorage.setItem("danhGiaList", JSON.stringify(danhGiaList));

		showPopup("Đánh giá đã được gửi");

		selectedStar.checked = false;
		commentInput.value = "";
	});
});
