function getBooks() {
	const saved = localStorage.getItem("bookList");
	return saved ? JSON.parse(saved) : [];
}

document.querySelectorAll(".muonsachchitiet").forEach((btn) =>
	btn.addEventListener("click", () => {
		const bookName = params.get("name") || "";
		const url = new URL("../muon/muon.html", window.location.origin);
		url.searchParams.set("book", bookName);
		window.location.href = url.href;
	})
);

const params = new URLSearchParams(window.location.search);
const bookName = params.get("name") || "...";

const bookList = getBooks();
const book = bookList.find((b) => b.title === bookName);

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
