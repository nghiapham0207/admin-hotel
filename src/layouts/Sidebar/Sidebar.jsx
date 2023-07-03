import { Link } from "react-router-dom";
import reactLogo from "../../assets/react.svg";
import { routes } from "../../routes";

export default function Sidebar() {
	return (
		<>
			{/* Sidebar Start */}
			<div className="sidebar pe-4 pb-3 bg-light">
				<nav className="navbar bg-light navbar-light">
					<a href={routes.hotel} className="navbar-brand mx-4 mb-3">
						<h3 className="text-primary">Trang chủ</h3>
					</a>
					<div className="d-flex align-items-center ms-4 mb-4">
						<div className="position-relative">
							<img className="rounded-circle" src={reactLogo} alt="" style={{ width: 40, height: 40 }} />
							<div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1" />
						</div>
						<div className="ms-3">
							<h6 className="mb-0">Jhon Doe</h6>
							<span>Admin</span>
						</div>
					</div>
					<div className="navbar-nav w-100">
						<Link to={routes.hotel} className="nav-item nav-link active">
							<i className="fa-solid fa-house"></i> Khách sạn
						</Link>
					</div>
				</nav>
			</div>
			{/* Sidebar End */}
		</>
	);
}
