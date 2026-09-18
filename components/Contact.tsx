'use client';

import { type ChangeEvent, type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, CircleAlert, Copy, Github, Linkedin, Mail, MapPin, MessageSquare } from 'lucide-react';
import { profile as fallbackProfile, type Profile } from '@/src/data/profile';
import './contact.css';

type FormState = {
    name: string;
    email: string;
    message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

type CopyState = 'idle' | 'copied' | 'failed';

const bestFit = [
    'AI systems / agentic workflows',
    'RAG and document AI',
    'Voice AI agents',
    'Full-stack AI products',
    'Backend/API integrations',
];

const initialForm: FormState = {
    name: '',
    email: '',
    message: '',
};

const fieldOrder: (keyof FormState)[] = ['name', 'email', 'message'];

function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validate(form: FormState) {
    const errors: FormErrors = {};

    if (!form.name.trim()) errors.name = 'Name is required.';
    if (!form.email.trim()) {
        errors.email = 'Email is required.';
    } else if (!isValidEmail(form.email.trim())) {
        errors.email = 'Enter a valid email address.';
    }
    if (!form.message.trim()) errors.message = 'Message is required.';

    return errors;
}

type FieldProps = {
    name: keyof FormState;
    label: string;
    error?: string;
    children: (props: { id: string; name: string; 'aria-invalid': boolean; 'aria-describedby'?: string; className: string; required: true }) => ReactNode;
};

function Field({ name, label, error, children }: FieldProps) {
    const id = `contact-${name}`;
    const errorId = `${id}-error`;

    return (
        <div className={`contact-field${error ? ' contact-field--invalid' : ''}`}>
            <label htmlFor={id} className="contact-field__label">{label}</label>
            {children({
                id,
                name,
                'aria-invalid': Boolean(error),
                'aria-describedby': error ? errorId : undefined,
                className: 'contact-field__control',
                required: true,
            })}
            {error ? (
                <p id={errorId} className="contact-field__error">
                    <CircleAlert size={15} aria-hidden="true" />
                    {error}
                </p>
            ) : null}
        </div>
    );
}

function ExternalHint() {
    return <span className="visually-hidden"> (opens in a new tab)</span>;
}

export default function Contact({ profile = fallbackProfile }: { profile?: Profile }) {
    const [form, setForm] = useState<FormState>(initialForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [copyState, setCopyState] = useState<CopyState>('idle');
    const resetTimer = useRef<number | undefined>(undefined);
    const email = profile.email;
    const location = [profile.location, profile.timezone].filter(Boolean).join(' · ');

    useEffect(() => () => window.clearTimeout(resetTimer.current), []);

    const copyEmail = async () => {
        if (!email) return;
        window.clearTimeout(resetTimer.current);

        try {
            if (typeof navigator === 'undefined' || !navigator.clipboard) throw new Error('Clipboard unavailable');
            await navigator.clipboard.writeText(email);
            setCopyState('copied');
            resetTimer.current = window.setTimeout(() => setCopyState('idle'), 1800);
        } catch {
            setCopyState('failed');
        }
    };

    const updateField = (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const nextForm = { ...form, [field]: event.target.value };
        setForm(nextForm);
        // Once a field has been flagged, clear or update its message as the visitor corrects it.
        if (errors[field]) setErrors((current) => ({ ...current, [field]: validate(nextForm)[field] }));
    };

    const submitForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!email) return;

        const nextErrors = validate(form);
        setErrors(nextErrors);
        const firstInvalid = fieldOrder.find((field) => nextErrors[field]);
        if (firstInvalid) {
            document.getElementById(`contact-${firstInvalid}`)?.focus();
            return;
        }

        const subject = `Portfolio inquiry from ${form.name.trim()}`;
        const body = [
            `Name: ${form.name.trim()}`,
            `Email: ${form.email.trim()}`,
            '',
            form.message.trim(),
        ].join('\n');

        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <section id="contact" className="contact-section" aria-labelledby="contact-heading">
            <div className="portfolio-wrap">
                <header className="contact-header">
                    <div>
                        <p className="contact-eyebrow"><MessageSquare size={15} aria-hidden="true" /> Contact</p>
                        <h2 id="contact-heading">Let’s build something useful<span className="accent-period">.</span></h2>
                    </div>
                    <p className="contact-intro">
                        I’m open to AI engineering internships, full-stack roles, freelance builds, and collaboration around practical AI systems.
                    </p>
                </header>

                <div className="contact-grid">
                    <div className="contact-aside">
                        <article className="ink-card tone-sage contact-card contact-fit" aria-labelledby="contact-fit-heading">
                            <h3 id="contact-fit-heading">Best fit</h3>
                            {profile.availability ? <p className="contact-card__copy">{profile.availability}</p> : null}
                            <ul className="contact-fit__list">
                                {bestFit.map((item) => <li key={item}>{item}</li>)}
                            </ul>
                        </article>

                        <article className="ink-card contact-card contact-direct" aria-labelledby="contact-direct-heading">
                            <h3 id="contact-direct-heading">Direct contact</h3>
                            <ul className="contact-channels">
                                {email ? (
                                    <li className="contact-channel contact-channel--email">
                                        <span className="contact-channel__icon" aria-hidden="true"><Mail size={18} /></span>
                                        <span className="contact-channel__text">
                                            <span className="contact-channel__label">Email</span>
                                            <a href={`mailto:${email}`} className="contact-channel__value contact-channel__mail">{email}</a>
                                        </span>
                                        <button type="button" onClick={copyEmail} className="contact-copy" data-state={copyState}>
                                            {copyState === 'copied' ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                                            {copyState === 'copied' ? 'Copied' : 'Copy'}
                                            <span className="visually-hidden"> email address</span>
                                        </button>
                                        <p className="contact-copy-status" role="status" aria-live="polite">
                                            {copyState === 'copied' ? <span className="visually-hidden">Email address copied to your clipboard.</span> : null}
                                            {copyState === 'failed' ? (
                                                <>
                                                    <CircleAlert size={15} aria-hidden="true" />
                                                    Copy failed. You can select the email address manually.
                                                </>
                                            ) : null}
                                        </p>
                                    </li>
                                ) : (
                                    <li className="contact-channel contact-channel--note">
                                        Email will be added soon. Use LinkedIn or GitHub for now.
                                    </li>
                                )}

                                {profile.linkedin ? (
                                    <li>
                                        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="contact-channel contact-channel--link">
                                            <span className="contact-channel__icon" aria-hidden="true"><Linkedin size={18} /></span>
                                            <span className="contact-channel__text">
                                                <span className="contact-channel__label">LinkedIn</span>
                                                <span className="contact-channel__value">{profile.linkedinHandle}</span>
                                            </span>
                                            <ArrowUpRight className="contact-channel__arrow" size={20} aria-hidden="true" />
                                            <ExternalHint />
                                        </a>
                                    </li>
                                ) : null}

                                {profile.github ? (
                                    <li>
                                        <a href={profile.github} target="_blank" rel="noopener noreferrer" className="contact-channel contact-channel--link">
                                            <span className="contact-channel__icon" aria-hidden="true"><Github size={18} /></span>
                                            <span className="contact-channel__text">
                                                <span className="contact-channel__label">GitHub</span>
                                                <span className="contact-channel__value">{profile.githubHandle}</span>
                                            </span>
                                            <ArrowUpRight className="contact-channel__arrow" size={20} aria-hidden="true" />
                                            <ExternalHint />
                                        </a>
                                    </li>
                                ) : null}

                                {location ? (
                                    <li className="contact-channel">
                                        <span className="contact-channel__icon" aria-hidden="true"><MapPin size={18} /></span>
                                        <span className="contact-channel__text">
                                            <span className="contact-channel__label">Location</span>
                                            <span className="contact-channel__value">{location}</span>
                                        </span>
                                    </li>
                                ) : null}
                            </ul>
                        </article>
                    </div>

                    <article className="ink-card contact-card contact-form-card" aria-labelledby="contact-form-heading">
                        <h3 id="contact-form-heading">Open an email draft</h3>
                        <p id="contact-form-note" className="contact-card__copy">
                            This opens your email client so the message is sent directly to me. All fields are required.
                        </p>

                        {email ? (
                            <form onSubmit={submitForm} className="contact-form" aria-describedby="contact-form-note" noValidate>
                                <Field name="name" label="Name" error={errors.name}>
                                    {(props) => (
                                        <input {...props} type="text" autoComplete="name" value={form.name} onChange={updateField('name')} placeholder="Your name" />
                                    )}
                                </Field>
                                <Field name="email" label="Email" error={errors.email}>
                                    {(props) => (
                                        <input {...props} type="email" autoComplete="email" inputMode="email" spellCheck={false} value={form.email} onChange={updateField('email')} placeholder="you@example.com" />
                                    )}
                                </Field>
                                <Field name="message" label="Message" error={errors.message}>
                                    {(props) => (
                                        <textarea {...props} rows={6} value={form.message} onChange={updateField('message')} placeholder="Tell me what you are building or hiring for." />
                                    )}
                                </Field>
                                <div className="contact-form__actions">
                                    <button type="submit" className="brutal-button contact-submit">
                                        Open email draft
                                        <ArrowUpRight size={18} aria-hidden="true" />
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <p className="state-note contact-form-empty">
                                Email is not configured yet, so the message form is disabled. Use LinkedIn or GitHub for now.
                            </p>
                        )}
                    </article>
                </div>
            </div>
        </section>
    );
}
