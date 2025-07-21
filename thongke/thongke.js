function clearStorage() {
	localStorage.clear();
	showPopup("Đã Reset toàn bộ dữ liệu về nguyên bản");
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
