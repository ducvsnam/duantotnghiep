if (!localStorage.getItem("bookList")) {
	localStorage.setItem("bookList", JSON.stringify(defaultBooks));
}

const bookList = JSON.parse(localStorage.getItem("bookList")) || [];
const borrowList = JSON.parse(localStorage.getItem("borrowList")) || [];
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const input = document.getElementById("bookTitle");
const suggestionsBox = document.getElementById("suggestions");

let selectedBookTitle = "";

function updateSuggestions() {
	const value = input.value.trim().toLowerCase();
	suggestionsBox.innerHTML = "";
	suggestionsBox.classList.add("show");

	const exactMatch = bookList.find((b) => b.title.toLowerCase() === value);
	const filtered = bookList
		.filter((b) => Number(b.quantity) > 0)
		.filter((b) =>
			exactMatch
				? b.title.toLowerCase() !== value
				: b.title.toLowerCase().includes(value)
		);

	if (filtered.length === 0) {
		const div = document.createElement("div");
		div.textContent = value
			? `Không có cuốn sách nào tên là "${value}"`
			: "Không còn sách nào để gợi ý.";
		div.style.padding = "8px";
		div.style.color = "gray";
		suggestionsBox.appendChild(div);
		return;
	}

	filtered.forEach((book) => {
		const div = document.createElement("div");
		div.classList.add("suggestion-item");
		div.textContent = `${book.title} - ${book.author} (Còn: ${book.quantity})`;
		div.addEventListener("click", () => {
			input.value = book.title;
			selectedBookTitle = book.title;
			suggestionsBox.innerHTML = "";
			suggestionsBox.classList.remove("show");
		});
		suggestionsBox.appendChild(div);
	});
}

input.addEventListener("focus", updateSuggestions);
input.addEventListener("input", () => {
	selectedBookTitle = "";
	updateSuggestions();
});

document.addEventListener("click", (e) => {
	if (!e.target.closest("#bookTitle") && !e.target.closest("#suggestions")) {
		suggestionsBox.innerHTML = "";
		suggestionsBox.classList.remove("show");
	}
});

// function borrowBook() {
// 	const phone = document.getElementById("phone").value.trim();
// 	const bookTitle = input.value.trim();
// 	const borrowedDate = document.getElementById("borrowedDate").value.trim();
// 	const returnDate = document.getElementById("returnDate").value.trim();

// 	if (!currentUser) {
// 		showPopup("Bạn chưa đăng nhập");
// 		return;
// 	}

// 	if (!phone || !bookTitle || !borrowedDate || !returnDate) {
// 		showPopup("Vui lòng nhập đầy đủ thông tin");
// 		return;
// 	}

// 	if (!/^0\d{9}$/.test(phone)) {
// 		showPopup("Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0");
// 		return;
// 	}

// 	const [bDay, bMonth, bYear] = borrowedDate.split("/");
// 	const [rDay, rMonth, rYear] = returnDate.split("/");
// 	const borrowD = new Date(bYear, bMonth - 1, bDay);
// 	const returnD = new Date(rYear, rMonth - 1, rDay);

// 	if (returnD <= borrowD) {
// 		showPopup("Ngày trả phải lớn hơn ngày mượn");
// 		return;
// 	}

// 	const bookIndex = bookList.findIndex((b) => b.title === bookTitle);
// 	if (bookIndex === -1 || bookList[bookIndex].quantity <= 0) {
// 		showPopup("Sách không khả dụng");
// 		return;
// 	}

// 	const alreadyBorrowed = borrowList.find(
// 		(b) => b.email === currentUser.email && b.bookTitle === bookTitle
// 	);
// 	if (alreadyBorrowed) {
// 		showPopup("Bạn đã mượn sách này và chưa trả");
// 		return;
// 	}

// 	bookList[bookIndex].quantity--;
// 	localStorage.setItem("bookList", JSON.stringify(bookList));

// 	borrowList.push({
// 		id: Date.now(),
// 		name: currentUser.name || currentUser.username || "Không rõ",
// 		email: currentUser.email,
// 		phone,
// 		bookTitle,
// 		borrowDate: borrowedDate,
// 		returnDate,
// 	});
// 	localStorage.setItem("borrowList", JSON.stringify(borrowList));

