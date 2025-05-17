import React from "react";

const TableRelations: React.FC = () => {
  const tables = [
    {
      name: "User",
      fields: [
        "id: String @id @default(uuid())",
        "name: String?",
        "email: String? @unique",
        "emailVerified: Boolean @default(false)",
        "image: String?",
        "role: Role @default(USER)",
        'lang: String? @default("en")',
        "createdAt: DateTime @default(now())",
        "updatedAt: DateTime @updatedAt",
      ],
      relations: [
        "sessions: Session[] (One-to-Many, Cascade)",
        "accounts: Account[] (One-to-Many, Cascade)",
        "verifications: Verification[] (One-to-Many, Cascade)",
        "Profile: Profile[] (One-to-Many, Cascade)",
      ],
      color: "bg-blue-100",
      textColor: "text-blue-800",
    },
    {
      name: "Session",
      fields: [
        "id: String @id @default(uuid())",
        "userId: String",
        "token: String @unique",
        "expiresAt: DateTime",
        "ipAddress: String?",
        "userAgent: String?",
        "createdAt: DateTime @default(now())",
        "updatedAt: DateTime @updatedAt",
      ],
      relations: ["user: User (Many-to-One, Cascade, references User.id)"],
      color: "bg-green-100",
      textColor: "text-green-800",
    },
    {
      name: "Account",
      fields: [
        "id: String @id @default(uuid())",
        "userId: String",
        "accountId: String",
        "providerId: String",
        "accessToken: String?",
        "refreshToken: String?",
        "accessTokenExpiresAt: DateTime?",
        "refreshTokenExpiresAt: DateTime?",
        "scope: String?",
        "idToken: String?",
        "password: String?",
        "createdAt: DateTime @default(now())",
        "updatedAt: DateTime @updatedAt",
      ],
      relations: ["user: User (Many-to-One, Cascade, references User.id)"],
      color: "bg-yellow-100",
      textColor: "text-yellow-800",
    },
    {
      name: "Verification",
      fields: [
        "id: String @id @default(uuid())",
        "identifier: String",
        "value: String",
        "expiresAt: DateTime",
        "createdAt: DateTime @default(now())",
        "updatedAt: DateTime @updatedAt",
        "userId: String",
      ],
      relations: ["user: User (Many-to-One, Cascade, references User.id)"],
      color: "bg-purple-100",
      textColor: "text-purple-800",
    },
    {
      name: "Profile",
      fields: [
        "id: String @id @default(uuid())",
        "firstName: String",
        "lastName: String",
        "dateOfBirth: DateTime?",
        'languagePreferred: String @default("en")',
        "createdAt: DateTime @default(now())",
        "updatedAt: DateTime @updatedAt",
        "userId: String @unique",
      ],
      relations: [
        "user: User (One-to-One, Cascade, references User.id)",
        "ProfilePro: ProfilePro[] (One-to-Many, Cascade)",
      ],
      color: "bg-pink-100",
      textColor: "text-pink-800",
    },
    {
      name: "ProfilePro",
      fields: [
        "id: String @id @default(uuid())",
        "profileId: String @unique",
        "organizationId: String",
        "updatedAt: DateTime @updatedAt",
      ],
      relations: [
        "profile: Profile (One-to-One, Cascade, references Profile.id)",
        "organization: Organization (Many-to-One, Cascade, references Organization.id)",
        "teams: OrganizationTeam[] (Many-to-Many, TeamMembers)",
        "projects: Project[] (Many-to-Many, ProjectMembers)",
      ],
      color: "bg-indigo-100",
      textColor: "text-indigo-800",
    },
    {
      name: "Organization",
      fields: [
        "id: String @id @default(uuid())",
        "name: String",
        "slug: String @unique",
        "createdAt: DateTime @default(now())",
        "updatedAt: DateTime @updatedAt",
      ],
      relations: [
        "members: ProfilePro[] (One-to-Many)",
        "teams: OrganizationTeam[] (One-to-Many)",
        "projects: Project[] (One-to-Many)",
      ],
      color: "bg-red-100",
      textColor: "text-red-800",
    },
    {
      name: "OrganizationTeam",
      fields: [
        "id: String @id @default(uuid())",
        "name: String",
        "description: String?",
        "order: Int @default(0)",
        "createdAt: DateTime @default(now())",
        "updatedAt: DateTime @updatedAt",
        "organizationId: String",
      ],
      relations: [
        "organization: Organization (Many-to-One, references Organization.id)",
        "members: ProfilePro[] (Many-to-Many, TeamMembers)",
      ],
      color: "bg-teal-100",
      textColor: "text-teal-800",
    },
    {
      name: "Project",
      fields: [
        "id: String @id @default(uuid())",
        "name: String",
        "description: String?",
        "image: String?",
        "startDate: DateTime?",
        "endDate: DateTime?",
        "createdAt: DateTime @default(now())",
        "updatedAt: DateTime @updatedAt",
        "organizationId: String",
      ],
      relations: [
        "organization: Organization (Many-to-One, references Organization.id)",
        "members: ProfilePro[] (Many-to-Many, ProjectMembers)",
      ],
      color: "bg-orange-100",
      textColor: "text-orange-800",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Prisma Schema Table Relations
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <div
            key={table.name}
            className={`p-6 rounded-lg shadow-lg ${table.color} ${table.textColor}`}
          >
            <h2 className="text-2xl font-semibold mb-4">{table.name}</h2>
            <div className="mb-4">
              <h3 className="text-lg font-medium">Fields:</h3>
              <ul className="list-disc pl-5">
                {table.fields.map((field, index) => (
                  <li key={index} className="text-sm">
                    {field}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">Relations:</h3>
              <ul className="list-disc pl-5">
                {table.relations.map((relation, index) => (
                  <li key={index} className="text-sm">
                    {relation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Relationship Explanations
        </h2>
        <p className="text-gray-600 mb-4">
          The schema defines a robust relational structure with the following
          key relationships:
        </p>
        <ul className="list-disc pl-5 text-gray-600">
          <li>
            <strong>User</strong> is the central entity, linked to{" "}
            <strong>Session</strong>, <strong>Account</strong>,{" "}
            <strong>Verification</strong> (one-to-many), and{" "}
            <strong>Profile</strong> (one-to-many, but typically one-to-one due
            to `@unique` on `userId` in Profile). All relations use `onDelete:
            Cascade`, meaning deleting a User removes related records.
          </li>
          <li>
            <strong>Profile</strong> has a one-to-one relationship with{" "}
            <strong>User</strong> and a one-to-many relationship with{" "}
            <strong>ProfilePro</strong>, connecting users to professional
            contexts.
          </li>
          <li>
            <strong>ProfilePro</strong> acts as a bridge, connecting{" "}
            <strong>Profile</strong> (one-to-one) and{" "}
            <strong>Organization</strong> (many-to-one), and enabling
            many-to-many relationships with <strong>OrganizationTeam</strong>{" "}
            and <strong>Project</strong> via relation names (`TeamMembers`,
            `ProjectMembers`).
          </li>
          <li>
            <strong>Organization</strong> owns multiple{" "}
            <strong>ProfilePro</strong>, <strong>OrganizationTeam</strong>, and{" "}
            <strong>Project</strong> records (one-to-many).
          </li>
          <li>
            <strong>OrganizationTeam</strong> and <strong>Project</strong> are
            linked to <strong>Organization</strong> (many-to-one) and have
            many-to-many relationships with <strong>ProfilePro</strong> for team
            and project memberships.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TableRelations;
