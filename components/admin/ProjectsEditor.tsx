"use client";

import { useState } from "react";
import type { Project } from "@/src/data/projects";
import { CmsWorkspace, type EditorFieldsProps, type WorkspaceConfig } from "./CmsWorkspace";
import { CheckboxField, FormSection, ListField, SelectField, TextAreaField, TextField } from "./fields";
import { slugify, slugifyWhileTyping } from "./format";
import { ImageUploader } from "./ImageUploader";
import {
  blankProjectForm,
  PROJECT_CATEGORY_SUGGESTIONS,
  PROJECT_LINK_FIELDS,
  PROJECT_LIST_FIELDS,
  PROJECT_STATUS_OPTIONS,
  projectAdapter,
  projectFormToPayload,
  projectSequence,
  projectToForm,
  validateProjectForm,
  withProjectOrder,
  type ProjectForm,
} from "./projectForm";
import { firestoreDataSource, type CmsDataSource } from "./useCmsCollection";
import { UrlField } from "./UrlField";

function ProjectFields({ form, update, isNew, errors, persisted, idPrefix, disabled }: EditorFieldsProps<ProjectForm>) {
  // While creating, the id follows the title until the admin edits the id directly.
  const [idEdited, setIdEdited] = useState(!isNew || Boolean(form.id));
  const fid = (key: string) => `${idPrefix}-${key.replace(/\./g, "-")}`;
  const bind = (key: string) => ({ id: fid(key), error: errors.errorFor(key), onBlur: () => errors.touch(key), disabled });

  return (
    <div className="adm-form">
      <FormSection title="Basics">
        <TextField
          {...bind("id")}
          label="ID (URL slug)"
          required
          mono
          value={form.id}
          readOnly={!isNew}
          onChange={(value) => {
            setIdEdited(true);
            update({ id: slugifyWhileTyping(value) });
          }}
          onBlur={() => {
            update({ id: slugify(form.id) });
            errors.touch("id");
          }}
          hint={
            isNew
              ? `The public page will be /projects/${form.id || "your-id"}. It cannot be changed later.`
              : `Fixed after creation: the page lives at /projects/${form.id}.`
          }
        />
        <TextField
          {...bind("title")}
          label="Title"
          required
          value={form.title}
          onChange={(value) => update(isNew && !idEdited ? { title: value, id: slugify(value) } : { title: value })}
        />
        <TextField {...bind("shortTitle")} label="Short title" value={form.shortTitle} onChange={(value) => update({ shortTitle: value })} hint="Used where space is tight. Optional." />
        <TextField
          {...bind("category")}
          label="Category"
          value={form.category}
          list={`${idPrefix}-categories`}
          onChange={(value) => update({ category: value })}
        />
        <datalist id={`${idPrefix}-categories`}>
          {PROJECT_CATEGORY_SUGGESTIONS.map((category) => (
            <option key={category} value={category} />
          ))}
        </datalist>
        <TextField {...bind("year")} label="Year" value={form.year} inputMode="numeric" onChange={(value) => update({ year: value })} />
        <SelectField
          id={fid("projectStatus")}
          label="Project status"
          value={form.projectStatus}
          options={PROJECT_STATUS_OPTIONS}
          onChange={(value) => update({ projectStatus: value })}
          hint="Shown as a label on the project. Not the same as publishing."
        />
        <TextField
          {...bind("priority")}
          label="Position"
          required
          type="number"
          min={0}
          step={1}
          inputMode="numeric"
          value={form.priority}
          onChange={(value) => update({ priority: value })}
          hint="Lower numbers appear first. The list arrows renumber positions for you."
        />
      </FormSection>

      <FormSection title="Where it appears">
        <CheckboxField id={fid("featured")} label="Featured" checked={form.featured} disabled={disabled} onChange={(checked) => update({ featured: checked })} description="Highlighted in project listings." />
        <CheckboxField id={fid("showOnHome")} label="Show on homepage" checked={form.showOnHome} disabled={disabled} onChange={(checked) => update({ showOnHome: checked })} description="Adds the project to the selected work on the homepage." />
        <CheckboxField
          id={fid("archived")}
          label="List under “From the archive”"
          checked={form.archived}
          disabled={disabled}
          onChange={(checked) => update({ archived: checked })}
          description="Keeps the project public but moves it to the archive section. To hide it completely, use Archive in the list."
        />
      </FormSection>

      <FormSection title="Story" columns={1}>
        <TextAreaField {...bind("summary")} label="Summary" required rows={3} value={form.summary} onChange={(value) => update({ summary: value })} />
        <TextField {...bind("oneLine")} label="One-line description" value={form.oneLine} onChange={(value) => update({ oneLine: value })} hint="Used for page descriptions and compact cards." />
        <TextAreaField {...bind("problem")} label="Problem" rows={3} value={form.problem} onChange={(value) => update({ problem: value })} />
        <TextAreaField {...bind("solution")} label="Solution" rows={3} value={form.solution} onChange={(value) => update({ solution: value })} />
        <TextAreaField {...bind("myRole")} label="My role" rows={3} value={form.myRole} onChange={(value) => update({ myRole: value })} />
      </FormSection>

      <FormSection title="Stack and tags">
        <ListField {...bind("techStack")} separator="comma" label="Tech stack" value={form.techStack} onChange={(value) => update({ techStack: value })} placeholder="Next.js, FastAPI, Postgres" />
        <ListField {...bind("tags")} separator="comma" label="Tags" value={form.tags} onChange={(value) => update({ tags: value })} placeholder="RAG, Evaluation" />
      </FormSection>

      <FormSection title="Case study details" description="One item per line. Empty lines are ignored.">
        {PROJECT_LIST_FIELDS.map(({ key, label }) => (
          <ListField
            key={key}
            {...bind(key)}
            separator="lines"
            label={label}
            rows={4}
            value={form[key]}
            onChange={(value) => update({ [key]: value } as Partial<ProjectForm>)}
          />
        ))}
      </FormSection>

      <FormSection
        title="Links"
        description="Leave a link empty to hide it. Removing a link here also removes it from a static project when you save. Bare domains are saved with https://."
      >
        {PROJECT_LINK_FIELDS.map(({ key, label, kind, placeholder }) => (
          <UrlField
            key={key}
            {...bind(`links.${key}`)}
            label={label}
            kind={kind}
            placeholder={placeholder}
            value={form.links[key]}
            onChange={(value) => update({ links: { ...form.links, [key]: value } })}
          />
        ))}
      </FormSection>

      <FormSection title="Thumbnail" columns={1} description="Shown at 16:10 on the case study. The preview is contained, never cropped or stretched.">
        <ImageUploader
          {...bind("thumbnail")}
          label="Thumbnail image"
          variant="wide"
          folder="project-images"
          uploadKey={form.id}
          value={form.thumbnail}
          persistedValue={persisted?.thumbnail}
          alt={form.thumbnailAlt}
          onChange={(value) => update({ thumbnail: value })}
        />
        <TextField
          {...bind("thumbnailAlt")}
          label="Thumbnail alt text"
          value={form.thumbnailAlt}
          onChange={(value) => update({ thumbnailAlt: value })}
          hint="Describe what the image shows, for screen readers."
        />
      </FormSection>
    </div>
  );
}

const projectsConfig: WorkspaceConfig<Project, ProjectForm> = {
  adapter: projectAdapter,
  noun: "project",
  nounPlural: "projects",
  idPrefix: "project",
  sequence: projectSequence,
  orderLabel: (order) => (order >= Number.MAX_SAFE_INTEGER ? "–" : String(order)),
  // Only items that are visible on the public site can be previewed (drafts are never public).
  previewHref: (row) =>
    row.state === "archived" || (row.state === "draft" && !row.hasStatic) ? undefined : `/projects/${encodeURIComponent(row.id)}`,
  toForm: projectToForm,
  blankForm: blankProjectForm,
  withOrder: withProjectOrder,
  validate: validateProjectForm,
  toPayload: projectFormToPayload,
  formId: (form) => form.id,
  formTitle: (form) => form.title.trim(),
  imagesOf: (form) => [form.thumbnail].filter(Boolean),
  Fields: ProjectFields,
};

/** Projects on the CMS layer: static src/data projects merged with cms/projects/items overrides. */
export function ProjectsEditor({ source = firestoreDataSource }: { source?: CmsDataSource }) {
  return <CmsWorkspace config={projectsConfig} source={source} />;
}
