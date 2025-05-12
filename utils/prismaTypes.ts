// utils/prismaTypes.ts
import { PrismaClient, UserGetPayload, UserAggregateGetPayload, ProjectGetPayload, MemberGetPayload, ThemaGetPayload, EpicGetPayload, UserStoryGetPayload, SprintGetPayload, TaskGetPayload, SubtaskGetPayload, FolderGetPayload, FileGetPayload, DependencyGetPayload, FileRelationGetPayload, CommentGetPayload, TimeLogGetPayload, ActivityLogGetPayload, SessionGetPayload, AccountGetPayload, VerificationGetPayload } from "@/lib/generated/prisma/client";

const prisma = new PrismaClient();

// 1. Type utilitaire pour les noms de modèles
export type ModelNames =
  | "User"
  | "UserAggregate"
  | "Project"
  | "Member"
  | "Thema"
  | "Epic"
  | "UserStory"
  | "Sprint"
  | "Task"
  | "Subtask"
  | "Folder"
  | "File"
  | "Dependency"
  | "FileRelation"
  | "Comment"
  | "TimeLog"
  | "ActivityLog"
  | "Session"
  | "Account"
  | "Verification";

// 2. Type pour accéder aux délégués Prisma
type PrismaDelegates = {
  [K in Uncapitalize<ModelNames>]: K extends keyof typeof prisma
    ? (typeof prisma)[K]
    : never;
};