// 	showPopup("Mượn sách thành công");
// 	document.querySelectorAll("input").forEach((i) => (i.value = ""));
// 	suggestionsBox.innerHTML = "";
// 	selectedBookTitle = "";

// 	const borrowPicker = document.getElementById(
// 		"borrowedDateDisplay"
// 	)._flatpickr;
// 	const returnPicker = document.getElementById("returnDateDisplay")._flatpickr;

// 	if (borrowPicker) borrowPicker.clear();
// 	if (returnPicker) returnPicker.clear();
// }
//
function borrowBook() {
	const phone = document.getElementById("phone").value.trim();
	const bookTitle = input.value.trim();
	const borrowedDate = document.getElementById("borrowedDate").value.trim();
	const returnDate = document.getElementById("returnDate").value.trim();

	if (!currentUser) {
		showPopup("Bạn chưa đăng nhập");
		return;
	}

	if (!phone || !bookTitle || !borrowedDate || !returnDate) {
		showPopup("Vui lòng nhập đầy đủ thông tin");
		return;
	}

	if (!/^0\d{9}$/.test(phone)) {
		showPopup("Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0");
		return;
	}

	const [bDay, bMonth, bYear] = borrowedDate.split("/");
	const [rDay, rMonth, rYear] = returnDate.split("/");
	const borrowD = new Date(bYear, bMonth - 1, bDay);
	const returnD = new Date(rYear, rMonth - 1, rDay);

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	if (borrowD < today) {
		showPopup("Ngày mượn không được trước ngày hôm nay");
		return;
	}

	if (returnD <= borrowD) {
		showPopup("Ngày trả phải lớn hơn ngày mượn");
		return;
	}

	const diffInMs = returnD - borrowD;
	const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
	if (diffInDays > 14) {
		showPopup("Chỉ được mượn sách tối đa trong 14 ngày");
		return;
	}

	const bookIndex = bookList.findIndex((b) => b.title === bookTitle);
	if (bookIndex === -1 || bookList[bookIndex].quantity <= 0) {
		showPopup("Sách không khả dụng");
		return;
	}

	const alreadyBorrowed = borrowList.find(
		(b) => b.email === currentUser.email && b.bookTitle === bookTitle
	);
	if (alreadyBorrowed) {
		showPopup("Bạn đã mượn sách này và chưa trả");
		return;
	}

	const currentBorrowedCount = borrowList.filter(
		(b) => b.email === currentUser.email
	).length;
	if (currentBorrowedCount >= 3) {
		showPopup("Bạn chỉ được mượn tối đa 3 cuốn sách cùng lúc");
		return;
	}

	bookList[bookIndex].quantity--;
	localStorage.setItem("bookList", JSON.stringify(bookList));

	borrowList.push({
		id: Date.now(),
		name: currentUser.name || currentUser.username || "Không rõ",
		email: currentUser.email,
		phone,
		bookTitle,
		borrowDate: borrowedDate,
		returnDate,
	});
	localStorage.setItem("borrowList", JSON.stringify(borrowList));

	showPopup("Mượn sách thành công");

	document.querySelectorAll("input").forEach((i) => (i.value = ""));
	suggestionsBox.innerHTML = "";
	selectedBookTitle = "";

	const borrowPicker = document.getElementById(
		"borrowedDateDisplay"
	)?._flatpickr;
	const returnPicker = document.getElementById("returnDateDisplay")?._flatpickr;
	if (borrowPicker) borrowPicker.clear();
	if (returnPicker) returnPicker.clear();
}
//
document.addEventListener("DOMContentLoaded", () => {
	const borrowedDisplay = document.getElementById("borrowedDateDisplay");
	const borrowedHidden = document.getElementById("borrowedDate");

	const returnDisplay = document.getElementById("returnDateDisplay");
	const returnHidden = document.getElementById("returnDate");

	if (borrowedDisplay && borrowedHidden) {
		window.borrowPicker = flatpickr(borrowedDisplay, {
			dateFormat: "d/m/Y",
			onChange: (_, dateStr) => {
				borrowedHidden.value = dateStr;
			},
		});
	}

	if (returnDisplay && returnHidden) {
		window.returnPicker = flatpickr(returnDisplay, {
			dateFormat: "d/m/Y",
			onChange: (_, dateStr) => {
				returnHidden.value = dateStr;
			},
		});
	}
});
