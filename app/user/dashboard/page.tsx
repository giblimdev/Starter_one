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
        User not found
      </div>
    );

  const projects: Project[] = user.projects ? JSON.parse(user.projects) : [];
  const tasks: Task[] = user.tasks ? JSON.parse(user.tasks) : [];
  const timeLogs: TimeLog[] = user.timeLogs ? JSON.parse(user.timeLogs) : [];
  const activities: Activity[] = user.activities
    ? JSON.parse(user.activities)
    : [];

  const totalTimeLogged =
    timeLogs.reduce((sum, log) => sum + (log.duration || 0), 0) / 3600;
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        {user.userImage ? (
          <Image
            src={user.userImage}
            alt={user.userName || "User"}
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
          <h1 className="text-3xl font-bold">{user.userName || "User"}</h1>
          <p className="text-muted-foreground capitalize">
            {user.userRole?.toLowerCase() || "member"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Briefcase />}
          value={projects.length}
          label="Projects"
        />
        <StatCard
          icon={<CheckCircle />}
          value={completedTasks}
          label="Completed Tasks"
        />
        <StatCard
          icon={<Clock />}
          value={`${totalTimeLogged.toFixed(1)}h`}
          label="Time Logged"
        />
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="timeLogs">Time Logs</TabsTrigger>
          <TabsTrigger value="activities">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {projects.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>{project.name}</TableCell>
                        <TableCell>{project.status}</TableCell>
                        <TableCell>
                          {new Date(project.createdAt).toLocaleDateString(
                            "en-US"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No projects found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {tasks.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{task.status}</TableCell>
                        <TableCell>{task.priority || "Unspecified"}</TableCell>
                        <TableCell>
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString("en-US")
                            : "None"}
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
                <p className="text-muted-foreground">No tasks found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeLogs">
          <Card>
            <CardHeader>
              <CardTitle>Time Logs</CardTitle>
            </CardHeader>
            <CardContent>
              {timeLogs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Start</TableHead>
                      <TableHead>End</TableHead>
                      <TableHead>Duration (hours)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timeLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {new Date(log.startTime).toLocaleString("en-US")}
                        </TableCell>
                        <TableCell>
                          {log.endTime
                            ? new Date(log.endTime).toLocaleString("en-US")
                            : "Ongoing"}
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
                <p className="text-muted-foreground">No time logs found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
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
                          {new Date(activity.timestamp).toLocaleString("en-US")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No activities found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

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
