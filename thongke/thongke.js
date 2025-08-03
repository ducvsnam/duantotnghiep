function getBooks() {
	const saved = localStorage.getItem("bookList");
	let books = [];

	try {
		books = JSON.parse(saved) || [];
	} catch {
		books = [];
	}

	books = books.filter(
		(b) =>
			b &&
			typeof b.title === "string" &&
			typeof b.genre === "string" &&
			!isNaN(Number(b.quantity))
	);

	if (books.length === 0 && window.defaultBooks) {
		localStorage.setItem("bookList", JSON.stringify(window.defaultBooks));
		return window.defaultBooks;
	}

	localStorage.setItem("bookList", JSON.stringify(books));
	return books;
}

// function getBorrowList() {
// 	const saved = localStorage.getItem("borrowList");
// 	return saved ? JSON.parse(saved) : [];
// }
//
//
//
function getBorrowList() {
	let all = [];
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key.startsWith("borrowList-")) {
			try {
				const list = JSON.parse(localStorage.getItem(key));
				if (Array.isArray(list)) all = all.concat(list);
			} catch {}
		}
	}
	return all;
}
//
function capNhatSoSachDangMuon() {
	const borrowList = getBorrowList();

	const sachDangMuon = borrowList.filter(
		(e) => e.isApproved && !e.isCancelled && !e.isReturned
	);

	const phanTuHienThi = document.getElementById("sosachdangchomuon");

	if (sachDangMuon.length === 0) {
		phanTuHienThi.textContent = "Hiện không có cuốn nào đang được mượn";
	} else {
		phanTuHienThi.textContent = `Có ${sachDangMuon.length} cuốn đang được mượn`;
	}
}
//
function updateStatistics() {
	if (!localStorage.getItem("bookList")) {
		localStorage.setItem("bookList", "[]");
	}

	let books = getBooks().filter((b) => !b.deleted);

	books = [...books];

	const sortedBooks = [...books].sort((a, b) => a.title.localeCompare(b.title));

	const borrows = getBorrowList();

	const totalBooks = books.reduce((sum, b) => {
		const qty = parseInt(b.quantity, 10);
		return sum + (isNaN(qty) ? 0 : qty);
	}, 0);

	document.getElementById("tongsoSach").textContent = totalBooks;

	if (sortedBooks.length > 0) {
		const quantities = books
			.map((b) => Number(b.quantity))
			.filter((q) => !isNaN(q));

		if (quantities.length === 0) {
			document.getElementById("sachcosoluongnhieunhat").textContent =
				"Không có dữ liệu";
			return;
		}
		//
		// const maxQty = Math.max(...quantities);
		// const minQty = Math.min(...quantities);

		// if (maxQty === minQty) {
		// 	document.getElementById(
		// 		"sachcosoluongnhieunhat"
		// 	).textContent = `Tất cả đều có số lượng bằng nhau (${maxQty} cuốn)`;
		// } else {
		// 	const maxBooks = sortedBooks.filter((b) => Number(b.quantity) === maxQty);
		// 	if (maxBooks.length === 1) {
		// 		document.getElementById(
		// 			"sachcosoluongnhieunhat"
		// 		).textContent = `${maxBooks[0].title} (${maxQty} cuốn)`;
		// 	} else {
		// 		document.getElementById(
		// 			"sachcosoluongnhieunhat"
		// 		).textContent = `Có ${maxBooks.length} cuốn có số lượng nhiều nhất (${maxQty} cuốn)`;
		// 	}
		// }
		//
		//
		//
		const maxQty = Math.max(...quantities);
		const maxBooks = sortedBooks.filter((b) => Number(b.quantity) === maxQty);
		const tenSach = maxBooks.map((b) => b.title).join("; ");

		document.getElementById(
			"sachcosoluongnhieunhat"
		).textContent = `${tenSach} (${maxQty} cuốn)`;
		//
	} else {
		document.getElementById("sachcosoluongnhieunhat").textContent =
			"Không có dữ liệu";
	}

	const borrowCountMap = {};

	borrows.forEach((entry) => {
		const title = entry.bookTitle || entry.bookName;
		if (title && entry.isApproved && !entry.isCancelled) {
			borrowCountMap[title] = (borrowCountMap[title] || 0) + 1;
		}
	});
	//
	// const entries = Object.entries(borrowCountMap);
	// if (entries.length === 0) {
	// 	document.getElementById("sachcoluotmuonnhieunhat").textContent =
	// 		"Hiện chưa có lượt mượn sách";
	// } else {
	// 	const maxCount = Math.max(...entries.map(([, count]) => count));
	// 	const mostBorrowedBooks = entries.filter(([, count]) => count === maxCount);

	// 	if (mostBorrowedBooks.length === 1) {
	// 		const [title, count] = mostBorrowedBooks[0];
	// 		document.getElementById(
	// 			"sachcoluotmuonnhieunhat"
	// 		).textContent = `${title} (${count} lượt)`;
	// 	} else {
	// 		document.getElementById(
	// 			"sachcoluotmuonnhieunhat"
	// 		).textContent = `Có ${mostBorrowedBooks.length} cuốn sách được mượn nhiều nhất (${maxCount} lượt)`;
	// 	}
	// }
	//
	//
	//
	const entries = Object.entries(borrowCountMap);

	if (entries.length === 0) {
		document.getElementById("sachcoluotmuonnhieunhat").textContent =
			"Hiện chưa có lượt mượn sách";
	} else {
		const maxCount = Math.max(...entries.map(([, count]) => count));
		const mostBorrowedBooks = entries.filter(([, count]) => count === maxCount);
		const tenSach = mostBorrowedBooks.map(([title]) => title).join("; ");

		document.getElementById(
			"sachcoluotmuonnhieunhat"
		).textContent = `${tenSach} (${maxCount} lượt)`;
		//
		const booksOnLoan = borrows.filter(
			(entry) => entry.isApproved && !entry.isCancelled && !entry.isReturned
		);

		// document.getElementById("sosachdangchomuon").textContent =
		// 	booksOnLoan.length;
		//
		//
		//
		capNhatSoSachDangMuon();
		//
	}
	//
}

function clearStorage() {
	localStorage.clear();
	showPopup("Đã Reset toàn bộ dữ liệu về nguyên bản");
}

function exportLocalStorage() {
	const data = {};
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		const value = localStorage.getItem(key);

		try {
			data[key] = JSON.parse(value);
		} catch (e) {
			data[key] = value;
		}
	}

	const jsonData = JSON.stringify(data, null, 2);
	const blob = new Blob([jsonData], { type: "application/json" });

	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "localStorage-data.json";
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

document.addEventListener("DOMContentLoaded", () => {
	updateStatistics();

	document
		.getElementById("exportBtn")
		.addEventListener("click", exportLocalStorage);
});
