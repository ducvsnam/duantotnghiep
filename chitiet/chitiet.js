document.querySelectorAll(".muonsachchitiet").forEach((btn) =>
	btn.addEventListener("click", () => {
		const bookName = params.get("name") || "";
		const url = new URL("../muon/muon.html", window.location.origin);
		url.searchParams.set("book", bookName);
		window.location.href = url.href;
	})
);

const params = new URLSearchParams(window.location.search);
const imgPath = params.get("img");
if (imgPath) {
	document.getElementById("anhChiTiet").src = imgPath;
}

document.getElementById("tenSach").textContent = params.get("name") || "...";
document.getElementById("tacGia").textContent = params.get("author") || "...";
document.getElementById("theLoai").textContent = params.get("genre") || "...";
document.getElementById("namXuatBan").textContent = params.get("year") || "...";

const bookName = params.get("name");
const bookList = JSON.parse(localStorage.getItem("bookList")) || [];
const book = bookList.find((b) => b.title === bookName);

document.getElementById("soLuong").textContent = book?.quantity ?? "...";
