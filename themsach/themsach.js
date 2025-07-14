const imageUpload = document.getElementById("imageUpload");
const preview = document.getElementById("preview");
const saveBtn = document.getElementById("saveBtn");
const result = document.getElementById("result");
const searchInput = document.getElementById("searchInput");
const searchBox = document.getElementById("searchBox");
const suggestionsDiv = document.getElementById("suggestionssearch");

function getBooks() {
	const saved = localStorage.getItem("bookList");
	if (saved) {
		return JSON.parse(saved);
	} else {
		localStorage.setItem("bookList", JSON.stringify(defaultBooks));
		return defaultBooks;
	}
}

function saveBooks(books) {
	localStorage.setItem("bookList", JSON.stringify(books));
}

function deleteBook(index) {
	const books = getBooks();
	showConfirm("Bạn có chắc chắn muốn xoá sách này không", function (xacNhan) {
		if (xacNhan) {
			books.splice(index, 1);
			saveBooks(books);
			renderBooks();
		}
	});
}

let editingIndex = null;

function editBook(index) {
	window.scrollTo({ top: 0, behavior: "smooth" });

	const books = getBooks();
	const book = books[index];
	document.getElementById("bookTitle").value = book.title;
	document.getElementById("author").value = book.author;
	document.getElementById("genre").value = book.genre;
	document.getElementById("year").value = book.year;
	document.getElementById("quantity").value = book.quantity;
	preview.src = book.image;
	preview.classList.add("show");
	document.getElementById("uploadIcon").style.display = "none";
	document.getElementById("uploadText").style.display = "none";

	editingIndex = index;
}

document.addEventListener("DOMContentLoaded", () => {
	if (!localStorage.getItem("bookList")) {
		saveBooks(defaultBooks);
	}
	renderBooks();
});

searchInput.addEventListener("input", renderBooks);

saveBtn.addEventListener("click", () => {
	const title = document.getElementById("bookTitle").value.trim();
	const author = document.getElementById("author").value.trim();
	const genre = document.getElementById("genre").value.trim();
	const year = document.getElementById("year").value.trim();
	const quantity = document.getElementById("quantity").value.trim();
	const imageSrc = preview.src;

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

	const books = getBooks();

	if (editingIndex === null) {
		const isDuplicate = books.some(
			(b) => b.title.toLowerCase() === title.toLowerCase()
		);
		if (isDuplicate) {
			showPopup("Sách này đã tồn tại, không thể thêm trùng");
			return;
		}
		books.push({ title, author, genre, year, quantity, image: imageSrc });
	} else {
		books[editingIndex] = {
			title,
			author,
			genre,
			year,
			quantity,
			image: imageSrc,
		};
		editingIndex = null;
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
});

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

function renderBooks() {
	const books = getBooks();
	const keyword = searchInput.value.trim().toLowerCase();
	const selectedGenre = searchBox.dataset.genre || "";

	const filtered = books.filter((book) => {
		const matchTitle = book.title.toLowerCase().includes(keyword);
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
		const isBase64 = book.image?.startsWith("data:image/");
		const isAbsolutePath = book.image?.startsWith("/");

		const imgSrc = isBase64
			? book.image
			: isAbsolutePath
			? book.image
			: book.image?.trim()
			? "/" + book.image.trim()
			: "/anh/theme/img2.jpg";

		const bookDiv = document.createElement("div");
		bookDiv.classList.add("reveal");

		bookDiv.innerHTML = `
		<div class="book-item">
			<img src="${imgSrc}" alt="${book.title}" onerror="this.src='/anh/theme/img1.jpg'" />
			<div class="book-info">
				<p><b>Tên sách:</b> ${book.title}</p>
				<p><b>Tác giả:</b> ${book.author}</p>
				<p><b>Thể loại:</b> ${book.genre}</p>
				<p><b>Năm xuất bản:</b> ${book.year}</p>
				<p><b>Số lượng:</b> ${book.quantity}</p>
				<div class="book-buttons">
					<button onclick="editBook(${index})">Sửa</button>
					<button onclick="deleteBook(${index})">Xoá</button>
				</div>
			</div>
		</div>
	`;

		result.appendChild(bookDiv);
	});

	revealOnScroll();
}

const genreOptions = [
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

searchBox.placeholder = "Chọn thể loại...";
searchBox.value = "";

searchBox.addEventListener("focus", () => {
	suggestionsSearch.innerHTML = "";
	genreOptions.forEach((option) => {
		const item = document.createElement("div");
		item.textContent = option;
		item.classList.add("suggestion-item");
		item.addEventListener("click", () => {
			searchBox.value = option;
			searchBox.dataset.genre = option === "Tất cả thể loại" ? "" : option;
			suggestionsSearch.classList.remove("show");
			renderBooks();
		});
		suggestionsSearch.appendChild(item);
	});
	suggestionsSearch.classList.add("show");
});

const genreInput = document.getElementById("genre");
const suggestionsInfo = document.getElementById("suggestionsinfo");
const suggestionsSearch = document.getElementById("suggestionssearch");

const genreOptionstl = [
	"Trinh thám",
	"Ngôn tình",
	"Khoa học viễn tưởng",
	"Ngụ ngôn triết lý",
	"Giả tưởng kỳ ảo",
	"Tâm lý học",
	"Kinh dị",
	"Tiểu thuyết các loại",
];

genreInput.placeholder = "Chọn thể loại...";
genreInput.value = "";

genreInput.addEventListener("focus", () => {
	suggestionsInfo.innerHTML = "";
	genreOptionstl.forEach((option) => {
		const item = document.createElement("div");
		item.textContent = option;
		item.classList.add("suggestion-item");
		item.addEventListener("click", () => {
			genreInput.value = option;
			suggestionsInfo.classList.remove("show");
		});
		suggestionsInfo.appendChild(item);
	});
	suggestionsInfo.classList.add("show");
});

document.addEventListener("click", (e) => {
	if (!suggestionsInfo.contains(e.target) && e.target !== genreInput) {
		suggestionsInfo.classList.remove("show");
	}

	if (!suggestionsSearch.contains(e.target) && e.target !== searchBox) {
		suggestionsSearch.classList.remove("show");
	}
});

window.showPopup = function (message) {
	const overlay = document.getElementById("overlay");
	const msg = document.getElementById("message");
	const closeBtn = document.getElementById("popup-close-btn");
	const yesBtn = document.getElementById("confirm-yes-btn");
	const noBtn = document.getElementById("confirm-no-btn");

	if (!overlay || !msg) return;

	msg.innerText = message;
	overlay.classList.add("show");

	closeBtn.style.display = "inline-block";
	yesBtn.style.display = "none";
	noBtn.style.display = "none";

	closeBtn.onclick = () => overlay.classList.remove("show");
	overlay.onclick = (e) => {
		if (e.target === overlay) overlay.classList.remove("show");
	};
};
