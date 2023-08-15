import React, { useEffect, useState } from "react";

type SubTask = {
  taskName: string;
  isDone: boolean;
  index: number;
  onChange1: (status: boolean) => void;
  allDone: boolean;
};

function NoteSubTask({ taskName, isDone, onChange1, allDone }: SubTask) {
  const [done, setDone] = useState<boolean>(isDone);

  useEffect(() => {
    onChange1(done);
  }, [done]);

  return (
    <div className="flex items-center ">
      <input
        type="checkbox"
        className="w-4 h-4"
        checked={allDone ? true : (done)}
        onChange={(e) => {
          if(!allDone){
            setDone(e.target.checked);
          }
        }}
      />
      <span
        className={`${
          allDone ? "line-through" : (done && "line-through")
        }  decoration-2 text-base ml-1 font-normal text-gray-800`}
      >
        {taskName}
      </span>
    </div>
  );
}

export default NoteSubTask;
