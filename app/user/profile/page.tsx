import PersoProfile from "@/components/profile/PersoProfile";
import ProProfile from "@/components/profile/ProProfile";
import UserProfile from "@/components/profile/UserProfile";
import React from "react";

function page() {
  return (
    <div>
      <UserProfile />
      <PersoProfile />
      <ProProfile />
    </div>
  );
}

export default page;
