import { useEffect, useRef, useState } from "react";
import { fetchHomesByUser } from "../../api/home-slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import HomeCard from "./home-card";
import * as _ from "lodash";
import { Spinner } from "react-bootstrap";

const HomeList = () => {
  const prevSelectedUserId = useRef<number>();
  const dispatch = useDispatch<AppDispatch>();

  const [page, setPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const {
    users: { selectedUser },
    home: { homes, status },
  } = useSelector((state: RootState) => state);

  const [homeList, setHomeList] = useState(homes);

  // Fetch homes when selectedUser or page changes
  useEffect(() => {
    if (selectedUser?.id) {
      if (selectedUser.id !== prevSelectedUserId.current) {
        // Reset page to 1 when selectedUser changes
        setPage(1);
        setHomeList([]); // Clear current list to show new data
      }

      dispatch(
        fetchHomesByUser({
          userId: selectedUser.id.toString(),
          page,
          limit: 50,
        })
      );

      // Update ref for the selectedUser
      prevSelectedUserId.current = selectedUser.id;
    }
  }, [selectedUser, page]);

  // Infinite scrolling: Detect when user scrolls to the bottom
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (
        scrollTop + clientHeight >= scrollHeight - 5 &&
        !loadingMore &&
        status !== "loading"
      ) {
        setLoadingMore(true);
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, status]);

  // When more homes are loaded, reset loadingMore flag
  useEffect(() => {
    if (status === "succeeded" || status === "failed") {
      setLoadingMore(false);
    }
  }, [status]);

  const clearHomeList = () => setHomeList([]);

  useEffect(() => {
    if (homes.length > 0) {
      // Find homes that are not already in homeList
      const newHomes = homes.filter(
        (home) =>
          !homeList.some(
            (existingHome) => existingHome.home_id === home.home_id
          )
      );

      // Only set the state if there are new homes
      if (newHomes.length > 0) {
        setHomeList((prev) => [...prev, ...newHomes]);
      }
    }
  }, [homes, homeList]);

  if (status === "loading" && page === 1) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner animation="border" />;
      </div>
    );
  }

  if (!homeList || homeList.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        Nothing to show
      </div>
    );
  }

  return (
    <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full gap-2">
      {homeList.map((home) => (
        <HomeCard
          key={home.home_id}
          data={home}
          clearHomeList={clearHomeList}
        />
      ))}
      {loadingMore && (
        <div className="flex items-center justify-center w-full">
          Loading more homes...
        </div>
      )}
    </div>
  );
};

export default HomeList;
