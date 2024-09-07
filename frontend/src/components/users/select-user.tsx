import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchAllUsers, setSelectedUser } from "../../api/user-slice";

const SelectUser = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Destructure the relevant parts of the state
  const {
    users: { users, status, selectedUser },
  } = useSelector((state: RootState) => state);
  const userList = users || [];

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Memoize the user list to avoid unnecessary re-renders
  const userOptions = useMemo(
    () =>
      userList.map((user) => (
        <option key={user.id} value={user.id}>
          {user.username}
        </option>
      )),
    [userList]
  );

  const handleSelectUser = (userId: string) => {
    dispatch(
      setSelectedUser(userList.find((u) => u.id.toString() === userId)!)
    );
  };

  return (
    <div className="h-10 px-10">
      <label htmlFor="users">Select User: </label>
      <select
        className="border rounded-md p-2 px-4 focus-visible:outline-none"
        name="users"
        id="users"
        disabled={status === "loading"}
        defaultValue="0"
        value={selectedUser?.id}
        onChange={(e) => handleSelectUser(e.target.value)}
      >
        {status === "loading" ? (
          <option value="0" disabled>
            Loading users...
          </option>
        ) : (
          <>
            <option value="0" disabled>
              None
            </option>
            {userOptions.length > 0 ? (
              userOptions
            ) : (
              <option value="0" disabled>
                No users available
              </option>
            )}
          </>
        )}
      </select>
    </div>
  );
};

export default SelectUser;
