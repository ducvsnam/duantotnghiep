function getBooks() {
	const saved = localStorage.getItem("bookList");
	return saved ? JSON.parse(saved) : [];
}

// document.querySelectorAll(".muonsachchitiet").forEach((btn) =>
// 	btn.addEventListener("click", () => {
// 		const bookName = params.get("name") || "";
// 		const url = new URL("../muon/muon.html", window.location.origin);
// 		url.searchParams.set("book", bookName);

// 		document.body.classList.remove("fade-in");
// 		document.body.classList.add("fade-out");

// 		setTimeout(() => {
// 			window.location.href = url.href;
// 		}, 800);
// 	})
// );
//
//
//
document.querySelectorAll(".muonsachchitiet").forEach((btn) =>
	btn.addEventListener("click", () => {
		const id = Number(params.get("id"));
		const bookList = JSON.parse(localStorage.getItem("bookList")) || [];
		const book = bookList.find((b) => b.id === id);

		if (!book) {
			showPopup("Không tìm thấy sách để mượn");
			return;
		}

		const url = new URL("../muon/muon.html", window.location.origin);
		url.searchParams.set("book", book.title);

		document.body.classList.remove("fade-in");
		document.body.classList.add("fade-out");

		setTimeout(() => {
			window.location.href = url.href;
		}, 800);
	})
);
//
const params = new URLSearchParams(window.location.search);
// const bookName = params.get("name") || "...";

// const bookList = getBooks();
// const book = bookList.find((b) => b.title === bookName);
//
//
//
const bookId = Number(params.get("id"));
const bookList = getBooks();
const book = bookList.find((b) => b.id === bookId);
//
if (book) {
	const imgSrc = book.image?.startsWith("data:image/")
		? book.image
		: book.image?.startsWith("/")
		? book.image
		: "/" + book.image;

	document.getElementById("anhChiTiet").src = imgSrc;
	document.getElementById("tenSach").textContent = book.title;
	document.getElementById("tacGia").textContent = book.author;
	document.getElementById("theLoai").textContent = book.genre;
	document.getElementById("namXuatBan").textContent = book.year;
	document.getElementById("soLuong").textContent = book.quantity;
} else {
	document.getElementById("tenSach").textContent = bookName;
	document.getElementById("soLuong").textContent = "...";
}
