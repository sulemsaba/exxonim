import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { routes } from "../../routes";

const adminLoginStyles = String.raw`
  .admin-auth-shell{min-height:100vh;display:grid;place-items:center;padding:1.4rem}
  .admin-auth-layout{width:min(72rem,100%);display:grid;grid-template-columns:minmax(18rem,.95fr) minmax(20rem,.85fr);border:1px solid rgba(15,92,99,.1);border-radius:2rem;background:rgba(255,255,255,.84);box-shadow:var(--shadow-panel-strong);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);overflow:hidden}
  .admin-auth-aside,.admin-auth-card{padding:1.6rem}
  .admin-auth-aside{display:grid;gap:1rem;align-content:start;background:linear-gradient(155deg,rgba(255,232,205,.8),rgba(226,245,240,.92))}
  .admin-auth-mark{width:3.2rem;height:3.2rem;display:grid;place-items:center;border-radius:1rem;background:rgba(255,255,255,.72);border:1px solid rgba(15,92,99,.1);color:var(--color-accent);font-size:.92rem;font-weight:800;letter-spacing:.18em}
  .admin-auth-pill,.admin-auth-metric strong,.admin-auth-field span{font-size:.75rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
  .admin-auth-pill{display:inline-flex;align-items:center;gap:.55rem;width:fit-content;padding:.45rem .72rem;border-radius:999px;background:rgba(255,255,255,.72);border:1px solid rgba(15,92,99,.1);color:var(--color-text-soft)}
  .admin-auth-pill span{width:.42rem;height:.42rem;border-radius:999px;background:linear-gradient(135deg,#ffb25f,#73c7bb)}
  .admin-auth-aside h1,.admin-auth-card h2{margin:0;font-family:var(--font-display);line-height:.96;letter-spacing:-.05em}
  .admin-auth-aside h1{font-size:clamp(2.5rem,5vw,4rem);max-width:9ch}
  .admin-auth-aside p,.admin-auth-card p,.admin-auth-metric p,.admin-auth-note{margin:0;color:var(--color-text-muted);line-height:1.7}
  .admin-auth-grid{display:grid;gap:.85rem}
  .admin-auth-metric{display:grid;gap:.35rem;padding:.9rem 1rem;border-radius:1.2rem;border:1px solid rgba(15,92,99,.1);background:rgba(255,255,255,.66)}
  .admin-auth-metric span{font-size:1.45rem;font-weight:800;letter-spacing:-.04em}
  .admin-auth-card{display:grid;gap:1.2rem;align-content:center}
  .admin-auth-card h2{font-size:clamp(2rem,4vw,2.9rem)}
  .admin-auth-form{display:grid;gap:1rem}
  .admin-auth-field{display:grid;gap:.5rem}
  .admin-auth-field input{width:100%;min-height:3.25rem;padding:.9rem 1rem;border:1px solid rgba(15,92,99,.14);border-radius:1rem;background:rgba(255,255,255,.92);color:var(--color-text);box-shadow:inset 0 1px 0 rgba(255,255,255,.76)}
  .admin-auth-field input:focus{outline:2px solid rgba(115,199,187,.22);outline-offset:2px;border-color:rgba(15,92,99,.24)}
  .admin-auth-error{padding:.9rem 1rem;border-radius:1rem;background:rgba(168,35,58,.08);border:1px solid rgba(168,35,58,.18);color:#8b2037;line-height:1.6}
  .admin-auth-actions{display:flex;gap:.8rem;align-items:center;justify-content:space-between;flex-wrap:wrap}
  .admin-auth-button{min-width:10rem;min-height:3.15rem;padding:.9rem 1.25rem;border:0;border-radius:1rem;background:linear-gradient(135deg,var(--color-accent),var(--color-accent-hover));color:var(--color-accent-contrast);font-size:.8rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:transform 180ms ease,box-shadow 180ms ease}
  .admin-auth-button:hover{transform:translateY(-1px);box-shadow:0 14px 28px rgba(15,92,99,.18)}
  .admin-auth-button:disabled{opacity:.6;cursor:progress}
  @media (max-width:880px){.admin-auth-layout{grid-template-columns:1fr}.admin-auth-aside{border-bottom:1px solid rgba(15,92,99,.08)}}
  @media (max-width:640px){.admin-auth-shell{padding:1rem}.admin-auth-aside,.admin-auth-card{padding:1.2rem}.admin-auth-actions{flex-direction:column;align-items:stretch}.admin-auth-button{width:100%}}
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
        <div className="admin-auth-layout">
          <aside className="admin-auth-aside">
            <div className="admin-auth-mark" aria-hidden="true">
              EX
            </div>
            <div className="admin-auth-pill">
              <span aria-hidden="true"></span>
              Exxonim admin
            </div>
            <h1>Manage the live Exxonim website from one secure console.</h1>
            <p>
              This workspace controls content publishing, navigation,
              pricing, testimonials, and global site settings.
            </p>
            <div className="admin-auth-grid">
              <div className="admin-auth-metric">
                <strong>Publishing</strong>
                <span>Articles, pages, media</span>
                <p>Keep the public site current without touching code.</p>
              </div>
              <div className="admin-auth-metric">
                <strong>Operations</strong>
                <span>Consultation tracking</span>
                <p>Review requests, assign follow-up, and send customer updates.</p>
              </div>
            </div>
          </aside>

          <div className="admin-auth-card">
            <div>
              <h2>Sign in</h2>
              <p>Use the backend-created admin account to access the protected workspace.</p>
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
                <p className="admin-auth-note">Backend auth is required. This form does not use mock access.</p>
                <button className="admin-auth-button" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
