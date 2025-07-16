function logout() {
	localStorage.removeItem("currentUser");

	document.body.classList.remove("fade-in");
	document.body.classList.add("fade-out");

	setTimeout(() => {
		window.location.href = "nguoidung.html";
	}, 800);
}
