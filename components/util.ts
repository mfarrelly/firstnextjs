import * as R from "ramda";

export function uniqueLetters(words: string[]): string[] {
    const allLetters = R.join("", words);
    const uniqLetters = R.uniq([...allLetters]);

    return uniqLetters;
}

export interface OutOfPlaceWord {
    data: OutOfPlaceChar[];
}

export interface OutOfPlaceChar {
    letter: string;
    isOk: boolean;
    isOutOfPosition: boolean;
}

/**
 * Get a list of characters that are out of place and never OK.
 */
export function analyze(words: string[], finalWord: string): OutOfPlaceWord[] {
    const data: OutOfPlaceWord[] = [];
    for (let word of words) {
        const items: OutOfPlaceChar[] = [];
        for (let i = 0; i < word.length; i++) {
            if (i < finalWord.length) {
                items.push({
                    letter: word[i].toUpperCase(),
                    isOk: word[i].toUpperCase() === finalWord[i].toUpperCase(),
                    isOutOfPosition:
                        word[i].toUpperCase() !== finalWord[i].toUpperCase() &&
                        finalWord.includes(word[i].toUpperCase()),
                });
            }
        }
        data.push({
            data: items,
        });
    }
    return data;
}

/**
 * Get a list of characters in the correct place.
 */
export function getOkLetters(words: string[], finalWord: string): string[] {
    const computedWords = analyze(words, finalWord);

    const validChars = R.flatten(
        computedWords.map((word) => word.data.filter((d) => d.isOk))
    );
    return R.uniq(validChars.map((c) => c.letter));
}

export function getOutOfPlaceLetters(
    words: string[],
    finalWord: string
): string[] {
    const okLetters = getOkLetters(words, finalWord);
    const computedWords = analyze(words, finalWord);

    const validChars = R.flatten(
        computedWords.map((word) => word.data.filter((d) => d.isOutOfPosition))
    );
    return R.uniq(validChars.map((c) => c.letter));
}
