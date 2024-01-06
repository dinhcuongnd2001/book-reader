import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type ITextSelection = {
    text: string
    cfiRange: string
}

export type ITheme = 'light' | 'dark'

interface IBookState {
    fontSizePer: number;
    isScroll: boolean;

    highlightTextList: ITextSelection[];
    removeItemHighLightId: string | null;
    theme: ITheme;
}

const initialState: IBookState = {
    fontSizePer: 100,
    isScroll: false,
    highlightTextList: [],
    removeItemHighLightId: null,
    theme: 'light',
};


const bookSlice = createSlice({
    name: 'book',
    initialState: initialState,
    reducers: {
        setFontSize: (state, action: PayloadAction<number>) => {
            state.fontSizePer = action.payload;
        },
        setIsScroll: (state, action: PayloadAction<boolean>) => {
            state.isScroll = action.payload;
        },
        addHighLightTextList: (state, action: PayloadAction<ITextSelection>) => {
            state.highlightTextList.push(action.payload);
        },
        removeItemHighLight: (state, action: PayloadAction<number>) => {
            const indexToRemove = action.payload; 
            state.highlightTextList.splice(indexToRemove, 1); 
        },
        setRemoveItemHighLightId: (state, action: PayloadAction<string | null>) => {
            state.removeItemHighLightId = action.payload;
        },
        setTheme: (state, action: PayloadAction<ITheme>) => {
            state.theme = action.payload;
        },
    },
});

export const bookSliceActions = bookSlice.actions;
export default bookSlice;
