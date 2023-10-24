import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
const BookingPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState({});
  const [photos, setPhotos] = useState([]);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  useEffect(() => {
    axios.get("/bookings").then((response) => {
      const foundBooking = response.data.find((booking) => booking._id === id);
      if (foundBooking) {
        setBooking(foundBooking);
        setPhotos(foundBooking.place.photos);
      }
    });
  });

  if (!booking) return "";

  if (showAllPhotos)
    return (
      <div className="absolute inset-0 bg-white min-h-screen">
        <div className="p-8 grid gap-4 bg-black">
          <h2 className="text-white font-bold text-4xl">
            Photos for {booking.place.title}
          </h2>
          <button
            onClick={() => setShowAllPhotos(false)}
            className="absolute top-4 right-12 items-center fixed flex gap-1 px-4 py-2 bg-white font-bold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Close
          </button>
          {photos?.length > 0 &&
            photos.map((photo) => (
              <img
                className="rounded-xl"
                src={"http://localhost:4000/uploads/" + photo}
              />
            ))}
        </div>
      </div>
    );

  return (
    <div className="mt-8 bg-gray-100 -mx-8 px-8 py-8">
      {photos?.length > 0 && (
        <div>
          <div className="relative my-6">
            <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-2xl overflow-hidden ">
              <div>
                {photos?.[0] && (
                  <img
                    className="object-cover aspect-square"
                    src={"http://localhost:4000/uploads/" + photos[0]}
                  />
                )}
              </div>
              <div className="grid">
                {photos?.[1] && (
                  <img
                    className="object-cover aspect-square"
                    src={"http://localhost:4000/uploads/" + photos[1]}
                  />
                )}
                <div className="overflow-hidden">
                  {photos?.[2] && (
                    <img
                      className="object-cover aspect-square relative top-2"
                      src={"http://localhost:4000/uploads/" + photos[2]}
                    />
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAllPhotos(true)}
              className="flex gap-1 items-center absolute bottom-1 right-1 px-4 py-2 rounded-xl bg-white shadow shadow-md font-bold"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                />
              </svg>
              Show more photos
            </button>
          </div>
          <div className="bg-gray-300 rounded-xl p-6 my-4">
            <h2 className="text-xl font-bold">{booking.place.title}</h2>
            <span className="my-4">
              <span className="flex items-center gap-2 font-bold underline">
                Address: {booking.place.address}{" "}
              </span>
            </span>
            <p className="text-gray-500 my-4">{booking.place.description}</p>
            <div className="flex justify-between">
              <p className="text-gray-500 font-bold">
                Check-in: {booking.checkIn} <br />
                Check-out: {booking.checkOut}
              </p>
              <div className="bg-primary p-8 rounded-2xl">
                <p className="text-white font-bold">Total: ${booking.price}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
