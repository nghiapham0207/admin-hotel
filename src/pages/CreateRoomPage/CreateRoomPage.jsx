import { useParams } from "react-router-dom";

export default function CreateRoomPage() {
	const { hotelId } = useParams();
	console.log(hotelId);
	return <div className="bg-light rounded h-100 p-5">Create room</div>;
}
