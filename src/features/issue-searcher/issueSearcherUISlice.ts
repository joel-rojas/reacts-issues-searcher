import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReactIssueOptionList } from "../../utils/models/ui";

export interface IssueAutocompleteUIState {
    options: ReactIssueOptionList[],
    loading: boolean;
}

export interface IssueListUIState {
    items: ReactIssueOptionList[],
    loading: boolean;
}

export interface IssueUIState {
    autocomplete: IssueAutocompleteUIState;
    list: IssueListUIState
}

const initialState: IssueUIState = {
    autocomplete: {
        loading: false,
        options: []
    },
    list: {
        items: [],
        loading: false
    }
}

const issuesUI = createSlice({
    name: 'issuesUI',
    initialState,
    reducers: {
        setIssueAutocompleteLoadingFlag: (state, action:PayloadAction<boolean>) => {
            state.autocomplete.loading = Boolean(action.payload);
        },
        setIssueAutocompleteUIOptions: (state, action: PayloadAction<ReactIssueOptionList[]>) => {
            if (action.payload) {
                state.autocomplete.options = action.payload;
            }
        },
        setIssueListLoadingFlag: (state, action:PayloadAction<boolean>) => {
            state.list.loading = Boolean(action.payload);
        },
        setIssueListUIOptions: (state, action: PayloadAction<ReactIssueOptionList[]>) => {
            if (action.payload) {
                state.list.items = action.payload;
            }
        },
    }
});

export const {
    setIssueAutocompleteUIOptions,
    setIssueAutocompleteLoadingFlag,
    setIssueListLoadingFlag,
    setIssueListUIOptions,
} = issuesUI.actions;

export default issuesUI.reducer;
