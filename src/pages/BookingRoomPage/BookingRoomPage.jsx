import { Link } from "react-router-dom";
import { routes } from "../../routes";
import { useDispatch, useSelector } from "react-redux";
import { selectAccessToken, selectRefreshToken, selectUser } from "../../redux/selectors";
import { axiosJWT, url } from "../../utils/httpRequest";
import { useQuery } from "@tanstack/react-query";

export default function BookingRoomPage() {
	const currentUser = useSelector(selectUser);
	const accessToken = useSelector(selectAccessToken);
	const refreshToken = useSelector(selectRefreshToken);
	const dispatch = useDispatch();
	const listHotelState = useQuery({
		queryKey: ["bookingList", currentUser],
		queryFn: async () => {
			const axiosJwt = axiosJWT(accessToken, refreshToken, dispatch);
			try {
				const res = await axiosJwt.get(url.hotel, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				return res;
			} catch (error) {
				console.log(error);
				return Promise.reject(error);
			}
		},
		staleTime: 3 * 60 * 1000,
	});
	let listHotel = [];
	if (listHotelState.isSuccess && listHotelState.data.data.success) {
		listHotel = listHotelState.data.data.hotels;
	}
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
