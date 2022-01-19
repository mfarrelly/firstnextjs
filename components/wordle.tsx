import React from "react";
import { getOkLetters, getOutOfPlaceLetters, uniqueLetters } from "./util";

import styles from "../styles/Home.module.css";
import WordGuess from "./wordguess";
import ActiveGuess from "./activeguess";
import VisualKeyboard from "./visualKeyboard";

export interface WordleProps {
    rounds?: number;
}

export function Wordle({ rounds = 6 }: WordleProps): JSX.Element {
    const [isLoading, setLoading] = React.useState(false);
    const [round, setRound] = React.useState(1);
    const [guessedWords, setGuessedWords] = React.useState<string[]>([]);
    const [outOfPositionLetters, setOut] = React.useState<string[]>([]);
    const [okLetters, setOk] = React.useState<string[]>([]);
    const [finalWord, setFinalWord] = React.useState<string>("STOLE");

    const [letters, setLetters] = React.useState<string[]>(
        uniqueLetters(guessedWords)
    );

    React.useEffect(() => {
        setLetters(uniqueLetters(guessedWords));
        setOk(getOkLetters(guessedWords, finalWord));
        setOut(getOutOfPlaceLetters(guessedWords, finalWord));
    }, [guessedWords, finalWord, setLetters, setOk, setOut]);

    const onAccept = React.useCallback(
        (nextGuess: string) => {
            setGuessedWords((last) => [...last, nextGuess]);
            setRound((last) => last + 1);
        },
        [setGuessedWords]
    );

    React.useEffect(() => {
        setLoading(true);
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
    }, []);
    return (
        <>
            <h1 className={styles.title}>Woorlde</h1>
            <p className={styles.description}>How to play the game.</p>
            {isLoading && <p>Loading...</p>}
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
                        <ActiveGuess finalWord={finalWord} onAccept={onAccept}>
                            <VisualKeyboard
                                letters={letters}
                                okLetters={okLetters}
                                outOfPositionLetters={outOfPositionLetters}
                            />
                        </ActiveGuess>
                    </div>
                </>
            )}
        </>
    );
}
