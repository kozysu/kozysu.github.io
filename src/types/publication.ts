export interface Publication {
    title: string;
    /** The English title, where a domestic paper was published under a Korean
     *  one. Shown in place of the Korean title wherever the paper is listed. */
    titleEn?: string;
    authors: string[];
    venue: string;
    /** Published at a Korean venue. These are listed on their own rather than
     *  mixed into the international record, and carry a page range instead of
     *  a DOI. */
    domestic?: boolean;
    /** Page range, the way a domestic proceedings entry is usually cited. */
    pages?: string;
    /** Short label shown in the venue pill; derived from `venue` when omitted. */
    venueShort?: string;
    /** What the venue is worth, joined with a middot: index and quartile,
     *  then the percentile where it is worth saying, then the impact factor.
     *  Journals only — see the note at the head of `publications.ts` for why,
     *  and for where each figure came from. */
    metrics?: string[];
    /** The system this paper reports, when it has a name. Ties the paper to a
     *  stage on the home-page scale. */
    project?: string;
    /** Research themes. These drive the keyword field on the home page:
     *  each distinct keyword becomes a node, and two keywords are joined
     *  whenever they appear together on a paper. */
    keywords?: string[];
    year: number;
    projectUrl?: string;
    pdfUrl?: string;
    imageUrl?: any;
    isSelected?: boolean;
}

export interface Patent {
    title: string;
    patentNo: string;
    authority?: string;
    year: string;
}

export interface SoftwareRegistration {
    title: string;
    registrationNo: string;
    authority: string;
    year: string;
}
