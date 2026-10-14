import Image from "next/image";
import portrait from "../assets/pic.jpg";
import { Email } from "../components/Email";
import { PubCarousel } from "../components/PubCarousel";
import { NewsList } from "../components/NewsList";
// import { ResearchLens } from "../components/ResearchLens";

export default function HomePage() {
    return (
        <div className="home">
            <section className="home-hero">
                {/* the portrait, with the address under it */}
                <div className="hero-profile">
                    <div className="hero-photo">
                        <Image
                            src={portrait}
                            alt="Jisu Ko"
                            priority
                            sizes="(max-width: 760px) 120px, 240px"
                        />
                    </div>

                    <p className="hero-contact">
                        <Email />
                    </p>
                </div>

                {/* who, then what: the greeting carries the name and the place,
                    and the research follows in the same column */}
                <div className="hero-text">
                    <h1>
                        Hi, I&apos;m Jisu Ko <span className="ko">고지수</span>
                    </h1>

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

                    <div className="lede">
                        <p>
                            My research focuses on <b>Reflective Human–AI Interaction</b>—designing
                            AI systems that help people reflect on their own thinking, explore
                            different perspectives, and make more intentional decisions.
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

            <section className="home-sec">
                <NewsList />
            </section>

            {/* the four principles, set directly above the papers that are
                their cases — hidden for now; uncomment to bring back
            <section className="home-sec home-lens">
                <ResearchLens />
            </section>
            */}

            {/* Every paper, as cards that step a page at a time. The three
                selected ones used to sit here alone (SystemsBand.tsx, now
                unmounted), and the keyword map before that (KeywordField.tsx). */}
            <section className="home-sec home-work">
                <PubCarousel />
            </section>
        </div>
    );
}
