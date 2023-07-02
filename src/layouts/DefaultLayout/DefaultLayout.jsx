import Header from "../Header";
import Sidebar from "../Sidebar";

export default function DefaultLayout({ children }) {
	return (
		<div className="container-xxl position-relative bg-white d-flex p-0">
			<Sidebar />
			<div className="content">
				<Header />
				{children}
			</div>
		</div>
	);
}
