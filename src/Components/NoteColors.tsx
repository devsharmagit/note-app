import { useEffect } from "react";
import useAddNote from "../hooks/useAddNote";

type NoteColorsProps = {
  sharingType: string;
  handleColorssss: ()=> void;
};

function NoteColors({ sharingType }: NoteColorsProps) {
  const { color, handleColor } = useAddNote(sharingType);

  useEffect(()=>{

    console.log("⭐⭐⭐⭐")

  }, [color])

  return (
    <>
      <div className="w-full flex gap-2 my-3">
        <div
          onClick={handleColor}
          id="white"
          className={`h-6 w-6 cursor-pointer bg-white rounded-full ${
            color === "bg-white" && "outline outline-2 outline-black"
          }`}
        />
        <div
          onClick={handleColor}
          id="red"
          className={`h-6 w-6 cursor-pointer bg-red-300 rounded-full ${
            color === "bg-red-100" && "outline outline-2 outline-black"
          }`}
        />
        <div
          onClick={handleColor}
          id="blue"
          className={`h-6 w-6 cursor-pointer bg-blue-300 rounded-full ${
            color === "bg-blue-100" && "outline outline-2 outline-black"
          }`}
        />
        <div
          onClick={handleColor}
          id="green"
          className={`h-6 w-6 cursor-pointer bg-green-300 rounded-full ${
            color === "bg-green-100" && "outline outline-2 outline-black"
          }`}
        />
        <div
          onClick={handleColor}
          id="yellow"
          className={`h-6 w-6 cursor-pointer bg-yellow-300 rounded-full ${
            color === "bg-yellow-100" && "outline outline-2 outline-black"
          }`}
        />
        <div
          onClick={handleColor}
          id="slate"
          className={`h-6 w-6 cursor-pointer bg-slate-300 rounded-full ${
            color === "bg-slate-100" && "outline outline-2 outline-black"
          }`}
        />
      </div>
    </>
  );
}

export default NoteColors;
