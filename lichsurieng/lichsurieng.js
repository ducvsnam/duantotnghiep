const borrowList = JSON.parse(localStorage.getItem("borrowList")) || [];
const bookList = JSON.parse(localStorage.getItem("bookList")) || [];
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const container = document.getElementById("borrowHistoryList");

const userBorrows = borrowList.filter(
	(b) => b.email === currentUser.email && !b.isReturned && !b.isCancelled
);

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
	showConfirm("Bạn có chắc chắn muốn trả cuốn sách này không", (confirm) => {
		if (!confirm) return;

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

		borrowList[index].isReturned = true;
		localStorage.setItem("borrowList", JSON.stringify(borrowList));

		renderBorrowCards();
	});
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

function cancelReservation(id) {
	showConfirm("Bạn có chắc chắn muốn huỷ đặt trước không?", (xacNhan) => {
		if (!xacNhan) return;

		const borrowList = JSON.parse(localStorage.getItem("borrowList")) || [];
		const bookList = JSON.parse(localStorage.getItem("bookList")) || [];

		const index = borrowList.findIndex((b) => b.id === id);
		if (index !== -1) {
			const borrow = borrowList[index];
			const book = bookList.find((b) => b.title === borrow.bookTitle);
			if (book) book.quantity++;

			borrow.isCancelled = true;

			localStorage.setItem("borrowList", JSON.stringify(borrowList));
			localStorage.setItem("bookList", JSON.stringify(bookList));

			renderBorrowCards();
		}
	});
}

function renderBorrowCards() {
	container.innerHTML = "";

	const bookList = JSON.parse(localStorage.getItem("bookList")) || [];
	const borrowList = JSON.parse(localStorage.getItem("borrowList")) || [];

	const userBorrows = borrowList.filter(
		(b) => b.email === currentUser.email && !b.isReturned && !b.isCancelled
	);

	if (userBorrows.length === 0) {
		container.innerHTML = `
		<div class="khongcogi">
			<p>Bạn chưa mượn sách hoặc đã trả hết</p>
		</div>
	`;
		return;
	}
	document.querySelectorAll(".khongcogi").forEach((el) => el.remove());

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	userBorrows.forEach((borrow) => {
		const daysLeft = calculateDaysLeft(borrow.returnDate);
		const book = bookList.find((b) => b.title === borrow.bookTitle);
		const imgSrc = book?.image || "";

		let status = "";
		const borrowDateObj = borrow.borrowDate
			? normalizeDate(borrow.borrowDate)
			: null;

		if (daysLeft < 0) {
			status = "Quá hạn";
		} else if (!borrowDateObj || borrowDateObj > today) {
			status = "Đặt trước";
		} else {
			status = `Đang mượn (còn ${daysLeft} ngày)`;
		}

		let actionButton = "";
		if (!borrow.isReturned) {
			if (!borrowDateObj || borrowDateObj > today) {
				actionButton = `<button onclick="cancelReservation(${borrow.id})">Huỷ đặt trước</button>`;
			} else {
				actionButton = `<button onclick="returnBook(${borrow.id})">Trả sách</button>`;
			}
		}

		const card = document.createElement("div");
		card.className = "book-item";
		card.innerHTML = `
			<img src="${imgSrc}"/>
			<div class="book-info">
				<p><b>Tên sách đã mượn:</b> ${borrow.bookTitle}</p>
				<p><b>Ngày mượn:</b> ${borrow.borrowDate}</p>
				<p><b>Ngày trả:</b> ${borrow.returnDate}</p>
				<p><b>Trạng thái:</b> ${status}</p>
				<div class="book-buttons">
					${actionButton}
				</div>
			</div>
		`;

		container.appendChild(card);
	});
}
renderBorrowCards();
