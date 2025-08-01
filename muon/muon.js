if (!localStorage.getItem("bookList")) {
	localStorage.setItem("bookList", JSON.stringify(defaultBooks));
}

const bookList = JSON.parse(localStorage.getItem("bookList")) || [];
// const borrowList = JSON.parse(localStorage.getItem("borrowList")) || [];
//
// const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//
if (!window.currentUser) {
	window.currentUser = JSON.parse(localStorage.getItem("currentUser"));
}
//
if (!currentUser || !currentUser.email) {
	showPopup("Không xác định được người dùng");
	throw new Error("Dữ liệu currentUser không hợp lệ");
}
//
const borrowList =
	// JSON.parse(localStorage.getItem(`borrowList-${currentUser.email}`)) || [];
	JSON.parse(localStorage.getItem(`borrowList-${currentUser.userID}`)) || [];
//
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
			: "Không còn sách nào để gợi ý";
		div.style.padding = "8px";
		div.style.overflow = "hidden";
		div.style.textOverflow = "ellipsis";
		div.style.whiteSpace = "nowrap";
		div.style.display = "block";
		div.style.width = "97%";
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

function normalizeDate(dateStr) {
	const [d, m, y] = dateStr.split("/");
	return new Date(y, m - 1, d);
}

function borrowBook() {
	const bookTitle = input.value.trim();
	const borrowedDate = document.getElementById("borrowedDate").value.trim();
	const returnDate = document.getElementById("returnDate").value.trim();

	if (!currentUser) {
		showPopup("Bạn chưa đăng nhập");
		return;
	}

	if (!bookTitle || !borrowedDate || !returnDate) {
		showPopup("Vui lòng nhập đầy đủ thông tin");
		return;
	}

	const borrowD = normalizeDate(borrowedDate);
	const returnD = normalizeDate(returnDate);

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

	const diffInDays = (returnD - borrowD) / (1000 * 60 * 60 * 24);
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
		(b) =>
			// b.email === currentUser.email &&
			//
			b.userID === currentUser.userID &&
			//
			b.bookTitle === bookTitle &&
			!b.isReturned &&
			!b.isCancelled
	);
	if (alreadyBorrowed) {
		showPopup("Bạn đã mượn sách này và chưa trả");
		return;
	}

	const hasOverdueBook = borrowList.some((b) => {
		if (b.email !== currentUser.email || b.isReturned || b.isCancelled)
			return false;
		if (!b.borrowDate || !b.returnDate) return false;

		const borrowDateObj = normalizeDate(b.borrowDate);
		const returnDateObj = normalizeDate(b.returnDate);

		return borrowDateObj <= today && returnDateObj < today;
	});

	if (hasOverdueBook) {
		showPopup("Bạn đang có sách quá hạn nên không thể mượn thêm sách");
		return;
	}

	const currentBorrowedCount = borrowList.filter(
		(b) => b.email === currentUser.email && !b.isReturned && !b.isCancelled
	).length;

	if (currentBorrowedCount >= 3) {
		showPopup("Bạn chỉ được mượn tối đa 3 cuốn sách cùng lúc");
		return;
	}

	// bookList[bookIndex].quantity--;
	// localStorage.setItem("bookList", JSON.stringify(bookList));
	//
	// const userBorrowList =
	// 	JSON.parse(localStorage.getItem(`borrowList-${currentUser.email}`)) || [];
	//
	borrowList.push({
		id: Date.now(),
		name: currentUser.name || currentUser.username || "Không rõ",
		email: currentUser.email,
		//
		userID: currentUser.userID,
		//
		phone: currentUser.phone || "—",
		bookTitle,
		borrowDate: borrowedDate,
		returnDate,
		isReturned: false,
		isCancelled: false,
		isApproved: false,
	});
	// localStorage.setItem("borrowList", JSON.stringify(borrowList));
	//
	localStorage.setItem(
		// `borrowList-${currentUser.email}`,
		`borrowList-${currentUser.userID}`,
		JSON.stringify(borrowList)
	);
	//
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

	updateSuggestions();
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

document.addEventListener("DOMContentLoaded", () => {
	// const currentUser = JSON.parse(localStorage.getItem("currentUser"));
	// if (!currentUser || !currentUser.email) {
	// 	showPopup("Không xác định được người dùng");
	// 	return;
	// }
	//
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

	const urlParams = new URLSearchParams(window.location.search);
	const bookFromDetail = urlParams.get("book");
	if (bookFromDetail) {
		input.value = bookFromDetail;
		selectedBookTitle = bookFromDetail;
		updateSuggestions();
	}
});
