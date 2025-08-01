const imageUpload = document.getElementById("imageUpload");
const preview = document.getElementById("preview");
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

		const imgSrc = book.image?.startsWith("data:image/")
			? book.image
			: book.image?.startsWith("/")
			? book.image
			: "/" + book.image;

		bookDiv.innerHTML = `
				<div class="book-item">
					<img src="${imgSrc}"/>
					<div class="book-info">
						<p><b>Tên sách:</b> ${book.title}</p>
						<p><b>Tác giả:</b> ${book.author}</p>
						<p><b>Thể loại:</b> ${book.genre}</p>
						<p><b>Năm xuất bản:</b> ${book.year}</p>
						<p><b>Số lượng:</b> ${book.quantity}</p>
						<div class="book-buttons">
							<button onclick="editBook(${book.id})">Sửa</button>
							<button onclick="deleteBook(${book.id})">Xoá</button>
						</div>
					</div>
				</div>
			`;

		result.appendChild(bookDiv);
	});

	revealOnScroll();
}

let editingId = null;

function editBook(id) {
	window.scrollTo({ top: 0, behavior: "smooth" });

	const books = getBooks();
	const index = books.findIndex((b) => b.id === id);
	if (index === -1) return;

	const book = books[index];

	document.getElementById("bookTitle").value = book.title || "";
	document.getElementById("author").value = book.author || "";
	document.getElementById("genre").value = book.genre || "";
	document.getElementById("year").value = book.year || "";
	document.getElementById("quantity").value = book.quantity || "";

	const imgSrc = book.image?.startsWith("data:image/")
		? book.image
		: book.image?.startsWith("/")
		? book.image
		: "/" + book.image;

	preview.src = imgSrc;
	preview.classList.add("show");
	document.getElementById("uploadIcon").style.display = "none";
	document.getElementById("uploadText").style.display = "none";

	editingId = id;
	saveBtn.textContent = "Lưu thông tin";
}

function isValidAuthorName(name) {
	const value = name.trim();
	if (!value || /^[ .-]+$/.test(value)) return false;

	// const baseRegex = /^[\p{L} .-]{3,40}$/u;
	//
	const baseRegex = /^[\p{L}\d .-]{3,40}$/u;
	//
	if (!baseRegex.test(value)) return false;

	if (/ {2,}/.test(value) || /\.{2,}/.test(value) || /-{2,}/.test(value))
		return false;

	if (/^[.-]/.test(value) || /[.-]$/.test(value)) return false;

	if (!/[\p{L}]/u.test(value)) return false;

	return true;
}

function isValidBookTitle(title) {
	const value = title.trim();
	if (!value || /^[ .,:-]+$/.test(value)) return false;

	const baseRegex = /^[\p{L}0-9 .,:-]{3,40}$/u;
	if (!baseRegex.test(value)) return false;

	if (
		/ {2,}/.test(value) ||
		/\.{2,}/.test(value) ||
		/:{2,}/.test(value) ||
		/-{2,}/.test(value) ||
		/,{2,}/.test(value)
	)
		return false;

	if (/^[.:/-]/.test(value) || /[.:/-]$/.test(value)) return false;

	if (!/[\p{L}0-9]/u.test(value)) return false;

	return true;
}

