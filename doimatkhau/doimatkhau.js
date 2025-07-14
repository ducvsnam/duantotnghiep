// function validatePassword(password) {
// 	const regex =
// 		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// 	return regex.test(password);
// }

function changePassword() {
	const oldPass = document.getElementById("oldPassword").value;
	const newPass = document.getElementById("newPassword").value;
	const confirmPass = document.getElementById("confirmPassword").value;

	const currentUser = JSON.parse(localStorage.getItem("currentUser"));
	const users = JSON.parse(localStorage.getItem("users") || "[]");

	if (!currentUser) {
		showPopup("Bạn chưa đăng nhập");
		return;
	}

	if (!oldPass || !newPass || !confirmPass) {
		showPopup("Vui lòng nhập đầy đủ thông tin");
		return;
	}

	const userIndex = users.findIndex((u) => u.username === currentUser.username);
	if (userIndex === -1) {
		showPopup("Tài khoản không tồn tại");
		return;
	}

	if (users[userIndex].password !== oldPass) {
		showPopup("Mật khẩu hiện tại không đúng");
		return;
	}

	if (newPass !== confirmPass) {
		showPopup("Mật khẩu mới không khớp");
		return;
	}

	const password = document.getElementById("newPassword").value.trim();

	if (!validatePassword(password)) {
		showPopup(
			"Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
		);
		return;
	}

	users[userIndex].password = newPass;
	localStorage.setItem("users", JSON.stringify(users));

	showPopup("Đổi mật khẩu thành công");
	window.location.href = "nguoidung.html";
}
