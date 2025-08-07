function changePassword() {
	const currentPassword = document.getElementById("oldPassword").value;
	const newPassword = document.getElementById("newPassword").value;
	const confirmPassword = document.getElementById("confirmPassword").value;

	if (!window.currentUser) {
		window.currentUser = JSON.parse(localStorage.getItem("currentUser"));
	}

	const users = JSON.parse(localStorage.getItem("users")) || [];

	if (!currentPassword || !newPassword || !confirmPassword) {
		showPopup("Vui lòng nhập đầy đủ thông tin");
		return;
	}

	if (currentUser.password !== currentPassword) {
		showPopup("Mật khẩu hiện tại không đúng");
		return;
	}

	if (newPassword === currentPassword) {
		showPopup("Mật khẩu mới phải khác mật khẩu hiện tại");
		return;
	}

	if (!validatePassword(newPassword)) {
		showPopup(
			"Mật khẩu mới phải có ít nhất 8 ký tự bao gồm 1 chữ hoa 1 chữ thường 1 số và ký tự đặc biệt"
		);
		return;
	}

	if (newPassword !== confirmPassword) {
		showPopup("Xác nhận mật khẩu không khớp");
		return;
	}

	currentUser.password = newPassword;
	localStorage.setItem("currentUser", JSON.stringify(currentUser));

	const updatedUsers = users.map((user) =>
		user.username === currentUser.username ? currentUser : user
	);
	localStorage.setItem("users", JSON.stringify(updatedUsers));

	showPopup("Đổi mật khẩu thành công");
}

function validatePassword(password) {
	const regex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
	return regex.test(password);
}
