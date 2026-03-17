import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { routes } from "../../routes";

const adminLoginStyles = String.raw`
  .admin-auth-shell {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 2rem 1rem;
  }

  .admin-auth-card {
    width: min(30rem, 100%);
    display: grid;
    gap: 1.4rem;
    padding: 2rem;
    border: 1px solid var(--cinematic-card-border);
    border-radius: 1.8rem;
    background: var(--cinematic-card-bg);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    box-shadow: var(--cinematic-card-shadow);
  }

  .admin-auth-copy {
    display: grid;
    gap: 0.85rem;
  }

  .admin-auth-copy h1 {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(2.4rem, 5vw, 3.4rem);
    line-height: 0.94;
    letter-spacing: -0.06em;
  }

  .admin-auth-copy p {
    margin: 0;
    color: var(--color-text-muted);
    line-height: 1.7;
  }

  .admin-auth-form {
    display: grid;
    gap: 1rem;
  }

  .admin-auth-field {
    display: grid;
    gap: 0.5rem;
  }

  .admin-auth-field span {
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-soft);
  }

  .admin-auth-field input {
    width: 100%;
    min-height: 3.2rem;
    padding: 0.85rem 1rem;
    border: 1px solid var(--color-border-strong);
    border-radius: 0.95rem;
    background: rgba(255, 255, 255, 0.7);
    color: var(--color-text);
  }

  .admin-auth-field input:focus {
    outline: 2px solid rgba(15, 92, 99, 0.18);
    outline-offset: 2px;
    border-color: rgba(15, 92, 99, 0.42);
  }

  .admin-auth-error {
    padding: 0.9rem 1rem;
    border-radius: 0.95rem;
    background: rgba(168, 35, 58, 0.08);
    border: 1px solid rgba(168, 35, 58, 0.18);
    color: #8b2037;
    line-height: 1.6;
  }

  .admin-auth-actions {
    display: flex;
    gap: 0.8rem;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .admin-auth-note {
    font-size: 0.92rem;
    color: var(--color-text-soft);
  }

  .admin-auth-button {
    min-width: 10rem;
    min-height: 3.15rem;
    padding: 0.9rem 1.25rem;
    border: 0;
    border-radius: 0.95rem;
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover));
    color: var(--color-accent-contrast);
    font-size: 0.84rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
  }

  .admin-auth-button:disabled {
    opacity: 0.6;
    cursor: progress;
  }

  @media (max-width: 640px) {
    .admin-auth-card {
      padding: 1.4rem;
    }

    .admin-auth-actions {
      flex-direction: column;
      align-items: stretch;
    }

    .admin-auth-button {
      width: 100%;
    }
  }
`;

function getNextAdminPath() {
  if (typeof window === "undefined") {
    return routes.admin;
  }

  const params = new URLSearchParams(window.location.search);
  const next = params.get("next");

  if (!next || !next.startsWith("/")) {
    return routes.admin;
  }

  return next;
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") {
      return detail;
    }
  }

  return "Unable to sign in. Check your credentials and try again.";
}

export function AdminLoginPage() {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && typeof window !== "undefined") {
      window.location.replace(getNextAdminPath());
    }
  }, [isAuthenticated]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await login({ email, password });

      if (typeof window !== "undefined") {
        window.location.replace(getNextAdminPath());
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <style>{adminLoginStyles}</style>
      <section className="admin-auth-shell">
        <div className="admin-auth-card">
          <div className="admin-auth-copy">
            <p className="section-pill section-pill--light">
              <span></span>
              Exxonim admin
            </p>
            <h1>Sign in to manage site content.</h1>
            <p>
              Phase 3 only establishes authentication and the protected admin
              route. Content management views land in Phase 4.
            </p>
          </div>

          <form className="admin-auth-form" onSubmit={handleSubmit}>
            <label className="admin-auth-field">
              <span>Email</span>
              <input
                autoComplete="email"
                inputMode="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label className="admin-auth-field">
              <span>Password</span>
              <input
                autoComplete="current-password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            {errorMessage ? (
              <div className="admin-auth-error" role="alert">
                {errorMessage}
              </div>
            ) : null}

            <div className="admin-auth-actions">
              <p className="admin-auth-note">
                Use the admin account created from the backend script.
              </p>
              <button className="admin-auth-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
