import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Perks from "../Perks";
import axios from "axios";
import AccountNav from "../AccountNav";

const PlacesFormPage = () => {
  const { id } = useParams();
  console.log(id);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState(1);
  const [checkOut, setCheckOut] = useState(1);
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState(false);
  const [price, setPrice] = useState(100);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setDescription(data.description);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setPrice(data.price);
      setMaxGuests(data.maxGuests);
    });
  }, [id]);
  const addPhotoByLink = async (e) => {
    e.preventDefault();
    const { data } = await axios.post("/upload-by-link", {
      link: photoLink,
    });
    setAddedPhotos([...addedPhotos, data]);
    setPhotoLink("");
  };

  const selectAsMainPhoto = (ev, filename) => {
    ev.preventDefault();
    setAddedPhotos((prev) => [
      filename,
      ...prev.filter((photo) => photo !== filename),
    ]);
  };
  const deletePhoto = (ev, filename) => {
    ev.preventDefault();
    setAddedPhotos((prev) => prev.filter((photo) => photo !== filename));
  };
  const uploadPhoto = (e) => {
    const files = e.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    axios
      .post("/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        const { data: filenames } = res;
        setAddedPhotos((prev) => [...prev, ...filenames]);
      })
      .catch((err) => console.log(err));
  };

  const savePlace = async (e) => {
    e.preventDefault();

    if (id) {
      await axios.put("/places", {
        id,
        title,
        description,
        address,
        photos: addedPhotos,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      setRedirect(true);
    }
    if (!id) {
      await axios.post("/places", {
        title,
        description,
        address,
        photos: addedPhotos,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      setRedirect(true);
    }
    setRedirect(true);
    return;
  };

  if (redirect) {
    return <Navigate to="/account/places" />;
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        <h2 className="text-xl mt-4">Title</h2>
        <p className="text-sm text-gray-500">Title of your place</p>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <h2 className="text-xl mt-4">Address</h2>
        <p className="text-sm text-gray-500">Address to your place</p>
        <input
          type="text"
          placeholder="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <h2 className="text-xl mt-4">Photos</h2>
        <p className="text-sm text-gray-500">More = better</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add photo using a link .....jpg"
            value={photoLink}
            onChange={(e) => setPhotoLink(e.target.value)}
          />

          <button
            onClick={addPhotoByLink}
            className="bg-gray-200 px-4 rounded-2xl"
          >
            Add&nbsp;Photo{" "}
          </button>
        </div>
        <div className="mt-2 gap-2 grid grid-cols-3 lg:grid-cols-6 md:grid-cols-4">
          {addedPhotos.length > 0 &&
            addedPhotos.map((photo) => (
              <div key={photo} className="h-32 flex relative">
                <img
                  className="rounded-2xl w-full object-cover"
                  src={"http://localhost:4000/uploads/" + photo}
                  alt=""
                />
                <button
                  onClick={(ev) => deletePhoto(ev, photo)}
                  className="absolute bottom-2 right-2 px-3 py-2 text-white rounded-xl bg-black bg-opacity-60"
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
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
                <button
                  onClick={(ev) => selectAsMainPhoto(ev, photo)}
                  className="absolute bottom-2 left-2 px-3 py-2 text-white rounded-xl bg-black bg-opacity-60"
                >
                  {photo !== addedPhotos[0] && (
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
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  )}
                  {photo === addedPhotos[0] && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          <label className="h-32 cursor-pointer flex gap-2 justify-center items-center  text-2xl text-gray-600 border bg-transparent rounded-2xl">
            <input
              multiple
              onChange={uploadPhoto}
              type="file"
              className="hidden"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              />
            </svg>
            Upload
          </label>
        </div>
        <h2 className="text-xl mt-4">Description</h2>
        <p className="text-sm text-gray-500">description your place</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <h2 className="text-xl mt-4">Perks</h2>
        <p className="text-sm text-gray-500">
          Select all the perks that you need
        </p>
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols:6">
          <Perks selected={perks} onChange={setPerks} />
        </div>
        <h2 className="text-xl mt-4">Extra Infor</h2>
        <p className="text-sm text-gray-500">
          Some extra information like house rules, e.t.c,
        </p>
        <textarea
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
        />
        <div className="grid gap-2 md:grid-cols-4 sm:grid-cols-2">
          <div>
            <h3>Check in time</h3>
            <input
              type="number"
              placeholder="16:00"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div>
            <h3>Check out time</h3>
            <input
              type="number"
              placeholder="16:00"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
          <div>
            <h3>Maximum number of guests</h3>
            <input
              type="number"
              placeholder="max guests: 1,2,3"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
            />
          </div>
          <div>
            <h3>Price per night</h3>
            <input
              type="number"
              placeholder="price in $usd"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <button className="primary mt-4">Save</button>
      </form>
    </div>
  );
};

export default PlacesFormPage;
