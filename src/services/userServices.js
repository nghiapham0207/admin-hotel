import { logoutSuccess } from "../redux/authSlice";
import { updateUser } from "../redux/userSlice";
import { axiosJWT, url } from "../utils/httpRequest";

export const signUp = () => {};

export const getUser = async (accessToken, refreshToken, dispatch) => {
	if (refreshToken) {
		const axiosJwt = axiosJWT(accessToken, refreshToken, dispatch);
		try {
			const res = await axiosJwt.get(url.getUser, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			dispatch(updateUser(res.data.userDto));
			return {
				isSuccess: true,
				data: res.data,
			};
		} catch (error) {
			console.log(error);
			return {
				isSuccess: false,
				data: error.response.data,
			};
		}
	}
};

export const logout = (dispatch) => {
	dispatch(logoutSuccess());
	dispatch(updateUser(null));
};
