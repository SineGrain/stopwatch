export const DECK = [
    "ca",
    "c2",
    "c3",
    "c4",
    "c5",
    "c6",
    "c7",
    "c8",

    //-------------------

    "c9",
    "c1",
    "cj",
    "cq",
    "ck",

    "qa",
    "q2",
    "q3",
    "q4",
    "q5",
    "q6",
    "q7",
    "q8",
    "q9",
    "q1",
    "qj",
    "qq",
    "qk",

    "fa",
    "f2",
    "f3",
    "f4",
    "f5",
    "f6",
    "f7",
    "f8",
    "f9",
    "f1",
    "fj",
    "fq",
    "fk",

    "pa",
    "p2",
    "p3",
    "p4",
    "p5",

    //-------------------

    "p6",
    "p7",
    "p8",
    "p9",
    "p1",
    "pj",
    "pq",
    "pk",
] as const

export type DeckType = typeof DECK[number]