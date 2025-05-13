"use client";

import React from "react";
import { useAppSelector } from "../../store/hooks";

export default function UserInfo() {
  const { user, loading, error } = useAppSelector((state) => state.user);

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold">User Information</h2>
      <div className="mt-2">
        <p>
          Name: {user.firstName} {user.lastName}
        </p>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <p>Verified: {user.verified ? "Yes" : "No"}</p>
      </div>
    </div>
  );
}
