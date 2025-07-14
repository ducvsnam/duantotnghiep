document.addEventListener("DOMContentLoaded", () => {
	const bookGrid = document.querySelector(".grid");
	const searchInput = document.getElementById("searchInput");
	const searchBox = document.getElementById("searchBox");
	const suggestionsDiv = document.getElementById("suggestions");
	const timkiem = document.getElementById("timkiem");

	const options = [
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

	function saveBooks(books) {
		localStorage.setItem("bookList", JSON.stringify(books));
	}

	function getBooks() {
		return JSON.parse(localStorage.getItem("bookList")) || [];
	}

	if (!localStorage.getItem("bookList")) {
		saveBooks(defaultBooks);
	}

	function renderBooks(books) {
		if (books.length === 0) {
			timkiem.innerHTML = "Không tìm thấy sách phù hợp";
			timkiem.style.display = "block";
			bookGrid.innerHTML = "";
			return;
		}

		bookGrid.innerHTML = books
			.map(
				(book) => `
				<div class="book book-card reveal">
					<img src="${book.image}">
					<div class="book-title">${book.title}</div>
				</div>`
			)
			.join("");

		revealRowsByLine();
		timkiem.innerHTML = "";
		timkiem.style.display = "none";
	}

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

	function showSuggestions() {
		suggestionsDiv.innerHTML = "";
		options.forEach((option) => {
			const item = document.createElement("div");
			item.textContent = option;
			item.classList.add("suggestion-item");
			item.addEventListener("click", () => {
				searchBox.value = option;
				searchBox.dataset.genre = option === "Tất cả thể loại" ? "" : option;
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

	function revealRowsByLine() {
		const cards = document.querySelectorAll(".book-card");
		const windowHeight = window.innerHeight;
		const rowMap = {};

		cards.forEach((card) => {
			const top = Math.round(card.getBoundingClientRect().top);
			if (!rowMap[top]) rowMap[top] = [];
			rowMap[top].push(card);
		});

		Object.keys(rowMap).forEach((top) => {
			const topValue = parseInt(top);
			const isInView = topValue < windowHeight - 100 && topValue > 0;

			rowMap[top].forEach((card, index) => {
				if (isInView) {
					setTimeout(() => card.classList.add("visible"), index * 100);
				} else {
					card.classList.remove("visible");
				}
			});
		});
	}

	renderBooks(getBooks());
});
