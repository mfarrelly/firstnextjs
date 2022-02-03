import styles from "../styles/WordGuess.module.css";
import * as R from "ramda";
import cx from "classnames";
import React from "react";
import { validButNotChosen, validWords } from "./validWords";
import { KeyContext, KeyContextProps } from "./keyContext";
import { Button, ButtonGroup, Card, Paper, Grid, styled } from "@mui/material";
import WordGuess from "./wordguess";
import { analyze, guessNext } from "./util";

export interface WordGuessProps {
    children?: React.ReactElement;
    disabled?: boolean;
    finalWord: string;
    rounds: number;
    guessedWords: string[];
    onAccept: (word: string) => void;
    nextKey?: string;
    letters: string[];
    okLetters: string[];
    outOfPositionLetters: string[];
}

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
}));

export default function ActiveGuess({
    children,
    disabled = false,
    finalWord,
    guessedWords = [],
    rounds,
    onAccept,
    nextKey,
    letters: guessedLetters,
    okLetters,
    outOfPositionLetters,
}: WordGuessProps) {
    const [letters, setLetters] = React.useState<string[]>([]);
    const maxLetters = React.useMemo(() => finalWord?.length ?? 5, [finalWord]);

    React.useEffect(() => {
        if (nextKey) {
            const key = nextKey.toUpperCase();
            if (
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(key) &&
                letters.length < maxLetters
            ) {
                setLetters((last) => [...last, key]);
            }
        }
    }, [nextKey, letters.length, maxLetters, setLetters]);

    const onKeyPress = React.useCallback(
        (ev: KeyboardEvent) => {
            if (disabled) {
                return;
            }
            if (ev.ctrlKey || ev.altKey) {
                return;
            }
            if (ev.key == "Enter" && letters.length == maxLetters) {
                // check that the word is valid first.
                const currentWord = R.join("", letters);

                const isValid = R.includes(currentWord.toLowerCase(), [
                    ...validWords,
                    ...validButNotChosen,
                ]);

                if (isValid) {
                    onAccept(currentWord);
                    setLetters([]);
                }
            } else if (ev.key == "Backspace") {
                setLetters((last) => {
                    if (last.length > 0) {
                        return last.slice(0, last.length - 1);
                    }
                    return last;
                });
            } else {
                const key = ev.key.toUpperCase();
                if (
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(key) &&
                    letters.length < maxLetters
                ) {
                    setLetters((last) => [...last, key]);
                }
            }
        },
        [disabled, setLetters, letters, onAccept, maxLetters]
    );

    const onGuessWord = React.useCallback(() => {
        // set the next word to a random one from validWords.
        // to be smarter, take the previous guesses and remove any bad words from it.
        const allWords = [...validButNotChosen, ...validWords];
        if (guessedWords.length == 0) {
            // choose a random word.
            const nextDigit = Math.floor(Math.random() * allWords.length);
            onAccept(allWords[nextDigit]);
        } else {
            onAccept(
                guessNext(
                    guessedWords,
                    guessedLetters,
                    okLetters,
                    outOfPositionLetters,
                    finalWord,
                    allWords
                )
            );
        }
    }, [
        guessedWords,
        guessedLetters,
        okLetters,
        outOfPositionLetters,
        finalWord,
        onAccept,
    ]);

    React.useEffect(() => {
        document.addEventListener("keyup", onKeyPress);

        return () => {
            document.removeEventListener("keyup", onKeyPress);
        };
    }, [onKeyPress]);

    const shownLetters = React.useMemo(() => {
        if (!finalWord) {
            return [];
        }
        if (letters.length < finalWord.length) {
            const pads = maxLetters - letters.length;
            let extraChars: string[] = [];
            for (let i = 0; i < pads; i++) {
                extraChars = [...extraChars, "_"];
            }
            return [...letters, ...extraChars];
        } else {
            return letters;
        }
    }, [letters, finalWord, maxLetters]);

    const contextValue = React.useMemo<KeyContextProps>(
        () => ({
            onKeyPress: onKeyPress,
            onGuessWord: onGuessWord,
        }),
        [onKeyPress, onGuessWord]
    );

    const blankGuessedWords = React.useMemo(() => {
        const items = [];
        // if (guessedWords.length < rounds) {
        for (let i = 0; i < rounds - guessedWords.length - 1; i++) {
            items.push("");
        }
        // }
        return items;
    }, [rounds, guessedWords]);

    return (
        <>
            {guessedWords.map((word, wordindex) => (
                <WordGuess
                    key={`gword_${wordindex}`}
                    word={word}
                    finalWord={finalWord}
                />
            ))}
            {!disabled && (
                <Grid container sx={{ flexGrow: 1 }} justifyContent="center">
                    {shownLetters.map((letterItem, index) => {
                        return (
                            <Grid key={index} item xs={1}>
                                <Paper
                                    variant="outlined"
                                    // className={cx({
                                    //     [styles.letter]: true,
                                    // })}
                                >
                                    {letterItem}
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
            {blankGuessedWords.map((word, wordindex) => (
                <WordGuess
                    key={`gword_b_${wordindex}`}
                    word={word}
                    finalWord={finalWord}
                />
            ))}
            <KeyContext.Provider value={contextValue}>
                <Card elevation={5} sx={{ marginTop: "1em" }}>
                    {children}
                </Card>
            </KeyContext.Provider>
        </>
    );
}
