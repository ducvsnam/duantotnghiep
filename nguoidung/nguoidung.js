if (!localStorage.getItem("bookList")) {
	localStorage.setItem("bookList", JSON.stringify(defaultBooks));
}

document.addEventListener("DOMContentLoaded", () => {
	if (!window.currentUser) {
		window.currentUser = JSON.parse(localStorage.getItem("currentUser"));
	}

	if (currentUser) {
		document.getElementById("welcome").textContent =
			currentUser.username || "...";
	}

	checkOverdueBooks();
});

function checkOverdueBooks() {
	const currentUser = JSON.parse(localStorage.getItem("currentUser"));
	if (!currentUser || !currentUser.userID) return;

	const borrowList =
		JSON.parse(localStorage.getItem(`borrowList-${currentUser.userID}`)) || [];

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	let overdueCount = 0;

	for (const item of borrowList) {
		if (
			item.isApproved &&
			!item.isReturned &&
			!item.isCancelled &&
			item.returnDate
		) {
			const [d, m, y] = item.returnDate.split("/");
			const returnDate = new Date(y, m - 1, d);
			returnDate.setHours(0, 0, 0, 0);

			if (returnDate < today) {
				overdueCount++;
			}
		}
	}

	if (overdueCount > 0) {
		showPopup(`Bạn có ${overdueCount} cuốn sách đã quá hạn trả`);
	}
}
