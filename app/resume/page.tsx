import type { Metadata } from 'next';
import {
    contact,
    summary,
    currentRole,
    previousExperience,
    skills,
    education,
    coursesAndCertifications,
    projects,
    personality,
    resumePdfPath,
} from '../../src/data/resume';

export const metadata: Metadata = {
    title: `${contact.name} - ${contact.title}`,
    description: summary,
    alternates: { canonical: '/resume' },
};

export default function ResumePage() {
    return (
        <main style={{ maxWidth: '760px', margin: '0 auto', padding: '2.5rem 1.5rem', lineHeight: 1.6 }}>
            <header>
                <h1>{contact.name}</h1>
                <p>
                    {contact.title} &middot; {contact.location}
                </p>
                <p>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    {' · '}
                    <a href={contact.site}>{contact.site.replace('https://', '')}</a>
                    {' · '}
                    <a href={contact.linkedin}>LinkedIn</a>
                    {' · '}
                    <a href={contact.github}>GitHub</a>
                </p>
                <p>
                    <a href={resumePdfPath} download>
                        Download PDF resume
                    </a>
                </p>
            </header>

            <section>
                <h2>Summary</h2>
                <p>{summary}</p>
            </section>

            <section>
                <h2>Experience</h2>
                <article>
                    <h3>{currentRole.company}</h3>
                    <p>
                        {currentRole.location} &middot; {currentRole.period}
                    </p>
                    <ul>
                        {currentRole.titles.map((t) => (
                            <li key={t.title}>
                                {t.title} ({t.period})
                            </li>
                        ))}
                    </ul>
                    <p>
                        <em>{currentRole.scope}</em>
                    </p>
                    <ul>
                        {currentRole.achievements.map((a, i) => (
                            <li key={i}>{a}</li>
                        ))}
                    </ul>
                </article>

                {previousExperience.map((job) => (
                    <article key={job.company}>
                        <h3>
                            {job.company} &mdash; {job.position}
                        </h3>
                        <p>{job.period}</p>
                        <ul>
                            {job.achievements.map((a, i) => (
                                <li key={i}>{a}</li>
                            ))}
                        </ul>
                    </article>
                ))}
            </section>

            <section>
                <h2>Projects</h2>
                {projects.map((p) => (
                    <article key={p.id}>
                        <h3>
                            <a href={p.url}>{p.name}</a> &middot; {p.status}
                        </h3>
                        <p>{p.description}</p>
                        <p>{p.stack.join(', ')}</p>
                    </article>
                ))}
            </section>

            <section>
                <h2>Skills</h2>
                <ul>
                    {skills.map((s) => (
                        <li key={s.group}>
                            <strong>{s.group}:</strong> {s.items.join(', ')}
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Education</h2>
                <ul>
                    {education.map((e) => (
                        <li key={e.degree}>
                            {e.degree}, {e.institution}
                            {'year' in e && e.year ? ` (${e.year})` : ''}
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Courses and certifications</h2>
                <ul>
                    {coursesAndCertifications.map((c) => (
                        <li key={c.name}>
                            {c.name}, {c.issuer} ({c.year})
                            {c.note ? ` — ${c.note}` : ''}
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Outside work</h2>
                <p>{personality.bio}</p>
                <ul>
                    {personality.items.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            </section>

            <footer>
                <p>
                    <a href="/">&larr; Back to the desktop</a>
                </p>
            </footer>
        </main>
    );
}