// 3. Mappage des types de modèle complets
export type Models = {
export type Models = {
  User: UserGetPayload<{}>;
  UserAggregate: UserAggregateGetPayload<{}>;
  Project: ProjectGetPayload<{}>;
  Member: MemberGetPayload<{}>;
  Thema: ThemaGetPayload<{}>;
  Epic: EpicGetPayload<{}>;
  UserStory: UserStoryGetPayload<{}>;
  Sprint: SprintGetPayload<{}>;
  Task: TaskGetPayload<{}>;
  Subtask: SubtaskGetPayload<{}>;
  Folder: FolderGetPayload<{}>;
  File: FileGetPayload<{}>;
  Dependency: DependencyGetPayload<{}>;
  FileRelation: FileRelationGetPayload<{}>;
  Comment: CommentGetPayload<{}>;
  TimeLog: TimeLogGetPayload<{}>;
  ActivityLog: ActivityLogGetPayload<{}>;
  Session: SessionGetPayload<{}>;
  Account: AccountGetPayload<{}>;
  Verification: VerificationGetPayload<{}>;
};
// 4. Types avec relations
export type UserWithRelations = Prisma.UserGetPayload<{
export type UserWithRelations = UserGetPayload<{
  include: {
    sessions: true;
    accounts: true;
    memberships: true;
    verifications: true;
  };
}>;

export type UserAggregateWithRelations = UserAggregateGetPayload<{
  include: {
    user: true;
    projects: true;
    tasks: true;
  };
}>;

export type ProjectWithRelations = ProjectGetPayload<{
  include: {
    themas: true;
    epics: true;
    userStories: true;
    sprints: true;
    members: true;
    folders: true;
    files: true;
    comments: true;
  };
}>;
// 5. Types pour les opérations CRUD
export type FindManyArgs<T extends ModelNames> = Prisma.Args<
  PrismaDelegates[Uncapitalize<T>],
  "findMany"
>;
export type CreateArgs<T extends ModelNames> = Prisma.Args<
  PrismaDelegates[Uncapitalize<T>],
  "create"
>;
export type UpdateArgs<T extends ModelNames> = Prisma.Args<
  PrismaDelegates[Uncapitalize<T>],
  "update"
>;
export type DeleteArgs<T extends ModelNames> = Prisma.Args<
  PrismaDelegates[Uncapitalize<T>],
  "delete"
>;

// 6. Vérificateur de champs amélioré
export function isValidField<T extends ModelNames>(
  model: T,
  field: string
): boolean {
  const delegate = prisma[model.toLowerCase() as keyof typeof prisma];
  const fields = delegate.fields as Record<string, unknown>;
  return field in fields;
}

// 7. Enumérations
export const PrismaEnums = {
  Role: ["USER", "READER", "AUTHOR", "DEV", "ADMIN"] as const,
  Status: [
    "TODO",
    "IN_PROGRESS",
    "REVIEW",
    "DONE",
    "BLOCKED",
    "CANCELLED",
  ] as const,
  FileType: [
    "DOCUMENT",
    "IMAGE",
    "SPREADSHEET",
    "PRESENTATION",
    "ARCHIVE",
    "CODE",
    "OTHER",
  ] as const,
  ActionType: ["CREATE", "UPDATE", "DELETE"] as const,
  RelationType: ["IMPORT", "REFERENCE", "OTHER"] as const,
};

export type Role = (typeof PrismaEnums.Role)[number];
export type Status = (typeof PrismaEnums.Status)[number];
export type FileType = (typeof PrismaEnums.FileType)[number];
export type ActionType = (typeof PrismaEnums.ActionType)[number];
export type RelationType = (typeof PrismaEnums.RelationType)[number];

// 8. Type guards pour les enums
export function isRole(value: string): value is Role {
  return PrismaEnums.Role.includes(value as Role);
}

export function isStatus(value: string): value is Status {
  return PrismaEnums.Status.includes(value as Status);
}

// 9. Générateur de types pour les formulaires
export type FormFieldConfig = {
  required?: boolean;
  type: "string" | "number" | "boolean" | "date" | "enum";
  enumValues?: string[];
};

export type FormFields<T extends ModelNames> = {
  [K in keyof Prisma.Args<
    PrismaDelegates[Uncapitalize<T>],
    "create"
  >["data"]]?: FormFieldConfig;
};

// 10. Configuration des formulaires
export const UserFormFields: FormFields<"User"> = {
  name: { type: "string" },
  email: { required: true, type: "string" },
  role: { required: true, type: "enum", enumValues: PrismaEnums.Role },
};

export const ProjectFormFields: FormFields<"Project"> = {
  name: { required: true, type: "string" },
  status: { type: "enum", enumValues: PrismaEnums.Status },
  priority: { type: "number" },
};

// 11. Helper pour les relations
export const ModelRelations: Record<ModelNames, string[]> = {
  User: ["sessions", "accounts", "memberships", "verifications"],
  UserAggregate: [],
  Project: [
    "themas",
    "epics",
    "userStories",
    "sprints",
    "members",
    "folders",
    "files",
    "comments",
  ],
  Member: [
    "files",
    "tasks",
    "subtasks",
    "comments",
    "timeLogs",
    "userStories",
    "themas",
    "epics",
    "sprints",
    "activities",
    "createdProjects",
  ],
  Thema: ["tasks", "comments"],
  Epic: ["userStories", "comments"],
  UserStory: ["tasks", "comments"],
  Sprint: ["userStories", "tasks", "subtasks", "files"],
  Task: ["subtasks", "dependencies", "blockedBy", "comments", "timeLogs"],
  Subtask: ["files"],
  Folder: ["files"],
  File: ["dependencies", "relationsFrom", "relationsTo"],
  Dependency: [],
  FileRelation: [],
  Comment: [],
  TimeLog: [],
  ActivityLog: [],
  Session: [],
  Account: [],
  Verification: [],
};

export function getModelRelations<T extends ModelNames>(model: T): string[] {
  return ModelRelations[model] || [];
}

// 12. Export des types pratiques
export type {
  User,
  UserAggregate,
  Project,
  Member,
  Thema,
  Epic,
  UserStory,
  Sprint,
  Task,
  Subtask,
  Folder,
  File,
  Dependency,
  FileRelation,
  Comment,
  TimeLog,
  ActivityLog,
  Session,
  Account,
  Verification,
} from "@/lib/generated/prisma/client";

// 13. Type utilitaire pour les sélections partielles
export type PartialModel<
  T extends ModelNames,
  K extends keyof Prisma.Args<
    PrismaDelegates[Uncapitalize<T>],
    "create"
  >["data"],
> = {
  [P in K]?: Prisma.Args<PrismaDelegates[Uncapitalize<T>], "create">["data"][P];
};
