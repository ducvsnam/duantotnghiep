document.addEventListener("DOMContentLoaded", () => {
	if (!window.currentUser) {
		window.currentUser = JSON.parse(localStorage.getItem("currentUser"));
	}

	if (currentUser) {
		document.getElementById("ten-dangnhap").textContent =
			currentUser.username || "...";
		document.getElementById("so-dien-thoai").textContent =
			currentUser.phone || "...";
		document.getElementById("email").textContent = currentUser.email || "...";
		document.getElementById("mat-khau").textContent =
			currentUser.password || "...";
	}

	const userID = localStorage.getItem("userID");
	const savedAvatar = localStorage.getItem(`avatarNguoiDung_${userID}`);
	const defaultAvatar = "../anh/theme/noava.jpg";

	const infoImg = document.getElementById("ava-info");
	const pageImg = document.getElementById("ava-page");

	if (infoImg) infoImg.src = savedAvatar || defaultAvatar;
	if (pageImg) pageImg.src = savedAvatar || defaultAvatar;
});
