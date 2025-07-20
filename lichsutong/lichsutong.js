const borrowList = JSON.parse(localStorage.getItem("borrowList")) || [];
const bookList = JSON.parse(localStorage.getItem("bookList")) || [];
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const container = document.getElementById("borrowHistoryList");

function normalizeDate(dateStr) {
	const [d, m, y] = dateStr.split("/");
	const date = new Date(y, m - 1, d);
	date.setHours(0, 0, 0, 0);
	return date;
}

function calculateDaysLeft(dateStr) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const returnDate = normalizeDate(dateStr);
	const diff = Math.ceil((returnDate - today) / (1000 * 60 * 60 * 24));
	return diff;
}

function returnBook(borrowId) {
	const borrowList = JSON.parse(localStorage.getItem("borrowList")) || [];
	const bookList = JSON.parse(localStorage.getItem("bookList")) || [];

	const index = borrowList.findIndex((b) => b.id === borrowId);
	if (index === -1) return;

	showConfirm(
		"Bạn có chắc chắn muốn xoá lịch sửa mượn sách này không",
		(agree) => {
			if (!agree) return;

			const item = borrowList[index];
			const bookIndex = bookList.findIndex((b) => b.title === item.bookTitle);

			if (bookIndex !== -1) {
				bookList[bookIndex].quantity += 1;
				localStorage.setItem("bookList", JSON.stringify(bookList));
			}

			borrowList.splice(index, 1);
			localStorage.setItem("borrowList", JSON.stringify(borrowList));

			renderBorrowCards();
		}
	);
}

function returnBookConfirmed(borrowId) {
	const borrowList = JSON.parse(localStorage.getItem("borrowList")) || [];
	const bookList = JSON.parse(localStorage.getItem("bookList")) || [];

	const index = borrowList.findIndex((b) => b.id === borrowId);
	if (index === -1) return;

	const item = borrowList[index];
	const bookIndex = bookList.findIndex((b) => b.title === item.bookTitle);

	if (bookIndex !== -1) {
		bookList[bookIndex].quantity += 1;
		localStorage.setItem("bookList", JSON.stringify(bookList));
	}

	borrowList.splice(index, 1);
	localStorage.setItem("borrowList", JSON.stringify(borrowList));

	renderBorrowCards();
}

function renderBorrowCards() {
	container.innerHTML = "";

	const borrowList = JSON.parse(localStorage.getItem("borrowList")) || [];
	const userBorrows = borrowList.filter((b) => b.email === currentUser.email);
	if (userBorrows.length === 0) {
		container.innerHTML = `
		<div class="khongcogi">
			<p>Không có lịch sử mượn sách</p>
		</div>
	`;
		return;
	}
	document.querySelectorAll(".khongcogi").forEach((el) => el.remove());

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	userBorrows.forEach((borrow) => {
		const book = bookList.find((b) => b.title === borrow.bookTitle);
		const imgSrc = book?.image || "";

		let status = "";
		const borrowDateObj = borrow.borrowDate
			? normalizeDate(borrow.borrowDate)
			: null;
		const returnDateObj = borrow.returnDate
			? normalizeDate(borrow.returnDate)
			: null;

		if (borrow.isCancelled) {
			status = "Đã huỷ đặt trước";
		} else if (borrow.isReturned) {
			status = "Đã trả";
		} else if (!borrowDateObj || borrowDateObj > today) {
			status = "Đặt trước";
		} else if (returnDateObj && today > returnDateObj) {
			status = "Quá hạn";
		} else {
			status = "Đang mượn";
		}

		const card = document.createElement("div");
		card.className = "book-item";
		card.innerHTML = `
			<img src="${imgSrc}"/>
			<div class="book-info">
				<p><b>Họ tên người mượn:</b> ${borrow.name}</p>
				<p><b>Email người mượn:</b> ${borrow.email}</p>
				<p><b>Số điện thoại người mượn:</b> ${borrow.phone}</p>
				<p><b>Tên sách đã mượn:</b> ${borrow.bookTitle}</p>
				<p><b>Ngày mượn:</b> ${borrow.borrowDate || "—"}</p>
				<p><b>Ngày trả:</b> ${borrow.returnDate}</p>
				<p><b>Trạng thái:</b> ${status}</p>
				<div class="book-buttons">
					<button onclick="returnBook(${borrow.id})">Xoá lịch sử</button>
				</div>
			</div>
		`;
		container.appendChild(card);
	});
}
renderBorrowCards();
