import { useDispatch, useSelector } from "react-redux";
import reactLogo from "../../assets/react.svg";
import { logout } from "../../services/userServices";
import { selectUser } from "../../redux/selectors";

export default function Header() {
	const currentUser = useSelector(selectUser);
	const dispatch = useDispatch();
	const handleLogout = (e) => {
		e.preventDefault();
		logout(dispatch);
	};
	return (
		<>
			{/* Navbar Start */}
			<nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0">
				<a href="index.html" className="navbar-brand d-flex d-lg-none me-4">
					<h2 className="text-primary mb-0">
						<i className="fa fa-hashtag" />
					</h2>
				</a>
				<a
					href="#"
					onClick={(e) => {
						e.preventDefault();
						$(".sidebar, .content").toggleClass("open");
						return false;
					}}
					className="sidebar-toggler flex-shrink-0">
					<i className="fa fa-bars" />
				</a>
				<form className="d-none d-md-flex ms-4">
					<input className="form-control border-0" type="search" placeholder="Search" />
				</form>
				<div className="navbar-nav align-items-center ms-auto">
					<div className="nav-item dropdown">
						<a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
							<i className="fa fa-envelope me-lg-2" />
							<span className="d-none d-lg-inline-flex">Message</span>
						</a>
						<div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
							<a href="#" className="dropdown-item">
								<div className="d-flex align-items-center">
									<img className="rounded-circle" src={reactLogo} alt="" style={{ width: 40, height: 40 }} />
									<div className="ms-2">
										<h6 className="fw-normal mb-0">Jhon send you a message</h6>
										<small>15 minutes ago</small>
									</div>
								</div>
							</a>
							<hr className="dropdown-divider" />
							<a href="#" className="dropdown-item">
								<div className="d-flex align-items-center">
									<img className="rounded-circle" src={reactLogo} alt="" style={{ width: 40, height: 40 }} />
									<div className="ms-2">
										<h6 className="fw-normal mb-0">Jhon send you a message</h6>
										<small>15 minutes ago</small>
									</div>
								</div>
							</a>
							<hr className="dropdown-divider" />
							<a href="#" className="dropdown-item">
								<div className="d-flex align-items-center">
									<img className="rounded-circle" src={reactLogo} alt="" style={{ width: 40, height: 40 }} />
									<div className="ms-2">
										<h6 className="fw-normal mb-0">Jhon send you a message</h6>
										<small>15 minutes ago</small>
									</div>
								</div>
							</a>
							<hr className="dropdown-divider" />
							<a href="#" className="dropdown-item text-center">
								See all message
							</a>
						</div>
					</div>
					<div className="nav-item dropdown">
						<a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
							<i className="fa fa-bell me-lg-2" />
							<span className="d-none d-lg-inline-flex">Notificatin</span>
						</a>
						<div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
							<a href="#" className="dropdown-item">
								<h6 className="fw-normal mb-0">Profile updated</h6>
								<small>15 minutes ago</small>
							</a>
							<hr className="dropdown-divider" />
							<a href="#" className="dropdown-item">
								<h6 className="fw-normal mb-0">New user added</h6>
								<small>15 minutes ago</small>
							</a>
							<hr className="dropdown-divider" />
							<a href="#" className="dropdown-item">
								<h6 className="fw-normal mb-0">Password changed</h6>
								<small>15 minutes ago</small>
							</a>
							<hr className="dropdown-divider" />
							<a href="#" className="dropdown-item text-center">
								See all notifications
							</a>
						</div>
					</div>
					<div className="nav-item dropdown">
						<a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
							<img
								className="rounded-circle me-lg-2"
								src={currentUser.avatar || reactLogo}
								alt=""
								style={{ width: 40, height: 40 }}
								onError={(e) => {
									e.target.src = reactLogo;
								}}
							/>
							<span className="d-none d-lg-inline-flex">{currentUser.firstName + " " + currentUser.lastName}</span>
						</a>
						<div className="dropdown-menu dropdown-menu-end bg-white border rounded m-0">
							<a href="#" className="dropdown-item">
								Cài đặt
							</a>
							<a onClick={handleLogout} href="#" className="dropdown-item">
								Đăng xuất
							</a>
						</div>
					</div>
				</div>
			</nav>
			{/* Navbar End */}
		</>
	);
}
