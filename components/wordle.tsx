import React from "react";
import { getOkLetters, getOutOfPlaceLetters, uniqueLetters } from "./util";

import styles from "../styles/WordleLike.module.css";
import WordGuess from "./wordguess";
import ActiveGuess from "./activeguess";
import VisualKeyboard from "./visualKeyboard";

export interface WordleProps {
    rounds?: number;
}

export interface WordleResult {
    finished: boolean;
    complete: boolean;
    rounds: number;
}

export function Wordle({ rounds = 6 }: WordleProps): JSX.Element {
    const [isLoading, setLoading] = React.useState(false);
    const [finished, setFinished] = React.useState<WordleResult>({
        finished: false,
        complete: false,
        rounds: 0,
    });
    const [round, setRound] = React.useState(1);
    const [guessedWords, setGuessedWords] = React.useState<string[]>([]);
    const [outOfPositionLetters, setOut] = React.useState<string[]>([]);
    const [okLetters, setOk] = React.useState<string[]>([]);
    const [finalWord, setFinalWord] = React.useState<string>("STOLE");

    const [letters, setLetters] = React.useState<string[]>(
        uniqueLetters(guessedWords)
    );

    // after a word is guessed, update the letters.
    React.useEffect(() => {
        // after the letters are guessed, update the visualKeyboard.
        setLetters(uniqueLetters(guessedWords));
        setOk(getOkLetters(guessedWords, finalWord));
        setOut(getOutOfPlaceLetters(guessedWords, finalWord));

        if (round > rounds) {
            setFinished({ finished: true, complete: false, rounds: round });
        }
        if (guessedWords[guessedWords.length - 1] === finalWord) {
            // you won?
            setFinished({ finished: true, complete: true, rounds: round });
        }
    }, [guessedWords, finalWord, setLetters, setOk, setOut, round, rounds]);

    const onAccept = React.useCallback(
        (nextGuess: string) => {
            setGuessedWords((last) => {
                return [...last, nextGuess];
            });

            setRound((last) => last + 1);
        },
        [setGuessedWords]
    );

    const resetGame = React.useCallback(() => {
        setLoading(true);
        setFinished({
            finished: false,
            complete: false,
            rounds: 0,
        });
        setGuessedWords([]);
        setOut([]);
        setOk([]);
        setFinalWord("1");
        setLetters([]);
        setRound(1);

        fetch("api/today")
            .then((res) => res.json())
            .then((data) => {
                setFinalWord(data.word.toUpperCase());
                setLoading(false);
            });
    }, [
        setLoading,
        setFinished,
        setGuessedWords,
        setOut,
        setOk,
        setLetters,
        setFinalWord,
        setRound,
    ]);

    // on first load, get the word of the "day", reset all values.
    React.useEffect(() => {
        resetGame();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <h1 className={styles.title}>Wordle-Like</h1>
            <p className={styles.description}>Guess 5 letter words.</p>
            {isLoading && <p>Loading...</p>}
            {!isLoading && finished.finished && (
                <>
                    <div>{finished.complete ? "SUCCESS" : "FAILURE"}</div>
                    <button onClick={resetGame}>RETRY</button>
                </>
            )}
            {!isLoading && (
                <>
                    <div className={styles.grid}>
                        <div>
                            Guesses {round - 1}/{rounds}
                        </div>
                        {guessedWords.map((word, wordindex) => (
                            <WordGuess
                                key={`gword_${wordindex}`}
                                word={word}
                                finalWord={finalWord}
                            />
                        ))}
                        <ActiveGuess
                            finalWord={finalWord}
                            onAccept={onAccept}
                            disabled={finished.finished}
                        >
                            <VisualKeyboard
                                letters={letters}
                                okLetters={okLetters}
                                outOfPositionLetters={outOfPositionLetters}
                                disabled={finished.finished}
                            />
                        </ActiveGuess>
                    </div>
                </>
            )}
        </>
    );
}
