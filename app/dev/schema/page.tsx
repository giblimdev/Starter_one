"use client";

// pages/prisma-schema-example.js
import Head from "next/head";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const prismaSchema = `
generator client {
  provider = "prisma-client-js"
  output   = "../lib/generated/prisma/client"
}

// Utilise SQLite comme base de données (modifiable pour PostgreSQL, etc.)
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// ============================
// 1. Authentification
// ============================
model User {
  id            String   @id @default(uuid())
  name          String?
  email         String?  @unique
  emailVerified Boolean  @default(false)
  image         String?
  role          Role     @default(USER)
  lang          String?  @default("en")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  sessions      Session[]
  accounts      Account[]
  verifications Verification[]

  profile Profile?
  member  Member?

  @@index([email])
  @@map("users")
}

enum Role {
  USER
  MEMBER
  DEV
  ADMIN
}

model Session {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("sessions")
}

model Account {
  id                String    @id @default(uuid())
  userId            String
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  providerType      String
  providerId        String
  providerAccountId String
  accessToken       String?
  refreshToken      String?
  expiresAt         DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  @@unique([providerId, providerAccountId])
  @@map("accounts")
}

model Verification {
  id         String   @id @default(uuid())
  identifier String
  token      String   @unique
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  userId     String?
  user       User?    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("verifications")
}

//
// ============================
// 2. Onboarding utilisateur
// ============================
model Profile {
  id                String    @id @default(uuid())
  firstName         String
  lastName          String
  dateOfBirth       DateTime?
  languagePreferred String    @default("en")
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}

model Organization {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  members  Member[]
  teams    Team[]
  projects Project[]

  @@map("organizations")
}

model Member {
  id             String       @id @default(uuid())
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId         String       @unique
  organization   Organization @relation(fields: [organizationId], references: [id])
  organizationId String
  joinedAt       DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  teams    Team[]    @relation("TeamMembers")
  projects Project[] @relation("ProjectMembers")

  @@unique([userId, organizationId])
  @@map("members")
}

model Team {
  id          String   @id @default(uuid())
  name        String
  description String?
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  organization   Organization @relation(fields: [organizationId], references: [id])
  organizationId String
  members        Member[]     @relation("TeamMembers")

  @@map("teams")
}

//
// ============================
// 3. Métier
// ============================

model Project {
  id          String    @id @default(uuid())
  name        String
  description String?
  image       String?
  startDate   DateTime?
  endDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  organization   Organization @relation(fields: [organizationId], references: [id])
  organizationId String
  members        Member[]     @relation("ProjectMembers")

  @@index([name])
  @@map("projects")
}


`;

