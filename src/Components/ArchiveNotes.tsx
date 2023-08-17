import { collection, orderBy, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../config/firebase";
import { useSelector } from "react-redux";
import NoteItem from "./NoteItem";
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import Skeleton from '@mui/material/Skeleton';

function ArchiveNotes() {
  const user = useSelector((state: any) => state.appRedux.userDetails);

  const q = query(
    collection(db, "notes"),
    where("ownedBy", "==", user.userId),
    where("archive", "==", true),
    orderBy("time", "desc")
  );

  const [archivedNotes, loading, error] = useCollection(q);


  return (
    <div className="w-full px-3">
      <div className="flex items-center gap-2 my-3">
      <ArchiveRoundedIcon fontSize="large" /> <span className="text-xl text-gray-800 font-medium">Archive</span>
      </div>

    <div className="flex flex-wrap gap-2">

{loading && <div className="w-full">
<Skeleton variant="rectangular" width={300} height={200} animation="wave" />
</div>
  }

      {archivedNotes?.empty && <div className="w-full h-full flex items-center justify-center">
         <p className="text-2xl text-slate-700">
        Deleted Notes will appear here!
        </p>
      </div>
        }
      {archivedNotes?.docs.map((e) => {
        return (
          <NoteItem
            archive ={true}
          collName={e.data().collName}
            key={e.id}
            noteId={e.id}
            title={e.data().noteTitle}
            desc={e.data().noteDesc}
            color={e.data().noteColor}
            tags={e.data().noteTags}
            time={e.data().time}
            noteType={e.data().noteType}
            sharingType="personal"
            subTasks={e?.data().subTasks}
            pinned={e.data().pinned}
            allDone={e.data().allDone}
          />
        );
      })}
    </div>
    </div>
  );
}

export default ArchiveNotes;
