'use client';

import { FormEvent, useState } from 'react';
import { ArrowRight, Check, Copy, Github, Linkedin, Mail, MapPin, MessageSquare } from 'lucide-react';
import { SkeuomorphicCard } from './ui/SkeuomorphicCard';
import { profile } from '@/config/portfolio';

type FormState = {
    name: string;
    email: string;
    message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

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

export default function Contact() {
    const [form, setForm] = useState<FormState>(initialForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [copied, setCopied] = useState(false);
    const [copyFailed, setCopyFailed] = useState(false);
    const email = profile.email;

    const copyEmail = async () => {
        if (!email || typeof navigator === 'undefined' || !navigator.clipboard) return;

        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setCopyFailed(false);
            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            setCopyFailed(true);
        }
    };

    const submitForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!email) return;

        const nextErrors = validate(form);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

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
        <section id="contact" className="relative z-10 w-full scroll-mt-28 overflow-hidden px-6 py-20 md:px-12 md:py-24">
            <div className="pointer-events-none absolute inset-x-6 top-16 mx-auto h-64 max-w-5xl rounded-full bg-gradient-to-r from-purple/10 via-cyan/10 to-orange/10 blur-[90px]" />
            <div className="mx-auto max-w-7xl">
                <div className="mb-10">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan/20 bg-cyan/10">
                            <MessageSquare className="h-5 w-5 text-cyan" aria-hidden="true" />
                        </div>
                        <p className="text-sm font-bold uppercase tracking-widest text-cyan">Contact</p>
                    </div>
                    <h2 className="max-w-3xl text-4xl font-black tracking-tight text-white md:text-5xl">
                        Let&apos;s build something useful.
                    </h2>
                    <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted md:text-lg">
                        I&apos;m open to AI engineering internships, full-stack roles, freelance builds, and collaboration around practical AI systems.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="space-y-6">
                        <SkeuomorphicCard className="p-6">
                            <h3 className="text-2xl font-black text-white">Best fit</h3>
                            <p className="mt-3 text-sm leading-relaxed text-muted">
                                {profile.availability}
                            </p>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {bestFit.map((item) => (
                                    <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-white/80">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </SkeuomorphicCard>

                        <SkeuomorphicCard className="p-6">
                            <h3 className="text-2xl font-black text-white">Direct contact</h3>
                            <div className="mt-5 grid gap-3">
                                {email ? (
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="min-w-0">
                                                <p className="mb-1 flex items-center gap-2 text-sm font-black text-white">
                                                    <Mail className="h-4 w-4 text-cyan" aria-hidden="true" />
                                                    Email
                                                </p>
                                                <a href={`mailto:${email}`} className="break-all text-sm font-semibold text-muted transition hover:text-white">
                                                    {email}
                                                </a>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={copyEmail}
                                                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white transition hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                                                aria-label="Copy email address"
                                            >
                                                {copied ? <Check className="h-4 w-4 text-cyan" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                                                {copied ? 'Copied' : 'Copy'}
                                            </button>
                                        </div>
                                        {copyFailed ? (
                                            <p className="mt-3 text-sm font-semibold text-orange">Copy failed. You can select the email address manually.</p>
                                        ) : null}
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-relaxed text-muted">
                                        Email will be added soon. Use LinkedIn or GitHub for now.
                                    </div>
                                )}

                                <a
                                    href={profile.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-cyan/30 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                                >
                                    <span className="flex min-w-0 items-center gap-3">
                                        <Linkedin className="h-5 w-5 shrink-0 text-cyan" aria-hidden="true" />
                                        <span>
                                            <span className="block text-sm font-black text-white">LinkedIn</span>
                                            <span className="block text-sm text-muted">{profile.linkedinHandle}</span>
                                        </span>
                                    </span>
                                    <ArrowRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                                </a>

                                <a
                                    href={profile.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-purple/30 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                                >
                                    <span className="flex min-w-0 items-center gap-3">
                                        <Github className="h-5 w-5 shrink-0 text-purple" aria-hidden="true" />
                                        <span>
                                            <span className="block text-sm font-black text-white">GitHub</span>
                                            <span className="block text-sm text-muted">{profile.githubHandle}</span>
                                        </span>
                                    </span>
                                    <ArrowRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                                </a>

                                {(profile.location || profile.timezone) ? (
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                                        <p className="mb-1 flex items-center gap-2 text-sm font-black text-white">
                                            <MapPin className="h-4 w-4 text-orange" aria-hidden="true" />
                                            Location
                                        </p>
                                        <p className="text-sm leading-relaxed text-muted">
                                            {[profile.location, profile.timezone].filter(Boolean).join(' · ')}
                                        </p>
                                    </div>
                                ) : null}
                            </div>

                            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                {email ? (
                                    <a href={`mailto:${email}`} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-background transition hover:translate-y-[-1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:w-auto">
                                        <Mail className="h-4 w-4" aria-hidden="true" />
                                        Email Me
                                    </a>
                                ) : null}
                                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-black text-white transition hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:w-auto">
                                    <Linkedin className="h-4 w-4 text-cyan" aria-hidden="true" />
                                    Connect on LinkedIn
                                </a>
                                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-black text-white transition hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:w-auto">
                                    <Github className="h-4 w-4 text-purple" aria-hidden="true" />
                                    View GitHub
                                </a>
                            </div>
                        </SkeuomorphicCard>
                    </div>

                    <SkeuomorphicCard className="p-6 md:p-8">
                        <h3 className="text-2xl font-black text-white">Open an email draft</h3>
                        <p className="mt-3 text-sm leading-relaxed text-muted">
                            This opens your email client so the message is sent directly to me.
                        </p>

                        {email ? (
                            <form onSubmit={submitForm} className="mt-6 grid gap-5" noValidate>
                                <div>
                                    <label htmlFor="contact-name" className="mb-2 block text-sm font-black text-white">
                                        Name
                                    </label>
                                    <input
                                        id="contact-name"
                                        name="name"
                                        value={form.name}
                                        onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                                        className="w-full rounded-2xl border border-white/10 bg-surface px-4 py-3 text-base text-white outline-none transition placeholder:text-muted/60 focus:border-cyan/50"
                                        placeholder="Your name"
                                        aria-invalid={Boolean(errors.name)}
                                        aria-describedby={errors.name ? 'contact-name-error' : undefined}
                                    />
                                    {errors.name ? <p id="contact-name-error" className="mt-2 text-sm font-semibold text-orange">{errors.name}</p> : null}
                                </div>

                                <div>
                                    <label htmlFor="contact-email" className="mb-2 block text-sm font-black text-white">
                                        Email
                                    </label>
                                    <input
                                        id="contact-email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                                        className="w-full rounded-2xl border border-white/10 bg-surface px-4 py-3 text-base text-white outline-none transition placeholder:text-muted/60 focus:border-cyan/50"
                                        placeholder="you@example.com"
                                        aria-invalid={Boolean(errors.email)}
                                        aria-describedby={errors.email ? 'contact-email-error' : undefined}
                                    />
                                    {errors.email ? <p id="contact-email-error" className="mt-2 text-sm font-semibold text-orange">{errors.email}</p> : null}
                                </div>

                                <div>
                                    <label htmlFor="contact-message" className="mb-2 block text-sm font-black text-white">
                                        Message
                                    </label>
                                    <textarea
                                        id="contact-message"
                                        name="message"
                                        value={form.message}
                                        onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                                        rows={6}
                                        className="w-full resize-y rounded-2xl border border-white/10 bg-surface px-4 py-3 text-base text-white outline-none transition placeholder:text-muted/60 focus:border-cyan/50"
                                        placeholder="Tell me what you are building or hiring for."
                                        aria-invalid={Boolean(errors.message)}
                                        aria-describedby={errors.message ? 'contact-message-error' : undefined}
                                    />
                                    {errors.message ? <p id="contact-message-error" className="mt-2 text-sm font-semibold text-orange">{errors.message}</p> : null}
                                </div>

                                <button
                                    type="submit"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-black text-background transition hover:translate-y-[-1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:w-auto"
                                >
                                    Open email draft
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </button>
                            </form>
                        ) : (
                            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-relaxed text-muted">
                                Email is not configured yet, so the message form is disabled. Use LinkedIn or GitHub for now.
                            </div>
                        )}
                    </SkeuomorphicCard>
                </div>
            </div>
        </section>
    );
}
