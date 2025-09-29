<?php
session_start();
require "db.php";

$errorMsg = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $ten = $_POST["ten"] ?? "";
    $password = $_POST["password"] ?? "";

    $sql = "SELECT MaQuanLy, TenQuanLy, TrangThai, MatKhau 
            FROM Admin 
            WHERE TenQuanLy = :ten";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":ten", $ten);
    $stmt->execute();
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($admin) {
        if ($password === $admin["MatKhau"]) {
            $_SESSION["user"] = [
                "id" => $admin["MaQuanLy"],
                "name" => $admin["TenQuanLy"],
                "role" => "quanly"
            ];
            // header("Location: ../quanlymuon/quanlymuon.html");
			header("Location: http://localhost/Library/duantotnghiep/quanlymuon/quanlymuon.html");
            exit();
        } else {
            $errorMsg = "Sai mật khẩu quản lý";
        }
    } else {
        $sql = "SELECT MaNhanVien, TenNhanVien, TrangThai, MatKhau 
                FROM NhanVien 
                WHERE TenNhanVien = :ten";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":ten", $ten);
        $stmt->execute();
        $nv = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($nv) {
            if ($password === $nv["MatKhau"]) {
                $_SESSION["user"] = [
                    "id" => $nv["MaNhanVien"],
                    "name" => $nv["TenNhanVien"],
                    "role" => "nhanvien"
                ];
                // header("Location: ../nhanvien/nhanvien.html");
                header("Location: /nhanvien.html");
                exit();
            } else {
                $errorMsg = "Sai mật khẩu nhân viên";
            }
        } else {
            $errorMsg = "Không tìm thấy tài khoản";
        }
    }
}

if (!empty($errorMsg)) {
    echo "<script>showPopup('" . addslashes($errorMsg) . "');</script>";
}
?>



<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Cats Stack | Đăng Nhập</title>
		<link rel="icon" href="anh/theme/logo.png" />

		<link rel="stylesheet" href="chung/chung.css" />
		<link rel="stylesheet" href="dangnhap/dangnhap.css" />
		<style>
			.menu {
				margin-left: 500px;
			}

			#loginForm {
				background: #4509ae;
				box-shadow: 4px 4px 0 black;
				border: 2px solid black;
				border-radius: 5px;
				padding: 30px;
				width: 350px;
				margin-top: 150px;
			}

			label {
				font-size: 20px;
				font-weight: bold;
				color: white;
				text-shadow: 1px 1px 0 black;
				margin-left: 5px;
			}

			input {
				width: 100%;
				margin-bottom: 20px;
				margin-top: 10px;
			}

			#mainActionBtn {
				padding: 10px 20px;
				background: white;
				color: #4509ae;
				text-shadow: 1px 1px 0 black;
				box-shadow: 4px 4px 0 black;
				border: 2px solid black;
				border-radius: 5px;
				cursor: pointer;
				transition: 0.1s;
				font-size: 20px;
				font-weight: bold;
				margin-top: 10px;
				margin-bottom: 10px;
				margin-left: 100px;
			}

			#mainActionBtn:hover {
				font-size: 23px;
				transform: scale(1.1);
			}

			#mainActionBtn:active {
				transform: scale(1.1) translate(3px, 3px);
				box-shadow: 0 0 black;
			}

			.flip-card__inner {
				width: 350px;
				height: 220px;
				position: relative;
				transition: 1s;
				transform-style: preserve-3d;
				margin-right: 55px;
			}

			.flip-card__inner.expanded-height {
				height: 335px;
			}

			footer {
				margin-top: 375px;
			}
		</style>
	</head>
	<body>
		<header>
			<div class="container">
				<div class="logo">
					<a href="chinh/chinh.html">
						<img src="anh/theme/logo.png" class="logo-img" />
						<h1>Cats Stack</h1>
					</a>
				</div>
			</div>
		</header>

		<div class="reveal">
			<div class="flip-card__inner" id="flipCard">
				<div class="card-face card-front">
					<div id="loginForm">
						<form class="form" method="POST" action="dangnhap.php">
							<div class="input-container">
								<label>Tên đăng nhập</label>
								<input
									type="text"
									name="ten"
									id="loginUsername"
									placeholder="Nhập tên đăng nhập..."
									maxlength="40"
									autocomplete="off"
								/>
								<label>Mật khẩu</label>
								<input
									type="password"
									name="password"
									id="loginPassword"
									placeholder="Nhập mật khẩu..."
									maxlength="37"
								/>
								<div class="eye-toggle">
									<svg
										class="eye"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										stroke="black"
										viewBox="0 0 24 24"
										width="24"
										height="24"
									>
										<path
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
										<path
											d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
									<svg
										class="eye-slash"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										stroke="black"
										viewBox="0 0 24 24"
										width="24"
										height="24"
									>
										<path
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
										<path
											d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
										<path
											d="M4 4l16 16"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</div>
							</div>
							<button id="mainActionBtn" type="submit">Đăng nhập</button>
						</form>
					</div>
				</div>
			</div>
			<!-- <button id="mainActionBtn" type="submit">Đăng nhập</button> -->
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
		<script src="dangnhap/dangnhap.js"></script>

		<?php if (!empty($errorMsg)): ?>
			<script>
				document.addEventListener("DOMContentLoaded", function() {
					showPopup("<?= addslashes($errorMsg) ?>");
				});
			</script>
		<?php endif; ?>

	</body>
</html>
