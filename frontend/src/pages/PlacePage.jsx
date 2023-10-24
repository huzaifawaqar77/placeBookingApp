import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { differenceInCalendarDays } from "date-fns";
const PlacePage = () => {
  const { id } = useParams();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [place, setPlace] = useState({});
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [navigate, setNavigate] = useState(false);
  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }
  const bookPlace = async () => {
    const reservation = {
      checkIn,
      checkOut,
      guests,
      name,
      phone,
      place: place._id,
      price: numberOfNights * place.price,
    };
    const res = await axios.post("/bookings", reservation);
    console.log(res);
    if (res.status === 200) {
      alert("Reservation was successful");
      setNavigate("/account/bookings/" + res.data.place);
    } else {
      alert("Reservation failed");
    }
  };
  useEffect(() => {
    axios.get("/places/" + id).then((res) => {
      const { data } = res;
      setPlace(data);
    });
  }, [id]);

  if (navigate) {
    return <Navigate to={navigate} />;
  }
  if (!place) return "";

  if (showAllPhotos)
    return (
      <div className="absolute inset-0 bg-white min-h-screen">
        <div className="p-8 grid gap-4 bg-black">
          <h2 className="text-white font-bold text-4xl">
            Photos for {place.title}
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
          {place?.photos?.length > 0 &&
            place.photos.map((photo) => (
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
      <h1 className="text-3xl">{place.title}</h1>
      <a
        className="flex gap-1 items-center my-2 block font-semibold underline"
        href={"https://maps.google.com/?q=" + place.address}
        target="_blank"
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
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>

        {place.address}
      </a>
      <div className="relative">
        <div className="rounded-2xl overflow-hidden grid gap-2 grid-cols-[2fr_1fr]">
          <div>
            {place.photos?.[0] && (
              <img
                className="object-cover aspect-square"
                src={"http://localhost:4000/uploads/" + place.photos[0]}
              />
            )}
          </div>
          <div className="grid">
            {place.photos?.[1] && (
              <img
                className="object-cover aspect-square"
                src={"http://localhost:4000/uploads/" + place.photos[1]}
              />
            )}
            <div className="overflow-hidden">
              {place.photos?.[2] && (
                <img
                  className="object-cover aspect-square relative top-2"
                  src={"http://localhost:4000/uploads/" + place.photos[2]}
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
      <div className="mt-8 grid gap-8 grid-cols-1 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold mt-8">Description</h2>
          <p>{place.description}</p>
          {place.checkIn && (
            <p className="font-bold">Check-in: {place?.checkIn}</p>
          )}
          {place.checkOut && (
            <p className="font-bold">Check-: out{place?.checkOut}</p>
          )}
          {place.maxGuests && (
            <p className="font-bold">
              Maimum number of guests: {place.maxGuests}
            </p>
          )}
        </div>
        <div>
          <div className="bg-white shadow p-4 rounded-2xl mt-4">
            <div className="text-2xl text-center">
              Price: ${place.price} / night
            </div>
            <div className="border rounded-2xl p-4 mt-4">
              <div className="flex">
                <div className="border-r p-2">
                  <label>Check-in:</label>
                  <input
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    type="date"
                  />
                </div>
                <div className="p-2">
                  <label>Check-out:</label>
                  <input
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    type="date"
                  />
                </div>
              </div>
              <div className="border-t p-2">
                <label>Guests:</label>
                <input
                  value={guests}
                  type="number"
                  onChange={(e) => setGuests(e.target.value)}
                />
              </div>
              {numberOfNights > 0 && (
                <div className="border-t p-2">
                  <label>Your full name:</label>
                  <input
                    value={name}
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label>Phone number:</label>
                  <input
                    value={phone}
                    type="tel"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              )}
            </div>
            <button onClick={bookPlace} className="primary mt-4">
              Book this place{" "}
              {numberOfNights > 0 && numberOfNights * place.price + "$"}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-700 leading-4 bg-white -mx-8 p-8">
        <h2 className="my-4 text-2xl font-bold mt-8">Extra Information</h2>
        {place.extraInfo}
      </div>
    </div>
  );
};

export default PlacePage;
