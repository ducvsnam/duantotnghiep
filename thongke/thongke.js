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

// function generateStats() {
// 	const bookList = JSON.parse(localStorage.getItem("bookList")) || [];
// 	const borrowList = JSON.parse(localStorage.getItem("borrowList")) || [];

// 	const totalBooks = bookList.length;

// 	let mostQuantityBook = "Không có dữ liệu";
// 	if (bookList.length > 0) {
// 		const maxQty = Math.max(...bookList.map((b) => Number(b.quantity)));
// 		const topBooks = bookList.filter((b) => Number(b.quantity) === maxQty);
// 		mostQuantityBook = topBooks
// 			.map((b) => `${b.title} (${b.quantity})`)
// 			.join(", ");
// 	}

// 	const borrowCount = {};
// 	borrowList.forEach((b) => {
// 		borrowCount[b.bookTitle] = (borrowCount[b.bookTitle] || 0) + 1;
// 	});

// 	let mostBorrowedBook = "Chưa có lượt mượn";
// 	if (Object.keys(borrowCount).length > 0) {
// 		const maxCount = Math.max(...Object.values(borrowCount));
// 		const topBorrowed = Object.keys(borrowCount).filter(
// 			(title) => borrowCount[title] === maxCount
// 		);
// 		mostBorrowedBook = topBorrowed
// 			.map((title) => `${title} (${borrowCount[title]} lượt)`)
// 			.join(", ");
// 	}

// 	document.getElementById("stats").innerHTML = `
// 		<p><strong>Tổng số sách:</strong> ${totalBooks}</p>
// 		<p><strong>Sách có số lượng nhiều nhất:</strong> ${mostQuantityBook}</p>
// 		<p><strong>Sách có lượt mượn nhiều nhất:</strong> ${mostBorrowedBook}</p>
// 	`;
// }

// document.addEventListener("DOMContentLoaded", generateStats);
//
//
//
const defaultBooks = [];
//
document.addEventListener("DOMContentLoaded", () => {
	updateStatistics();
});

function getBooks() {
	const saved = localStorage.getItem("bookList");
	return saved ? JSON.parse(saved) : [];
}

function getBorrowList() {
	const saved = localStorage.getItem("borrowList");
	return saved ? JSON.parse(saved) : [];
}

function updateStatistics() {
	//
	if (!localStorage.getItem("bookList")) {
		localStorage.setItem("bookList", "[]");
	}
	//
	const books = getBooks();
	const borrows = getBorrowList();

	// const totalBooks = books.reduce((sum, b) => sum + Number(b.quantity || 0), 0);
	//
	const totalBooks = books.reduce((sum, b) => {
		const qty = parseInt(b.quantity, 10);
		return sum + (isNaN(qty) ? 0 : qty);
	}, 0);
	//
	document.getElementById("tongsoSach").textContent = totalBooks;

	if (books.length > 0) {
		const maxQtyBook = books.reduce(
			(max, b) => (Number(b.quantity) > Number(max.quantity) ? b : max),
			books[0]
		);
		document.getElementById(
			"sachcosoluongnhieunhat"
		).textContent = `${maxQtyBook.title} (${maxQtyBook.quantity} cuốn)`;
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
