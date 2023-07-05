import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import HorizontalInput from "../../components/HorizontalInput";
import HorizontalSelect from "../../components/HorizontalSelect";
import Checkbox from "../../components/Checkbox";
import { axiosGet, axiosJWT, url } from "../../utils/httpRequest";
import { selectAccessToken, selectRefreshToken } from "../../redux/selectors";

const typeOfBed = [
	{
		id: 1,
		name: "Giường đôi",
	},
	{
		id: 2,
		name: "Giường đơn",
	},
];

export default function UpdateRoomPage() {
	const { roomId } = useParams();

	const nameRef = useRef();
	const guestRef = useRef();
	const numOfBedRef = useRef();
	const typeRef = useRef();
	const descriptionRef = useRef();
	const priceRef = useRef();
	const totalRef = useRef();
	const refundRef = useRef();
	const rescheduleRef = useRef();
	const img1Ref = useRef();
	const img2Ref = useRef();
	const img3Ref = useRef();

	const accessToken = useSelector(selectAccessToken);
	const refreshToken = useSelector(selectRefreshToken);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const roomState = useQuery({
		queryKey: ["room", roomId],
		queryFn: async () => {
			try {
				const res = await axiosGet(url.detailRoom + roomId);
				return res;
			} catch (error) {
				return Promise.reject(error);
			}
		},
		staleTime: 3 * 60 * 1000,
	});
	let room = {};
	if (roomState.isSuccess && roomState.data.success) {
		room = roomState.data.roomDetailDto;
	} else {
		return null;
	}
	const handleUpdate = async (e) => {
		e.preventDefault();
		const axiosJwt = axiosJWT(accessToken, refreshToken, dispatch);
		const toastId = toast.loading("Đang xử lý!");
		const formData = new FormData();
		const today = new Date();
		formData.append("id", roomId);
		formData.append("name", nameRef.current.value);
		formData.append("numOfPeope", guestRef.current.value);
		formData.append("numOfBed", numOfBedRef.current.value);
		formData.append("typeOfBed", typeRef.current.value);
		formData.append("description", descriptionRef.current.value);
		formData.append("price", priceRef.current.value);
		formData.append("totalRoom", totalRef.current.value);
		formData.append("refund", refundRef.current.checked);
		formData.append("reschedule", rescheduleRef.current.checked);
		const bodyData = {
			id: roomId,
			name: nameRef.current.value,
			numOfPeope: guestRef.current.value,
			numOfBed: numOfBedRef.current.value,
			typeOfBed: typeRef.current.value,
			description: descriptionRef.current.value,
			price: priceRef.current.value,
			totalRoom: totalRef.current.value,
			refund: refundRef.current.checked,
			reschedule: rescheduleRef.current.checked,
		};
		// formData.append("CreatedDate", today.toISOString());
		// formData.append("UpdateDate", today.toISOString());
		// formData.append("HotelId", hotelId);
		// formData.append("Images", img1Ref.current);
		// formData.append("Images", img2Ref.current);
		// formData.append("Images", img3Ref.current);
		try {
			const res = await axiosJwt.put(url.updateRoom, bodyData, {
				headers: {
					Authorization: "Bearer " + accessToken,
				},
			});
			if (res.data.success) {
				roomState.refetch();
				toast.update(toastId, {
					render: "Cập nhật thông công!",
					type: "success",
					closeButton: true,
					autoClose: 1000,
					isLoading: false,
				});
			}
		} catch (error) {
			console.log(error);
			toast.update(toastId, {
				render: "Không cập nhật!",
				type: "error",
				closeButton: true,
				autoClose: 1000,
				isLoading: false,
			});
		}
	};
	return (
		<div className="bg-light rounded h-100 p-5">
			<h4 className="mb-4">Cập nhật thông tin phòng</h4>
			<form onSubmit={handleUpdate}>
				<HorizontalInput ref={nameRef} label={"Tên phòng"} defaultValue={room.name} required={true} />
				<HorizontalInput
					ref={guestRef}
					type="number"
					min={0}
					label={"Số khách 1 phòng"}
					defaultValue={room.numOfPeope}
					required={true}
				/>
				<HorizontalInput
					ref={numOfBedRef}
					type="number"
					min={0}
					label={"Số giường"}
					defaultValue={room.numOfBed}
					required={true}
				/>
				<HorizontalSelect label={"Loại giường"} ref={typeRef} defaultValue={room.name}>
					{typeOfBed.map((value) => (
						<option key={value.id} defaultChecked={value.id === 1 ? true : false} value={value.name}>
							{value.name}
						</option>
					))}
				</HorizontalSelect>
				<HorizontalInput ref={descriptionRef} label={"Mô tả"} defaultValue={room.description} required={true} />
				<HorizontalInput
					ref={priceRef}
					type="number"
					min={0}
					label={"Giá phòng"}
					defaultValue={room.price}
					required={true}
				/>
				<HorizontalInput
					ref={totalRef}
					type="number"
					min={0}
					label={"Số phòng"}
					defaultValue={room.totalRoom}
					required={true}
				/>
				<div className="row mb-3">
					<legend className="col-form-label col-sm-3 pt-0">Hoàn tiền</legend>
					<div className="col-sm-9">
						<Checkbox label={"Được phép"} ref={refundRef} defaultChecked={room.refund} />
					</div>
				</div>
				<div className="row mb-3">
					<legend className="col-form-label col-sm-3 pt-0">Đổi lịch</legend>
					<div className="col-sm-9">
						<Checkbox label={"Được phép"} ref={rescheduleRef} defaultChecked={room.reschedule} />
					</div>
				</div>
				<div className="row mb-3">
					<label htmlFor="" className="col-sm-3 col-form-label">
						Hình ảnh
					</label>
					<div className="col-sm-9">
						<input
							required
							onChange={(e) => {
								img1Ref.current = e.target.files[0];
							}}
							placeholder=""
							className="form-control"
							type="file"
							id="formFile"
							accept="image/*"
						/>
					</div>
				</div>
				<div className="row mb-3">
					<label htmlFor="" className="col-sm-3 col-form-label">
						Hình ảnh
					</label>
					<div className="col-sm-9">
						<input
							required
							onChange={(e) => {
								img2Ref.current = e.target.files[0];
							}}
							placeholder=""
							className="form-control"
							type="file"
							id="formFile"
							accept="image/*"
						/>
					</div>
				</div>
				<div className="row mb-3">
					<label htmlFor="" className="col-sm-3 col-form-label">
						Hình ảnh
					</label>
					<div className="col-sm-9">
						<input
							required
							onChange={(e) => {
								img3Ref.current = e.target.files[0];
							}}
							placeholder=""
							className="form-control"
							type="file"
							id="formFile"
							accept="image/*"
						/>
					</div>
				</div>
				<div className="row mb-3">
					<label htmlFor="" className="col-sm-3 col-form-label"></label>
					<div className="col-sm-9">
						<button type="submit" className="btn btn-primary">
							Cập nhật
						</button>
						<button
							type="button"
							onClick={() => {
								navigate(-1);
							}}
							className="ms-3 btn btn-danger">
							Hủy
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
