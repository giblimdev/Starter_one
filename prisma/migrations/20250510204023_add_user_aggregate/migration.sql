-- CreateTable
CREATE TABLE "user_aggregate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userName" TEXT,
    "userEmail" TEXT,
    "userImage" TEXT,
    "userRole" TEXT NOT NULL DEFAULT 'USER',
    "userLang" TEXT DEFAULT 'en',
    "userCreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userUpdatedAt" DATETIME NOT NULL,
    "sessions" JSONB NOT NULL,
    "accounts" JSONB NOT NULL,
    "memberProjects" JSONB NOT NULL,
    "projects" JSONB NOT NULL,
    "files" JSONB NOT NULL,
    "tasks" JSONB NOT NULL,
    "subtasks" JSONB NOT NULL,
    "comments" JSONB NOT NULL,
    "timeLogs" JSONB NOT NULL,
    "epics" JSONB NOT NULL,
    "userStories" JSONB NOT NULL,
    "sprints" JSONB NOT NULL,
    "themas" JSONB NOT NULL,
    "activities" JSONB NOT NULL,
    "fileDependencies" JSONB NOT NULL,
    "fileRelations" JSONB NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_aggregate_userEmail_key" ON "user_aggregate"("userEmail");
