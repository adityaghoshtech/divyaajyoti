"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import "./admin-login.css";

export default function AdminLoginPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Incorrect password.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">

        <div className="admin-login-brand">
          <h1>Divyajyoti</h1>
          <p>Admin Control Centre</p>
          <div className="admin-login-divider" />
        </div>

        <div className="admin-login-heading">
          <h2>Welcome Back</h2>
          <p>
            Enter your administrator password to
            access the management dashboard.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="admin-login-form"
        >
          <label htmlFor="admin-password">
            Admin Password
          </label>

          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          {error && (
            <div className="admin-login-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
          >
            {loading
              ? "Verifying..."
              : "Access Admin Dashboard"}
          </button>
        </form>

        <div className="admin-login-security">
          Protected Admin Access · Authorized Personnel Only
        </div>

      </section>
    </main>
  );
}