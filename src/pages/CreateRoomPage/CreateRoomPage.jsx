import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosJWT, url } from "../../utils/httpRequest";
import { useDispatch, useSelector } from "react-redux";
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

export default function CreateRoomPage() {
	const { hotelId } = useParams();

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

	const handlePost = async (e) => {
		e.preventDefault();
		const axiosJwt = axiosJWT(accessToken, refreshToken, dispatch);
		const toastId = toast.loading("Đang xử lý!");
		try {
			const today = new Date();
			console.log({
				Id: 0,
				Name: nameRef.current.value,
				NumOfPeope: guestRef.current.value,
				NumOfBed: numOfBedRef.current.value,
				TypeOfBed: typeRef.current.value,
				Description: descriptionRef.current.value,
				Price: priceRef.current.value,
				TotalRoom: totalRef.current.value,
				Refund: refundRef.current.checked,
				Reschedule: rescheduleRef.current.checked,
				CreatedDate: today.toISOString(),
				UpdateDate: today.toISOString(),
				HotelId: hotelId,
				Images: [img1Ref.current, img2Ref.current, img3Ref.current],
			});
			const res = await axiosJwt.post(
				url.createRoom,
				{
					Id: 0,
					Name: nameRef.current.value,
					NumOfPeope: guestRef.current.value,
					NumOfBed: numOfBedRef.current.value,
					TypeOfBed: typeRef.current.value,
					Description: descriptionRef.current.value,
					Price: priceRef.current.value,
					TotalRoom: totalRef.current.value,
					Refund: refundRef.current.checked,
					Reschedule: rescheduleRef.current.checked,
					CreatedDate: today.toISOString(),
					UpdateDate: today.toISOString(),
					HotelId: hotelId,
					Images: [img1Ref.current, img2Ref.current, img3Ref.current],
				},
				{
					headers: {
						Authorization: "Bearer " + accessToken,
						"Content-Type": "multipart/form-data",
					},
				},
			);
			console.log(res);
			if (res.data.success) {
				e.target.reset();
				toast.update(toastId, {
					render: res.data.message,
					type: "success",
					closeButton: true,
					autoClose: 1000,
					isLoading: false,
				});
			}
		} catch (error) {
			console.log(error);
			toast.update(toastId, {
				render: "Không thể tạo!",
				type: "error",
				closeButton: true,
				autoClose: 1000,
				isLoading: false,
			});
		}
	};
	return (
		<div className="bg-light rounded h-100 p-5">
			<h6 className="mb-4">Thêm phòng</h6>
			<form onSubmit={handlePost}>
				<div className="row mb-3">
					<label htmlFor="" className="col-sm-3 col-form-label">
						Tên phòng
					</label>
					<div className="col-sm-9">
						<input ref={nameRef} placeholder="" type="text" required className="form-control" />
					</div>
				</div>
				<div className="row mb-3">
					<label htmlFor="" className="col-sm-3 col-form-label">
						Số khách 1 phòng
					</label>
					<div className="col-sm-9">
						<input
							ref={guestRef}
							placeholder=""
							type="number"
							min={0}
							defaultValue={1}
							required
							className="form-control"
						/>
					</div>
				</div>
				<div className="row mb-3">
					<label htmlFor="" className="col-sm-3 col-form-label">
						Số giường
					</label>
					<div className="col-sm-9">
						<input
							ref={numOfBedRef}
							placeholder=""
							type="number"
							min={0}
							defaultValue={1}
							required
							className="form-control"
						/>
					</div>
				</div>
				<div className="row mb-3">
					<label htmlFor="" className="col-sm-3 col-form-label">
						Loại giường
					</label>
					<div className="col-sm-9">
						<select ref={typeRef} className="form-select" aria-label="Default select example">
							{typeOfBed.map((value) => (
								<option key={value.id} defaultChecked={value.id === 1 ? true : false} value={value.name}>
									{value.name}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className="row mb-3">
					<label htmlFor="" className="col-sm-3 col-form-label">
						Mô tả
					</label>
					<div className="col-sm-9">
						<input ref={descriptionRef} placeholder="" type="text" required className="form-control" />
					</div>
				</div>
				<div className="row mb-3">
					<label htmlFor="" className="col-sm-3 col-form-label">
						Giá phòng
					</label>
					<div className="col-sm-9">
						<input ref={priceRef} placeholder="" type="number" required className="form-control" />
					</div>
				</div>
				<div className="row mb-3">
					<label htmlFor="" className="col-sm-3 col-form-label">
						Số phòng
					</label>
					<div className="col-sm-9">
						<input ref={totalRef} placeholder="" type="number" required className="form-control" />
					</div>
				</div>
				<div className="row mb-3">
					<legend className="col-form-label col-sm-3 pt-0">Hoàn tiền</legend>
					<div className="col-sm-9">
						<div className="form-check">
							<input ref={refundRef} className="form-check-input" type="checkbox" id="refundRef" />
							<label className="form-check-label" htmlFor="refundRef">
								Được phép
							</label>
						</div>
					</div>
				</div>
				<div className="row mb-3">
					<legend className="col-form-label col-sm-3 pt-0">Đổi lịch</legend>
					<div className="col-sm-9">
						<div className="form-check">
							<input ref={rescheduleRef} className="form-check-input" type="checkbox" id="rescheduleRef" />
							<label className="form-check-label" htmlFor="rescheduleRef">
								Được phép
							</label>
						</div>
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
							Thêm mới
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
