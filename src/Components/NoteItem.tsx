import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import { AvatarGroup, Avatar, IconButton } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import NoteSubTask from "./NoteSubTask";
import RestoreIcon from "@mui/icons-material/Restore";
import useNoteItem from "../hooks/useNoteItem";

type SubTask = {
  taskName: string;
  isDone: boolean;
};

type Tag = {
  value: String;
  label: String;
};

type NoteItemProps = {
  noteId: string;
  title: string;
  desc: string;
  time: any;
  tags: Tag[];
  noteType: "note" | "task";
  sharingType: "personal" | "shared";
  subTasks?: SubTask[];
  color: string;
  pinned: boolean;
  allDone?: boolean;
  edited?: string[];
  assignedTo?: string[];
  collName: string;
  archive?: boolean;
  isHome?: boolean;
};

function NoteItem({
  archive,
  title,
  tags,
  time,
  desc,
  noteType,
  sharingType,
  subTasks,
  pinned,
  color,
  noteId,
  allDone,
  edited,
  assignedTo,
  isHome,
  collName,
}: NoteItemProps) {
  const {handleMouseEnter, handleMouseLeave, noteCollection, updateAllDone, updateTask, handlePinClick, isPinned, handleSelectClick, selectedNote, isHovered, open, handleClick, editedpersons, anchorEl, handleClose, handleEditClick, handleDeleteClick, handleCopy,handleRestoreClick, formattedDate} = useNoteItem({
    archive,
    title,
    tags,
    time,
    desc,
    noteType,
    sharingType,
    subTasks,
    pinned,
    color,
    noteId,
    allDone,
    edited,
    assignedTo,
    collName}
  );

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`min-h-[100px] h-fit max-w-[300px] min-w-[250px] opacity-100 rounded-xl p-3 border relative border-slate-400 ${color}`}
    >
      {noteCollection === null && sharingType === "personal" && (
        <h2 className="font-medium text-[1rem] opacity-40 ">#{collName} </h2>
      )}
      <h1
        className={`flex items-center mr-6 gap-2 px-1 font-medium text-[19px] mb-4 ${
          allDone && "line-through"
        }`}
      >
        {noteType === "task" && (
          <input
            onChange={(e) => {
              updateAllDone(e.target.checked);
            }}
            checked={allDone}
            className="w-6 h-5"
            type="checkbox"
          />
        )}
        {title}
      </h1>
      <p
        className={`leading-tight px-1 mr-6  font-normal text-[16px] ${
          allDone && "line-through"
        } `}
      >
        {desc}
      </p>

      {noteType === "task" && (
        <div className="mt-2">
          {subTasks?.map((e, i) => {
            if (allDone !== undefined) {
              return (
                <NoteSubTask
                  onChange1={(status) => {
                    updateTask(i, status);
                  }}
                  key={i}
                  index={i}
                  taskName={e.taskName}
                  isDone={e.isDone}
                  allDone={allDone}
                />
              );
            }
          })}
        </div>
      )}

      <IconButton
        onClick={handlePinClick}
        className={`!absolute top-1 right-1`}
      >
        {isPinned ? <PushPinRoundedIcon /> : <PushPinOutlinedIcon />}
      </IconButton>
      <IconButton
        onClick={() => {
          handleSelectClick();
        }}
        className={`!absolute ${selectedNote && "!opacity-100"}`}
        style={{
          opacity: `${isHovered ? "1" : "0"}`,
          top: "-10px",
          left: "-10px",
          transition: "all linear 0.1s",
        }}
      >
        {selectedNote ? (
          <CheckCircleRoundedIcon />
        ) : (
          <CheckCircleOutlineRoundedIcon />
        )}
      </IconButton>

      <IconButton
        className={`!absolute bottom-0 right-1`}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MoreVertRoundedIcon />
      </IconButton>

      <div className="mt-3 flex items-center">
        {tags?.map((e, i) => {
          return (
            <span key={i} className="bg-slate-700 h-fit text-xs text-white px-2 py-[2px] mr-1 mt-2 rounded">
              {e.label}
            </span>
          );
        })}
        {sharingType === "shared" && (
          <AvatarGroup max={4} className="!w-fit mt-2 ">
            {editedpersons.map((a, i) => {
              return <Avatar key={i} src={a} />;
            })}
          </AvatarGroup>
        )}
      </div>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {!archive && ( !isHome &&
          <MenuItem onClick={handleEditClick}>
            <EditRoundedIcon color="action" className="mr-2" /> Edit
          </MenuItem>
        )}

        <MenuItem onClick={handleDeleteClick}>
          <DeleteRoundedIcon color="action" className="mr-2" /> Delete
        </MenuItem>

        {!archive && (
          <MenuItem onClick={handleCopy}>
            <ContentCopyRoundedIcon color="action" className="mr-2" /> Copy
          </MenuItem>
        )}

        {!archive && (
          <MenuItem onClick={handleClose}>
            <SendRoundedIcon color="action" className="mr-2" /> Send
          </MenuItem>
        )}

        {archive && (
          <MenuItem onClick={handleRestoreClick}>
            <RestoreIcon color="action" className="mr-2" /> Restore
          </MenuItem>
        )}
      </Menu>
      <p className="text-xs text-gray-400 relative top-[10px]">
        {formattedDate}
      </p>
    </div>
  );
}

export default NoteItem;
