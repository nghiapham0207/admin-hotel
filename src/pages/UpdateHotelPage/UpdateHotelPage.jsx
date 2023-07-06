import { useQuery } from "@tanstack/react-query";
import { axiosGet, axiosJWT, url } from "../../utils/httpRequest";
import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";
import HorizontalInput from "../../components/HorizontalInput";
import HorizontalSelect from "../../components/HorizontalSelect";
import Checkbox from "../../components/Checkbox";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { selectAccessToken, selectRefreshToken, selectUser } from "../../redux/selectors";

const categories = [
	{ id: 1, name: "Hotel", hotels: null },
	{ id: 2, name: "Motel", hotels: null },
	{ id: 3, name: "HomeStay", hotels: null },
	{ id: 4, name: "Resort", hotels: null },
];

export default function UpdateHotelPage() {
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

	const { hotelId } = useParams();
	const hotelState = useQuery({
		queryKey: ["hotel", hotelId],
		queryFn: async () => {
			try {
				const res = await axiosGet(url.detailHotel + hotelId);
				return res;
			} catch (error) {
				return Promise.reject(error);
			}
		},
		staleTime: 3 * 60 * 1000,
	});
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
	let hotel = {};
	if (hotelState.isSuccess && hotelState.data.success) {
		hotel = hotelState.data.hotelDto;
	} else {
		return null;
	}
	const handleUpdate = async (e) => {
		e.preventDefault();
		if (homeletRef.current.value === "undefined") {
			provinceRef.current.focus();
			return;
		}
		const axiosJwt = axiosJWT(accessToken, refreshToken, dispatch);
		const toastId = toast.loading("Đang xử lý!");
		const formData = new FormData();
		const today = new Date();
		formData.append("Id", hotelId);
		formData.append("Name", nameRef.current.value);
		formData.append("Star", hotel.star === "NaN" ? 5 : hotel.star);
		formData.append("Description", descriptionRef.current.value);
		formData.append("Address", addressRef.current.value);
		formData.append("Logo", avatarRef.current);
		formData.append("Slug", slugRef.current.value);
		formData.append("CreatedDate", hotel.createdDate);
		formData.append("UpdateDate", today.toISOString());
		formData.append("USerId", currentUser.id);
		formData.append("HotelCategoryId", categoryRef.current.value);
		formData.append("HotelBenefitId", hotel.hotelBenefit.id);
		formData.append("HomeletId", homeletRef.current.value);
		formData.append("Resttaurant", restaurantRef.current.checked);
		formData.append("AllTimeFrontDesk", _24hRef.current.checked);
		formData.append("Elevator", elevatorRef.current.checked);
		formData.append("Pool", poolRef.current.checked);
		formData.append("FreeBreakfast", freeBreakfastRef.current.checked);
		formData.append("AirConditioner", airConditionerRef.current.checked);
		formData.append("CarBorow", lendingCarRef.current.checked);
		formData.append("WifiFree", wifiFreeRef.current.checked);
		formData.append("Parking", parkingRef.current.checked);
		formData.append("AllowPet", allowPetRef.current.checked);
		try {
			const res = await axiosJwt.put(url.updateHotel, formData, {
				headers: {
					Authorization: "Bearer " + accessToken,
					"Content-Type": "multipart/form-data",
				},
			});
			if (res.data.success) {
				// e.target.reset();
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
				render: "Không thể cập nhật!",
				type: "error",
				closeButton: true,
				autoClose: 1000,
				isLoading: false,
			});
		}
	};
	return (
		<div className="bg-light rounded h-100 p-5">
			<h4 className="mb-4">Cập nhật khách sạn</h4>
			<form onSubmit={handleUpdate}>
				<HorizontalInput label={"Tên khách sạn"} ref={nameRef} required={true} defaultValue={hotel.name} />
				<HorizontalInput label={"Mô tả"} ref={descriptionRef} required={true} defaultValue={hotel.description} />
				<HorizontalInput label={"Địa chỉ"} ref={addressRef} required={true} defaultValue={hotel.address} />
				<div className="row mb-3">
					<label htmlFor="" className="col-sm-3 col-form-label">
						Hình ảnh
					</label>
					<div className="col-sm-9">
						<input
							// required
							onChange={(e) => {
								avatarRef.current = e.target.files[0];
							}}
							placeholder="avatarRef"
							// defaultValue={hotel.logoLink}
							className="form-control"
							type="file"
							id="formFile"
							accept="image/*"
						/>
					</div>
				</div>
				<HorizontalInput label={"Slug"} ref={slugRef} required={true} defaultValue={hotel.slug} />
				<HorizontalSelect label={"Loại khách sạn"} ref={categoryRef} defaultValue={hotel.hotelCategory.id}>
					{categories.map((category) => (
						<option key={category.id} value={category.id}>
							{category.name}
						</option>
					))}
				</HorizontalSelect>
				<HorizontalSelect label={"Tỉnh/Thành phố"} ref={provinceRef} required={true} onChange={handleProvinceChange}>
					<option defaultChecked value="undefined">
						Chọn tỉnh/thành phố
					</option>
					{provinces?.map((province) => (
						<option key={province.id} value={province.id}>
							{province.name}
						</option>
					))}
				</HorizontalSelect>
				<HorizontalSelect
					label={"Quận/Huyện"}
					ref={districtRef}
					required={true}
					// disable={true}
					onChange={handleDistrictChange}>
					<option defaultChecked value="undefined">
						Chọn quận/huyện
					</option>
					{districts?.map((district) => (
						<option key={district.id} value={district.id}>
							{district.name}
						</option>
					))}
				</HorizontalSelect>
				<HorizontalSelect label={"Xã/Phường"} ref={homeletRef} required={true} disable={true}>
					<option value="undefined" defaultChecked>
						Chọn xã/phường
					</option>
					{homelets?.map((homelet) => (
						<option key={homelet.id} value={homelet.id}>
							{homelet.name}
						</option>
					))}
				</HorizontalSelect>

				{/* Benefit khong can */}
				<fieldset className="row mb-3">
					<legend className="col-form-label col-sm-3 pt-0">Tiện ích khách sạn</legend>
					<div className="col-sm-9">
						<Checkbox label={"Nhà hàng"} ref={restaurantRef} defaultChecked={hotel.hotelBenefit.resttaurant} />
						<Checkbox label={"Lễ tân 24h"} ref={_24hRef} defaultChecked={hotel.hotelBenefit.allTimeFrontDesk} />
						<Checkbox label={"Thang máy"} ref={elevatorRef} defaultChecked={hotel.hotelBenefit.elevator} />
						<Checkbox label={"Bể bơi"} ref={poolRef} defaultChecked={hotel.hotelBenefit.pool} />
						<Checkbox
							label={"Bữa sáng miễn phí"}
							ref={freeBreakfastRef}
							defaultChecked={hotel.hotelBenefit.freeBreakfast}
						/>
						<Checkbox
							label={"Máy điều hòa"}
							ref={airConditionerRef}
							defaultChecked={hotel.hotelBenefit.airConditioner}
						/>
						<Checkbox label={"Thuê xe"} ref={lendingCarRef} defaultChecked={hotel.hotelBenefit.carBorow} />
						<Checkbox label={"Wifi free"} ref={wifiFreeRef} defaultChecked={hotel.hotelBenefit.wifiFree} />
						<Checkbox label={"Chỗ đậu xe"} ref={parkingRef} defaultChecked={hotel.hotelBenefit.parking} />
						<Checkbox label={"Cho phép dắt thú cưng"} ref={allowPetRef} defaultChecked={hotel.hotelBenefit.allowPet} />
					</div>
				</fieldset>
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
