// const imageUpload = document.getElementById("imageUpload");
// const preview = document.getElementById("preview");
const saveBtn = document.getElementById("saveBtn");
const result = document.getElementById("result");
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", renderBooks);

function renderBooks() {
	const books = getBooks().filter((book) => !book.deleted);

	const keyword = searchInput.value.trim().toLowerCase();
	const selectedGenre = searchBox.dataset.genre || "";

	const filtered = books.filter((book) => {
		const matchTitle = book.title?.toLowerCase().includes(keyword);
		const matchGenre = selectedGenre === "" || book.genre === selectedGenre;
		return matchTitle && matchGenre;
	});

	result.innerHTML = "";

	const timkiem = document.getElementById("timkiem");
	if (filtered.length === 0) {
		timkiem.textContent = "Không tìm thấy sách phù hợp";
		timkiem.style.display = "block";
		return;
	} else {
		timkiem.textContent = "";
		timkiem.style.display = "none";
	}

	filtered.forEach((book, index) => {
		const bookDiv = document.createElement("div");
		bookDiv.classList.add("reveal");

		const imgSrc =
			localStorage.getItem("bookImage-" + book.id) ||
			book.image ||
			"anh/theme/nothing.jpg";

		bookDiv.innerHTML = `
				<div class="book-item">
					<img src="${imgSrc}"/>
					<button onclick="infoBook(${book.id})">Xem chi tiết</button>
				</div>
			`;

		result.appendChild(bookDiv);
	});

	revealOnScroll();
}

let editingId = null;

function getBooks() {
	const books = JSON.parse(localStorage.getItem("bookList") || "[]");
	let changed = false;
	books.forEach((book) => {
		if (!book.id) {
			book.id = Date.now() + Math.floor(Math.random() * 10000);
			changed = true;
		}
	});
	if (changed) {
		localStorage.setItem("bookList", JSON.stringify(books));
	}
	return books;
}

function saveBooks(books) {
	localStorage.setItem("bookList", JSON.stringify(books));
}

function getAllBorrowList() {
	let all = [];
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key.startsWith("borrowList-")) {
			try {
				const list = JSON.parse(localStorage.getItem(key));
				if (Array.isArray(list)) all = all.concat(list);
			} catch {}
		}
	}
	return all;
}

// imageUpload.addEventListener("change", function (e) {
// 	const file = e.target.files[0];
// 	if (!file) return;

// 	const reader = new FileReader();
// 	reader.onload = function (event) {
// 		const img = new Image();
// 		img.onload = function () {
// 			const MAX_WIDTH = 300;
// 			const MAX_HEIGHT = 400;

// 			let width = img.width;
// 			let height = img.height;

// 			if (width > MAX_WIDTH || height > MAX_HEIGHT) {
// 				const scale = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
// 				width = width * scale;
// 				height = height * scale;
// 			}

// 			const canvas = document.createElement("canvas");
// 			canvas.width = width;
// 			canvas.height = height;
// 			const ctx = canvas.getContext("2d");
// 			ctx.drawImage(img, 0, 0, width, height);

// 			const compressed = canvas.toDataURL("image/jpeg", 0.7);

// 			preview.src = compressed;
// 			preview.classList.add("show");
// 			preview.dataset.compressed = compressed;

// 			document.getElementById("uploadIcon").style.display = "none";
// 			document.getElementById("uploadText").style.display = "none";
// 		};
// 		img.src = event.target.result;
// 	};
// 	reader.readAsDataURL(file);
// });
//
const fileInput = document.getElementById("excelUpload");
const uploadIcon = document.getElementById("uploadIcon");
const excelIcon = document.getElementById("excelIcon");

fileInput.addEventListener("change", function () {
	if (this.files.length > 0) {
		uploadIcon.style.display = "none";
		excelIcon.style.display = "block";
	}
});
//
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

const genreInput = document.getElementById("genre");
const suggestionsInfo = document.getElementById("suggestionsinfo");
const searchBox = document.getElementById("searchBox");
const suggestionsDiv = document.getElementById("suggestionssearch");

genreInput.placeholder = "Chọn thể loại...";
genreInput.value = "";

genreInput.addEventListener("focus", () => {
	suggestionsInfo.innerHTML = "";
	genreInput.placeholder = "Chọn thể loại...";

	const customGenres = JSON.parse(localStorage.getItem("customGenres") || "[]");
	const fullGenres = [...customGenres, ...defaultGenres, "Thể loại khác"];

	fullGenres.forEach((option) => {
		const item = document.createElement("div");
		item.textContent = option;
		item.classList.add("suggestion-item");

		item.addEventListener("click", () => {
			if (option === "Thể loại khác") {
				genreInput.readOnly = false;
				genreInput.value = "";
				genreInput.focus();
			} else {
				genreInput.readOnly = true;
				genreInput.value = option;
			}
			suggestionsInfo.classList.remove("show");
		});

		suggestionsInfo.appendChild(item);
	});

	suggestionsInfo.classList.add("show");
});

searchBox.placeholder = "Tìm kiếm theo thể loại...";
searchBox.value = "";

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
			renderBooks();
		});

		suggestionsDiv.appendChild(item);
	});

	suggestionsDiv.classList.add("show");
});

document.addEventListener("DOMContentLoaded", () => {
	if (!localStorage.getItem("bookList")) {
		saveBooks(defaultBooks);
	}
	renderBooks();

	saveBtn.addEventListener("click", addBook);
});

document.addEventListener("click", (e) => {
	if (!suggestionsInfo.contains(e.target) && e.target !== genreInput) {
		suggestionsInfo.classList.remove("show");
	}

	if (!suggestionsDiv.contains(e.target) && e.target !== searchBox) {
		suggestionsDiv.classList.remove("show");
	}
});
