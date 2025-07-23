// function renderMenu() {
// 	const menu = document.getElementById("mainMenu");
// 	if (!menu) return;

// 	const user = JSON.parse(localStorage.getItem("loggedInUser"));

// 	let html = "";

// 	if (!user) {
// 		html = `
// 			<li><a href="../chinh/chinh.html">Trang Chủ</a></li>
// 			<li><a onclick="vuilongdangnhap()">Mượn Sách</a></li>
// 			<li><a onclick="vuilongdangnhap()">Lịch Sử</a></li>
// 			<li><a onclick="vuilongdangnhap()">Đánh Giá</a></li>
// 			<li><a href="../dangnhap/dangnhap.html">Đăng Nhập</a></li>
// 			<li><a href="../dangky/dangky.html">Đăng Ký</a></li>
// 		`;
// 	} else if (user.role === "user") {
// 		html = `
// 			<li><a href="../nguoidung/nguoidung.html">Trang Chủ</a></li>
// 			<li><a href="../muon/muon.html">Mượn Sách</a></li>
// 			<li><a href="../lichsurieng/lichsurieng.html">Lịch Sử</a></li>
// 			<li><a href="../danhgia/danhgia.html">Đánh Giá</a></li>
// 		`;
// 	} else if (user.role === "admin") {
// 		html = `
// 			<li><a href="../quanly/quanly.html">Trang Chủ</a></li>
// 			<li><a href="../themsach/themsach.html">Thêm Sách</a></li>
// 			<li><a href="../lichsutong/lichsutong.html">Lịch Sử</a></li>
// 			<li><a href="../thongke/thongke.html">Thống Kê</a></li>
// 		`;
// 	}

// 	menu.innerHTML = html;
// }
//
//
//
const genres = [
	"Tất cả thể loại",
	"Trinh thám",
	"Ngôn tình",
	"Khoa học viễn tưởng",
	"Ngụ ngôn triết lý",
	"Giả tưởng kỳ ảo",
	"Tâm lý học",
	"Kinh dị",
	"Tiểu thuyết các loại",
];

const saveBooks = (books) =>
	localStorage.setItem("bookList", JSON.stringify(books));

function renderBooks(books, bookGrid, timkiem) {
	if (books.length === 0) {
		timkiem.innerHTML = "Không tìm thấy sách phù hợp";
		timkiem.style.display = "block";
		bookGrid.innerHTML = "";
		return;
	}

	timkiem.innerHTML = "";
	timkiem.style.display = "none";

	bookGrid.innerHTML = books
		.map((book) => {
			const imageSrc = book.image.startsWith("/")
				? ".." + book.image
				: book.image;
			return `
			<div class="book book-card reveal">
				<img src="${imageSrc}">
				<div class="book-title">${book.title}</div>
			</div>`;
		})
		.join("");

	revealOnScroll();
}

function filterBooks(searchInput, searchBox, bookGrid, timkiem) {
	const keyword = searchInput.value.toLowerCase();
	const genre = searchBox.dataset.genre || "";
	const books = getBooks();

	const filtered = books.filter((b) => {
		const matchTitle = b.title.toLowerCase().includes(keyword);
		const matchGenre = genre === "" || b.genre === genre;
		return matchTitle && matchGenre;
	});

	renderBooks(filtered, bookGrid, timkiem);
}

function showSuggestions(
	searchBox,
	suggestionsDiv,
	searchInput,
	bookGrid,
	timkiem
) {
	suggestionsDiv.innerHTML = "";
	genres.forEach((genre) => {
		const item = document.createElement("div");
		item.textContent = genre;
		item.classList.add("suggestion-item");

		item.addEventListener("click", () => {
			searchBox.value = genre;
			searchBox.dataset.genre = genre === "Tất cả thể loại" ? "" : genre;
			searchBox.placeholder = "";
			suggestionsDiv.classList.remove("show");
			filterBooks(searchInput, searchBox, bookGrid, timkiem);
		});

		suggestionsDiv.appendChild(item);
	});
	suggestionsDiv.classList.add("show");
}

const bookGrid = document.querySelector(".grid");
const searchInput = document.getElementById("searchInput");
const searchBox = document.getElementById("searchBox");
const suggestionsDiv = document.getElementById("suggestions");
const timkiem = document.getElementById("timkiem");

searchBox.placeholder = "Tìm kiếm theo thể loại...";
searchBox.value = "";

const defaultGenres = [
	"Trinh thám",
	"Ngôn tình",
	"Khoa học viễn tưởng",
	"Ngụ ngôn triết lý",
	"Giả tưởng kỳ ảo",
	"Tâm lý học",
	"Kinh dị",
	"Tiểu thuyết các loại",
];

searchBox.addEventListener("focus", () => {
	suggestionsDiv.innerHTML = "";

	const customGenres = JSON.parse(localStorage.getItem("customGenres") || "[]");
	const fullGenres = ["Tất cả thể loại", ...defaultGenres, ...customGenres];

	fullGenres.forEach((option) => {
		const item = document.createElement("div");
		item.textContent = option;
		item.classList.add("suggestion-item");

		item.addEventListener("click", () => {
			searchBox.value = option;
			searchBox.dataset.genre = option === "Tất cả thể loại" ? "" : option;
			suggestionsDiv.classList.remove("show");
			filterBooks(searchInput, searchBox, bookGrid, timkiem);
		});

		suggestionsDiv.appendChild(item);
	});

	suggestionsDiv.classList.add("show");
});

searchInput.addEventListener("input", () =>
	filterBooks(searchInput, searchBox, bookGrid, timkiem)
);

document.addEventListener("DOMContentLoaded", () => {
	if (!localStorage.getItem("bookList")) {
		saveBooks(defaultBooks);
	}

	renderBooks(getBooks(), bookGrid, timkiem);

	setTimeout(revealOnScroll, 100);
	setInterval(revealOnScroll, 300);
	//
	//
	//
	// renderMenu();
});

document.addEventListener("click", (e) => {
	if (!suggestionsDiv.contains(e.target) && e.target !== searchBox) {
		suggestionsDiv.classList.remove("show");
	}
});
