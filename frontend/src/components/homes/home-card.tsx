import React, { useState } from "react";
import { HomeType } from "../../types";
import UpdateUserDialog from "./update-user-dialog";
import { Button } from "react-bootstrap";

type HomeCardProps = {
  data: { home: HomeType; user_id: number; home_id: number };
  clearHomeList: () => void;
};

const HomeCard: React.FC<HomeCardProps> = ({ data, clearHomeList }) => {
  const { home } = data || {};

  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  // Reorder the details
  const homeDetails = () => {
    const orderedKeys = ["list_price", "state", "zip", "sqft", "beds", "baths"];

    return orderedKeys.map((key) => ({
      key,
      value: home[key as keyof HomeType],
    }));
  };

  const formatKey = (key: string) => key.replace("_", " ");

  return (
    <>
      <div className="flex flex-col items-start justify-center h-full w-full p-4 rounded-md shadow-md max-w-[450px] justify-items-center">
        <p className="font-bold text-lg">{home.street_address}</p>
        {homeDetails().map((item) => (
          <p
            className={`capitalize mb-0 ${item.key === "list_price"}`}
            key={item.key}
          >
            {`${formatKey(item.key)}: ${
              item.key === "list_price" ? `$${item.value}` : item.value
            }`}
          </p>
        ))}
        <Button
          variant="primary"
          className="mt-4"
          onClick={() => setOpenUpdateModal(true)}
        >
          Edit Users
        </Button>
      </div>
      {openUpdateModal && (
        <UpdateUserDialog
          open={openUpdateModal}
          handleClose={() => setOpenUpdateModal(false)}
          selectedHome={data}
          clearHomeList={clearHomeList}
        />
      )}
    </>
  );
};

export default HomeCard;
