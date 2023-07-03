import { Link } from "react-router-dom";
import { routes } from "../../routes";

export default function BookingRoomPage() {
	return (
		<div className="bg-light rounded h-100 p-4">
			<div className="mb-4 d-flex justify-content-between align-items-center">
				<h6 className="mb-0">Danh sách đơn đặt phòng</h6>
			</div>
			<div className="table-responsive">
				<table className="table">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">First Name</th>
							<th scope="col">Last Name</th>
							<th scope="col">Email</th>
							<th scope="col">Country</th>
							<th scope="col">Chi tiết</th>
							<th scope="col">Duyệt</th>
							<th scope="col">Xóa/Hủy</th>
						</tr>
					</thead>
					<tbody>
						<tr className="align-middle">
							<th scope="row">1</th>
							<td>John</td>
							<td>Doe</td>
							<td>jhon@email.com</td>
							<td>USA</td>
							<td>
								<Link to={routes.hotel + "/" + "1" + "/room"} className="btn btn-outline-primary">
									Xem
								</Link>
							</td>
							<td>
								<Link to={routes.hotel + "/" + "1" + "/booking"} className="btn btn-outline-primary">
									Duyệt
								</Link>
							</td>
							<td>
								<button className="btn btn-danger">Xóa</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
