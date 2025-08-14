document.addEventListener("DOMContentLoaded", function () {
	const btn = document.querySelector(".nut-danhgia");
	const commentInput = document.getElementById("registerComment");

	if (!window.currentUser) {
		window.currentUser = JSON.parse(localStorage.getItem("currentUser"));
	}

	const danhGiaList = JSON.parse(localStorage.getItem("danhGiaList")) || [];

	const daDanhGia = danhGiaList.some((dg) => dg.email === currentUser?.email);

	const nutWrapper = document.querySelector(".nut");

	if (daDanhGia) {
		if (nutWrapper) nutWrapper.style.display = "none";

		const khung = document.getElementById("khungDanhGia");
		if (khung) {
			khung.innerHTML = `
				<div class="khung-camon">
					<h2>Cảm ơn bạn đã gửi đánh giá</h2>
					<p>Chúng tôi rất trân trọng phản hồi của bạn</p>
					<button class="nut-camon" data-href="../xemdanhgianguoidung/xemdanhgianguoidung.html">
						Xem đánh giá của bạn
					</button>
				</div>
			`;

			const nutCamOn = khung.querySelector(".nut-camon");
			if (nutCamOn) {
				nutCamOn.addEventListener("click", function (e) {
					e.preventDefault();
					const href = this.getAttribute("data-href");
					if (href) {
						document.body.classList.remove("fade-in");
						document.body.classList.add("fade-out");

						setTimeout(() => {
							window.location.href = href;
						}, 800);
					}
				});
			}
		}
		return;
	}

	btn.addEventListener("click", function () {
		const selectedStar = document.querySelector('input[name="star"]:checked');
		if (!selectedStar) {
			showPopup("Vui lòng chọn số sao để đánh giá");
			return;
		}

		const rating = selectedStar.value;
		const comment = commentInput.value.trim();
		// const avatar =
		// 	localStorage.getItem("avatarNguoiDung") || "../anh/theme/noava.jpg";
		//
		const userID = currentUser?.userID || localStorage.getItem("userID");
		const avatarKey = userID ? `avatarNguoiDung_${userID}` : "avatarNguoiDung";
		const avatar = localStorage.getItem(avatarKey) || "../anh/theme/noava.jpg";
		//
		const newReview = {
			name: currentUser?.username || "Ẩn danh",
			email: currentUser?.email || "Không rõ",
			image: avatar,
			rating: rating,
			comment: comment,
		};

		danhGiaList.push(newReview);
		localStorage.setItem("danhGiaList", JSON.stringify(danhGiaList));

		showPopup("Đánh giá đã được gửi");
		selectedStar.checked = false;
		commentInput.value = "";

		if (nutWrapper) nutWrapper.style.display = "none";

		const khung = document.getElementById("khungDanhGia");
		if (khung) {
			setTimeout(() => {
				khung.innerHTML = `
					<div class="khung-camon">
						<h2>Cảm ơn bạn đã gửi đánh giá</h2>
						<p>Chúng tôi rất trân trọng phản hồi của bạn</p>
						<button class="nut-camon" data-href="../xemdanhgianguoidung/xemdanhgianguoidung.html">
							Xem đánh giá của bạn
						</button>
					</div>
				`;

				const nutCamOn = khung.querySelector(".nut-camon");
				if (nutCamOn) {
					nutCamOn.addEventListener("click", function (e) {
						e.preventDefault();
						const href = this.getAttribute("data-href");
						if (href) {
							document.body.classList.remove("fade-in");
							document.body.classList.add("fade-out");

							setTimeout(() => {
								window.location.href = href;
							}, 800);
						}
					});
				}
			}, 1000);
		}
	});
});
