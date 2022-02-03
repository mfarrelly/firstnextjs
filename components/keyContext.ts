import React from "react";

export interface KeyContextProps {
    onKeyPress: (ev: KeyboardEvent) => void;
    onGuessWord: () => void;
}
export const KeyContext = React.createContext<KeyContextProps>({
    onKeyPress: (ev) => {
        // do nothing yet.
    },
    onGuessWord: () => {
        // do nothing yet.
    },
});
