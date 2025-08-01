if (!localStorage.getItem("bookList")) {
	localStorage.setItem("bookList", JSON.stringify(defaultBooks));
}

document.addEventListener("DOMContentLoaded", () => {
	// const currentUser = JSON.parse(localStorage.getItem("currentUser"));
	//
	if (!window.currentUser) {
		window.currentUser = JSON.parse(localStorage.getItem("currentUser"));
	}
	//
	if (currentUser) {
		document.getElementById("welcome").textContent =
			currentUser.username || "...";
	}
});
