'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, LoaderCircle } from 'lucide-react';

const BOOT_SESSION_KEY = 'ayush-portfolio-booted-v2';

const bootTasks = [
    { id: 'shell', label: 'Document shell' },
    { id: 'fonts', label: 'Type system' },
    { id: 'portrait', label: 'Portrait asset' },
    { id: 'interface', label: 'Interface modules' },
] as const;

function delay(duration: number) {
    return new Promise<void>((resolve) => window.setTimeout(resolve, duration));
}

function waitForDocument() {
    if (document.readyState === 'complete') return Promise.resolve();

    return new Promise<void>((resolve) => {
        window.addEventListener('load', () => resolve(), { once: true });
    });
}

function waitForFonts() {
    return document.fonts?.ready.then(() => undefined) ?? Promise.resolve();
}

function preloadImage(src: string) {
    return new Promise<void>((resolve) => {
        const image = new window.Image();
        let settled = false;

        const finish = () => {
            if (settled) return;
            settled = true;
            resolve();
        };

        image.onload = () => {
            if (image.decode) {
                image.decode().catch(() => undefined).finally(finish);
            } else {
                finish();
            }
        };
        image.onerror = finish;
        image.src = src;
        window.setTimeout(finish, 1800);
    });
}

function waitForInterface() {
    return new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()));
    });
}

export default function BootLoader() {
    const router = useRouter();
    const [visible, setVisible] = useState(true);
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);
    const [exiting, setExiting] = useState(false);
    const progress = useMemo(
        () => Math.round((completedTasks.length / bootTasks.length) * 100),
        [completedTasks.length]
    );

    useEffect(() => {
        let cancelled = false;
        const root = document.documentElement;
        const body = document.body;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const prefetchPrimaryRoutes = () => {
            const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
            if (connection?.saveData) return;

            window.setTimeout(() => {
                ['/projects', '/skills', '/about', '/resume'].forEach((route) => router.prefetch(route));
            }, 500);
        };

        let sessionAlreadyBooted = false;
        try {
            sessionAlreadyBooted = sessionStorage.getItem(BOOT_SESSION_KEY) === 'true';
        } catch {
            sessionAlreadyBooted = false;
        }

        const skipBoot = root.dataset.bootSkip === 'true' || sessionAlreadyBooted;

        if (skipBoot) {
            root.dataset.booting = 'false';
            body.removeAttribute('aria-busy');
            setVisible(false);
            prefetchPrimaryRoutes();
            return;
        }

        root.dataset.booting = 'true';
        body.setAttribute('aria-busy', 'true');
        const previousOverflow = body.style.overflow;
        body.style.overflow = 'hidden';

        const markComplete = (id: string) => {
            if (cancelled) return;
            setCompletedTasks((current) => current.includes(id) ? current : [...current, id]);
        };

        const runTask = async (id: string, task: () => Promise<void>) => {
            try {
                await task();
            } finally {
                markComplete(id);
            }
        };

        const finishBoot = async () => {
            const tasks = Promise.allSettled([
                runTask('shell', waitForDocument),
                runTask('fonts', waitForFonts),
                runTask('portrait', () => preloadImage('/profile.png')),
                runTask('interface', waitForInterface),
            ]);

            await Promise.all([
                Promise.race([tasks, delay(2400)]),
                delay(reducedMotion ? 0 : 750),
            ]);

            if (cancelled) return;

            setCompletedTasks(bootTasks.map((task) => task.id));
            try {
                sessionStorage.setItem(BOOT_SESSION_KEY, 'true');
            } catch {
                // Storage can be blocked in privacy-restricted contexts; boot must still finish.
            }
            setExiting(true);

            await delay(reducedMotion ? 0 : 360);
            if (cancelled) return;

            root.dataset.booting = 'false';
            root.dataset.bootSkip = 'true';
            body.removeAttribute('aria-busy');
            body.style.overflow = previousOverflow;
            setVisible(false);
            prefetchPrimaryRoutes();
        };

        void finishBoot();

        return () => {
            cancelled = true;
            body.style.overflow = previousOverflow;
            body.removeAttribute('aria-busy');
        };
    }, [router]);

    if (!visible) return null;

    return (
        <div
            className={`boot-loader ${exiting ? 'boot-loader--exiting' : ''}`}
            role="status"
            aria-live="polite"
            aria-label={`Loading portfolio, ${progress}% complete`}
        >
            <div className="boot-loader__scan" aria-hidden="true" />

            <div className="boot-loader__terminal">
                <div className="boot-loader__brand" aria-hidden="true">
                    <span>AC</span>
                    <span className="boot-loader__brand-line" />
                    <span>PORTFOLIO/OS</span>
                </div>

                <div className="boot-loader__heading">
                    <p>INITIALIZING EXPERIENCE</p>
                    <span className="boot-loader__cursor" aria-hidden="true" />
                </div>

                <div className="boot-loader__tasks" aria-hidden="true">
                    {bootTasks.map((task) => {
                        const complete = completedTasks.includes(task.id);

                        return (
                            <div key={task.id} className={complete ? 'is-complete' : ''}>
                                <span className="boot-loader__task-icon">
                                    {complete ? <Check aria-hidden="true" /> : <LoaderCircle aria-hidden="true" />}
                                </span>
                                <span>{task.label}</span>
                                <span>{complete ? 'READY' : 'WAIT'}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="boot-loader__progress" aria-hidden="true">
                    <div>
                        <span>BOOT SEQUENCE</span>
                        <span>{progress.toString().padStart(3, '0')}%</span>
                    </div>
                    <div className="boot-loader__track">
                        <span style={{ width: `${Math.max(progress, 6)}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