function addBook() {
	const title = document.getElementById("bookTitle").value.trim();
	const author = document.getElementById("author").value.trim();
	const genre = document.getElementById("genre").value.trim();
	const year = document.getElementById("year").value.trim();
	const quantity = document.getElementById("quantity").value.trim();

	if (!isValidAuthorName(author)) {
		showPopup("Tên tác giả không hợp lệ");
		return;
	}

	if (!isValidBookTitle(title)) {
		showPopup("Tên sách không hợp lệ");
		return;
	}

	let imageSrc = preview.src;

	if (!imageSrc.startsWith("data:image/")) {
		if (imageSrc.startsWith(window.location.origin)) {
			imageSrc = imageSrc.replace(window.location.origin, "");
		}
	}

	if (
		!title ||
		!author ||
		!genre ||
		!year ||
		!quantity ||
		!preview.classList.contains("show")
	) {
		showPopup("Vui lòng điền đầy đủ thông tin và chọn ảnh bìa");
		return;
	}

	if (isNaN(quantity) || Number(quantity) < 0) {
		showPopup("Số lượng sách phải là số dương");
		return;
	}

	const currentYear = new Date().getFullYear();
	if (!/^\d{4}$/.test(year) || year < 868 || year > currentYear) {
		showPopup("Năm xuất bản không hợp lệ");
		return;
	}

	let customGenres = JSON.parse(localStorage.getItem("customGenres") || "[]");

	if (
		!defaultGenres.includes(genre) &&
		!customGenres.includes(genre) &&
		genre.trim() !== "" &&
		genre.toLowerCase() !== "thể loại khác"
	) {
		customGenres.unshift(genre);
		localStorage.setItem("customGenres", JSON.stringify(customGenres));
	}

	const books = getBooks();

	if (editingId === null) {
		const isDuplicate = books.some(
			(b) => b.title.toLowerCase() === title.toLowerCase()
		);
		if (isDuplicate) {
			showPopup("Sách này đã tồn tại nên không thể thêm trùng");
			return;
		}

		books.push({
			id: Date.now(),
			title,
			author,
			genre,
			year: Number(year),
			quantity: Number(quantity),
			image: imageSrc,
		});

		localStorage.setItem("bookList", JSON.stringify(books));
		renderBooks();

		showPopup("Thêm sách thành công");
		saveBtn.textContent = "Thêm sách";
	} else {
		const isDuplicate = books.some(
			(b) => b.title.toLowerCase() === title.toLowerCase() && b.id !== editingId
		);

		if (isDuplicate) {
			showPopup("Tên sách này đã trùng với một sách khác");
			return;
		}

		const index = books.findIndex((b) => b.id === editingId);
		if (index === -1) {
			showPopup("Không tìm thấy sách để cập nhật");
			return;
		}

		books[index] = {
			...books[index],
			title,
			author,
			genre,
			year: Number(year),
			quantity: Number(quantity),
			image: imageSrc,
		};

		showPopup("Sửa thông tin sách thành công");
		editingId = null;
		saveBtn.textContent = "Thêm sách";
	}

	saveBooks(books);
	renderBooks();

	document.getElementById("bookTitle").value = "";
	document.getElementById("author").value = "";
	document.getElementById("genre").value = "";
	document.getElementById("year").value = "";
	document.getElementById("quantity").value = "";
	preview.src = "";
	preview.classList.remove("show");
	document.getElementById("uploadIcon").style.display = "block";
	document.getElementById("uploadText").style.display = "block";
}

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

function deleteBook(id) {
	const books = getBooks();

	const index = books.findIndex((book) => book.id === id);
	if (index === -1) return;

	showConfirm("Bạn có chắc chắn muốn xoá sách này không", function (xacNhan) {
		if (xacNhan) {
			books[index] = {
				id,
				image: "anh/theme/nothing.jpg",
				title: "Sách đã bị xóa",
				author: "",
				genre: "",
				quantity: 0,
				deleted: true,
			};
			saveBooks(books);
			renderBooks();
		}
	});
}

function saveNewGenreIfNeeded(genre) {
	const customGenres = JSON.parse(localStorage.getItem("customGenres") || "[]");
	if (
		!defaultGenres.includes(genre) &&
		!customGenres.includes(genre) &&
		genre.trim() !== "" &&
		genre !== "Thể loại khác"
	) {
		customGenres.unshift(genre);
		localStorage.setItem("customGenres", JSON.stringify(customGenres));
	}
}

imageUpload.addEventListener("change", function (e) {
	const file = e.target.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = function (e) {
			preview.src = e.target.result;
			preview.classList.add("show");
			document.getElementById("uploadIcon").style.display = "none";
			document.getElementById("uploadText").style.display = "none";
		};
		reader.readAsDataURL(file);
	}
});

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

const inputsoluong = document.getElementById("quantity");
const inputnamxuatban = document.getElementById("year");
inputsoluong.addEventListener("input", () => {
	inputsoluong.value = inputsoluong.value.replace(/\D/g, "");
});
inputnamxuatban.addEventListener("input", () => {
	inputnamxuatban.value = inputnamxuatban.value.replace(/\D/g, "");
});
