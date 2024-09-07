import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAllUsers } from "./api/user-slice";
import { AppDispatch } from "./store";
import SelectUser from "./components/users/select-user";
import HomeList from "./components/homes/homes-list";
import { ToastComponent } from "./components/ui/toast";
import "./input.css";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    <div className="flex flex-col items-end !h-screen !w-screen p-5 ">
      <SelectUser />
      <HomeList />
      <ToastComponent />
    </div>
  );
}

export default App;
