import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
// import PlacesFormPage from "./PlacesFormPage";
import AccountNav from "../AccountNav";
import axios from "axios";

const PlacesPage = () => {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);
  return (
    <div>
      <AccountNav />

      <div className="text-center">
        <h1 className="text-md">List of all the places.</h1>
        <Link
          to="/account/places/new"
          className="inline-flex bg-primary text-white py-2 px-6 rounded-full items-center gap-2"
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add a new place
        </Link>
      </div>
      {
        <div className="mt-4">
          {places.map((place) => (
            <Link
              to={"/account/places/" + place._id}
              key={place.title}
              className="flex gap-4 bg-gray-200 p-4 rounded-2xl cursor-pointer my-4"
            >
              <div className="flex w-32 h-32 bg-gray-300 shrink-0">
                {place.photos.length > 0 && (
                  <img
                    className="object-cover rounded-2xl"
                    src={"http://localhost:4000/uploads/" + place.photos[0]}
                    alt=""
                  />
                )}
              </div>
              <div className="shrink">
                <h2 className="text-xl">{place.title}</h2>
                <p className="text-gray-500">{place.description}</p>
              </div>
            </Link>
          ))}
        </div>
      }
    </div>
  );
};

export default PlacesPage;
