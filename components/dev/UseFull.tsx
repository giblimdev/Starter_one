"use client";
import { Terminal, Shield, Database, Palette, Mail, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const UseFull = () => {
  const sections = [
    {
      title: "Project Base",
      icon: <Terminal className="w-5 h-5" />,
      items: [
        "npx create-next-app@latest",
        "npm install --save-dev typescript @types/node @types/react @types/react-dom",
        "npm install next@latest react@latest react-dom@latest",
      ],
    },
    {
      title: "Security & Auth",
      icon: <Shield className="w-5 h-5" />,
      items: [
        "npm install bcryptjs jsonwebtoken cookie cookie-parser",
        "npm install @better-auth/client better-auth",
        "npm install next-auth",
      ],
    },
    {
      title: "Database",
      icon: <Database className="w-5 h-5" />,
      items: [
        "npm install @prisma/client",
        "npm install prisma --save-dev",
        "npx prisma init",
        "npx prisma migrate reset",
        "npx prisma migrate dev",
        "npx prisma generate",
        "npx prisma db push",
        "npm run prisma:seed",
        "npx prisma studio",
      ],
    },
    {
      title: "UI & Design",
      icon: <Palette className="w-5 h-5" />,
      items: [
        "npm install tailwindcss postcss autoprefixer",
        "npx shadcn@latest add 'https://21st.dev/r/minhxthanh/404-page-not-found'",
        "npx shadcn@latest add alert avatar badge button card checkbox dropdown-menu input label progress select separator skeleton sonner switch tabs textarea tootip",
        "npm install lucide-react",
        "npm install next-themes class-variance-authority clsx tailwind-merge",
      ],
    },
    {
      title: "Forms & Validation",
      icon: <Key className="w-5 h-5" />,
      items: ["npm install react-hook-form", "npm install zod"],
    },
    {
      title: "Emails",
      icon: <Mail className="w-5 h-5" />,
      items: ["npm install resend"],
    },
  ];

  const globalCommands = [
    "npm install",
    "npm run dev",
    "npm run build",
    "npm run start",
    "npm run lint",
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Project Configuration</h1>
      {/* Translated */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Global Commands</h2>
        {/* Translated */}
        <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {globalCommands.map((cmd, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md font-mono text-sm"
            >
              {cmd}
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  {section.icon}
                </div>
                <CardTitle>{section.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm font-mono flex justify-between items-center"
                  >
                    <span>{item}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(item)}
                    >
                      Copy
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UseFull;
