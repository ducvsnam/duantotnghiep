function clearStorage() {
	localStorage.clear();
	showPopup("Đã Reset toàn bộ dữ liệu về nguyên bản");
}

function exportLocalStorage() {
	const data = {};
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		data[key] = localStorage.getItem(key);
	}

	const jsonData = JSON.stringify(data, null, 2);
	const blob = new Blob([jsonData], { type: "application/json" });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = "localStorage-data.json";
	a.click();
	URL.revokeObjectURL(url);
}

document.addEventListener("DOMContentLoaded", () => {
	updateStatistics();
});

function getBooks() {
	const saved = localStorage.getItem("bookList");
	if (saved) {
		const parsed = JSON.parse(saved);
		if (Array.isArray(parsed) && parsed.length > 0) {
			return parsed;
		}
	}
	const books = window.defaultBooks || [];
	localStorage.setItem("bookList", JSON.stringify(books));
	return books;
}

function getBorrowList() {
	const saved = localStorage.getItem("borrowList");
	return saved ? JSON.parse(saved) : [];
}

function updateStatistics() {
	if (!localStorage.getItem("bookList")) {
		localStorage.setItem("bookList", "[]");
	}

	const books = getBooks();
	const borrows = getBorrowList();

	const totalBooks = books.reduce((sum, b) => {
		const qty = parseInt(b.quantity, 10);
		return sum + (isNaN(qty) ? 0 : qty);
	}, 0);

	document.getElementById("tongsoSach").textContent = totalBooks;

	if (books.length > 0) {
		const quantities = books.map((b) => Number(b.quantity));
		const maxQty = Math.max(...quantities);
		const minQty = Math.min(...quantities);

		if (maxQty === minQty) {
			document.getElementById(
				"sachcosoluongnhieunhat"
			).textContent = `Tất cả đều có số lượng bằng nhau (${maxQty} cuốn)`;
		} else {
			const maxBooks = books.filter((b) => Number(b.quantity) === maxQty);
			if (maxBooks.length === 1) {
				document.getElementById(
					"sachcosoluongnhieunhat"
				).textContent = `${maxBooks[0].title} (${maxQty} cuốn)`;
			} else {
				document.getElementById(
					"sachcosoluongnhieunhat"
				).textContent = `Có ${maxBooks.length} cuốn có số lượng nhiều nhất (${maxQty} cuốn)`;
			}
		}
	} else {
		document.getElementById("sachcosoluongnhieunhat").textContent =
			"Không có dữ liệu";
	}

	const borrowCountMap = {};

	borrows.forEach((entry) => {
		if (entry.bookName) {
			borrowCountMap[entry.bookName] =
				(borrowCountMap[entry.bookName] || 0) + 1;
		}
	});

	let mostBorrowed = null;
	let maxBorrow = 0;

	for (const [title, count] of Object.entries(borrowCountMap)) {
		if (count > maxBorrow) {
			maxBorrow = count;
			mostBorrowed = title;
		}
	}

	document.getElementById("sachcoluotmuonnhieunhat").textContent = mostBorrowed
		? `${mostBorrowed} (${maxBorrow} lượt)`
		: "Chưa có lượt mượn nào";
}
