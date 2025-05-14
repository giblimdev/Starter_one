// @/app/user/infoConnect/page.tsx
"use client";

import React from "react";
import { useSession } from "@/lib/auth/auth-client";
import {
  Loader2,
  Shield,
  User,
  Clock,
  Smartphone,
  Hash,
  Key,
  Globe,
} from "lucide-react";
import Image from "next/image";

function SessionInfoCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b flex items-center">
        <Icon className="h-5 w-5 text-indigo-600 mr-2" />
        <h4 className="font-medium text-gray-800">{title}</h4>
      </div>
      <div className="p-4 space-y-3 bg-white">{children}</div>
    </div>
  );
}

function SessionInfoItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string | null | boolean;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start">
      <Icon className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500 truncate">{label}</p>
        <p className="text-sm text-gray-900 font-mono truncate">
          {value !== undefined && value !== null ? (
            String(value)
          ) : (
            <span className="text-gray-400">Not available</span>
          )}
        </p>
      </div>
    </div>
  );
}

function formatDate(dateString?: string | Date) {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  // Changed locale to en-US for English formatting
  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function InfoConnect() {
  const { data: session, isPending, error } = useSession();

  if (isPending) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
          <span className="text-lg text-gray-600">
            Loading session information...
          </span>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-md text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600">Not Connected</h2>
          <p className="mt-2 text-gray-600">
            You must be logged in to view your session information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Connection Information
        </h1>
        <p className="text-gray-600">
          Details about your session and user information
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header with user profile */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-white/20 shadow-md">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Profile picture" // Kept as is
                  width={80}
                  height={80}
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-indigo-100 flex items-center justify-center">
                  <User className="h-10 w-10 text-indigo-600" />
                </div>
              )}
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white">
                {session.user?.name?.trim() || "User"}
              </h2>
              <p className="text-indigo-100">
                {session.user?.email || "Email not available"}
              </p>
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-sm">
                {session.user?.emailVerified ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                    Email verified
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-yellow-400 mr-2"></span>
                    Email not verified
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Session details */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SessionInfoCard title="User Profile" icon={User}>
              <SessionInfoItem
                label="User ID"
                value={session.user?.id}
                icon={Hash}
              />
              <SessionInfoItem
                label="Full Name"
                value={session.user?.name?.trim() || "Not specified"}
                icon={User}
              />
              <SessionInfoItem
                label="Email Address"
                value={session.user?.email}
                icon={User}
              />
              <SessionInfoItem
                label="Email Verified"
                value={session.user?.emailVerified}
                icon={Shield}
              />
              <SessionInfoItem
                label="Account Created On"
                value={formatDate(session.user?.createdAt)}
                icon={Clock}
              />
              <SessionInfoItem
                label="Last Updated On"
                value={formatDate(session.user?.updatedAt)}
                icon={Clock}
              />
            </SessionInfoCard>

            <SessionInfoCard title="Active Session" icon={Shield}>
              <SessionInfoItem
                label="Session ID"
                value={session.session?.id}
                icon={Hash}
              />
              <SessionInfoItem
                label="Associated User"
                value={session.session?.userId}
                icon={User}
              />
              <SessionInfoItem
                label="Session Token"
                value={session.session?.token}
                icon={Key}
              />
              <SessionInfoItem
                label="Created On"
                value={formatDate(session.session?.createdAt)}
                icon={Clock}
              />
              <SessionInfoItem
                label="Last Updated On"
                value={formatDate(session.session?.updatedAt)}
                icon={Clock}
              />
              <SessionInfoItem
                label="Expires On"
                value={formatDate(session.session?.expiresAt)}
                icon={Clock}
              />
              <SessionInfoItem
                label="Browser"
                value={session.session?.userAgent}
                icon={Smartphone}
              />
              <SessionInfoItem
                label="IP Address"
                value={session.session?.ipAddress || "Not available"}
                icon={Globe}
              />
            </SessionInfoCard>
          </div>

          {/* Raw session data */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Hash className="h-5 w-5 text-gray-500 mr-2" />
              Technical Session Data
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-hidden">
              <pre className="text-xs font-mono text-gray-700 overflow-x-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoConnect;
