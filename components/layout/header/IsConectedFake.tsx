"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function IsConnectedFake() {
  return (
    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
      <Avatar className="h-10 w-10">
        <AvatarFallback className="invisible">a</AvatarFallback>
      </Avatar>
    </Button>
  );
}
