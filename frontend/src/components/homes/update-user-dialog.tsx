import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { HomeType } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchUserByHome } from "../../api/user-slice";
import { fetchHomesByUser, updateUsersForHome } from "../../api/home-slice";
import { Toast } from "../ui/toast";

type UpdateUserDialogProps = {
  open: boolean;
  selectedHome: { home: HomeType; user_id: number; home_id: number };
  handleClose: () => void;
  clearHomeList: () => void;
};

const UpdateUserModal: React.FC<UpdateUserDialogProps> = ({
  open,
  selectedHome,
  handleClose,
  clearHomeList,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useSelector((state: RootState) => state);
  const {
    users: userList,
    usersByHome: usersForCurrentHome,
    selectedUser,
  } = users || {};

  const [homeOwners, setHomeOwners] = useState<number[]>([]);

  const handleUpdateUsers = useCallback(() => {
    dispatch(
      updateUsersForHome({ homeId: selectedHome.home_id, userIds: homeOwners })
    )
      .then(() => {
        Toast.success("Users updated successfully");
        clearHomeList();
        selectedUser?.id &&
          dispatch(
            fetchHomesByUser({
              userId: selectedUser?.id.toString(),
              page: 1,
              limit: 50,
            })
          );
        handleClose();
      })
      .catch(() => {
        Toast.error("Something went wrong!");
      });
  }, [dispatch, homeOwners, selectedHome.home_id, handleClose]);

  useEffect(() => {
    if (selectedHome?.home_id) {
      dispatch(fetchUserByHome(selectedHome.home_id.toString()));
    }
  }, [dispatch, selectedHome.home_id]);

  useEffect(() => {
    const commonElements = userList
      .filter((user) =>
        usersForCurrentHome.some((owner) => user.id === owner.id)
      )
      .map((user) => user.id);
    setHomeOwners(commonElements);
  }, [userList, usersForCurrentHome]);

  // Memoize form checkboxes
  const userCheckboxes = useMemo(
    () =>
      userList.map((user) => (
        <Form.Check
          type="checkbox"
          key={user.id}
          id={user.id.toString()}
          label={user.username}
          checked={homeOwners.includes(user.id)}
          onChange={(e) => {
            const checked = e.target.checked;
            setHomeOwners((prev) =>
              checked ? [...prev, user.id] : prev.filter((u) => u !== user.id)
            );
          }}
        />
      )),
    [userList, homeOwners]
  );

  return (
    <>
      <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Modify Users for: {selectedHome.home.street_address}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userCheckboxes.length > 0 ? (
            userCheckboxes
          ) : (
            <p>No users available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateUsers}
            disabled={homeOwners.length === 0}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateUserModal;
