const container = document.getElementById("borrowHistoryList");
//
// const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//
if (!window.currentUser) {
	window.currentUser = JSON.parse(localStorage.getItem("currentUser"));
}
// const currentUser = window.currentUser;
//
window.currentUser =
	window.currentUser || JSON.parse(localStorage.getItem("currentUser"));
//
if (!currentUser || !currentUser.userID) {
	container.innerHTML = `<div class="khongcogi"><p>Bạn chưa mượn sách hoặc đã trả hết</p></div>`;
	throw new Error("Chưa đăng nhập hoặc thiếu userID");
}
//
// const borrowList = JSON.parse(localStorage.getItem("borrowList")) || [];
const bookList = JSON.parse(localStorage.getItem("bookList")) || [];
// const container = document.getElementById("borrowHistoryList");

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

function calculateOverdueDays(dateStr) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const returnDate = normalizeDate(dateStr);
	const diff = Math.ceil((today - returnDate) / (1000 * 60 * 60 * 24));
	return diff;
}

// function cancelReservation(id) {
// 	showConfirm("Bạn có chắc chắn muốn huỷ mượn sách không", (xacNhan) => {
// 		if (!xacNhan) return;

// 		// const borrowList = JSON.parse(localStorage.getItem("borrowList")) || [];
// 		//
// 		// const currentUser = JSON.parse(localStorage.getItem("currentUser"));
// 		//
// 		const borrowList =
// 			JSON.parse(localStorage.getItem(`borrowList-${currentUser.userID}`)) ||
// 			[];
// 		//
// 		const bookList = JSON.parse(localStorage.getItem("bookList")) || [];
// 		const index = borrowList.findIndex((b) => b.id === id);
// 		if (index !== -1) {
// 			const borrow = borrowList[index];
// 			const book = bookList.find((b) => b.title === borrow.bookTitle);
// 			if (book) book.quantity++;

