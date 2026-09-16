"use client";

import { useState } from "react";
import { CmsWorkspace, type EditorFieldsProps, type WorkspaceConfig } from "./CmsWorkspace";
import {
  blankExperienceForm,
  experienceAdapter,
  experienceFormToPayload,
  experienceSequence,
  experienceToForm,
  validateExperienceForm,
  withExperienceOrder,
  type AdminExperience,
  type ExperienceForm,
} from "./experienceForm";
import { CheckboxField, FormSection, ListField, TextAreaField, TextField } from "./fields";
import { slugify, slugifyWhileTyping } from "./format";
import { ImageUploader } from "./ImageUploader";
import { firestoreDataSource, type CmsDataSource } from "./useCmsCollection";

function ExperienceFields({ form, update, isNew, errors, persisted, idPrefix, disabled }: EditorFieldsProps<ExperienceForm>) {
  const [idEdited, setIdEdited] = useState(!isNew || Boolean(form.id));
  const fid = (key: string) => `${idPrefix}-${key}`;
  const bind = (key: string) => ({ id: fid(key), error: errors.errorFor(key), onBlur: () => errors.touch(key), disabled });

  return (
    <div className="adm-form">
      <FormSection title="Company">
        <TextField
          {...bind("id")}
          label="ID"
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
          hint={isNew ? "Lowercase, for example the company name. It cannot be changed later." : "Fixed after creation."}
        />
        <TextField
          {...bind("company")}
          label="Company"
          required
          value={form.company}
          onChange={(value) => update(isNew && !idEdited ? { company: value, id: slugify(value) } : { company: value })}
        />
        <TextField {...bind("location")} label="Location" value={form.location} onChange={(value) => update({ location: value })} placeholder="Pune, India · Remote" />
        <TextField {...bind("type")} label="Type" value={form.type} onChange={(value) => update({ type: value })} placeholder="Internship, Current role, Freelance" />
      </FormSection>

      <FormSection title="Company logo" columns={1} description="Square mark shown next to the role. Without a logo the site shows the company initials, as previewed here.">
        <ImageUploader
          {...bind("companyLogo")}
          label="Logo"
          variant="logo"
          folder="experience-logos"
          uploadKey={form.id || form.company}
          company={form.company}
          value={form.companyLogo}
          persistedValue={persisted?.companyLogo}
          onChange={(value) => update({ companyLogo: value })}
          hint="Transparent PNG or SVG works best. It is shown contained, never stretched."
        />
      </FormSection>

      <FormSection title="Role">
        <TextField {...bind("role")} label="Role" required value={form.role} onChange={(value) => update({ role: value })} />
        <TextField {...bind("period")} label="Period" required value={form.period} onChange={(value) => update({ period: value })} placeholder="May 2026 – Present" />
        <TextField {...bind("chapterTitle")} label="Chapter title" value={form.chapterTitle} onChange={(value) => update({ chapterTitle: value })} hint="Editorial headline on the timeline." />
        <TextField {...bind("progressionLabel")} label="Progression label" value={form.progressionLabel} onChange={(value) => update({ progressionLabel: value })} hint="Short label in the chapter guide." />
        <TextField
          {...bind("order")}
          label="Position"
          required
          type="number"
          min={0}
          step={1}
          inputMode="numeric"
          value={form.order}
          onChange={(value) => update({ order: value })}
          hint="0 is the newest role, shown first. The list arrows renumber positions for you."
        />
        <CheckboxField id={fid("featured")} label="Featured" checked={form.featured} disabled={disabled} onChange={(checked) => update({ featured: checked })} description="Marks the role as a highlight." />
      </FormSection>

      <FormSection title="Details" columns={1}>
        <TextAreaField {...bind("shortSummary")} label="Short summary" rows={3} value={form.shortSummary} onChange={(value) => update({ shortSummary: value })} />
        <ListField {...bind("responsibilities")} separator="lines" label="Responsibilities" rows={5} value={form.responsibilities} onChange={(value) => update({ responsibilities: value })} />
        <ListField {...bind("impact")} separator="lines" label="Impact" rows={4} value={form.impact} onChange={(value) => update({ impact: value })} />
        <ListField {...bind("techStack")} separator="comma" label="Tech stack" value={form.techStack} onChange={(value) => update({ techStack: value })} placeholder="Python, FastAPI, n8n" />
      </FormSection>
    </div>
  );
}

const experienceConfig: WorkspaceConfig<AdminExperience, ExperienceForm> = {
  adapter: experienceAdapter,
  noun: "role",
  nounPlural: "roles",
  idPrefix: "experience",
  sequence: experienceSequence,
  orderLabel: (order) => (order >= Number.MAX_SAFE_INTEGER ? "–" : String(order)),
  previewHref: (row) => (row.state === "archived" || (row.state === "draft" && !row.hasStatic) ? undefined : "/#experience"),
  toForm: experienceToForm,
  blankForm: blankExperienceForm,
  withOrder: withExperienceOrder,
  validate: validateExperienceForm,
  toPayload: experienceFormToPayload,
  formId: (form) => form.id,
  formTitle: (form) => form.company.trim(),
  imagesOf: (form) => [form.companyLogo].filter(Boolean),
  Fields: ExperienceFields,
};

/** Experience timeline on the CMS layer: static src/data roles merged with cms/experience/items overrides. */
export function ExperienceEditor({ source = firestoreDataSource }: { source?: CmsDataSource }) {
  return <CmsWorkspace config={experienceConfig} source={source} />;
}
