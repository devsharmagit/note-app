import SlidebarItems from "./SlidebarItems";
import ArchiveIcon from "@mui/icons-material/Archive";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSelector } from "react-redux";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';

function Sidebar() {
  const sidebar = useSelector((state: any) => state.appRedux.isSidebarOpen);

  return (
    <div
      className={`bg-slate-700 w-80 h-full origin-top-left opacity-100 absolute z-10 transition-transform ${
        sidebar ? "w-64 scale-x-100" : "scale-x-0 opacity-0"
      }`}
    >
      <SlidebarItems avatar={true} />
      <SlidebarItems IconType={LogoutIcon} iconText={"Logout"} />
      <hr className="h-[1px] border-t outline-0 border-slate-400 w-full" />
      <SlidebarItems IconType={HomeRoundedIcon} iconText={"Home"} />
      <SlidebarItems IconType={ArchiveIcon} iconText={"Archive"} />
      <SlidebarItems IconType={InsertPhotoRoundedIcon} iconText={"Gallery"} />
      <SlidebarItems IconType={ChatRoundedIcon} iconText={"Discuss"} />
    </div>
  );
}

export default Sidebar;
