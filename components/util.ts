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
        if (word.length == 0) {
            for (let i = 0; i < finalWord.length; i++) {
                items.push({
                    letter: "_",
                    isOk: false,
                    isOutOfPosition: false,
                });
            }
        }
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

export function guessNext(
    guessedWords: string[],
    guessedLetters: string[] = [],
    okLetters: string[] = [],
    outOfPositionLetters: string[] = [],
    finalWord: string,
    allWords: string[]
): string {
    const analyzeResult = analyze(guessedWords, finalWord);

    const wrongLetters = guessedLetters
        .map((c) => c.toUpperCase())
        .filter((c) => {
            if ([...okLetters, ...outOfPositionLetters].includes(c)) {
                return false;
            }
            return true;
        });
    const possibleWords2 = allWords
        .map((w) => w.toUpperCase())
        .filter((w) => {
            for (let l of wrongLetters) {
                if (w.includes(l)) {
                    return false;
                }
            }
            return true;
        });

    let possibleWords: { word: string; pts: number }[] = [];

    for (let nextWord of possibleWords2) {
        let pts = 0;
        // for (let i = 0; i < analyzeResult.length; i++) {
        for (let data of analyzeResult) {
            const analyzeLetters = data.data;
            for (let j = 0; j < analyzeLetters.length; j++) {
                const analyzeLetter = analyzeLetters[j];
                // const hasGuessed = wrongLetters.includes(
                //     analyzeLetter.letter.toUpperCase()
                // );
                if (
                    analyzeLetter.isOk &&
                    `${nextWord[j].toUpperCase()}` ===
                        analyzeLetter.letter.toUpperCase()
                ) {
                    pts += 10;
                } else if (
                    analyzeLetter.isOutOfPosition &&
                    nextWord.includes(analyzeLetter.letter) &&
                    nextWord[j] !== analyzeLetter.letter.toUpperCase()
                ) {
                    pts += 1;
                }
                // remove pts when
            }
        }

        if (pts > 0) {
            possibleWords.push({ word: nextWord, pts: pts });
        }
    }

    possibleWords.sort((a, b) => {
        return b.pts - a.pts;
    });
    if (possibleWords.length > 0) {
        return possibleWords[0].word;
    }
    const nextDigit = Math.floor(Math.random() * allWords.length);
    return allWords[nextDigit];
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
