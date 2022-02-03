import * as R from "ramda";
import React from "react";
import { KeyContext } from "./keyContext";
import { Button, ButtonGroup, Grid, Paper } from "@mui/material";
import BackspaceIcon from "@mui/icons-material/Backspace";
import EditIcon from "@mui/icons-material/Edit";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

export interface VisualKeyboardProps {
    disabled?: boolean;
    letters: string[];
    okLetters: string[];
    outOfPositionLetters: string[];
}

export default function VisualKeyboard({
    disabled = false,
    letters,
    okLetters,
    outOfPositionLetters,
}: VisualKeyboardProps) {
    const { onKeyPress, onGuessWord } = React.useContext(KeyContext);

    const keys = React.useMemo(() => {
        return [
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
            ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace", "AI"],
        ];
    }, []);

    const styledKeys = React.useMemo(() => {
        return keys.map((keyRow, rowi) => {
            return (
                <Grid item xs={12} key={`keyrow_${rowi}`}>
                    {keyRow.map((k, ki) => {
                        const isOk = R.includes(k, okLetters);
                        const isOutOfPosition = R.includes(
                            k,
                            outOfPositionLetters
                        );
                        const hasGuessed =
                            R.includes(k, letters) && !isOk && !isOutOfPosition;
                        return (
                            <Button
                                key={`k${rowi}_${ki}`}
                                variant={
                                    isOutOfPosition || isOk || hasGuessed
                                        ? "contained"
                                        : "outlined"
                                }
                                color={
                                    isOk
                                        ? "success"
                                        : isOutOfPosition
                                        ? "secondary"
                                        : hasGuessed
                                        ? "error"
                                        : undefined
                                }
                                size="large"
                                onClick={() => {
                                    // mock a keyboard event.
                                    if (k == "AI") {
                                        // guess the word
                                        onGuessWord();
                                    } else {
                                        onKeyPress({
                                            key: k,
                                        } as KeyboardEvent);
                                    }
                                }}
                            >
                                {k == "Backspace" ? (
                                    <BackspaceIcon />
                                ) : k == "Enter" ? (
                                    <EditIcon />
                                ) : k == "AI" ? (
                                    <LightbulbIcon />
                                ) : (
                                    k
                                )}
                            </Button>
                        );
                    })}
                </Grid>
            );
        });
    }, [
        keys,
        outOfPositionLetters,
        okLetters,
        letters,
        onKeyPress,
        onGuessWord,
    ]);

    return (
        <Paper elevation={5}>
            <Grid
                container
                spacing={1}
                sx={{ flexGrow: 1 }}
                justifyContent="center"
            >
                {styledKeys}
            </Grid>
        </Paper>
    );
}
