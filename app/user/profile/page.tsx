import PersoProfile from "@/components/profile/PersoProfile";
import ProProfile from "@/components/profile/ProProfile";
import UserProfile from "@/components/profile/UserProfile";
import React from "react";

const profiles = [
  {
    title: "Profil Utilisateur",
    component: <UserProfile />,
  },
  {
    title: "Profil Personnel",
    component: <PersoProfile />,
  },
  {
    title: "Profil Professionnel",
    component: <ProProfile />,
  },
];

function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Mes Profils</h1>

      {/* Grid layout pour les vignettes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map(({ title, component }, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105 h-full"
          >
            <div className="p-6 h-full flex flex-col">
              <h2 className="text-xl font-semibold mb-4">{title}</h2>
              <div className="flex-grow">{component}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;
