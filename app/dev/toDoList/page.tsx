"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronRight } from "lucide-react";

/**
 * Représente une tâche détaillée dans la roadmap de développement.
 */
type Task = {
  id: string;
  title: string;
  effort: number; // effort estimé en heures
  description?: string;
  completed: boolean;
  subtasks?: string[];
  dependencies?: string[];
  priority?: "Low" | "Medium" | "High";
  category: string;
  role?: "admin" | "user";
  responsible?: string;
  link?: string;
};

/**
 * Tâches de développement de l'application (mockées en local).
 */
const initialTasks: Task[] = [
  {
    id: "auth-setup",
    category: "Authentification",
    title: "Configurer BetterAuth",
    description: "Configurer les routes, les providers, et le middleware",
    completed: false,
    effort: 4,
    priority: "High",
    subtasks: [
      "Créer la route /api/auth/[...all]",
      "Configurer PrismaAdapter",
      "Mettre en place les providers",
    ],
    dependencies: ["better-auth", "prisma"],
    responsible: "jean",
  },
  {
    id: "user-signup",
    category: "Authentification",
    title: "Créer les pages d'inscription/connexion",
    completed: false,
    effort: 3,
    subtasks: ["Formulaire React", "Validation avec zod", "Toast de feedback"],
    link: "/auth/sign-up",
  },
  {
    id: "admin-users",
    category: "Administration",
    title: "CRUD utilisateurs + gestion des rôles",
    completed: false,
    effort: 4,
    priority: "High",
    subtasks: ["Liste des users", "Changer les rôles", "Supprimer un user"],
    role: "admin",
  },
  {
    id: "post-editor",
    category: "Articles",
    title: "Formulaire de création d'article",
    completed: false,
    effort: 4,
    description: "Markdown + images + catégorie",
    dependencies: ["react-hook-form", "zod"],
    responsible: "dev-content",
  },
  {
    id: "comment-system",
    category: "Commentaires",
    title: "Mise en place du système de commentaires",
    completed: false,
    effort: 3,
    description: "Liés à l'article + CRUD + modération",
  },
  {
    id: "seo-next",
    category: "SEO",
    title: "Optimisation du SEO avec next-seo",
    completed: false,
    effort: 2,
    priority: "Medium",
    link: "/",
  },
];

export default function ToDoListApp() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleCategory = (category: string) => {
    setExpanded((prev) => {
      const copy = new Set(prev);
      if (copy.has(category)) copy.delete(category);
      else copy.add(category);
      return copy;
    });
  };

  const categories = Array.from(new Set(tasks.map((t) => t.category)));
  const totalEffort = tasks.reduce((acc, t) => acc + t.effort, 0);
  const doneEffort = tasks
    .filter((t) => t.completed)
    .reduce((acc, t) => acc + t.effort, 0);
  const globalProgress = Math.round((doneEffort / totalEffort) * 100);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">To-Do List de développement</h1>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span>
            Progression globale : {doneEffort}h / {totalEffort}h
          </span>
          <span>{globalProgress}%</span>
        </div>
        <Progress value={globalProgress} className="h-4" />
      </div>

      <div className="space-y-4">
        {categories.map((cat) => {
          const catTasks = tasks.filter((t) => t.category === cat);
          const catDone = catTasks
            .filter((t) => t.completed)
            .reduce((acc, t) => acc + t.effort, 0);
          const catTotal = catTasks.reduce((acc, t) => acc + t.effort, 0);
          const catProgress = Math.round((catDone / catTotal) * 100);

          return (
            <Card key={cat}>
              <CardHeader
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleCategory(cat)}
              >
                <div className="flex justify-between items-center">
                  <CardTitle>{cat}</CardTitle>
                  {expanded.has(cat) ? <ChevronDown /> : <ChevronRight />}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {catDone}h / {catTotal}h
                  <Progress value={catProgress} className="h-2 mt-2" />
                </div>
              </CardHeader>

              {expanded.has(cat) && (
                <CardContent className="space-y-3">
                  {catTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`border rounded-md p-3 ${
                        task.completed ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <div className="flex gap-3 items-start">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h3
                              className={`font-medium ${
                                task.completed
                                  ? "line-through text-gray-500"
                                  : ""
                              }`}
                            >
                              {task.title}
                            </h3>
                            <span className="text-sm text-gray-600">
                              {task.effort}h
                            </span>
                          </div>

                          {task.description && (
                            <p className="text-sm text-gray-500 mt-1">
                              {task.description}
                            </p>
                          )}

                          {task.subtasks?.length && (
                            <ul className="mt-2 ml-4 list-disc text-sm text-gray-600 space-y-1">
                              {task.subtasks.map((sub, i) => (
                                <li key={i}>{sub}</li>
                              ))}
                            </ul>
                          )}

                          {task.dependencies?.length && (
                            <p className="text-xs text-gray-400 mt-2">
                              Dépendances : {task.dependencies.join(", ")}
                            </p>
                          )}

                          {task.role && (
                            <p className="text-xs text-gray-400">
                              Rôle concerné : {task.role}
                            </p>
                          )}

                          {task.responsible && (
                            <p className="text-xs text-gray-400">
                              Assigné à : {task.responsible}
                            </p>
                          )}

                          {task.link && (
                            <a
                              href={task.link}
                              className="block text-xs text-blue-500 underline mt-1"
                            >
                              Voir la page liée
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
