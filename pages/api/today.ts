// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { validWords } from "../../components/validWords";

type Data = {
    word: string;
};

/**
 * Choose a random word from validWords.
 */
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const words = validWords;
    const nextDigit = Math.floor(Math.random() * words.length);

    res.status(200).json({ word: words[nextDigit] });
}
