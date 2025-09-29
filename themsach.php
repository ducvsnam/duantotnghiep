<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Cats Stack | Quản lý | Quản lý</title>
		<link rel="icon" href="anh/theme/logo.png" />
		<link rel="stylesheet" href="chung/chung.css" />
		<link rel="stylesheet" href="themsach/themsach.css" />
	</head>
	<body>
		<header>
			<div class="container">
				<div class="logo">
					<a href="quanly/quanly.html">
						<img src="anh/theme/logo.png" class="logo-img" />
						<h1>Cats Stack</h1>
					</a>
				</div>
				<nav>
					<ul class="menu">
						<li><a href="themsach/themsach.html" class="active">Sách</a></li>
						<li><a href="themsach/themsach.html">Danh mục</a></li>
						<li><a href="themsach/themsach.html">Nhân viên</a></li>
						<li><a href="themsach/themsach.html">Sinh viên</a></li>
						<li><a href="themsach/themsach.html">Giáo viên</a></li>
						<li><a href="quanlymuon/quanlymuon.html">Phiếu mượn</a></li>
					</ul>
				</nav>
				<div class="avatar">
					<a href="thongtinquanly/thongtinquanly.html">
						<img src="anh/theme/anhboss.png" class="ava-img-admin" />
					</a>
				</div>
			</div>
		</header>

		<div class="reveal">
		<div id="khung">
			<div class="upload-section">
			<label
				for="excelUpload"
				class="image-frame"
				style="cursor: pointer; position: relative; display: inline-block"
			>
				<svg id="uploadIcon" xmlns="http://www.w3.org/2000/svg" 
					viewBox="0 0 24 24" width="100" height="100" fill="#4CAF50">
				<path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.67v4h6V9h3.67L12 2z"/>
				</svg>

				<img
				id="excelIcon"
				src="anh/theme/excel_icon3.png"
				alt="Excel file"
				style="width: 100px; height: auto; display: none;"
				/>
			</label>

			<input
				type="file"
				id="excelUpload"
				accept=".xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
				style="display: none"
			/>
			</div>

			<div id="uploadText">
			<span>Bấm vào biểu tượng để tải lên file Excel</span>
			</div>
		</div>
		</div>

		<div id="suggestionsinfo"></div>

		<div class="reveal">
			<button id="saveBtn">Xác nhận thêm sách</button>
		</div>

		<div class="reveal">
			<div class="filter">
				<div class="input-wrapper">
					<input
						type="text"
						id="searchInput"
						placeholder="Tìm kiếm theo tên sách..."
						maxlength="83"
						autocomplete="off"
					/>
					<input type="text" id="searchBox" readonly />
				</div>
			</div>
		</div>

		<div id="suggestionssearch" class="suggestion-box"></div>

		<div class="reveal">
			<p id="timkiem"></p>
		</div>

		<div class="reveal">
			<div id="result"></div>
		</div>

		<footer>
			<div class="container">
				<div class="footer-bottom">
					<p>© 2025 Cats Stack</p>
				</div>
			</div>
		</footer>

		<button onclick="window.scrollTo({top: 0, behavior: 'smooth'})" class="up">
			<span>⬆</span>
		</button>

		<button
			onclick="window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})"
			class="down"
		>
			<span>⬇</span>
		</button>

		<div id="overlay" class="overlay">
			<div class="popup">
				<p id="message"></p>
				<div id="popup-buttons">
					<button id="popup-close-btn">Đóng</button>
					<button id="confirm-yes-btn">Đồng ý</button>
					<button id="confirm-no-btn">Thoát</button>
				</div>
			</div>
		</div>

		<script src="chung/chung.js"></script>
		<script src="themsach/themsach.js"></script>
	</body>
</html>

<?php
// require 'vendor/autoload.php';
require __DIR__ . '/../vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\IOFactory;

include 'db.php';

if (isset($_POST['submit'])) {
    $file = $_FILES['excelFile']['tmp_name'];

    if ($file) {
        $spreadsheet = IOFactory::load($file);
        $worksheet = $spreadsheet->getActiveSheet();
        $rows = $worksheet->toArray(null, true, true, true);

        foreach ($rows as $index => $row) {
            if ($index == 1) continue;

            $TenSach = $row['A'];
            $TacGia = $row['B'];
            $TomTat = $row['C'];
            $TenDanhMuc = $row['D'];
            $NhaXuatBan = $row['E'];
            $SoLuong = $row['F'];
            $TienDatCoc = $row['G'];
            $GiaSach = $row['H'];

            // 1. Insert or get DanhMuc
            $stmt = $conn->prepare("SELECT MaDanhMuc FROM DanhMuc WHERE TenDanhMuc = ?");
            $stmt->execute([$TenDanhMuc]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result) {
                $MaDanhMuc = $result['MaDanhMuc'];
            } else {
                $stmt = $conn->prepare("INSERT INTO DanhMuc (TenDanhMuc) VALUES (?)");
                $stmt->execute([$TenDanhMuc]);
                $MaDanhMuc = $conn->lastInsertId();
            }

            // 2. Insert Sach
            $stmt = $conn->prepare("INSERT INTO Sach (TenSach, TacGia, TomTat, MaDanhMuc) VALUES (?, ?, ?, ?)");
            $stmt->execute([$TenSach, $TacGia, $TomTat, $MaDanhMuc]);
            $MaSach = $conn->lastInsertId();

            // 3. Insert SachChiTiet (default MaTrangThai = 1)
            $stmt = $conn->prepare("INSERT INTO SachChiTiet (MaTrangThai, MaSach, NhaXuatBan, SoLuong, TienDatCoc, GiaSach) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([1, $MaSach, $NhaXuatBan, $SoLuong, $TienDatCoc, $GiaSach]);
        }

        echo "✅ Import thành công!";
    } else {
        echo "❌ Không tìm thấy file.";
    }
}
?>