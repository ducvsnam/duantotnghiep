// document.addEventListener("DOMContentLoaded", () => {
// 	const bookGrid = document.querySelector(".grid");
// 	const searchInput = document.getElementById("searchInput");
// 	const searchBox = document.getElementById("searchBox");
// 	const suggestionsDiv = document.getElementById("suggestions");
// 	const timkiem = document.getElementById("timkiem");

// 	const options = [
// 		"Tất cả thể loại",
// 		"Trinh thám",
// 		"Ngôn tình",
// 		"Khoa học viễn tưởng",
// 		"Ngụ ngôn triết lý",
// 		"Giả tưởng kỳ ảo",
// 		"Tâm lý học",
// 		"Kinh dị",
// 		"Tiểu thuyết các loại",
// 	];

// 	searchBox.placeholder = "Chọn thể loại...";
// 	searchBox.value = "";

// 	function saveBooks(books) {
// 		localStorage.setItem("bookList", JSON.stringify(books));
// 	}

// 	function getBooks() {
// 		return JSON.parse(localStorage.getItem("bookList")) || [];
// 	}

// 	if (!localStorage.getItem("bookList")) {
// 		saveBooks(defaultBooks);
// 	}

// 	function renderBooks(books) {
// 		if (books.length === 0) {
// 			timkiem.innerHTML = "Không tìm thấy sách phù hợp";
// 			timkiem.style.display = "block";
// 			bookGrid.innerHTML = "";
// 			return;
// 		}

// 		bookGrid.innerHTML = books
// 			.map(
// 				(book) => `
// 				<div class="book book-card reveal">
// 					<img src="${book.image}">
// 					<div class="book-title">${book.title}</div>
// 				</div>`
// 			)
// 			.join("");

// 		revealOnScroll();
// 		timkiem.innerHTML = "";
// 		timkiem.style.display = "none";
// 	}

// 	function filterBooks() {
// 		const keyword = searchInput.value.toLowerCase();
// 		const genre = searchBox.dataset.genre || "";
// 		const books = getBooks();

// 		const filtered = books.filter((b) => {
// 			const matchTitle = b.title.toLowerCase().includes(keyword);
// 			const matchGenre = genre === "" || b.genre === genre;
// 			return matchTitle && matchGenre;
// 		});

// 		renderBooks(filtered);
// 	}

// 	function showSuggestions() {
// 		suggestionsDiv.innerHTML = "";
// 		options.forEach((option) => {
// 			const item = document.createElement("div");
// 			item.textContent = option;
// 			item.classList.add("suggestion-item");
// 			item.addEventListener("click", () => {
// 				searchBox.value = option;
// 				searchBox.dataset.genre = option === "Tất cả thể loại" ? "" : option;
// 				searchBox.placeholder = "";
// 				suggestionsDiv.classList.remove("show");
// 				filterBooks();
// 			});
// 			suggestionsDiv.appendChild(item);
// 		});
// 		suggestionsDiv.classList.add("show");
// 	}

// 	searchBox.addEventListener("focus", showSuggestions);
// 	searchInput.addEventListener("input", filterBooks);

// 	document.addEventListener("click", (e) => {
// 		if (!suggestionsDiv.contains(e.target) && e.target !== searchBox) {
// 			suggestionsDiv.classList.remove("show");
// 		}
// 	});

// 	function revealOnScroll() {
// 		const cards = document.querySelectorAll(".book-card");
// 		const windowHeight = window.innerHeight;
// 		const rowMap = {};

// 		cards.forEach((card) => {
// 			const top = Math.round(card.getBoundingClientRect().top);
// 			if (!rowMap[top]) rowMap[top] = [];
// 			rowMap[top].push(card);
// 		});

// 		Object.keys(rowMap).forEach((top) => {
// 			const topValue = parseInt(top);
// 			const isInView = topValue < windowHeight - 100 && topValue > 0;

// 			rowMap[top].forEach((card, index) => {
// 				if (isInView) {
// 					setTimeout(() => card.classList.add("visible"), index * 100);
// 				} else {
// 					card.classList.remove("visible");
// 				}
// 			});
// 		});
// 	}

// 	renderBooks(getBooks());
// });
//
//
//
//
//
//
//
//
//
//
//
// Tìm và hiển thị các dòng theo từng hàng
// function revealOnScroll() {
// 	const reveals = document.querySelectorAll(".reveal");
// 	for (let i = 0; i < reveals.length; i++) {
// 		const windowHeight = window.innerHeight;
// 		const revealTop = reveals[i].getBoundingClientRect().top;
// 		const revealPoint = 100;

// 		if (revealTop < windowHeight - revealPoint) {
// 			reveals[i].classList.add("active");
// 		} else {
// 			reveals[i].classList.remove("active");
// 		}
// 	}
// }
// window.addEventListener("scroll", revealOnScroll);
// window.addEventListener("load", revealOnScroll);
//
document.addEventListener("DOMContentLoaded", () => {
	const bookGrid = document.querySelector(".grid");
	const searchInput = document.getElementById("searchInput");
	const searchBox = document.getElementById("searchBox");
	const suggestionsDiv = document.getElementById("suggestions");
	const timkiem = document.getElementById("timkiem");

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

	searchBox.placeholder = "Chọn thể loại...";
	searchBox.value = "";

	const getBooks = () => JSON.parse(localStorage.getItem("bookList")) || [];

	const saveBooks = (books) =>
		localStorage.setItem("bookList", JSON.stringify(books));

	if (!localStorage.getItem("bookList")) {
		saveBooks(defaultBooks);
	}
	//
	// if (!localStorage.getItem("bookList") && window.defaultBooks) {
	// 	saveBooks(window.defaultBooks);
	// }
	//
	// Hiển thị danh sách sách ra lưới
	// function renderBooks(books) {
	// 	if (books.length === 0) {
	// 		timkiem.innerHTML = "Không tìm thấy sách phù hợp";
	// 		timkiem.style.display = "block";
	// 		bookGrid.innerHTML = "";
	// 		return;
	// 	}

	// 	timkiem.innerHTML = "";
	// 	timkiem.style.display = "none";

	// 	bookGrid.innerHTML = books
	// 		.map(
	// 			(book) => `
	// 			<div class="book book-card reveal">
	// 				<img src="${book.image}">
	// 				<div class="book-title">${book.title}</div>
	// 			</div>`
	// 		)
	// 		.join("");

	// 	revealOnScroll();
	// }
	//
	//
	//
	//
	//
	function renderBooks(books) {
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
	//
	//
	//
	//
	//
	// Lọc sách theo tên + thể loại
	function filterBooks() {
		const keyword = searchInput.value.toLowerCase();
		const genre = searchBox.dataset.genre || "";
		const books = getBooks();

		const filtered = books.filter((b) => {
			const matchTitle = b.title.toLowerCase().includes(keyword);
			const matchGenre = genre === "" || b.genre === genre;
			return matchTitle && matchGenre;
		});

		renderBooks(filtered);
	}

	// Hiện gợi ý thể loại
	function showSuggestions() {
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
				filterBooks();
			});

			suggestionsDiv.appendChild(item);
		});
		suggestionsDiv.classList.add("show");
	}

	searchBox.addEventListener("focus", showSuggestions);
	searchInput.addEventListener("input", filterBooks);

	document.addEventListener("click", (e) => {
		if (!suggestionsDiv.contains(e.target) && e.target !== searchBox) {
			suggestionsDiv.classList.remove("show");
		}
	});

	renderBooks(getBooks());

	setTimeout(revealOnScroll, 100);
	setInterval(revealOnScroll, 300);
});
