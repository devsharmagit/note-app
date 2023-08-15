import { Button, IconButton } from "@mui/material";
import  { useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import AddNoteModal from "./AddNoteModal";
import { useDispatch, useSelector } from "react-redux";
import { openNoteModal } from "../redux/noteSlice";

type AddNoteButtonProps ={
  type: "personal" | "shared"
}

function AddNoteButton(props: AddNoteButtonProps) {

  const [addNoteOpen, setAddNoteOpen] = useState<boolean>(false);
  const [type, setType] = useState<string>("")
  const dispatch = useDispatch()

  const noteModal = useSelector((state :any)=> state.note.noteModal)

  const handleClickOpen = (e :React.MouseEvent<HTMLButtonElement>) => {
    setType(e.currentTarget.name)
    dispatch(openNoteModal({actionType: "add", noteType: e.currentTarget.name, sharingType: props.type}))
  };

  return (
    <>
    <div className="w-full bg-white flex items-center mt-2">
      <div
        className={`${addNoteOpen ? "rotate-45" : "rotate-0"} transition-all `}
        >
        <IconButton
          onClick={() => {
            setAddNoteOpen(!addNoteOpen);
          }}
          size="small"
          className={`  !text-white !bg-red-500 !font-bold`}
          >
          <AddRoundedIcon fontSize="large" className="!font-bold" />
        </IconButton>
      </div>
      <div
        className={`${
          addNoteOpen ? "scale-x-100" : "scale-x-0"
        } transition-transform origin-left `}
        >
        <div className="px-3 flex gap-2 ">
          <Button
          className="!bg-slate-800"
          name={"note"}
            onClick={handleClickOpen}
            variant="contained"
            endIcon={<NoteAddRoundedIcon />}
            >
            Add Note
          </Button>
          <Button
          className="!bg-slate-800"
          name={"task"} onClick={handleClickOpen} variant="contained" endIcon={<ChecklistRoundedIcon />}>
            Add Note
          </Button>
        </div>
      </div>

    </div>
     { noteModal && <AddNoteModal  type={props.type}/>
    }
          </>
  );
}

export default AddNoteButton;
