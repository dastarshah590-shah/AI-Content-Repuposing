import { Clock3, FileText } from "lucide-react";

export function ProjectSidebar({ projects, onOpenProject }) {
  return (
    <aside className="project-rail" id="projects" aria-labelledby="projects-heading">
      <div className="section-heading">
        <div>
          <p className="step-label">History</p>
          <h2 id="projects-heading">Projects</h2>
        </div>
        <Clock3 size={18} aria-hidden="true" />
      </div>

      <div className="project-list">
        {projects.length ? (
          projects.slice(0, 10).map((project) => (
            <button className="project-item" key={project.id} type="button" onClick={() => onOpenProject(project.id)}>
              <FileText size={16} />
              <div>
                <strong>{project.title}</strong>
                <span>{project.clientName || project.status} - {project.outputCount || 0} assets</span>
              </div>
            </button>
          ))
        ) : (
          <p className="muted-copy">No projects yet.</p>
        )}
      </div>
    </aside>
  );
}