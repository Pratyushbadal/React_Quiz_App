import axios from "axios";
import { useEffect, useState } from "react";
import MyInformation from "../../MyInformation";
import { Link } from "react-router-dom";

export interface IAuthUserList {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

function AuthHomePage() {
  const [users, setUsers] = useState<IAuthUserList[]>([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .get("http://localhost:3000/users/list", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        setUsers(response?.data?.users || []);
      });
  }, []);

  return (
    <div>
      <h1 className="page-title">Professionals</h1>
      <div className="user-grid">
        {users?.map((user) => (
          <div key={user._id} className="user-card">
            <MyInformation
              id={user._id}
              name={user.name}
              email={user.email}
              profilePicture={user.profilePicture}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AuthHomePage;
