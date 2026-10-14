import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { systemPages, systemPageFor, trimTitle } from "../../../data/systems";
import { publications } from "../../../data/publications";
import { stages } from "../../../data/agenda";

/** `projectUrl` is a DOI on some papers and a live demo on others */
const linkLabel = (url?: string) =>
    url && /doi\.org|dl\.acm\.org|jmir\.org|mdpi\.com/.test(url) ? "DOI" : "Demo";

/** a section and its jump-link have to agree on the id */
const anchor = (eyebrow: string) =>
    eyebrow.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function generateStaticParams() {
    return systemPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const page = systemPageFor(slug);
    if (!page) return {};
    return {
        title: `${page.project} — Jisu Ko`,
        description: page.tldr,
    };
}

export default async function SystemPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const page = systemPageFor(slug);
    if (!page) notFound();

    const pub = publications.find((p) => p.project === page.project);
    const stage = stages.find((s) => s.project === page.project);

    const hasPdf = pub?.pdfUrl && pub.pdfUrl !== "#";
    const hasProject = pub?.projectUrl && pub.projectUrl !== "#";
    const sections = page.sections ?? [];

    return (
        <article className="sys">
            {/* the page's own bar under the site masthead: where you are, and
                every section within reach */}
            <nav className="sys-bar">
                <Link href="/" className="sys-bar-home">
                    {page.project}
                </Link>

                <div className="sys-bar-links">
                    {page.abstract && <a href="#abstract">Abstract</a>}
                    {sections.map((section) => (
                        <a href={`#${anchor(section.eyebrow)}`} key={section.eyebrow}>
                            {section.eyebrow}
                        </a>
                    ))}
                    {page.bibtex && <a href="#bibtex">BibTeX</a>}
                </div>
            </nav>

            {/* the venue and year are the only thing here the page does not
                say again below; the name and project are the title itself */}
            <div className="runhead">
                {pub && (
                    <span>
                        {pub.venueShort ?? pub.venue} · {pub.year}
                    </span>
                )}
            </div>

            <header className="sys-head">
                <h1 className="display">{page.project}</h1>
                {stage && <p className="sys-kind">{stage.note}</p>}
                {pub && <p className="sys-sub">{trimTitle(pub.title, page.project)}</p>}

                {pub && (
                    <p className="sys-authors">
                        {pub.authors.map((author, i) => (
                            <span key={i}>
                                {author.includes("Jisu Ko") ? <b>{author}</b> : author}
                                {i < pub.authors.length - 1 ? ", " : ""}
                            </span>
                        ))}
                    </p>
                )}

                <div className="sys-affil">
                    {(
                        page.affiliations ?? [
                            "Human-AI Interaction Lab, Hanyang University ERICA",
                        ]
                    ).map((line) => (
                        <span key={line}>{line}</span>
                    ))}
                </div>

                {(hasPdf || hasProject || page.codeUrl || page.videoUrl) && (
                    <div className="sys-links">
                        {hasPdf && (
                            <a
                                className="solid"
                                href={pub?.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Paper ↗
                            </a>
                        )}
                        {hasProject && (
                            <a
                                href={pub?.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {linkLabel(pub?.projectUrl)} ↗
                            </a>
                        )}
                        {page.codeUrl && (
                            <a href={page.codeUrl} target="_blank" rel="noopener noreferrer">
                                Code ↗
                            </a>
                        )}
                        {page.videoUrl && (
                            <a href={page.videoUrl} target="_blank" rel="noopener noreferrer">
                                Video ↗
                            </a>
                        )}
                    </div>
                )}
            </header>

            {/* the swap, in the reader's first ten seconds */}
            <section className="sys-tldr">
                <span className="eyebrow">TL;DR</span>
                <p>{page.tldr}</p>
            </section>

            {pub?.imageUrl ? (
                <figure className="sys-teaser">
                    <Image
                        src={pub.imageUrl}
                        alt={`${page.project} teaser figure`}
                        sizes="(max-width: 900px) 100vw, 1100px"
                        priority
                    />
                </figure>
            ) : (
                <div className="sys-teaser pending">Figure to come</div>
            )}

            {page.abstract && (
                <section className="sys-sec band" id="abstract">
                    <div className="sys-sec-head">
                        <span className="eyebrow">Abstract</span>
                    </div>

                    <div className="sys-prose">
                        <p className="sys-lead">{page.abstract}</p>
                    </div>
                </section>
            )}

            {sections.map((section) => (
                <section
                    className={`sys-sec${section.band ? " band" : ""}`}
                    id={anchor(section.eyebrow)}
                    key={section.eyebrow}
                >
                    <div className="sys-sec-head">
                        <span className="eyebrow">{section.eyebrow}</span>
                        <h2>{section.heading}</h2>
                    </div>

                    {/* lead and body are one column of prose beside the
                        heading; splitting them across grid rows left a gap
                        mid-paragraph-stream */}
                    {(section.lead || section.body) && (
                        <div className="sys-prose">
                            {section.lead && (
                                <p className="sys-lead">{section.lead}</p>
                            )}
                            {section.body?.map((para, i) => (
                                <p className="sys-body" key={i}>
                                    {para}
                                </p>
                            ))}
                        </div>
                    )}

                    {section.stats && (
                        <div className="sys-stats">
                            {section.stats.map((stat) => (
                                <div className="sys-stat" key={stat.label}>
                                    <span className="v">{stat.value}</span>
                                    <span className="l">{stat.label}</span>
                                    {stat.against && (
                                        <span className="a">{stat.against}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {section.cards && (
                        <div className="sys-cards">
                            {section.cards.map((card) => (
                                <div className="sys-card" key={card.title}>
                                    {card.label && <span className="n">{card.label}</span>}
                                    <h3>{card.title}</h3>
                                    <p>{card.body}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {section.chart && (
                        <figure className="sys-chart">
                            {section.chart.series.length > 1 && (
                                <div className="chart-key">
                                    {section.chart.series.map((name, i) => (
                                        <span className={`s${i}`} key={name}>
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="chart-rows">
                                {section.chart.rows.map((row) => (
                                    <div
                                        className={`chart-row${row.lead ? " lead" : ""}`}
                                        key={row.label}
                                    >
                                        <span className="k">{row.label}</span>

                                        <div className="t">
                                            {row.values.map((v, i) => (
                                                <div className={`bar s${i}`} key={i}>
                                                    <span
                                                        className="fill"
                                                        style={{
                                                            width: `${
                                                                (v / section.chart!.max) *
                                                                100
                                                            }%`,
                                                        }}
                                                    />
                                                    <span className="v">
                                                        {v.toFixed(
                                                            section.chart!.max <= 1 ? 3 : 2
                                                        )}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {row.note && <span className="n">{row.note}</span>}
                                    </div>
                                ))}
                            </div>

                            <figcaption>{section.chart.caption}</figcaption>
                        </figure>
                    )}

                    {section.figures?.map((fig, i) => (
                        <figure className="sys-fig" key={i}>
                            <Image
                                src={fig.src as never}
                                alt=""
                                sizes="(max-width: 900px) 100vw, 1100px"
                            />
                            {fig.caption && <figcaption>{fig.caption}</figcaption>}
                        </figure>
                    ))}
                </section>
            ))}

            {page.bibtex && (
                <section className="sys-sec" id="bibtex">
                    <div className="sys-sec-head">
                        <span className="eyebrow">BibTeX</span>
                    </div>
                    <pre className="sys-bib">{page.bibtex}</pre>
                </section>
            )}

        </article>
    );
}
