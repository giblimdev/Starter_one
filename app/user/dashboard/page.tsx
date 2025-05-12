"use client";

import { useSession } from "@/lib/auth/auth-client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, CheckCircle, Activity, Clock } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

type UserAggregate = {
  id: string;
  userName?: string;
  userEmail?: string;
  userImage?: string;
  userRole?: string;
  userLang?: string;
  userCreatedAt: string;
  userUpdatedAt: string;
  memberProjects?: string;
  projects?: string;
  tasks?: string;
  comments?: string;
  activities?: string;
  timeLogs?: string;
  epics?: string;
  userStories?: string;
  sprints?: string;
  themas?: string;
  sessions?: string;
  accounts?: string;
};

type Project = {
  id: string;
  name: string;
  description?: string;
  status: string;
  createdAt: string;
};

type Task = {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  createdAt: string;
  dueDate?: string;
};

type TimeLog = {
  id: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  createdAt: string;
};

type Activity = {
  id: string;
  action: string;
  entityId: string;
  timestamp: string;
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserAggregate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) {
        console.log("No user ID in session");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching data for user ID:", session.user.id);
        const res = await fetch(`/api/user/dashboard/${session.user.id}`);
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session]);

  if (loading) return <DashboardSkeleton />;
  if (!user)
    return (
      <div className="container mx-auto py-8 text-center text-red-600">
        Utilisateur non trouvé
      </div>
    );

  // Parse JSON fields
  const projects: Project[] = user.projects ? JSON.parse(user.projects) : [];
  const tasks: Task[] = user.tasks ? JSON.parse(user.tasks) : [];
  const timeLogs: TimeLog[] = user.timeLogs ? JSON.parse(user.timeLogs) : [];
  const activities: Activity[] = user.activities
    ? JSON.parse(user.activities)
    : [];

  // Calculate time metrics
  const totalTimeLogged =
    timeLogs.reduce((sum, log) => sum + (log.duration || 0), 0) / 3600; // Convert seconds to hours
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        {user.userImage ? (
          <Image
            src={user.userImage}
            alt={user.userName || "Utilisateur"}
            width={64}
            height={64}
            className="rounded-full border-2 border-white shadow-md"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {user.userName?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">
            {user.userName || "Utilisateur"}
          </h1>
          <p className="text-muted-foreground capitalize">
            {user.userRole?.toLowerCase() || "membre"}
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Briefcase />}
          value={projects.length}
          label="Projets"
        />
        <StatCard
          icon={<CheckCircle />}
          value={completedTasks}
          label="Tâches terminées"
        />
        <StatCard
          icon={<Clock />}
          value={`${totalTimeLogged.toFixed(1)}h`}
          label="Temps travaillé"
        />
      </div>

      {/* Tabs for Detailed Data */}
      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="projects">Projets</TabsTrigger>
          <TabsTrigger value="tasks">Tâches</TabsTrigger>
          <TabsTrigger value="timeLogs">Temps</TabsTrigger>
          <TabsTrigger value="activities">Activités</TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projets</CardTitle>
            </CardHeader>
            <CardContent>
              {projects.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Créé le</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>{project.name}</TableCell>
                        <TableCell>{project.status}</TableCell>
                        <TableCell>
                          {new Date(project.createdAt).toLocaleDateString(
                            "fr-FR"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">Aucun projet trouvé.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Tâches</CardTitle>
            </CardHeader>
            <CardContent>
              {tasks.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Priorité</TableHead>
                      <TableHead>Échéance</TableHead>
                      <TableHead>Progrès</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{task.status}</TableCell>
                        <TableCell>{task.priority || "Non spécifié"}</TableCell>
                        <TableCell>
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString("fr-FR")
                            : "Aucune"}
                        </TableCell>
                        <TableCell>
                          <Progress
                            value={
                              task.status === "COMPLETED"
                                ? 100
                                : task.status === "IN_PROGRESS"
                                  ? 50
                                  : 0
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">Aucune tâche trouvée.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Time Logs Tab */}
        <TabsContent value="timeLogs">
          <Card>
            <CardHeader>
              <CardTitle>Temps travaillé</CardTitle>
            </CardHeader>
            <CardContent>
              {timeLogs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Début</TableHead>
                      <TableHead>Fin</TableHead>
                      <TableHead>Durée (heures)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timeLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {new Date(log.startTime).toLocaleString("fr-FR")}
                        </TableCell>
                        <TableCell>
                          {log.endTime
                            ? new Date(log.endTime).toLocaleString("fr-FR")
                            : "En cours"}
                        </TableCell>
                        <TableCell>
                          {log.duration
                            ? (log.duration / 3600).toFixed(1)
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">Aucun temps enregistré.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Activités récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>{activity.action}</TableCell>
                        <TableCell>
                          {new Date(activity.timestamp).toLocaleString("fr-FR")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">
                  Aucune activité trouvée.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Utility Components
function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="text-primary">{icon}</div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <Skeleton className="h-16 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
