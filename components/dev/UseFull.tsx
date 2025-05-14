"use client";
import { Terminal, Shield, Database, Palette, Mail, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

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

  const prismaSchema = `
generator client {
  provider = "prisma-client-js" // Specifies the Prisma client generator
  output   = "../lib/generated/prisma/client" // Output path for the generated client
}

datasource db {
  provider = "sqlite" // Database provider (SQLite)
  url      = env("DATABASE_URL") // Database connection URL, taken from environment variables
}

enum Role {
  USER // Standard user with limited rights
  READER // User with read-only rights
  AUTHOR // User who can create content
  DEV // Developer with technical rights
  ADMIN // Administrator with all rights
}

enum Status {
  TODO // Task/project/sprint to do
  IN_PROGRESS // Task/project/sprint in progress
  REVIEW // Task/project/sprint in review
  DONE // Task/project/sprint completed
  BLOCKED // Task/project/sprint blocked
  CANCELLED // Task/project/sprint cancelled
}

enum FileType {
  DOCUMENT // Document file type (e.g. PDF, Word)
  IMAGE // Image file type (e.g. JPG, PNG)
  SPREADSHEET // Spreadsheet file type (e.g. Excel)
  PRESENTATION // Presentation file type (e.g. PowerPoint)
  ARCHIVE // Archive file type (e.g. ZIP)
  CODE // Source code file type
  OTHER // Other file type
}

enum ActionType {
  CREATE // Create action
  UPDATE // Update action
  DELETE // Delete action
}

enum RelationType {
  IMPORT // File import (e.g. import in code)
  REFERENCE // File reference (e.g. logical link)
  OTHER // Other relation type
}

model User {
  id            String   @id @default(uuid()) // Unique user identifier
  name          String? // User name (optional)
  email         String?  @unique // Unique user email (optional)
  emailVerified Boolean  @default(false) // Indicates if the email is verified
  image         String? // Profile image URL (optional)
  role          Role     @default(USER) // User role in the application
  lang          String?  @default("en") // User's preferred language
  createdAt     DateTime @default(now()) // Account creation date
  updatedAt     DateTime @updatedAt // Account last update date

  sessions      Session[] // User's active sessions
  accounts      Account[] // Linked authentication accounts
  memberships   Member[] // Projects where the user is a member
  verifications Verification[] // Verifications associated with the user

  @@index([email]) // Index on email for quick lookups
  @@map("user") // Table name in the database
}

model Session {
  id        String   @id @default(uuid()) // Unique session identifier
  userId    String // Associated user ID
  token     String   @unique // Unique session token
  expiresAt DateTime // Session expiration date
  ipAddress String? // Connection IP address (optional)
  userAgent String? // Browser user agent (optional)
  createdAt DateTime @default(now()) // Session creation date
  updatedAt DateTime @updatedAt // Session last update date

  user User @relation(fields: [userId], references: [id], onDelete: Cascade) // Relation with the user, cascade deletion

  @@map("session") // Table name in the database
}

model Account {
  id                  String    @id @default(uuid()) // Unique account identifier
  userId              String // Associated user ID
  accountId           String // Account ID at the provider
  providerId          String // Provider identifier (e.g. Google, GitHub)
  accessToken         String? // OAuth access token (optional)
  refreshToken        String? // OAuth refresh token (optional)
  accessTokenExpiresAt  DateTime? // Access token expiration date
  refreshTokenExpiresAt DateTime? // Refresh token expiration date
  scope               String? // OAuth authorization scope
  idToken             String? // OAuth identity token
  password            String? // Hashed password (for local authentication)
  createdAt           DateTime  @default(now()) // Account creation date
  updatedAt           DateTime  @updatedAt // Account last update date

  user User @relation(fields: [userId], references: [id], onDelete: Cascade) // Relation with the user, cascade deletion

  @@map("account") // Table name in the database
}

model Verification {
  id          String   @id @default(uuid()) // Unique verification identifier
  identifier  String // Identifier to verify (e.g. email)
  value       String // Verification value (e.g. token)
  expiresAt   DateTime // Token expiration date
  createdAt   DateTime @default(now()) // Verification creation date
  updatedAt   DateTime @updatedAt // Verification last update date

  user    User   @relation(fields: [userId], references: [id], onDelete: Cascade) // Associated user
  userId  String // User ID

  @@map("verification") // Table name in the database
}

model UserAggregate {
  id String @id @default(uuid())

  // User data (scalar fields)
  userName        String?
  userEmail       String?  @unique
  userImage       String?
  userRole        Role     @default(USER)
  userLang        String?  @default("en")
  userCreatedAt   DateTime @default(now())
  userUpdatedAt   DateTime @updatedAt

  // Relations (JSON arrays)
  sessions         Json // Stores Session[]
  accounts         Json // Stores Account[]
  memberProjects   Json // Stores Member[]
  projects         Json // Stores Project[]
  files            Json // Stores File[]
  tasks            Json // Stores Task[]
  subtasks         Json // Stores Subtask[]
  comments         Json // Stores Comment[]
  timeLogs         Json // Stores TimeLog[]
  epics            Json // Stores Epic[]
  userStories      Json // Stores UserStory[]
  sprints          Json // Stores Sprint[]
  themas           Json // Stores Thema[]
  activities       Json // Stores ActivityLog[]
  fileDependencies Json // Stores Dependency[]
  fileRelations    Json // Stores FileRelation[]

  @@map("user_aggregate")
}

model Project {
  id          String    @id @default(uuid()) // Unique project identifier
  name        String // Project name
  description String? // Project description (optional)
  image       String? // Project image URL (optional)
  status      Status    @default(TODO) // Project status
  priority    Int       @default(1) // Project priority (1 = low)
  startDate   DateTime? // Project start date (optional)
  endDate     DateTime? // Project end date (optional)
  createdAt   DateTime  @default(now()) // Project creation date
  updatedAt   DateTime  @updatedAt // Project last update date

  themas      Thema[] // Themes associated with the project
  epics       Epic[] // Epics associated with the project
  userStories UserStory[] // User stories associated with the project
  sprints     Sprint[] // Sprints associated with the project
  members     Member[]    @relation("ProjectMembers") // Project members
  folders     Folder[] // Project folders
  files       File[] // Files associated with the project
  comments    Comment[] // Comments on the project
  creator     Member?     @relation("ProjectCreator", fields: [creatorId], references: [id]) // Member who created the project
  creatorId   String? // Creator ID (member)

  @@index([name]) // Index on name for quick lookups
  @@index([status]) // Index on status for effective filtering
  @@map("project") // Table name in the database
}

model Member {
  id        String   @id @default(uuid()) // Unique membership identifier
  role      Role     @default(USER) // Member's role in the project
  joinedAt  DateTime @default(now()) // Project join date
  updatedAt DateTime @updatedAt // Membership last update date

  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade) // Associated user
  userId    String // User ID
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade, name: "ProjectMembers") // Associated project
  projectId String // Project ID

  files           File[] // Files uploaded by the member
  tasks           Task[] // Tasks assigned to the member
  subtasks        Subtask[] // Subtasks assigned to the member
  comments        Comment[] // Comments written by the member
  timeLogs        TimeLog[] // Time logs recorded by the member
  userStories     UserStory[] // User stories created by the member
  themas          Thema[] // Themes created by the member
  epics           Epic[] // Epics created by the member
  sprints         Sprint[] // Sprints created by the member
  activities      ActivityLog[] // Activities recorded for this member
  createdProjects Project[]     @relation("ProjectCreator") // Projects created by the member

  @@unique([userId, projectId]) // Uniqueness of the user-project pair
  @@map("member") // Table name in the database
}

model Thema {
  id          String    @id @default(uuid()) // Unique theme identifier
  name        String // Theme name
  description String? // Theme description (optional)
  status      Status    @default(TODO) // Theme status
  priority    Int       @default(1) // Theme priority
  startDate   DateTime? // Theme start date (optional)
  endDate     DateTime? // Theme end date (optional)
  createdAt   DateTime  @default(now()) // Theme creation date
  updatedAt   DateTime  @updatedAt // Theme last update date

  project   Project   @relation(fields: [projectId], references: [id], onDelete: Cascade) // Associated project
  projectId String // Project ID
  creator   Member    @relation(fields: [creatorId], references: [id], onDelete: Cascade) // Member who created the theme
  creatorId String // Creator ID (member)
  tasks     Task[] // Tasks associated with the theme
  comments  Comment[] // Comments on the theme

  @@map("thema") // Table name in the database
}

model Epic {
  id          String    @id @default(uuid()) // Unique epic identifier
  name        String // Epic name
  description String? // Epic description (optional)
  status      Status    @default(TODO) // Epic status
  priority    Int       @default(1) // Epic priority
  startDate   DateTime? // Theme start date (optional) // Kept as is, looks like original error
  endDate     DateTime? // Theme end date (optional) // Kept as is, looks like original error
  createdAt   DateTime  @default(now()) // Epic creation date
  updatedAt   DateTime  @updatedAt // Epic last update date

  project     Project     @relation(fields: [projectId], references: [id], onDelete: Cascade) // Associated project
  projectId   String // Project ID
  creator     Member      @relation(fields: [creatorId], references: [id], onDelete: Cascade) // Member who created the epic
  creatorId   String // Creator ID (member)
  userStories UserStory[] // User stories associated with the epic
  comments    Comment[] // Comments on the epic

  @@map("epic") // Table name in the database
}

model UserStory {
  id          String   @id @default(uuid()) // Unique user story identifier
  title       String // User story title
  description String? // User story description (optional)
  status      Status   @default(TODO) // User story status
  priority    Int      @default(1) // User story priority
  createdAt   DateTime @default(now()) // User story creation date
  updatedAt   DateTime @updatedAt // User story last update date

  project   Project   @relation(fields: [projectId], references: [id], onDelete: Cascade) // Associated project
  projectId String // Project ID
  epic      Epic?     @relation(fields: [epicId], references: [id], onDelete: SetNull) // Associated epic
  epicId    String? // Epic ID (optional)
  creator   Member    @relation(fields: [creatorId], references: [id], onDelete: Cascade) // Member who created the story
  creatorId String // Creator ID (member)
  sprint    Sprint?   @relation(fields: [sprintId], references: [id], onDelete: SetNull) // Associated sprint
  sprintId  String? // Sprint ID (optional)
  tasks     Task[] // Tasks associated with the user story
  comments  Comment[] // Comments on the user story

  @@map("user_story") // Table name in the database
}

model Sprint {
  id          String    @id @default(uuid()) // Unique sprint identifier
  name        String // Sprint name
  description String? // Sprint description (optional)
  status      Status    @default(TODO) // Sprint status
  startDate   DateTime? // Sprint start date (optional)
  endDate     DateTime? // Sprint end date (optional)
  createdAt   DateTime  @default(now()) // Sprint creation date
  updatedAt   DateTime  @updatedAt // Sprint last update date

  project     Project     @relation(fields: [projectId], references: [id], onDelete: Cascade) // Associated project
  projectId   String // Project ID
  creator     Member      @relation(fields: [creatorId], references: [id], onDelete: Cascade) // Member who created the sprint
  creatorId   String // Creator ID (member)
  userStories UserStory[] // User stories associated with the sprint
  tasks       Task[] // Tasks associated with the sprint
  subtasks    Subtask[] // Subtasks associated with the sprint
  files       File[] // Files associated with the sprint

  @@map("sprint") // Table name in the database
}

model Task {
  id                String    @id @default(uuid()) // Unique task identifier
  title             String // Task title
  description       String? // Task description (optional)
  status            Status    @default(TODO) // Task status
  priority          Int       @default(1) // Task priority
  dueDate           DateTime? // Task due date (optional)
  estimatedDuration Int? // Estimated duration in hours (optional)
  createdAt         DateTime  @default(now()) // Task creation date
  updatedAt         DateTime  @updatedAt // Task last update date

  thema           Thema?     @relation(fields: [themaId], references: [id], onDelete: SetNull) // Associated theme
  themaId         String? // Theme ID (optional)
  userStory       UserStory? @relation(fields: [userStoryId], references: [id], onDelete: SetNull) // Associated user story
  userStoryId     String? // User story ID (optional)
  sprint          Sprint?    @relation(fields: [sprintId], references: [id], onDelete: SetNull) // Associated sprint
  sprintId        String? // Sprint ID (optional)
  assignee        Member?    @relation(fields: [assigneeId], references: [id], onDelete: SetNull) // Assigned member
  assigneeId      String? // Assigned member ID (optional)
  subtasks        Subtask[] // Associated subtasks
  dependencies    Task[]     @relation("TaskDependencies") // Tasks that this task depends on
  blockedBy       Task[]     @relation("TaskDependencies") // Tasks that block this task
  comments        Comment[] // Comments on the task
  timeLogs        TimeLog[] // Time logs for the task

  @@map("task") // Table name in the database
}

model Subtask {
  id          String   @id @default(uuid()) // Unique subtask identifier
  title       String // Subtask title
  description String? // Subtask description (optional)
  status      Status   @default(TODO) // Subtask status
  createdAt   DateTime @default(now()) // Subtask creation date
  updatedAt   DateTime @updatedAt // Subtask last update date

  task        Task    @relation(fields: [taskId], references: [id], onDelete: Cascade) // Parent task
  taskId      String // Parent task ID
  sprint      Sprint? @relation(fields: [sprintId], references: [id], onDelete: SetNull) // Associated sprint
  sprintId    String? // Sprint ID (optional)
  assignee    Member? @relation(fields: [assigneeId], references: [id], onDelete: SetNull) // Assigned member
  assigneeId  String? // Assigned member ID (optional)
  files       File[] // Files associated with the subtask

  @@map("subtask") // Table name in the database
}

model Folder {
  id        String   @id @default(uuid()) // Unique folder identifier
  name      String // Folder name
  path      String // Full folder path (e.g. /parent/sub-folder)
  createdAt DateTime @default(now()) // Folder creation date
  updatedAt DateTime @updatedAt // Folder last update date
  parentId  String? // Parent folder ID for hierarchical relation
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade) // Associated project
  projectId String // Project ID
  files     File[] // Files contained in the folder

  @@index([parentId]) // Index on parentId for optimizing hierarchical queries
  @@index([projectId]) // Index on projectId for optimizing project queries
  @@map("project_folder") // Table name in the database
}

model File {
  id          String   @id @default(uuid()) // Unique file identifier
  name        String // File name
  description String? // File description (optional)
  type        FileType // File type (e.g. DOCUMENT, IMAGE)
  size        Int // File size in bytes
  url         String // File access URL
  version     Int      @default(1) // File version
  createdAt   DateTime @default(now()) // File creation date
  updatedAt   DateTime @updatedAt // File last update date

  folder          Folder?        @relation(fields: [folderId], references: [id], onDelete: SetNull) // Folder containing the file
  folderId        String? // Folder ID (optional)
  project         Project        @relation(fields: [projectId], references: [id], onDelete: Cascade) // Associated project
  projectId       String // Project ID
  subtask         Subtask?       @relation(fields: [subtaskId], references: [id], onDelete: SetNull) // Associated subtask
  subtaskId       String? // Subtask ID (optional)
  sprint          Sprint?        @relation(fields: [sprintId], references: [id], onDelete: SetNull) // Associated sprint
  sprintId        String? // Sprint ID (optional)
  uploader        Member         @relation(fields: [uploaderId], references: [id], onDelete: Cascade) // Member who uploaded
  uploaderId      String // Uploader member ID
  dependencies    Dependency[] // External dependencies (libraries)
  relationsFrom   FileRelation[] @relation("FileRelationFrom") // Outgoing relations to other files
  relationsTo     FileRelation[] @relation("FileRelationTo") // Incoming relations from other files

  @@map("project_file") // Table name in the database
}

model Dependency {
  id            String @id @default(uuid()) // Unique dependency identifier
  fileId        String // Associated file ID
  componentName String // External component name (e.g. prisma, zod)
  version       String? // Component version (e.g. 5.0.0)
  createdAt     DateTime @default(now()) // Dependency creation date

  file File @relation(fields: [fileId], references: [id], onDelete: Cascade) // Associated file

  @@map("dependency") // Table name in the database
}

model FileRelation {
  id         String       @id @default(uuid()) // Unique relation identifier
  fromFileId String // Source file ID
  toFileId   String // Target file ID
  type       RelationType // Relation type (e.g. IMPORT, REFERENCE)
  createdAt  DateTime     @default(now()) // Relation creation date

  fromFile File @relation(fields: [fromFileId], references: [id], onDelete: Cascade, name: "FileRelationFrom") // Source file
  toFile   File @relation(fields: [toFileId], references: [id], onDelete: Cascade, name: "FileRelationTo") // Target file

  @@unique([fromFileId, toFileId]) // Uniqueness of the source-target pair
  @@map("file_relation") // Table name in the database
}

model Comment {
  id          String   @id @default(uuid()) // Unique comment identifier
  content     String // Comment content
  createdAt   DateTime @default(now()) // Comment creation date
  updatedAt   DateTime @updatedAt // Comment last update date

  author      Member    @relation(fields: [authorId], references: [id], onDelete: Cascade) // Comment author member
  authorId    String // Author member ID
  project     Project?  @relation(fields: [projectId], references: [id], onDelete: Cascade) // Associated project
  projectId   String? // Project ID (optional)
  thema       Thema?    @relation(fields: [themaId], references: [id], onDelete: Cascade) // Associated theme
  themaId     String? // Theme ID (optional)
  epic        Epic?     @relation(fields: [epicId], references: [id], onDelete: Cascade) // Associated epic
  epicId      String? // Epic ID (optional)
  userStory   UserStory? @relation(fields: [userStoryId], references: [id], onDelete: Cascade) // Associated user story
  userStoryId String? // User story ID (optional)
  task        Task?     @relation(fields: [taskId], references: [id], onDelete: Cascade) // Associated task
  taskId      String? // Task ID (optional)

  @@map("comment") // Table name in the database
}

model TimeLog {
  id          String    @id @default(uuid()) // Unique time log identifier
  description String? // Log description (optional)
  startTime   DateTime // Work start time
  endTime     DateTime? // Work end time (optional)
  createdAt   DateTime  @default(now()) // Log creation date
  task        Task      @relation(fields: [taskId], references: [id], onDelete: Cascade) // Associated task
  taskId      String // Task ID
  member      Member    @relation(fields: [memberId], references: [id], onDelete: Cascade) // Associated member
  memberId    String // Member ID

  @@map("time_log") // Table name in the database
}

model ActivityLog {
  id        String     @id @default(uuid()) // Unique activity log identifier
  action    ActionType // Action performed (e.g. CREATE, UPDATE, DELETE)
  entityId  String // ID of the concerned entity (e.g. project, task)
  timestamp DateTime   @default(now()) // Date and time of the action

  member  Member @relation(fields: [memberId], references: [id], onDelete: Cascade) // Member who performed the action
  memberId String // Member ID

  @@map("activity_log") // Table name in the database
}
  `;

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
      <div className="mt-8 p-6 bg 			bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          Recommended Configuration
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Prisma (prisma/schema.prisma)</h3>{" "}
            <SyntaxHighlighter
              language="prisma"
              style={vscDarkPlus}
              customStyle={{
                borderRadius: "0.375rem",
                padding: "1rem",
                fontSize: "0.875rem",
              }}
              showLineNumbers
            >
              {prismaSchema}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseFull;
