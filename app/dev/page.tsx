import DevToDoList from "@/components/dev/DevToDoList";
import UseFull from "@/components/dev/UseFull";
import React from "react";

function pages() {
  return (
    <div>
      <div>
        <UseFull />
        <DevToDoList />
      </div>
    </div>
  );
}

export default pages;
