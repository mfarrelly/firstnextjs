import React from "react";
import { getOkLetters, getOutOfPlaceLetters, uniqueLetters } from "./util";

import styles from "../styles/WordleLike.module.css";
import WordGuess from "./wordguess";
import ActiveGuess from "./activeguess";
import VisualKeyboard from "./visualKeyboard";
import {
    Button,
    Dialog,
    DialogTitle,
    List,
    ListItem,
    ListItemAvatar,
    Paper,
    Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";

export interface WordleProps {
    rounds?: number;
}

export interface WordleResult {
    finished: boolean;
    complete: boolean;
    rounds: number;
}
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
}));

interface WinConditionDialogProps {
    open: boolean;
    title: string;
    description: string;
    onNewGame: () => void;
    onClose: () => void;
}

function WinConditionDialog({
    open = false,
    title,
    description,
    onNewGame = () => {
        /* nothing */
    },
    onClose = () => {
        /* nothing */
    },
}: WinConditionDialogProps) {
    const handleClose = () => {
        onClose();
    };

    const handleListItemClick = (value: any) => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>{title}</DialogTitle>
            {description}
            <Button onClick={onNewGame}>New Game</Button>
        </Dialog>
    );
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
    }, [guessedWords, finalWord, setLetters, setOk, setOut, round, rounds]);

    const onAccept = React.useCallback(
        (nextGuess: string) => {
            const nextWords = [...guessedWords, nextGuess];
            setGuessedWords((last) => {
                return nextWords;
            });
            setLetters(uniqueLetters(nextWords));
            setOk(getOkLetters(nextWords, finalWord));
            setOut(getOutOfPlaceLetters(nextWords, finalWord));

            if (round >= rounds) {
                setFinished({ finished: true, complete: false, rounds: round });
            }
            if (nextWords[nextWords.length - 1] === finalWord) {
                // you won?
                setFinished({ finished: true, complete: true, rounds: round });
            }

            setRound((last) => last + 1);
        },
        [setGuessedWords, finalWord, guessedWords, rounds, round]
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
            <WinConditionDialog
                open={!isLoading && finished.finished}
                title={finished.complete ? "SUCCESS" : "FAILURE"}
                description={`Completed in ${round - 1} rounds.`}
                onClose={resetGame}
                onNewGame={resetGame}
            />
            {!isLoading && (
                <Stack spacing={2}>
                    <Item>
                        Guesses {round - 1}/{rounds}
                    </Item>
                    <Item>
                        <ActiveGuess
                            finalWord={finalWord}
                            guessedWords={guessedWords}
                            rounds={rounds}
                            onAccept={onAccept}
                            disabled={finished.finished}
                            letters={letters}
                            okLetters={okLetters}
                            outOfPositionLetters={outOfPositionLetters}
                        >
                            <VisualKeyboard
                                letters={letters}
                                okLetters={okLetters}
                                outOfPositionLetters={outOfPositionLetters}
                                disabled={finished.finished}
                            />
                        </ActiveGuess>
                    </Item>
                </Stack>
            )}
        </>
    );
}
