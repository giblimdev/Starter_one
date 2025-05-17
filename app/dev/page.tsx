import DevToDoList from "@/components/dev/DevToDoList";
import Schema from "@/components/dev/Schema";
import UseFull from "@/components/dev/UseFull";
import React from "react";

function pages() {
  return (
    <div>
      <div>
        <UseFull />
        <Schema />
        <DevToDoList />
      </div>
    </div>
  );
}

export default pages;
