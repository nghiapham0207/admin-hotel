import { Link, useParams } from "react-router-dom";
import { routes } from "../../routes";
import { axiosGet, url } from "../../utils/httpRequest";
import { useQuery } from "@tanstack/react-query";

export default function RoomPage() {
	const { hotelId } = useParams();
	const hotelState = useQuery({
		queryKey: ["hotel", hotelId],
		queryFn: async () => {
			try {
				const res = await axiosGet(url.room + hotelId);
				console.log(res);
				return res;
			} catch (error) {
				return Promise.reject(error);
			}
		},
		staleTime: 3 * 60 * 1000,
	});
	let rooms = [];
	if (hotelState.isSuccess) {
		rooms = hotelState.data.hotelDto.rooms;
	}
	return (
		<div className="bg-light rounded h-100 p-4">
			<div className="mb-4 d-flex justify-content-between align-items-center">
				<h6 className="mb-0">Danh sách phòng</h6>
				<Link to={routes.hotel + "/" + hotelId + "/room/create"} className="btn btn-outline-primary">
					Thêm phòng
				</Link>
			</div>
			<div className="table-responsive">
				<table className="table">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Tên Phòng</th>
							<th scope="col">Loại Phòng</th>
							<th scope="col">Giá (VNĐ)</th>
							<th scope="col">Tổng Phòng</th>
							<th scope="col">Chi tiết</th>
							<th scope="col">Xóa/Hủy</th>
						</tr>
					</thead>
					<tbody>
						{rooms.length > 0
							? rooms.map((room, index) => (
									<tr key={room.id} className="align-middle">
										<th scope="row">{index + 1}</th>
										<td>{room.name}</td>
										<td>{room.typeOfBed}</td>
										<td>{new Intl.NumberFormat().format(room.price)}</td>
										<td>{room.totalRoom}</td>
										<td>
											<Link to={routes.hotel + "/" + hotelId + "/room/" + room.id} className="btn btn-outline-primary">
												Xem
											</Link>
										</td>
										<td>
											<button className="btn btn-danger">Xóa</button>
										</td>
									</tr>
							  ))
							: null}
					</tbody>
				</table>
			</div>
		</div>
	);
}
