function renderMenu() {
	const menu = document.getElementById("mainMenu");
	if (!menu) return;

	const user = JSON.parse(localStorage.getItem("loggedInUser"));

	let html = "";

	if (!user) {
		html = `
			<li><a href="../chinh/chinh.html">Trang Chủ</a></li>
			<li><a onclick="vuilongdangnhap()">Mượn Sách</a></li>
			<li><a onclick="vuilongdangnhap()">Lịch Sử</a></li>
			<li><a onclick="vuilongdangnhap()">Đánh Giá</a></li>
			<li><a href="../dangnhap/dangnhap.html">Đăng Nhập</a></li>
			<li><a href="../dangky/dangky.html">Đăng Ký</a></li>
		`;
	} else if (user.role === "user") {
		html = `
			<li><a href="../nguoidung/nguoidung.html">Trang Chủ</a></li>
			<li><a href="../muon/muon.html">Mượn Sách</a></li>
			<li><a href="../lichsurieng/lichsurieng.html">Lịch Sử</a></li>
			<li><a href="../danhgia/danhgia.html">Đánh Giá</a></li>
		`;
	} else if (user.role === "admin") {
		html = `
			<li><a href="../quanly/quanly.html">Trang Chủ</a></li>
			<li><a href="../themsach/themsach.html">Thêm Sách</a></li>
			<li><a href="../lichsutong/lichsutong.html">Lịch Sử</a></li>
			<li><a href="../thongke/thongke.html">Thống Kê</a></li>
		`;
	}

	menu.innerHTML = html;
}
//
//
//
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
//
document.addEventListener("DOMContentLoaded", () => {
	renderMenu();
});
//
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
