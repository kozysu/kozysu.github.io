import Image from "next/image";
import portrait from "../assets/pic.jpg";
import { Email } from "../components/Email";
import { PubCarousel } from "../components/PubCarousel";
import { NewsList } from "../components/NewsList";
import { profiles } from "../data/profiles";

export default function HomePage() {
    return (
        <div className="home">
            {/* a bento of cards: who, with the portrait as its own card beside
                it at the same height; the research under both */}
            <section className="home-hero">
                {/* who, then what: the greeting carries the name and the place */}
                <div className="hero-text card">
                    <span className="card-label">About</span>

                    <div className="hero-head">
                        <h1>
                            Hi, I&apos;m Jisu Ko <span className="ko">고지수</span>
                        </h1>
                    </div>

                    <p className="standing">
                        I&apos;m a third-year Ph.D. student in Applied AI at Hanyang University,
                        doing research in Human-Computer Interaction. I work with{" "}
                        <a
                            href="https://scholar.google.co.kr/citations?user=HYgqtDIAAAAJ"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Prof. Minsam Ko
                        </a>{" "}
                        as part of the{" "}
                        <a href="https://hai.hanyang.ac.kr/" target="_blank" rel="noopener noreferrer">
                            Human-AI Interaction Lab
                        </a>
                        .
                    </p>

                    {/* the ways to reach and look up, as plain words in the
                        header's manner: the address, then the outside profiles
                        marked as leaving */}
                    <div className="hero-contact">
                        <Email>Email</Email>
                        {profiles.map(({ label, href }) => (
                            <a key={href} href={href} target="_blank" rel="noopener noreferrer">
                                {label}
                                <span className="out" aria-hidden="true">
                                    ↗
                                </span>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="hero-photo card">
                    <Image
                        src={portrait}
                        alt="Jisu Ko"
                        priority
                        sizes="(max-width: 760px) 100vw, 380px"
                    />
                </div>

                <div className="hero-focus card">
                    <span className="card-label">Research</span>

                    <div className="lede">
                        <p>
                            My research focuses on <b>Reflective <span className="nobr">Human–AI</span> </b>
                            <span className="nobr">
                                <b>Interaction</b>—designing
                            </span>{" "}
                            AI systems that help people reflect on their own thinking, 
                            explore different perspectives, and make more intentional decisions.
                        </p>
                        <p>
                            I design and evaluate interactive AI systems that make reasoning,
                            intentions, and different perspectives easier to examine and revise. My
                            broader goal is to explore how AI can support human agency, rather than
                            simply provide answers.
                        </p>
                    </div>
                </div>

            </section>

            {/* Every paper, as cards that step a page at a time. The three
                selected ones used to sit here alone (SystemsBand.tsx, now
                unmounted), and the keyword map before that (KeywordField.tsx). */}
            <section className="home-sec home-work card">
                <PubCarousel />
            </section>

            {/* news last: a line or two of what is new, after the work */}
            <section className="home-sec card">
                <NewsList />
            </section>
        </div>
    );
}
