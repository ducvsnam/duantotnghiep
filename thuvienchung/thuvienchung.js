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
	// if (books.length === 0) {
	// 	timkiem.innerHTML = "Không tìm thấy sách phù hợp";
	// 	timkiem.style.display = "block";
	// 	bookGrid.innerHTML = "";
	// 	return;
	// }
	//
	// const filteredBooks = books.filter(
	// 	(book) => book.image.trim().toLowerCase() !== "nothing.jpg"
	// );
	//
	const filteredBooks = books
		.map((book, i) => ({ ...book, realIndex: i }))
		.filter((book) => {
			const img = book.image?.trim().toLowerCase();
			const title = book.title?.trim().toLowerCase();
			return img !== "nothing.jpg" && !title.includes("sách đã bị xóa");
		});
	//
	if (filteredBooks.length === 0) {
		timkiem.innerHTML = "Không tìm thấy sách phù hợp";
		timkiem.style.display = "block";
		bookGrid.innerHTML = "";
		return;
	}
	//
	timkiem.innerHTML = "";
	timkiem.style.display = "none";

	// bookGrid.innerHTML = filteredBooks
	// 	.map((book) => {
	// 		const imageSrc = book.image.startsWith("/")
	// 			? ".." + book.image
	// 			: book.image;
	// 		return `
	// 		<div class="book book-card reveal">
	// 			<img src="${imageSrc}">
	// 			<div class="book-title">${book.title}</div>
	// 		</div>`;
	// 	})
	// 	.join("");
	//
	bookGrid.innerHTML = filteredBooks
		.map((book) => {
			const imageSrc = book.image.startsWith("/")
				? ".." + book.image
				: book.image;
			return `
			<div class="book book-card reveal" data-index="${book.realIndex}">
				<img src="${imageSrc}">
				<div class="book-title">${book.title}</div>
			</div>
			`;
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
});

document.addEventListener("click", (e) => {
	if (!suggestionsDiv.contains(e.target) && e.target !== searchBox) {
		suggestionsDiv.classList.remove("show");
	}
});
