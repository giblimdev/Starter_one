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
      name: "1. Authentification Utilisateur",
      totalHours: 27,
      completedHours: 0,
      tasks: [
        {
          id: "auth-1",
          title: "Configurer BetterAuth.js",
          priority: "High",
          effort: 8,
          description: "Configuration des fournisseurs (Email/Google/GitHub)",
          subtasks: [
            "Créer la route /api/auth/[...all]",
            "Configurer l'adaptateur Prisma",
            "Ajouter les variables d'environnement",
          ],
          dependencies: ["BetterAuth", "bcrypt"],
          completed: false,
        },
        {
          id: "auth-2",
          title: "Formulaire d'inscription",
          priority: "High",
          effort: 4,
          description: "Page /auth/signup avec validation",
          subtasks: [
            "Champs email/nom/mot de passe",
            "Validation avec Zod",
            "Notifications toast",
          ],
          dependencies: ["react-hook-form", "zod", "sonner"],
          completed: false,
        },
        {
          id: "auth-3",
          title: "Formulaire de connexion",
          priority: "High",
          effort: 3,
          description: "Page /auth/signin sécurisée",
          dependencies: ["react-hook-form", "zod"],
          completed: false,
        },
        {
          id: "auth-4",
          title: "Gestion des rôles",
          priority: "High",
          effort: 6,
          description: "Système de permissions",
          subtasks: [
            "Ajouter enum Role au schéma",
            "Middleware de protection",
            "Restreindre /admin aux ADMIN",
          ],
          completed: false,
        },
        {
          id: "auth-5",
          title: "Réinitialisation mot de passe",
          priority: "Medium",
          effort: 6,
          description: "Flux complet de réinitialisation",
          subtasks: [
            "Pages forgot/reset password",
            "Envoi d'emails via Resend",
          ],
          completed: false,
        },
      ],
    },
    {
      id: "posts",
      name: "2. Gestion des Articles",
      totalHours: 21,
      completedHours: 0,
      tasks: [
        {
          id: "posts-1",
          title: "Finaliser NewPostForm",
          priority: "High",
          effort: 4,
          subtasks: [
            "Validation authorId",
            "Création automatique des slugs",
            "Tests de soumission",
          ],
          completed: false,
        },
        {
          id: "posts-2",
          title: "Édition d'articles",
          priority: "High",
          effort: 6,
          description: "Page /admin/posts/[id]/edit",
          dependencies: ["react-datepicker"],
          completed: false,
        },
        {
          id: "posts-3",
          title: "Suppression d'articles",
          priority: "Medium",
          effort: 3,
          description: "Avec confirmation",
          dependencies: ["Shadcn/UI Dialog"],
          completed: false,
        },
        {
          id: "posts-4",
          title: "Liste des articles",
          priority: "High",
          effort: 8,
          subtasks: [
            "Tableau avec tri/filtre",
            "Pagination",
            "Recherche instantanée",
          ],
          dependencies: ["react-query"],
          completed: false,
        },
      ],
    },
    {
      id: "public",
      name: "3. Pages Publiques",
      totalHours: 28,
      completedHours: 0,
      tasks: [
        {
          id: "public-1",
          title: "Page d'accueil",
          priority: "High",
          effort: 6,
          description: "Liste des derniers articles publiés",
          dependencies: ["next/image"],
          completed: false,
        },
        {
          id: "public-2",
          title: "Page article",
          priority: "High",
          effort: 8,
          subtasks: [
            "Rendu Markdown",
            "Génération SSG",
            "Système de likes/views",
          ],
          dependencies: ["react-markdown"],
          completed: false,
        },
        {
          id: "public-3",
          title: "Pages catégories/tags",
          priority: "Medium",
          effort: 6,
          description: "Routes dynamiques",
          completed: false,
        },
        {
          id: "public-4",
          title: "Recherche",
          priority: "Medium",
          effort: 8,
          description: "Recherche full-text",
          dependencies: ["algolia"],
          completed: false,
        },
      ],
    },
    {
      id: "comments",
      name: "4. Système de Commentaires",
      totalHours: 21,
      completedHours: 0,
      tasks: [
        {
          id: "comments-1",
          title: "Formulaire de commentaire",
          priority: "High",
          effort: 4,
          description: "Validation en temps réel",
          dependencies: ["zod"],
          completed: false,
        },
        {
          id: "comments-2",
          title: "Affichage des commentaires",
          priority: "High",
          effort: 4,
          subtasks: ["Pagination", "Tri chronologique"],
          completed: false,
        },
        {
          id: "comments-3",
          title: "Édition de commentaires",
          priority: "Medium",
          effort: 4,
          description: "Fenêtre de 15 minutes",
          completed: false,
        },
        {
          id: "comments-4",
          title: "Modération",
          priority: "Medium",
          effort: 6,
          subtasks: ["Interface admin", "Filtres par statut"],
          completed: false,
        },
        {
          id: "comments-5",
          title: "Suppression",
          priority: "Medium",
          effort: 3,
          dependencies: ["Shadcn/UI Dialog"],
          completed: false,
        },
      ],
    },
    {
      id: "admin",
      name: "5. Administration",
      totalHours: 18,
      completedHours: 0,
      tasks: [
        {
          id: "admin-1",
          title: "Dashboard",
          priority: "Medium",
          effort: 8,
          description: "Statistiques et activité récente",
          dependencies: ["recharts"],
          completed: false,
        },
        {
          id: "admin-2",
          title: "Gestion utilisateurs",
          priority: "Medium",
          effort: 6,
          subtasks: ["CRUD complet", "Changement de rôles"],
          completed: false,
        },
        {
          id: "admin-3",
          title: "Paramètres",
          priority: "Low",
          effort: 4,
          description: "Configuration du blog",
          completed: false,
        },
      ],
    },
    {
      id: "seo",
      name: "6. SEO & Performance",
      totalHours: 16,
      completedHours: 0,
      tasks: [
        {
          id: "seo-1",
          title: "Métadonnées",
          priority: "High",
          effort: 4,
          dependencies: ["next-seo"],
          completed: false,
        },
        {
          id: "seo-2",
          title: "Sitemap",
          priority: "Medium",
          effort: 3,
          dependencies: ["next-sitemap"],
          completed: false,
        },
        {
          id: "seo-3",
          title: "Optimisation",
          priority: "Medium",
          effort: 6,
          subtasks: ["Lazy loading", "Cache stratégique"],
          completed: false,
        },
        {
          id: "seo-4",
          title: "Flux RSS",
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
      <h1 className="text-3xl font-bold mb-6">Blog Development To-Do List</h1>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span>
            Progression globale: {completedHours}h/{totalHours}h
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
                    {category.completedHours}h complétées sur{" "}
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
                                SOUS-TÂCHES:
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
                                DÉPENDANCES:
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
