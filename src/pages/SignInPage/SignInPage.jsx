import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { useRef, useState } from "react";
import { validateEmail, validatePassword } from "../../utils/helpers";
import { toast } from "react-toastify";
import { axiosPost, url } from "../../utils/httpRequest";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../redux/authSlice";
import { getUser } from "../../services/userServices";
import { selectUser } from "../../redux/selectors";

const initState = {
	email: "",
	password: "",
};

export default function SignInPage() {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const next = searchParams.get("next");
	const emailRef = useRef();
	const passwordRef = useRef();
	const currentUser = useSelector(selectUser);
	const [showPw, setShowPw] = useState(false);
	const [errors, setErrors] = useState(initState);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	if (currentUser) {
		return <Navigate to={routes.hotel} />;
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		const username = emailRef.current.value;
		const password = passwordRef.current.value;
		const errors = {};
		validateEmail(errors, username);
		validatePassword(errors, password);
		if (Object.keys(errors).length) {
			setErrors(errors);
		} else {
			setErrors({
				...initState,
			});
			const signInRequest = async () => {
				const toastId = toast.loading("Đang xử lý!");
				try {
					const res = await axiosPost(url.signIn, {
						userName: username,
						password,
					});
					toast.update(toastId, {
						render: "Đăng nhập thành công!",
						type: "success",
						closeButton: true,
						autoClose: 1000,
						isLoading: false,
					});
					dispatch(loginSuccess({ accessToken: res.accessToken, refreshToken: res.refreshToken }));
					getUser(res.accessToken, res.refreshToken, dispatch);
					if (next) {
						setTimeout(() => {
							navigate(next);
						}, 1000);
					} else {
						navigate(routes.home);
					}
				} catch (error) {
					console.log(error);
					toast.update(toastId, {
						render: "Tài khoản hoặc mật khẩu không đúng!",
						type: "error",
						closeButton: true,
						autoClose: 1000,
						isLoading: false,
					});
				}
			};
			signInRequest();
		}
	};
	const handleChange = (name) => {
		setErrors({
			...errors,
			[name]: "",
		});
	};
	return (
		<div className="container-xxl bg-white d-flex p-0">
			<div className="container-fluid">
				<div className="row h-100 min-vh-100 align-items-center justify-content-center">
					<div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
						{/* should use form tag */}
						<form onSubmit={handleSubmit} className="bg-light bg-gradient rounded p-3 p-sm-4 my-4 mx-3">
							<div className="d-flex align-items-center justify-content-center mb-3">
								<h4>Đăng nhập</h4>
							</div>
							<div className="mb-3">
								<label htmlFor="Username" className="form-label">
									Email
								</label>
								<input
									ref={emailRef}
									onChange={() => {
										handleChange("email");
									}}
									className={`form-control ${errors.email ? "is-invalid" : ""}`}
									id="Username"
									type="email"
								/>
								<div className="invalid-feedback">{errors.email}</div>
							</div>
							<div className="mb-4">
								<label htmlFor="Password" className="form-label">
									Mật khẩu
								</label>
								<input
									ref={passwordRef}
									onChange={() => {
										handleChange("password");
									}}
									type={`${showPw ? "text" : "password"}`}
									className={`form-control ${errors.password ? "is-invalid" : ""}`}
									id="Password"
								/>
								<div className="invalid-feedback">{errors.password}</div>
							</div>
							<div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-4">
								<div className="form-check">
									<input
										onChange={(e) => {
											if (e.target.checked) {
												setShowPw(true);
											} else {
												setShowPw(false);
											}
										}}
										type="checkbox"
										id="check-password"
										className="form-check-input"
									/>
									<label htmlFor="check-password" className="form-check-label">
										Hiện mật khẩu!
									</label>
								</div>
								<a href="#">Quên mật khẩu?</a>
							</div>
							<button type="submit" className="btn btn-primary w-100 py-3 mb-4">
								Đăng nhập
							</button>
							<p className="text-center mb-0">
								{"Chưa có tài khoản? "}
								<Link to={routes.signUp}>Đăng ký</Link>
							</p>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
