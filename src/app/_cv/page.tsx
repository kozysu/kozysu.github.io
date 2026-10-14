import { CvDoc } from "../../components/CvDoc";

/** Served from `public/`. Replace the file to update the page — nothing here
 *  needs to change. */
const CV = "/cv.pdf";

export default function CVPage() {
    return (
        <>
            <div className="page-head">
                <h1 className="display">Curriculum Vitae</h1>

                <a
                    className="textlink"
                    href={CV}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Download PDF ↓
                </a>
            </div>

            {/* The CV is a typeset document; re-setting it in HTML only makes a
                second copy to keep in step. The page draws the document and
                hands over the file. */}
            <CvDoc src={CV} />
        </>
    );
}