// 			borrow.isCancelled = true;
// 			// localStorage.setItem("borrowList", JSON.stringify(borrowList));
// 			//
// 			localStorage.setItem(
// 				`borrowList-${currentUser.userID}`,
// 				JSON.stringify(borrowList)
// 			);
// 			//
// 			localStorage.setItem("bookList", JSON.stringify(bookList));
// 			renderBorrowCards();
// 		}
// 	});
// }
//
function cancelReservation(id) {
	showConfirm("Bạn có chắc chắn muốn huỷ mượn sách không", (xacNhan) => {
		if (!xacNhan) return;

		const borrowList =
			JSON.parse(localStorage.getItem(`borrowList-${currentUser.userID}`)) ||
			[];
		const bookList = JSON.parse(localStorage.getItem("bookList")) || [];

		const index = borrowList.findIndex((b) => b.id === id);
		if (index !== -1) {
			const borrow = borrowList[index];
			const book = bookList.find((b) => b.title === borrow.bookTitle);
			if (book) book.quantity++;

			borrow.isCancelled = true;
			borrow.cancelledByUser = true;

			localStorage.setItem(
				`borrowList-${currentUser.userID}`,
				JSON.stringify(borrowList)
			);
			localStorage.setItem("bookList", JSON.stringify(bookList));

			renderBorrowCards();
		}
	});
}
//
function renderBorrowCards() {
	container.innerHTML = "";

	// const borrowList = JSON.parse(localStorage.getItem("borrowList")) || [];
	// const userBorrows = borrowList.filter((b) => b.userID === currentUser.userID);
	//
	const userBorrows =
		JSON.parse(localStorage.getItem(`borrowList-${currentUser.userID}`)) || [];
	//

	if (userBorrows.length === 0) {
		container.innerHTML = `<div class="khongcogi"><p>Bạn chưa mượn sách hoặc đã trả hết</p></div>`;
		return;
	}
	document.querySelectorAll(".khongcogi").forEach((el) => el.remove());

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	userBorrows.forEach((borrow) => {
		const book = bookList.find((b) => b.title === borrow.bookTitle);
		// const imgSrc = book?.image || "";
		//
		let imgSrc = "";

		if (book?.id) {
			imgSrc =
				localStorage.getItem("bookImage-" + book.id) ||
				book.image ||
				// 		"../anh/theme/nothing.jpg";
				// } else {
				// 	imgSrc = book?.image || "../anh/theme/nothing.jpg";
				// }
				//
				window.location.origin + "/anh/theme/nothing.jpg";
		} else {
			imgSrc = book?.image?.startsWith("http")
				? book.image
				: window.location.origin + "/anh/theme/nothing.jpg";
		}
		//
		const borrowDate = borrow.borrowDate
			? normalizeDate(borrow.borrowDate)
			: null;
		const returnDate = borrow.returnDate
			? normalizeDate(borrow.returnDate)
			: null;

		let status = "";
		// if (borrow.isCancelled) {
		//
		if (borrow.removed) {
			status = "Sách này đã bị gỡ khỏi thư viện bởi quản lý";
		} else if (borrow.removedPending) {
			status = "Sách đã bị gỡ khỏi thư viện, yêu cầu không xử lý được";
		} else if (borrow.isCancelled) {
			//
			// status = "Đã huỷ";
			//
			if (borrow.cancelledByUser) {
				status = "Đã huỷ";
			} else if (borrow.cancelledByAdmin) {
				status = "Đã bị huỷ yêu cầu";
			} else {
				status = "Đã huỷ";
			}
			//
		} else if (!borrow.isApproved && returnDate && today > returnDate) {
			status = "Quá hạn duyệt";
		} else if (!borrow.isApproved) {
			status = "Chờ duyệt";
			// } else if (returnDate && today > returnDate) {
			// 	const overdue = calculateOverdueDays(borrow.returnDate);
			// 	status = `Trả muộn (quá ${overdue} ngày)`;
			// } else if (borrow.isReturned) {
			// 	status = "Đã trả";
			//
		} else if (borrow.isReturned) {
			status = "Đã trả";
		} else if (returnDate && today > returnDate) {
			const overdue = calculateOverdueDays(borrow.returnDate);
			status = `Trả muộn (quá ${overdue} ngày)`;
			// } else if (borrowDate > today) {
			// 	status = "Đặt trước";
		} else {
			const daysLeft = calculateDaysLeft(borrow.returnDate);
			status = `Đang mượn (còn ${daysLeft} ngày)`;
		}

		let actionButton = "";
		if (status === "Chờ duyệt") {
			actionButton = `<button onclick="cancelReservation(${borrow.id})">Huỷ yêu cầu</button>`;
		}
		// } else if (
		// 	status.startsWith("Đang mượn") ||
		// 	status.startsWith("Trả muộn")
		// ) {
		// 	actionButton = `<button onclick="returnBook(${borrow.id})">Đánh dấu đã trả sách</button>`;
		// }

		const thongTin1 = `<p${
			!actionButton ? ' class="thongtin-khong"' : ""
		}><b>Tên sách đã mượn:</b> ${borrow.bookTitle}</p>`;
		const thongTin2 = `<p${
			!actionButton ? ' class="thongtin-khong"' : ""
		}><b>Ngày mượn:</b> ${borrow.borrowDate || "—"}</p>`;
		const thongTin3 = `<p${
			!actionButton ? ' class="thongtin-khong"' : ""
		}><b>Ngày trả:</b> ${borrow.returnDate || "—"}</p>`;
		const thongTin4 = `<p${
			!actionButton ? ' class="thongtin-khong-cuoi"' : ""
		}><b>Trạng thái:</b> ${status}</p>`;

		const card = document.createElement("div");
		card.className = "book-item";
		card.innerHTML = `
			<img src="${imgSrc}"/>
			<div class="book-info">
				${thongTin1}
				${thongTin2}
				${thongTin3}
				${thongTin4}
				<div class="book-buttons">${actionButton}</div>
			</div>
		`;
		container.appendChild(card);
	});
}
renderBorrowCards();
