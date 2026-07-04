import { BriefcaseBusiness, CreditCard, FileText, PlugZap, UserCircle } from "lucide-react";
import { Logo } from "./Logo.jsx";

export function Header({ user }) {
  return (
    <header className="app-header animated-entry">
      <Logo />
      <div className="header-copy">
        <p className="eyebrow">AI Content Repurposing Engine</p>
        <h1>Repurpose one source into platform-ready assets</h1>
      </div>
      <nav className="top-nav" aria-label="Primary navigation">
        <a href="#projects" title="Projects">
          <FileText size={18} />
          <span>Projects</span>
        </a>
        <a href="#pricing" title="Pricing">
          <CreditCard size={18} />
          <span>Plans</span>
        </a>
        <a href="#workspace" title="Workspace">
          <BriefcaseBusiness size={18} />
          <span>Team</span>
        </a>
        <a href="#integrations" title="Integrations">
          <PlugZap size={18} />
          <span>Connect</span>
        </a>
        <a href="#account" title="Account">
          <UserCircle size={18} />
          <span>{user?.name || "Account"}</span>
        </a>
      </nav>
    </header>
  );
}