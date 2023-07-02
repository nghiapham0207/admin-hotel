import NonLayout from "../layouts/NonLayout";

import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import HotelPage from "../pages/HotelPage";

export const routes = {
	signIn: "/sign-in",
	signUp: "/sign-up",

	hotel: "/hotel",
	createHotel: "/hotel/create",
};

export const publicRoutes = [
	{ path: routes.signIn, page: SignInPage, layout: NonLayout },
	{ path: routes.signUp, page: SignUpPage, layout: NonLayout },
	{ path: routes.hotel, page: HotelPage, layout: null },
];

// export const privateRoutes = [{ path: routes.hotel, page: HotelPage, layout: null }];
export const privateRoutes = [];
