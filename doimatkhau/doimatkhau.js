function changePassword() {
	const currentPassword = document.getElementById("oldPassword").value;
	const newPassword = document.getElementById("newPassword").value;
	const confirmPassword = document.getElementById("confirmPassword").value;

	const currentUser = JSON.parse(localStorage.getItem("currentUser"));
	const users = JSON.parse(localStorage.getItem("users")) || [];

	if (currentUser.password !== currentPassword) {
		showPopup("Mật khẩu hiện tại không đúng");
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
