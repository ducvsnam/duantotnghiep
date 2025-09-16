const params = new URLSearchParams(window.location.search);
if (params.get("unauth") === "1") {
	showPopup("Bạn chưa đăng nhập");
	history.replaceState({}, document.title, window.location.pathname);
} else if (params.get("noaccess") === "1") {
	showPopup("Bạn không có quyền truy cập");
	history.replaceState({}, document.title, window.location.pathname);
}

function handleLogin() {
	const username = document.getElementById("loginUsername").value;
	const password = document.getElementById("loginPassword").value;

	if (!username || !password) {
		showPopup("Vui lòng điền đầy đủ thông tin");
		return;
	}

	if (username === "CatBoss" && password === "CatsStackBoss@888") {
		localStorage.setItem(
			"currentUser",
			JSON.stringify({ username: "CatBoss", email: "CatsStackBoss@gmail.com" })
		);

		document.body.classList.remove("fade-in");
		document.body.classList.add("fade-out");

		setTimeout(() => {
			window.location.href = "../quanlymuon/quanlymuon.html";
		}, 800);
		return;
	}

	const users = JSON.parse(localStorage.getItem("users") || "[]");
	const found = users.find(
		(u) => u.username === username && u.password === password
	);

	if (found) {
		localStorage.setItem(
			"currentUser",
			JSON.stringify({
				username: found.username,
				email: found.email,
				password: found.password,
				phone: found.phone,
				userID: found.userID,
			})
		);

		localStorage.setItem("userID", found.userID);

		document.body.classList.remove("fade-in");
		document.body.classList.add("fade-out");

		setTimeout(() => {
			window.location.href = "../nguoidung/nguoidung.html";
		}, 1500);
	} else {
		showPopup("Sai tên đăng nhập hoặc mật khẩu");
	}
}

document.addEventListener("DOMContentLoaded", () => {
	document.body.classList.add("fade-in");

	const shouldShowPopup = localStorage.getItem("showLoginPopup");
	if (shouldShowPopup === "true") {
		showPopup("Bạn chưa đăng nhập");
		localStorage.removeItem("showLoginPopup");
	}

	switchForm("login");
});
