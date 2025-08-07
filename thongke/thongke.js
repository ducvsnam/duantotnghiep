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

function capNhatSoSachDangMuon() {
	const borrowList = getBorrowList();

	const sachDangMuon = borrowList.filter(
		(e) => e.isApproved && !e.isCancelled && !e.isReturned
	);

	const grouped = {};
	for (const e of sachDangMuon) {
		const title = e.bookTitle || e.bookName || e.title || "(Không rõ)";
		if (!title) continue;
		grouped[title] = (grouped[title] || 0) + 1;
	}

	const tbody = document.getElementById("table-sachdangchomuon");
	tbody.innerHTML = "";

	const entries = Object.entries(grouped);

	if (entries.length === 0) {
		const row = `<tr><td colspan="2">Hiện không có sách đang được mượn</td></tr>`;
		tbody.insertAdjacentHTML("beforeend", row);
		return;
	}

	for (const [title, count] of entries) {
		const row = `<tr><td>${title}</td><td class="col-soluong">${count}</td></tr>`;
		tbody.insertAdjacentHTML("beforeend", row);
	}
}

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
		const maxQty = Math.max(...sortedBooks.map((b) => Number(b.quantity)));
		const maxBooks = sortedBooks.filter((b) => Number(b.quantity) === maxQty);

		const tbody = document.getElementById("table-sachnhieunhat");
		tbody.innerHTML = "";

		maxBooks.forEach((book) => {
			const row = `<tr><td>${book.title}</td><td>${book.quantity}</td></tr>`;
			tbody.insertAdjacentHTML("beforeend", row);
		});
	}

	const borrowCountMap = {};
	borrows.forEach((entry) => {
		const title = entry.bookTitle || entry.bookName;
		if (title && entry.isApproved && !entry.isCancelled) {
			borrowCountMap[title] = (borrowCountMap[title] || 0) + 1;
		}
	});

	const entries = Object.entries(borrowCountMap);
	const tbody = document.getElementById("table-sachmuonnhieunhat");
	tbody.innerHTML = "";

	if (entries.length === 0) {
		const row = `<tr><td colspan="2">Hiện chưa có lượt mượn sách</td></tr>`;
		tbody.insertAdjacentHTML("beforeend", row);
	} else {
		const maxCount = Math.max(...entries.map(([, count]) => count));
		const mostBorrowedBooks = entries.filter(([, count]) => count === maxCount);

		mostBorrowedBooks.forEach(([title, count]) => {
			const row = `<tr><td>${title}</td><td class="col-soluong">${count}</td></tr>`;
			tbody.insertAdjacentHTML("beforeend", row);
		});
	}

	capNhatSoSachDangMuon();
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
	window.updateStatistics = updateStatistics;
});
