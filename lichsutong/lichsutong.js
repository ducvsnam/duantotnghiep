const borrowList = JSON.parse(localStorage.getItem("borrowList")) || [];
const bookList = JSON.parse(localStorage.getItem("bookList")) || [];
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

function calculateOverdueDays(dateStr) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const returnDate = normalizeDate(dateStr);
	const diff = Math.ceil((today - returnDate) / (1000 * 60 * 60 * 24));
	return diff;
}

function returnBook(borrowId) {
	const borrowList = JSON.parse(localStorage.getItem("borrowList")) || [];
	const bookList = JSON.parse(localStorage.getItem("bookList")) || [];

	const index = borrowList.findIndex((b) => b.id === borrowId);
	if (index === -1) return;

	showConfirm("Xác nhận người dùng đã trả sách này", (agree) => {
		if (!agree) return;

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

function renderBorrowCards() {
	container.innerHTML = "";

	const borrowList = JSON.parse(localStorage.getItem("borrowList")) || [];
	const userBorrows = borrowList;

	if (userBorrows.length === 0) {
		container.innerHTML = `<div class="khongcogi"><p>Không có lịch sử mượn sách</p></div>`;
		return;
	}
	document.querySelectorAll(".khongcogi").forEach((el) => el.remove());

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	userBorrows.forEach((borrow) => {
		const book = bookList.find((b) => b.title === borrow.bookTitle);
		const imgSrc = book?.image || "";
		const borrowDate = borrow.borrowDate
			? normalizeDate(borrow.borrowDate)
			: null;
		const returnDate = borrow.returnDate
			? normalizeDate(borrow.returnDate)
			: null;

		let status = "";
		if (borrow.isCancelled) {
			status = "Đã huỷ";
		} else if (!borrow.isApproved && returnDate && today > returnDate) {
			status = "Quá hạn duyệt";
		} else if (!borrow.isApproved) {
			status = "Chờ duyệt";
		} else if (returnDate && today > returnDate) {
			const overdue = calculateOverdueDays(borrow.returnDate);
			status = `Trả muộn (quá ${overdue} ngày)`;
		} else if (borrow.isReturned) {
			status = "Đã trả";
		} else if (borrowDate > today) {
			status = "Đặt trước";
		} else {
			const daysLeft = calculateDaysLeft(borrow.returnDate);
			status = `Đang mượn (còn ${daysLeft} ngày)`;
		}

		let actionButton = "";
		// if (status === "Chờ duyệt") {
		// 	actionButton = `<button onclick="approveBorrow(${borrow.id})">Duyệt yêu cầu</button>`;
		// } else if (
		//
		if (status === "Chờ duyệt") {
			const daysUntilBorrow = calculateDaysLeft(borrow.borrowDate);

			if (borrowDate > today) {
				actionButton = `<button onclick="handlePreApprove(${borrow.id}, ${daysUntilBorrow})">
			Duyệt yêu cầu (còn ${daysUntilBorrow} ngày)
		</button>`;
			} else {
				actionButton = `<button onclick="approveBorrow(${borrow.id})">Duyệt yêu cầu</button>`;
			}
		} else if (
			status.startsWith("Đang mượn") ||
			status.startsWith("Trả muộn")
		) {
			actionButton = `<button onclick="returnBook(${borrow.id})">Đánh dấu đã trả sách</button>`;
		}

		const thongTin1 = `<p${
			!actionButton ? ' class="thongtin-khong"' : ""
		}><b>Họ tên người mượn:</b> ${borrow.name}</p>`;
		const thongTin2 = `<p${
			!actionButton ? ' class="thongtin-khong"' : ""
		}><b>Email người mượn:</b> ${borrow.email}</p>`;
		const thongTin3 = `<p${
			!actionButton ? ' class="thongtin-khong"' : ""
		}><b>Số điện thoại người mượn:</b> ${borrow.phone}</p>`;
		const thongTin4 = `<p${
			!actionButton ? ' class="thongtin-khong"' : ""
		}><b>Tên sách đã mượn:</b> ${borrow.bookTitle}</p>`;
		const thongTin5 = `<p${
			!actionButton ? ' class="thongtin-khong"' : ""
		}><b>Ngày mượn:</b> ${borrow.borrowDate || "—"}</p>`;
		const thongTin6 = `<p${
			!actionButton ? ' class="thongtin-khong"' : ""
		}><b>Ngày trả:</b> ${borrow.returnDate || "—"}</p>`;
		const thongTin7 = `<p${
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
				${thongTin5}
				${thongTin6}
				${thongTin7}
				<div class="book-buttons">${actionButton}</div>
			</div>
		`;
		container.appendChild(card);
	});
}

function approveBorrow(borrowId) {
	const borrowList = JSON.parse(localStorage.getItem("borrowList")) || [];
	const index = borrowList.findIndex((b) => b.id === borrowId);
	if (index === -1) return;

	borrowList[index].isApproved = true;

	localStorage.setItem("borrowList", JSON.stringify(borrowList));
	renderBorrowCards();
}
//
function handlePreApprove(id, daysLeft) {
	if (daysLeft > 0) {
		showPopup("Chưa đến ngày mượn sách nên không thể duyệt lúc này");
	} else {
		approveBorrow(id);
	}
}
//
renderBorrowCards();
