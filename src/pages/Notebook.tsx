import React from "react";
import { FileList } from "../components/FileList";
import { FileEditor } from "../components/FileEditor";

export const Notebook: React.FC = () => {
  return (
    <div className=" sm:flex  ">
      <div className="  rounded-lg p-2 bg-black">
        <FileList />
      </div>
      <div className="flex-1 p-2  ">
        <FileEditor />
      </div>
    </div>
  );
};
