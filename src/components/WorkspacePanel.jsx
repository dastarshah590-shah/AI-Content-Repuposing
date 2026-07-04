import { BriefcaseBusiness, UserPlus } from "lucide-react";
import { useState } from "react";

export function WorkspacePanel({
  clients,
  teamMembers,
  selectedClientId,
  onSelectClient,
  onCreateClient,
  onCreateTeamMember,
  onToast
}) {
  const [clientForm, setClientForm] = useState({ name: "", industry: "", notes: "" });
  const [memberForm, setMemberForm] = useState({ name: "", email: "", role: "Editor" });

  async function addClient() {
    const client = await onCreateClient(clientForm);
    onSelectClient(client.id);
    setClientForm({ name: "", industry: "", notes: "" });
    onToast("Client folder added.");
  }

  async function addMember() {
    await onCreateTeamMember(memberForm);
    setMemberForm({ name: "", email: "", role: "Editor" });
    onToast("Team member added.");
  }

  return (
    <section className="panel workspace-panel" aria-labelledby="workspace-heading">
      <div className="section-heading">
        <div>
          <p className="step-label">Workspace</p>
          <h2 id="workspace-heading">Clients and team</h2>
        </div>
        <BriefcaseBusiness size={20} />
      </div>

      <label className="field">
        <span>Client folder</span>
        <select value={selectedClientId} onChange={(event) => onSelectClient(event.target.value)}>
          <option value="">No client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
      </label>

      <div className="field-grid two-columns">
        <label className="field">
          <span>New client</span>
          <input value={clientForm.name} onChange={(event) => setClientForm({ ...clientForm, name: event.target.value })} placeholder="Client name" />
        </label>
        <label className="field">
          <span>Industry</span>
          <input value={clientForm.industry} onChange={(event) => setClientForm({ ...clientForm, industry: event.target.value })} placeholder="SaaS, coaching, agency" />
        </label>
      </div>
      <button className="secondary-button full-button" type="button" onClick={addClient} disabled={!clientForm.name.trim()}>
        <BriefcaseBusiness size={16} />
        <span>Add client</span>
      </button>

      <div className="team-list">
        {teamMembers.slice(0, 4).map((member) => (
          <span key={member.id}>{member.name} - {member.role}</span>
        ))}
      </div>

      <div className="field-grid two-columns">
        <label className="field">
          <span>Team member</span>
          <input value={memberForm.name} onChange={(event) => setMemberForm({ ...memberForm, name: event.target.value })} placeholder="Name" />
        </label>
        <label className="field">
          <span>Role</span>
          <input value={memberForm.role} onChange={(event) => setMemberForm({ ...memberForm, role: event.target.value })} />
        </label>
      </div>
      <button className="secondary-button full-button" type="button" onClick={addMember} disabled={!memberForm.name.trim()}>
        <UserPlus size={16} />
        <span>Add member</span>
      </button>
    </section>
  );
}