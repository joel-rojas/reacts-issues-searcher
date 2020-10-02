import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReactIssueOptionList } from "../../utils/models/ui";

export interface IssueAutocompleteUIState {
    options: ReactIssueOptionList[],
    loading: boolean;
    focus: boolean;
}

export interface IssueListUIState {
    items: ReactIssueOptionList[],
    loading: boolean;
}

export interface IssueErrorAlertUIState {
    show: boolean;
}

export interface IssueAlertUIState {
    error: IssueErrorAlertUIState
}

export interface IssueUIState {
    autocomplete: IssueAutocompleteUIState;
    list: IssueListUIState,
    alert: IssueAlertUIState
}

const initialState: IssueUIState = {
    autocomplete: {
        loading: false,
        focus: false,
        options: []
    },
    list: {
        items: [],
        loading: false
    },
    alert: {
        error: {
            show: false
        }
    }
}

const issuesUI = createSlice({
    name: 'issuesUI',
    initialState,
    reducers: {
        setIssueAutocompleteLoadingFlag: (state, action:PayloadAction<boolean>) => {
            state.autocomplete.loading = Boolean(action.payload);
        },
        setIssueAutocompleteFocusFlag: (state, action: PayloadAction<boolean>) => {
            state.autocomplete.focus = Boolean(action.payload);
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
        setIssueErrorAlertUIFlag: (state, action: PayloadAction<boolean>) => {
            state.alert.error.show = Boolean(action.payload);
        }
    }
});

export const {
    setIssueAutocompleteUIOptions,
    setIssueAutocompleteLoadingFlag,
    setIssueAutocompleteFocusFlag,
    setIssueListLoadingFlag,
    setIssueListUIOptions,
    setIssueErrorAlertUIFlag
} = issuesUI.actions;

export default issuesUI.reducer;
