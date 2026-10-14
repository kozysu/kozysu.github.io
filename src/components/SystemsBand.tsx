import Image from "next/image";
import Link from "next/link";
import { stages } from "../data/agenda";
import { slugForProject } from "../data/systems";
import { publications } from "../data/publications";
import { Publication } from "../types/publication";

/**
 * The selected papers. `agenda.ts` decides which three they are — one per
 * stage of the thesis — and `publications.ts` supplies the paper itself and
 * its figure, matched on the `project` field. Nothing is written twice.
 *
 * The card shows the figure, the venue and the paper's own title, and the
 * title is the link. The system name and the stage it belongs to are the
 * project page's business, not the teaser's.
 */

function paperFor(project: string): Publication | undefined {
    return publications.find((pub) => pub.project === project);
}

export function SystemsBand() {
    const current = stages.filter((stage) => stage.project);

    return (
        <div className="systems-row">
            {current.map((stage) => {
                const project = stage.project as string;
                const pub = paperFor(project);
                const img = pub?.imageUrl ?? null;
                const slug = slugForProject(project);

                // the whole card is the link; the paper's own PDF link would
                // sit inside it and nesting anchors is not allowed, so the PDF
                // lives on the project page instead
                return (
                    <Link
                        className="system"
                        href={slug ? `/projects/${slug}` : "/projects"}
                        key={stage.kind}
                    >
                        <div className={`system-fig${img ? "" : " pending"}`}>
                            {img ? (
                                <Image
                                    src={img}
                                    alt=""
                                    sizes="(max-width: 900px) 100vw, 33vw"
                                />
                            ) : (
                                <span>Figure to come</span>
                            )}
                        </div>

                        {pub && (
                            <span className="venue">
                                {pub.venueShort ?? pub.venue} · {pub.year}
                            </span>
                        )}

                        <h3>{pub ? pub.title : project}</h3>
                    </Link>
                );
            })}
        </div>
    );
}
