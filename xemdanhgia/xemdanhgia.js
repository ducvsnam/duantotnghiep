const danhGiaList = JSON.parse(localStorage.getItem("danhGiaList")) || [];
const reviewList = document.getElementById("reviewList");

if (!reviewList) {
	showPopup("Lỗi hiển thị: không tìm thấy phần tử reviewList");
} else if (danhGiaList.length === 0) {
	reviewList.innerHTML = "<p>Chưa có đánh giá nào</p>";
} else {
	reviewList.innerHTML = "";
	danhGiaList.forEach((review) => {
		const card = document.createElement("div");
		card.className = "review-card";
		card.innerHTML = `
			<img src="${review.image}"">
			<p>${review.name} - ${review.email}</p>
			<p><b>Chất lượng:</b> ${"★".repeat(review.rating)}</p>
			<p><b>Bình luận:</b> ${review.comment}</p>
		`;
		reviewList.appendChild(card);
	});
}
