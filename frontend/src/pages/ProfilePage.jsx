import { useContext, useState } from "react";
import { UserContext } from "../contexts/userContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";
const ProfilePage = () => {
  const [redirect, setRedirect] = useState(null);
  const { name, email, ready, setUser } = useContext(UserContext);
  let { subpage } = useParams();

  if (subpage == undefined) {
    subpage = "profile";
  }

  const logout = async () => {
    await axios.post("/logout");
    setRedirect("/");
    setUser(null);
  };
  if (ready && !name && !redirect) {
    return <Navigate to="/login" />;
  }

  if (!ready) {
    return <div>Loading...</div>;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <AccountNav />
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          logged in as {name} ({email}) <br />
          <button onClick={logout} className="primary max-w-sm mt-2">
            Logout
          </button>
        </div>
      )}
      {subpage === "places" && <PlacesPage />}
    </div>
  );
};

export default ProfilePage;
