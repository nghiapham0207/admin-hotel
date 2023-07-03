import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { axiosGet, axiosJWT, url } from "../../utils/httpRequest";
import { useDispatch, useSelector } from "react-redux";
import { selectAccessToken, selectRefreshToken, selectUser } from "../../redux/selectors";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const categories = [
	{ id: 1, name: "Hotel", hotels: null },
	{ id: 2, name: "Motel", hotels: null },
	{ id: 3, name: "HomeStay", hotels: null },
	{ id: 4, name: "Resort", hotels: null },
];

export default function CreateHotelPage() {
	const nameRef = useRef();
	const descriptionRef = useRef();
	const addressRef = useRef();
	const avatarRef = useRef();
	const slugRef = useRef();
	const categoryRef = useRef();
	const provinceRef = useRef();
	const districtRef = useRef();
	const homeletRef = useRef();
	const restaurantRef = useRef();
	const _24hRef = useRef();
	const elevatorRef = useRef();
	const poolRef = useRef();
	const freeBreakfastRef = useRef();
	const airConditionerRef = useRef();
	const lendingCarRef = useRef();
	const wifiFreeRef = useRef();
	const parkingRef = useRef();
	const allowPetRef = useRef();

	const accessToken = useSelector(selectAccessToken);
	const refreshToken = useSelector(selectRefreshToken);
	const currentUser = useSelector(selectUser);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [getDistrict, setGetDistrict] = useState(false);
	const [getHomelet, setGetHomelet] = useState(false);

	const hotelProvince = useQuery({
		queryKey: ["hotelProvince"],
		queryFn: async () => {
			try {
				const res = await axiosGet(url.province);
				return res;
			} catch (error) {
				return Promise.reject(error);
			}
		},
		staleTime: 3 * 60 * 1000,
		// refetchOnWindowFocus: false,
	});
	const hotelDistrict = useQuery({
		queryKey: ["hotelDistrict"],
		queryFn: async () => {
			try {
				const res = await axiosGet(url.district + provinceRef.current.value);
				return res;
			} catch (error) {
				return Promise.reject(error);
			}
		},
		enabled: getDistrict,
		staleTime: 3 * 60 * 1000,
		// refetchOnWindowFocus: false,
	});
	const hotelHomelet = useQuery({
		queryKey: ["hotelHomelet"],
		queryFn: async () => {
			try {
				const res = await axiosGet(url.homelet + districtRef.current.value);
				return res;
			} catch (error) {
				return Promise.reject(error);
			}
		},
		enabled: getHomelet,
		staleTime: 3 * 60 * 1000,
		// refetchOnWindowFocus: false,
	});

	let provinces = [];
	if (hotelProvince.isSuccess) {
		provinces = hotelProvince.data.data;
	}
	let districts = [];
	if (hotelDistrict.isSuccess) {
		districts = hotelDistrict.data.data;
	}
	let homelets = [];
	if (hotelHomelet.isSuccess) {
		homelets = hotelHomelet.data.data;
	}
	const handleProvinceChange = (e) => {
		const value = e.target.value;
		if (value !== "undefined") {
			if (!getDistrict) {
				setGetDistrict(true);
			}
			districtRef.current.disabled = false;
			hotelDistrict.refetch();
		} else {
			if (getDistrict) {
				setGetDistrict(false);
			}
			districtRef.current.disabled = true;
			districtRef.current.value = undefined;
			homeletRef.current.disabled = true;
			homeletRef.current.value = undefined;
		}
	};
	const handleDistrictChange = (e) => {
		const value = e.target.value;
		if (value !== "undefined") {
			if (!getDistrict) {
				setGetHomelet(true);
			}
			homeletRef.current.disabled = false;
			hotelHomelet.refetch();
		} else {
			if (getDistrict) {
				setGetHomelet(false);
			}
			homeletRef.current.disabled = true;
			homeletRef.current.value = undefined;
		}
	};
	const handlePost = async (e) => {
		e.preventDefault();
		if (homeletRef.current.value === "undefined") {
			provinceRef.current.focus();
			return;
		}
		const axiosJwt = axiosJWT(accessToken, refreshToken, dispatch);
		const toastId = toast.loading("Đang xử lý!");
		try {
			const today = new Date();
			const res = await axiosJwt.post(
				url.createHotel,
				{
					id: null,
					name: nameRef.current.value,
					star: 0,
					description: descriptionRef.current.value,
					address: addressRef.current.value,
					logo: avatarRef.current,
					slug: slugRef.current.value,
					createdDate: today.toISOString(),
					updateDate: today.toISOString(),
					uSerId: currentUser.id,
					hotelCategoryId: categoryRef.current.value,
					hotelBenefitId: 0,
					homeletId: homeletRef.current.value,
					resttaurant: restaurantRef.current.checked,
					allTimeFrontDesk: _24hRef.current.checked,
					elevator: elevatorRef.current.checked,
					pool: poolRef.current.checked,
					freeBreakfast: freeBreakfastRef.current.checked,
					airConditioner: airConditionerRef.current.checked,
					carBorrow: lendingCarRef.current.checked,
					wifiFree: wifiFreeRef.current.checked,
					parking: parkingRef.current.checked,
					allowPet: allowPetRef.current.checked,
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
			<h6 className="mb-4">Thêm khách sạn</h6>
			<form onSubmit={handlePost}>
				<div className="row mb-3">
					<label htmlFor="inputEmail3" className="col-sm-3 col-form-label">
						Tên khách sạn
					</label>
					<div className="col-sm-9">
						<input ref={nameRef} placeholder="" type="text" required className="form-control" id="inputEmail3" />
					</div>
				</div>
				<div className="row mb-3">
					<label htmlFor="" className="col-sm-3 col-form-label">
						Mô tả
					</label>
					<div className="col-sm-9">
						<input ref={descriptionRef} placeholder="" type="text" className="form-control" />
					</div>
				</div>
				<div className="row mb-3">
					<label htmlFor="" className="col-sm-3 col-form-label">
						Địa chỉ
					</label>
					<div className="col-sm-9">
						<input ref={addressRef} placeholder="" type="text" required className="form-control" />
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
								avatarRef.current = e.target.files[0];
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
						Slug
					</label>
					<div className="col-sm-9">
						<input ref={slugRef} placeholder="" type="text" className="form-control" />
					</div>
				</div>
				<div className="row mb-3">
					<label htmlFor="" className="col-sm-3 col-form-label">
						Loại khách sạn
					</label>
					<div className="col-sm-9">
						<select ref={categoryRef} className="form-select" aria-label="Default select example">
							{categories.map((category) => (
								<option key={category.id} defaultChecked={category.id === 1 ? true : false} value={category.id}>
									{category.name}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className="row mb-3">
					<label htmlFor="" className="col-sm-3 col-form-label">
						Tỉnh/Thành phố
					</label>
					<div className="col-sm-9">
						<select
							required
							ref={provinceRef}
							onChange={handleProvinceChange}
							className="form-select"
							aria-label="Default select example">
							<option defaultChecked value="undefined">
								Chọn tỉnh/thành phố
							</option>
							{provinces?.map((province) => (
								<option key={province.id} value={province.id}>
									{province.name}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className="row mb-3">
					<label htmlFor="" className="col-sm-3 col-form-label">
						Quận/Huyện
					</label>
					<div className="col-sm-9">
						<select
							ref={districtRef}
							onChange={handleDistrictChange}
							className="form-select"
							disabled
							aria-label="Default select example">
							<option defaultChecked value="undefined">
								Chọn quận/huyện
							</option>
							{districts?.map((district) => (
								<option key={district.id} value={district.id}>
									{district.name}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className="row mb-3">
					<label htmlFor="" className="col-sm-3 col-form-label">
						Xã/Phường
					</label>
					<div className="col-sm-9">
						<select required ref={homeletRef} className="form-select" disabled aria-label="Default select example">
							<option value="undefined" defaultChecked>
								Chọn xã/phường
							</option>
							{homelets?.map((homelet) => (
								<option key={homelet.id} value={homelet.id}>
									{homelet.name}
								</option>
							))}
						</select>
					</div>
				</div>
				{/* Benefit khong can */}

				<fieldset className="row mb-3">
					<legend className="col-form-label col-sm-3 pt-0">Tiện ích khách sạn</legend>
					<div className="col-sm-9">
						<div className="form-check">
							<input
								ref={restaurantRef}
								placeholder=""
								className="form-check-input"
								type="checkbox"
								defaultValue=""
								id="restaurant"
							/>
							<label className="form-check-label" htmlFor="restaurant">
								Nhà hàng
							</label>
						</div>
						<div className="form-check">
							<input
								ref={_24hRef}
								placeholder=""
								className="form-check-input"
								type="checkbox"
								defaultValue=""
								id="24h"
							/>
							<label className="form-check-label" htmlFor="24h">
								Lễ tân 24h
							</label>
						</div>
						<div className="form-check">
							<input
								ref={elevatorRef}
								placeholder=""
								className="form-check-input"
								type="checkbox"
								defaultValue=""
								id="elevator"
							/>
							<label className="form-check-label" htmlFor="elevator">
								Thang máy
							</label>
						</div>
						<div className="form-check">
							<input
								ref={poolRef}
								placeholder=""
								className="form-check-input"
								type="checkbox"
								defaultValue=""
								id="pool"
							/>
							<label className="form-check-label" htmlFor="pool">
								Bể bơi
							</label>
						</div>
						<div className="form-check">
							<input
								ref={freeBreakfastRef}
								placeholder=""
								className="form-check-input"
								type="checkbox"
								defaultValue=""
								id="free-breakfast"
							/>
							<label className="form-check-label" htmlFor="free-breakfast">
								Bữa sáng miễn phí
							</label>
						</div>
						<div className="form-check">
							<input
								ref={airConditionerRef}
								placeholder=""
								className="form-check-input"
								type="checkbox"
								defaultValue=""
								id="air-conditioner"
							/>
							<label className="form-check-label" htmlFor="air-conditioner">
								Máy điều hòa
							</label>
						</div>
						<div className="form-check">
							<input
								ref={lendingCarRef}
								placeholder=""
								className="form-check-input"
								type="checkbox"
								defaultValue=""
								id="lendingCar"
							/>
							<label className="form-check-label" htmlFor="lendingCar">
								Thuê xe
							</label>
						</div>
						<div className="form-check">
							<input
								ref={wifiFreeRef}
								placeholder=""
								className="form-check-input"
								type="checkbox"
								defaultValue=""
								id="wifi-free"
							/>
							<label className="form-check-label" htmlFor="wifi-free">
								Wifi free
							</label>
						</div>
						<div className="form-check">
							<input
								ref={parkingRef}
								placeholder=""
								className="form-check-input"
								type="checkbox"
								defaultValue=""
								id="parking"
							/>
							<label className="form-check-label" htmlFor="parking">
								Chỗ đậu xe
							</label>
						</div>
						<div className="form-check">
							<input
								ref={allowPetRef}
								placeholder=""
								className="form-check-input"
								type="checkbox"
								defaultValue=""
								id="allow-pets"
							/>
							<label className="form-check-label" htmlFor="allow-pets">
								Cho phép dắt thú cưng
							</label>
						</div>
					</div>
				</fieldset>
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
