import  { useEffect, useState } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button, IconButton } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { closeSharedCollModal } from "../redux/noteSlice";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

function AddSharedCollModal() {
  const [collName, setCollName] = useState<string>("");

  const sharedCollModal = useSelector(
    (state: any) => state.note.sharedCollModal
  );

  Modal.setAppElement("div");

  const user = useSelector((state: any) => state.appRedux.userDetails);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeSharedCollModal());
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "0px",
    },
  };

  const userRef = collection(db, "userDetails");
  const [seachText, setSearchText] = useState<string>("");
  const [searchedUsers, setSearchedUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any[]>([
    { name: user.name, userId: user.userId, photo: user.photo },
  ]);

  const getUser = async () => {
    if (seachText.length !== 0) {
      console.log("get user is called");
      const q = query(userRef, where("email", ">=", seachText));
      const data = await getDocs(q);
      let newarr = data.docs.map((doc) => doc.data());
      setSearchedUsers(newarr);
      console.log(searchedUsers);
    }
  };

  const collRef = collection(db, "sharedColl");
  const notificationRef = collection(db, "notification");
  const handleSave = async () => {
    if (collName.length !== 0 && selectedUser.length >= 2) {
      let newArr = selectedUser.map((d) => {
        return d.userId;
      });
      console.log(newArr);
      await addDoc(collRef, {
        collectionName: collName,
        owner: user.userId,
        members: newArr,
      });
      newArr.forEach(async (a) => {
        await addDoc(notificationRef, {
          sentBy: user.userId,
          sentTo: a,
          message: `${user.name} added you in a collection named "${collName}".`,
          time: serverTimestamp(),
          read: false,
        });
      });
      handleClose();
    }
  };

  const handleClick = (name: string, photo: string, userId: string) => {
    setSelectedUser([
      ...selectedUser,
      { name: name, photo: photo, userId: userId },
    ]);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      getUser();
    }, 1000);

    return () => {
      clearTimeout(t);
      console.log(seachText);
    };
  }, [seachText]);

  const handleCancleAddedMember = (photo: string) => {
    setSelectedUser(
      searchedUsers.filter((user) => {
        return user.photo !== photo;
      })
    );
  };

  // useEffect(()=>{
  //   if(collName.length < 2 && )
  // }, [collName, selectedUser])

  return (
    <Modal style={customStyles} isOpen={sharedCollModal}>
      <div className="bg-slate-200  z-10  flex-col flex items-center justify-center">
        <div
          className={` bg-white w-screen max-w-xs sm:max-w-lg p-5 opacity-100`}
        >
          <h1 className="text-xl font-medium px-3 mb-3">
            Make a shared Collection
          </h1>
          <input
            value={collName}
            onChange={(e) => {
              setCollName(e.target.value);
            }}
            type="text"
            placeholder={`name of shared collection`}
            className="bg-transparent border-0 outline-0 border-b border-gray-400 text-base px-3 py-1 w-full"
          />
          {selectedUser.length !== 0 && (
            <>
              <h1 className="text-[17px]  px-3 mt-3">added members :-</h1>
              <div className="flex flex-col">
                {selectedUser.length !== 0 && (
                  <div className="flex flex-col">
                    {selectedUser.map((e) => {
                      return (
                        <div className="flex justify-between items-center gap-2 p-1">
                          <div className="flex items-center gap-2">
                            {e.photo ? (
                              <img
                                src={e.photo}
                                className="w-6 h-6 rounded-full"
                              />
                            ) : (
                              <Avatar className="!w-6 !h-6" />
                            )}
                            {e.name ? (
                              <p className="text-[14px]">{e.name}</p>
                            ) : (
                              <p>you</p>
                            )}
                          </div>
                          <IconButton  className="!p-0"
                            onClick={() => {
                              handleCancleAddedMember(e.photo);
                            }}
                          >
                            <CloseRoundedIcon  className="!w-6 !h-6" />
                          </IconButton>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>{" "}
            </>
          )}
          <h1 className="text-[17px]  px-3 mt-3">Add members to collection</h1>
          <div className="flex flex-col relative ">
            <div className="flex items-center">
              <SearchRoundedIcon />
              <input
                value={seachText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
                type="text"
                placeholder={`search the name`}
                className="bg-transparent border-0 outline-0 border-b border-gray-400 text-base  px-3 py-1 flex-1"
              />
            </div>

            <div className="max-h-40 overflow-y-scroll no-scrolll">
              {searchedUsers.map((e) => {
                console.log("this bitch cause rerender");
                if (
                  !selectedUser.some(
                    (selected) => selected.userId === e.userId
                  ) &&
                  e.userId !== user.userId
                ) {
                  return (
                    <div
                      onClick={() => {
                        handleClick(e.name, e.photo, e.userId);
                      }}
                      key={e.userId}
                      className="flex gap-2 p-2 hover:bg-slate-200 cursor-pointer rounded-md"
                    >
                      {e.photo ? (
                        <img src={e.photo} className="w-6 h-6 rounded-full" />
                      ) : (
                        <Avatar />
                      )}
                      {e.email ? <p>{e.email}</p> : <p>you</p>}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full px-5 pb-4 bg-white">
          <Button
            disabled={!(selectedUser.length >= 2 && collName.length > 1)}
            onClick={handleSave}
            variant="contained"
            endIcon={<CheckRoundedIcon />}
            className="!bg-slate-600 disabled:!text-gray-400"
          >
            Save
          </Button>
          <Button
            className="!bg-slate-600"
            onClick={handleClose}
            variant="contained"
            endIcon={<CloseRoundedIcon />}
          >
            Cancel
          </Button>
        </div>
        <IconButton
          onClick={handleClose}
          className="!absolute top-1 right-1 !text-red-600"
        >
          <CloseRoundedIcon fontSize="large" />
        </IconButton>
      </div>
    </Modal>
  );
}

export default AddSharedCollModal;
