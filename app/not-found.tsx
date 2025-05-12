// app/not-found.tsx
import React from "react";
// Import the NotFoundPage component that shadcn/ui should have added
import { NotFoundPage } from "@/components/ui/404-page-not-found";

// This is the default export that Next.js will render for the not-found page
export default function NotFound() {
  return (
    <div>
      {/* Render the actual NotFoundPage component */}
      <NotFoundPage />
    </div>
  );
}

// Note: You don't need the other 'export function NotFoundPage()' declaration here,
// as the component is imported from your components directory.
// The 'export default not-found' at the end was also incorrect syntax.
