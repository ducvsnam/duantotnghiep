document.addEventListener("DOMContentLoaded", () => {
	const currentUser = JSON.parse(localStorage.getItem("currentUser"));

	if (currentUser) {
		document.getElementById("welcome").textContent =
			currentUser.username || "...";
	}
});
