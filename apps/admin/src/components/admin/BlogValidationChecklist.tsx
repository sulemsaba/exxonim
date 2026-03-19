import { AdminSectionCard } from "./AdminSectionCard";
import type { BlogValidationChecklist as BlogValidationChecklistData } from "../../utils/blogEditor";

interface BlogValidationChecklistProps {
  checklist: BlogValidationChecklistData;
}

export function BlogValidationChecklist({
  checklist,
}: BlogValidationChecklistProps) {
  return (
    <AdminSectionCard
      title="Publishing checklist"
      description="Review the live readiness signals before you publish or archive this post."
    >
      <div className="blog-editor-stack">
        <div className={`blog-editor-checklist-summary${checklist.can_publish ? " is-ready" : ""}`}>
          <strong>{checklist.can_publish ? "Ready to publish" : "Needs attention"}</strong>
          <span>
            Resolved read time:{" "}
            {checklist.resolved_read_time_minutes
              ? `${checklist.resolved_read_time_minutes} min`
              : "Not enough content yet"}
          </span>
        </div>

        <ul className="blog-editor-checklist" aria-label="Publishing checklist">
          {checklist.items.map((item) => (
            <li key={item.key} className={item.complete ? "is-complete" : "is-incomplete"}>
              <div>
                <strong>{item.label}</strong>
                <p>{item.detail}</p>
              </div>
              <span>{item.complete ? "Done" : "Check"}</span>
            </li>
          ))}
        </ul>
      </div>
    </AdminSectionCard>
  );
}
