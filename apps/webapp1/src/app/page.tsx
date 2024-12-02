"use client";

import { Button } from "@monorepo/ui/components";
import { useAuth } from "../components/auth-provider";
import { useRouter } from "next/navigation";
import { logout } from "../lib/auth";

export default function Home() {
  const { user, clearAuth } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    router.push("/auth/login");
  };

  const handleLogout = async () => {
    await logout();
    clearAuth();
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Welcome to Webapp 1</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {user ? (
            <div className="space-y-4">
              <p className="text-lg">
                Signed in as:{" "}
                <span className="font-semibold">{user.email}</span>
              </p>
              <Button variant="secondary" onClick={handleLogout}>
                Sign out
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg">Please sign in to continue</p>
              <Button variant="primary" onClick={handleLogin}>
                Sign in
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

