import { mapCells, mapColumns, mapRows, MapCell } from "../data/researchMap";

function Cell({ cell }: { cell: MapCell }) {
    return (
        <div className={`rmap-cell${cell.current ? " current" : ""}`}>
            {cell.current && <div className="rmap-flag">Current work</div>}
            <ul>
                {cell.items.map((item) => (
                    <li key={item.name}>
                        <span className="nm">{item.name}</span>
                        {item.note && <span className="nt"> — {item.note}</span>}
                        <span className="vn">{item.venue}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/** 2×2 of all papers: who decides × when the goal is set. */
export function ResearchMap() {
    const rows = [mapCells.slice(0, 2), mapCells.slice(2, 4)];

    return (
        <figure className="rmap">
            <div className="rmap-row rmap-head" aria-hidden="true">
                <span />
                {mapColumns.map((c) => (
                    <span className="rmap-axis" key={c}>
                        {c}
                    </span>
                ))}
            </div>

            {rows.map((cells, r) => (
                <div className="rmap-row" key={r}>
                    <span className="rmap-axis rmap-rowlabel">{mapRows[r]}</span>
                    {cells.map((cell) => (
                        <Cell cell={cell} key={cell.key} />
                    ))}
                </div>
            ))}

            <figcaption>
                My work has moved from the lower left to the upper right: from AI that reads
                people to AI that helps people work out what they want.
            </figcaption>
        </figure>
    );
}
