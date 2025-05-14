"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronRight } from "lucide-react";

type Task = {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  effort: number;
  description?: string;
  subtasks?: string[];
  dependencies?: string[];
  completed: boolean;
};

type Category = {
  id: string;
  name: string;
  totalHours: number;
  completedHours: number;
  tasks: Task[];
};

const DevToDoList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "auth",
      name: "1. User Authentication", // Translated
      totalHours: 27,
      completedHours: 0,
      tasks: [
        {
          id: "auth-1",
          title: "Configure BetterAuth.js", // Translated
          priority: "High",
          effort: 8,
          description: "Provider configuration (Email/Google/GitHub)", // Translated
          subtasks: [
            "Create /api/auth/[...all] route", // Translated
            "Configure Prisma adapter", // Translated
            "Add environment variables", // Translated
          ],
          dependencies: ["BetterAuth", "bcrypt"], // Kept as is (library names)
          completed: false,
        },
        {
          id: "auth-2",
          title: "Signup Form", // Translated
          priority: "High",
          effort: 4,
          description: "/auth/signup page with validation", // Translated
          subtasks: [
            "Email/Name/Password fields", // Translated
            "Validation with Zod", // Translated
            "Toast notifications", // Translated
          ],
          dependencies: ["react-hook-form", "zod", "sonner"], // Kept as is
          completed: false,
        },
        {
          id: "auth-3",
          title: "Login Form", // Translated
          priority: "High",
          effort: 3,
          description: "Secure /auth/signin page", // Translated
          dependencies: ["react-hook-form", "zod"], // Kept as is
          completed: false,
        },
        {
          id: "auth-4",
          title: "Role Management", // Translated
          priority: "High",
          effort: 6,
          description: "Permissions system", // Translated
          subtasks: [
            "Add Role enum to schema", // Translated
            "Protection middleware", // Translated
            "Restrict /admin to ADMIN", // Translated
          ],
          completed: false,
        },
        {
          id: "auth-5",
          title: "Password Reset", // Translated
          priority: "Medium",
          effort: 6,
          description: "Complete reset flow", // Translated
          subtasks: [
            "Forgot/reset password pages", // Translated
            "Email sending via Resend", // Translated
          ],
          completed: false,
        },
      ],
    },
    {
      id: "posts",
      name: "2. Post Management", // Translated
      totalHours: 21,
      completedHours: 0,
      tasks: [
        {
          id: "posts-1",
          title: "Finalize NewPostForm", // Translated
          priority: "High",
          effort: 4,
          subtasks: [
            "AuthorId validation", // Translated
            "Automatic slug generation", // Translated
            "Submission tests", // Translated
          ],
          completed: false,
        },
        {
          id: "posts-2",
          title: "Post Editing", // Translated
          priority: "High",
          effort: 6,
          description: "/admin/posts/[id]/edit page", // Translated
          dependencies: ["react-datepicker"], // Kept as is
          completed: false,
        },
        {
          id: "posts-3",
          title: "Post Deletion", // Translated
          priority: "Medium",
          effort: 3,
          description: "With confirmation", // Translated
          dependencies: ["Shadcn/UI Dialog"], // Kept as is
          completed: false,
        },
        {
          id: "posts-4",
          title: "Post List", // Translated
          priority: "High",
          effort: 8,
          subtasks: [
            "Table with sorting/filtering", // Translated
            "Pagination", // Kept as is
            "Instant search", // Translated
          ],
          dependencies: ["react-query"], // Kept as is
          completed: false,
        },
      ],
    },
    {
      id: "public",
      name: "3. Public Pages", // Translated
      totalHours: 28,
      completedHours: 0,
      tasks: [
        {
          id: "public-1",
          title: "Homepage", // Translated
          priority: "High",
          effort: 6,
          description: "List of latest published articles", // Translated
          dependencies: ["next/image"], // Kept as is
          completed: false,
        },
        {
          id: "public-2",
          title: "Post Page", // Translated
          priority: "High",
          effort: 8,
          subtasks: [
            "Markdown rendering", // Translated
            "SSG generation", // Translated
            "Likes/Views system", // Translated
          ],
          dependencies: ["react-markdown"], // Kept as is
          completed: false,
        },
        {
          id: "public-3",
          title: "Category/Tag Pages", // Translated
          priority: "Medium",
          effort: 6,
          description: "Dynamic routes", // Translated
          completed: false,
        },
        {
          id: "public-4",
          title: "Search", // Translated
          priority: "Medium",
          effort: 8,
          description: "Full-text search", // Translated
          dependencies: ["algolia"], // Kept as is
          completed: false,
        },
      ],
    },
    {
      id: "comments",
      name: "4. Comment System", // Translated
      totalHours: 21,
      completedHours: 0,
      tasks: [
        {
          id: "comments-1",
          title: "Comment Form", // Translated
          priority: "High",
          effort: 4,
          description: "Real-time validation", // Translated
          dependencies: ["zod"], // Kept as is
          completed: false,
        },
        {
          id: "comments-2",
          title: "Comment Display", // Translated
          priority: "High",
          effort: 4,
          subtasks: ["Pagination", "Chronological sorting"], // Translated
          completed: false,
        },
        {
          id: "comments-3",
          title: "Comment Editing", // Translated
          priority: "Medium",
          effort: 4,
          description: "15-minute window", // Translated
          completed: false,
        },
        {
          id: "comments-4",
          title: "Moderation", // Kept as is
          priority: "Medium",
          effort: 6,
          subtasks: ["Admin interface", "Status filters"], // Translated
          completed: false,
        },
        {
          id: "comments-5",
          title: "Deletion", // Translated
          priority: "Medium",
          effort: 3,
          dependencies: ["Shadcn/UI Dialog"], // Kept as is
          completed: false,
        },
      ],
    },
    {
      id: "admin",
      name: "5. Administration", // Kept as is
      totalHours: 18,
      completedHours: 0,
      tasks: [
        {
          id: "admin-1",
          title: "Dashboard", // Kept as is
          priority: "Medium",
          effort: 8,
          description: "Statistics and recent activity", // Translated
          dependencies: ["recharts"], // Kept as is
          completed: false,
        },
        {
          id: "admin-2",
          title: "User Management", // Translated
          priority: "Medium",
          effort: 6,
          subtasks: ["Complete CRUD", "Role changes"], // Translated
          completed: false,
        },
        {
          id: "admin-3",
          title: "Settings", // Translated
          priority: "Low",
          effort: 4,
          description: "Blog configuration", // Translated
          completed: false,
        },
      ],
    },
    {
      id: "seo",
      name: "6. SEO & Performance", // Kept as is
      totalHours: 16,
      completedHours: 0,
      tasks: [
        {
          id: "seo-1",
          title: "Metadata", // Kept as is
          priority: "High",
          effort: 4,
          dependencies: ["next-seo"], // Kept as is
          completed: false,
        },
        {
          id: "seo-2",
          title: "Sitemap", // Kept as is
          priority: "Medium",
          effort: 3,
          dependencies: ["next-sitemap"], // Kept as is
          completed: false,
        },
        {
          id: "seo-3",
          title: "Optimization", // Translated
          priority: "Medium",
          effort: 6,
          subtasks: ["Lazy loading", "Strategic caching"], // Translated
          completed: false,
        },
        {
          id: "seo-4",
          title: "RSS Feed", // Translated
          priority: "Medium",
          effort: 3,
          completed: false,
        },
      ],
    },
  ]);

  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    "auth"
  );

  const toggleTaskCompletion = (categoryId: string, taskId: string) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          const updatedTasks = category.tasks.map((task) => {
            if (task.id === taskId) {
              const newCompleted = !task.completed;
              return {
                ...task,
                completed: newCompleted,
              };
            }
            return task;
          });

          const completedHours = updatedTasks.reduce(
            (sum, task) => (task.completed ? sum + task.effort : sum),
            0
          );

          return {
            ...category,
            tasks: updatedTasks,
            completedHours,
          };
        }
        return category;
      })
    );
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const totalHours = categories.reduce((sum, cat) => sum + cat.totalHours, 0);
  const completedHours = categories.reduce(
    (sum, cat) => sum + cat.completedHours,
    0
  );
  const progress = Math.round((completedHours / totalHours) * 100);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Blog Development To-Do List</h1>{" "}
      {/* Kept as is */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span>
            Overall Progress: {completedHours}h/{totalHours}h {/* Translated */}
          </span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-4" />
      </div>
      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleCategory(category.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{category.name}</CardTitle>
                  <div className="text-sm text-gray-500 mt-1">
                    {category.completedHours}h completed out of{" "}
                    {/* Translated */}
                    {category.totalHours}h
                    <Progress
                      value={
                        (category.completedHours / category.totalHours) * 100
                      }
                      className="h-2 mt-2"
                    />
                  </div>
                </div>
                {expandedCategory === category.id ? (
                  <ChevronDown />
                ) : (
                  <ChevronRight />
                )}
              </div>
            </CardHeader>
            {expandedCategory === category.id && (
              <CardContent>
                <div className="space-y-4">
                  {category.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`border rounded-lg p-4 transition-all ${
                        task.completed ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() =>
                            toggleTaskCompletion(category.id, task.id)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h3
                              className={`font-medium ${
                                task.completed
                                  ? "line-through text-gray-500"
                                  : ""
                              }`}
                            >
                              {task.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  task.priority === "High"
                                    ? "bg-red-100 text-red-800"
                                    : task.priority === "Medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                }`}
                              >
                                {task.priority}
                              </span>
                              <span className="text-sm text-gray-600">
                                {task.effort}h
                              </span>
                            </div>
                          </div>
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {task.description}
                            </p>
                          )}
                          {task.subtasks && (
                            <div className="mt-3 space-y-2">
                              <h4 className="text-xs font-semibold text-gray-500">
                                SUBTASKS: {/* Translated */}
                              </h4>
                              <ul className="space-y-1 pl-4">
                                {task.subtasks.map((subtask, i) => (
                                  <li
                                    key={i}
                                    className="text-sm text-gray-600 flex items-start"
                                  >
                                    <span className="mr-2">•</span>
                                    <span>{subtask}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {task.dependencies && (
                            <div className="mt-3">
                              <h4 className="text-xs font-semibold text-gray-500">
                                DEPENDENCIES: {/* Translated */}
                              </h4>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {task.dependencies.map((dep, i) => (
                                  <span
                                    key={i}
                                    className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                                  >
                                    {dep}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DevToDoList;