export default function PrismaSchemaExamplePage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prismaSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Schéma Prisma</title>
        <meta
          name="description"
          content="Affichage du schéma Prisma avec mise en évidence syntaxique dans Next.js"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Schéma Prisma</h1>
          <p className="mt-2 text-sm text-gray-600">
            Un exemple de schéma Prisma pour la gestion de projets, avec mise en
            évidence syntaxique.
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-12">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Database Schema Documentation
          </h1>
          <p className="text-gray-600 mt-2">
            Authentication and Project Management System
          </p>
        </header>

        {/* Authentication Section */}
        <section className="bg-blue-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            Authentication Tables
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* User Table */}
            <div className="bg-white p-4 rounded border border-blue-100">
              <h3 className="font-medium text-blue-700 mb-3">User</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">
                    PK
                  </span>
                  <code>id: String @default(uuid())</code>
                </li>
                <li>
                  <code>email: String? @unique</code>
                </li>
                <li>
                  <code>role: Role @default(USER)</code>
                </li>
                <li className="mt-3 pt-3 border-t border-blue-50 text-blue-600">
                  → 1-to-1 with Profile
                </li>
              </ul>
            </div>

            {/* Session Table */}
            <div className="bg-white p-4 rounded border border-blue-100">
              <h3 className="font-medium text-blue-700 mb-3">Session</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <code>token: String @unique</code>
                </li>
                <li>
                  <code>expiresAt: DateTime</code>
                </li>
                <li className="text-blue-600">Cascades on User delete</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Profile & Organizations Section */}
        <section className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            User Management
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Table */}
            <div className="bg-white p-4 rounded border border-green-100">
              <h3 className="font-medium text-green-700 mb-3">Profile</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <code>firstName: String</code>
                </li>
                <li>
                  <code>lastName: String</code>
                </li>
                <li>
                  <code>userId: String @unique</code>
                </li>
                <li className="mt-3 pt-3 border-t border-green-50 text-green-600">
                  → Extends User data
                </li>
              </ul>
            </div>

            {/* Organization Table */}
            <div className="bg-white p-4 rounded border border-green-100">
              <h3 className="font-medium text-green-700 mb-3">Organization</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <code>name: String</code>
                </li>
                <li>
                  <code>slug: String @unique</code>
                </li>
                <li className="text-green-600">Has many Members</li>
              </ul>
            </div>

            {/* Member Table */}
            <div className="bg-white p-4 rounded border border-green-100">
              <h3 className="font-medium text-green-700 mb-3">Member</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <code>profileId: String</code>
                </li>
                <li>
                  <code>joinedAt: DateTime</code>
                </li>
                <li className="flex items-start mt-2">
                  <span className="inline-block bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs mr-2">
                    UNIQUE
                  </span>
                  <span className="text-sm">(profileId + projectId)</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Business Logic Section */}
        <section className="bg-amber-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-amber-800 mb-4">
            Business Domain
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Project Table */}
            <div className="bg-white p-4 rounded border border-amber-100">
              <h3 className="font-medium text-amber-700 mb-3">Project</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <code>name: String</code>
                </li>
                <li>
                  <code>status: Status @default(TODO)</code>
                </li>
                <li className="text-amber-600">Has many Members</li>
              </ul>
            </div>

            {/* Team Table */}
            <div className="bg-white p-4 rounded border border-amber-100">
              <h3 className="font-medium text-amber-700 mb-3">Team</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <code>name: String</code>
                </li>
                <li>
                  <code>order: Int @default(0)</code>
                </li>
                <li className="text-amber-600">Groups Members</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Key Relationships */}
        <section className="bg-purple-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">
            Key Relationships
          </h2>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white px-4 py-3 rounded-full border border-purple-200 text-sm flex items-center">
              <span className="font-medium text-purple-700">User</span>
              <span className="mx-2 text-purple-400">→ 1:1 →</span>
              <span className="font-medium text-purple-700">Profile</span>
            </div>
            <div className="bg-white px-4 py-3 rounded-full border border-purple-200 text-sm flex items-center">
              <span className="font-medium text-purple-700">Profile</span>
              <span className="mx-2 text-purple-400">→ 1:N →</span>
              <span className="font-medium text-purple-700">Member</span>
            </div>
            <div className="bg-white px-4 py-3 rounded-full border border-purple-200 text-sm flex items-center">
              <span className="font-medium text-purple-700">Member</span>
              <span className="mx-2 text-purple-400">→ M:N →</span>
              <span className="font-medium text-purple-700">Project</span>
            </div>
          </div>
        </section>

        {/* Onboarding Flow */}
        <section className="bg-emerald-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">
            User Onboarding Flow
          </h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                <span className="text-emerald-800 font-medium">1</span>
              </div>
              <p className="text-gray-700">User signs up (auth only)</p>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                <span className="text-emerald-800 font-medium">2</span>
              </div>
              <p className="text-gray-700">Completes Profile</p>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                <span className="text-emerald-800 font-medium">3</span>
              </div>
              <p className="text-gray-700">Joins Organization as Member</p>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                <span className="text-emerald-800 font-medium">4</span>
              </div>
              <p className="text-gray-700">Gets assigned to Projects/Teams</p>
            </div>
          </div>
        </section>
      </div>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Code Block Header */}
          <div className="flex justify-between items-center px-4 py-3 bg-gray-800 text-white">
            <span className="text-sm font-medium">schema.prisma</span>
            <button
              onClick={handleCopy}
              className="flex items-center px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors"
            >
              {copied ? (
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Copié !
                </span>
              ) : (
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copier
                </span>
              )}
            </button>
          </div>

          {/* Code Block */}
          <div className="overflow-x-auto">
            <SyntaxHighlighter
              language="prisma"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: "1.5rem",
                fontSize: "0.9rem",
                lineHeight: "1.5",
              }}
              showLineNumbers
              wrapLines
            >
              {prismaSchema}
            </SyntaxHighlighter>
          </div>
        </div>
      </main>
    </div>
  );
}
