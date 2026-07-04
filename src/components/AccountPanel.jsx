import { LogIn, Save, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

export function AccountPanel({ user, usage, onLogin, onRegister, onUpdateProfile, onToast }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    setForm((current) => ({
      ...current,
      name: user?.name || "",
      email: user?.email || ""
    }));
  }, [user]);

  const limit = usage?.limits?.monthlyGenerations || 0;
  const used = usage?.generations || 0;
  const percent = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  async function submit(action) {
    if (action === "login") await onLogin(form);
    if (action === "register") await onRegister(form);
    if (action === "profile") await onUpdateProfile(form);
    onToast("Account updated.");
  }

  return (
    <section className="panel account-panel" id="account" aria-labelledby="account-heading">
      <div className="section-heading">
        <div>
          <p className="step-label">Account</p>
          <h2 id="account-heading">Local workspace</h2>
        </div>
        <span className="plan-badge">{user?.plan || "demo"}</span>
      </div>

      <div className="usage-meter" aria-label="Monthly usage">
        <div>
          <strong>{used}</strong>
          <span> / {limit} generations</span>
        </div>
        <div className="meter-track">
          <span style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="field-grid">
        <label className="field">
          <span>Name</span>
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Creator name"
          />
        </label>
        <label className="field">
          <span>Email</span>
          <input
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="you@example.com"
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            type="password"
            placeholder="Optional for demo"
          />
        </label>
      </div>

      <div className="toolbar-row account-actions">
        <button className="secondary-button" type="button" onClick={() => submit("profile")}>
          <Save size={16} />
          <span>Save</span>
        </button>
        <button className="secondary-button" type="button" onClick={() => submit("login")}>
          <LogIn size={16} />
          <span>Login</span>
        </button>
        <button className="secondary-button" type="button" onClick={() => submit("register")}>
          <UserPlus size={16} />
          <span>Create</span>
        </button>
      </div>
    </section>
  );
}