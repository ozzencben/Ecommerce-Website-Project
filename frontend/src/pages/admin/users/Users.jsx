import { useEffect, useState } from "react";
import Loading from "../../../components/loading/Loading";
import { handleError } from "../../../helpers/error/ErrorHelper";
import { getAllUsers } from "../../../services/UserServices";
import "./UsersStyles.css";

const Users = () => {
  const [users, setUsers] = useState([]); // Başlangıçta array
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Filtreleme
  useEffect(() => {
    if (!Array.isArray(users)) return; // users array değilse işlemi durdur

    const term = searchTerm.toLowerCase();

    const filtered = users.filter((user) => {
      return (
        user.firstname?.toLowerCase().includes(term) ||
        user.lastname?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term)
      );
    });

    console.log("Filtered users:", filtered);

    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  // API'den kullanıcıları çek
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        const res = await getAllUsers();

        console.log("API response raw:", res);

        // Güvenlik: res her zaman array olacak
        const usersArray = Array.isArray(res) ? res : [];
        if (!Array.isArray(res)) {
          console.warn("Users array değil!", res);
        }

        setUsers(usersArray);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  if (loading) {
    return (
      <div className="user-page-container">
        <Loading />
      </div>
    );
  }

  return (
    <div className="user-page-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>Ad</th>
            <th>Soyad</th>
            <th>Email</th>
            <th>Düzenle</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  {user.firstname
                    ? user.firstname.charAt(0).toUpperCase() +
                      user.firstname.slice(1)
                    : ""}
                </td>
                <td>
                  {user.lastname
                    ? user.lastname.charAt(0).toUpperCase() +
                      user.lastname.slice(1)
                    : ""}
                </td>
                <td>{user.email || ""}</td>
                <td>
                  <button className="edit-button">Düzenle</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>Kullanıcı bulunamadı.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
