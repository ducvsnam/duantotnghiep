const danhGiaList = JSON.parse(localStorage.getItem("danhGiaList")) || [];
const reviewList = document.getElementById("reviewList");

if (!reviewList) {
	showPopup("Lỗi hiển thị: không tìm thấy phần tử reviewList");
} else if (danhGiaList.length === 0) {
	reviewList.innerHTML = "<p class='khongcogi'>Chưa có đánh giá nào</p>";
} else {
	reviewList.innerHTML = "";
	danhGiaList.forEach((review) => {
		const card = document.createElement("div");
		card.className = "review-card";

		const avatar = review.image || "../anh/theme/noava.jpg";
		const name = review.name || "Ẩn danh";
		const email = review.email || "Không rõ";
		const rating = parseInt(review.rating) || 0;
		let stars = "";
		for (let i = 1; i <= 5; i++) {
			stars += `<span class="star ${i <= rating ? "filled" : ""}">★</span>`;
		}
		const comment = review.comment?.trim() || "Không có bình luận";

		card.innerHTML = `
			<div class="khung-xemdanhgiaquanly">
				<div class="dong-thongtin">
					<img src="${avatar}" class="anh-danhgia"/>
					<b>${name}</b> - ${email}
				</div>
				<p><b>Chất lượng:</b><br>${stars}</p>
				<p><b>Bình luận:</b><br>${comment}</p>
			</div>
		`;
		reviewList.appendChild(card);
	});
}
