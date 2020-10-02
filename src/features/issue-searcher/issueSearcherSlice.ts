import { createAsyncThunk, createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../redux/store';
import {
    AsyncTaskLoadingState,
    GithubErrorResponse,
    IssueSearchResult,
    IssueSearchResultRequest,
    RepoDetailedIssue
} from '../../utils/models/github';
import { IssuesSearchQuantity } from '../../utils/models/ui';
import { fetchDetailedIssue, fetchIssuesList } from './reactIssueAPI';

export interface RepoIssueState {
    selectedIssue: RepoDetailedIssue | null;
    searchedText: string | null;
    suggestedIssues: IssueSearchResult | null,
    issues: IssueSearchResult | null;
    loading: string;
    error: SerializedError | null;
}

const initialState: RepoIssueState = {
    selectedIssue: null,
    searchedText: null,
    suggestedIssues: null,
    issues: null,
    loading: AsyncTaskLoadingState.Idle,
    error: null
}

export const fetchReactIssuesListByName = createAsyncThunk
    <IssueSearchResult|null, IssueSearchResultRequest, { state: RootState, rejectValue: GithubErrorResponse, dispatch: AppDispatch}>(
    'issues/list',
    async ({name, quantity}, {getState, rejectWithValue, dispatch}) => {
        const { searchedText, loading, suggestedIssues } = getState().issues;
        if (loading !== AsyncTaskLoadingState.Pending) {
            return null;
        }
        if (searchedText !== name || quantity === IssuesSearchQuantity.Big) {
            dispatch(setIssueSearchText(name));
            try {
                const response = await fetchIssuesList(name, quantity);
                if (response instanceof Error) {
                    return rejectWithValue({error: response.message});
                }
                return response as IssueSearchResult;
            } catch (error) {
                return rejectWithValue({error});
            }
        } else if (name === searchedText && suggestedIssues) {
            return suggestedIssues;
        }
        return null;
    }
);

export const fetchReactDetailedIssueById = createAsyncThunk
    <RepoDetailedIssue|null, number, { state: RootState, rejectValue: GithubErrorResponse}>(
    'issues/detailedIssue',
    async (id: number, {getState, rejectWithValue}) => {
        const { selectedIssue, loading } = getState().issues;
        if (loading !== AsyncTaskLoadingState.Pending) {
            return null;
        }
        if (!selectedIssue || (selectedIssue && selectedIssue.id !== id)) {
            try {
                const response = await fetchDetailedIssue(id);
                if (response instanceof Error) {
                    return rejectWithValue({error: response.message});
                }
                return response as RepoDetailedIssue;
            } catch (error) {
                return rejectWithValue({error});
            }
        } else if (selectedIssue && selectedIssue.id === id){
            return selectedIssue;
        }
        return null;
    }
);

const repoIssues = createSlice({
    name: 'repoIssues',
    initialState,
    reducers: {
        setIssueSearchText: (state, action: PayloadAction<string>) => {
            state.searchedText = action.payload;
        },
        getRepoDetailedIssueSuccess: (state, action: PayloadAction<RepoDetailedIssue>) => {
            state.selectedIssue = action.payload;
            state.error = null;
        },
        getRepoDetailedIssueFailed: (state, action: PayloadAction<SerializedError>) => {
            state.selectedIssue = null;
            state.error = action.payload;
        },
        getRepoIssuesSuccess: (state, action: PayloadAction<IssueSearchResult>) => {
            state.issues = action.payload;
            state.error = null;
        },
        getRepoIssuesFailed: (state, action: PayloadAction<SerializedError>) => {
            state.issues = null;
            state.error = action.payload;
        },
        resetRepoSuggestedIssuesList: (state) => {
            state.suggestedIssues && (state.suggestedIssues = null);
        },
        resetRepoIssuesList: (state) => {
            state.issues && (state.issues = null);
        },
        resetRepoDetailedIssue: (state) => {
            state.selectedIssue && (state.selectedIssue = null);
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchReactIssuesListByName.pending, (state, action) => {
            if (state.loading === AsyncTaskLoadingState.Idle) {
                state.loading = AsyncTaskLoadingState.Pending;
            }
        });
        builder.addCase(fetchReactIssuesListByName.fulfilled, (state, action) => {
            if (state.loading === AsyncTaskLoadingState.Pending && action.payload) {
                state.loading = AsyncTaskLoadingState.Idle;
                if (action.meta.arg.quantity === IssuesSearchQuantity.Small) {
                    state.suggestedIssues = action.payload
                    state.issues = null;
                } else if (action.meta.arg.quantity === IssuesSearchQuantity.Big) {
                    state.issues = action.payload;
                    if (state.selectedIssue) {
                        state.selectedIssue = null;
                    }
                }
            }
        });
        builder.addCase(fetchReactIssuesListByName.rejected, (state, action) => {
            if (state.loading === 'pending' && (action.meta.aborted || action.error)) {
                state.loading = AsyncTaskLoadingState.Idle;
                state.error = action.error;
                state.suggestedIssues = null;
                state.issues = null;
            }
        });
        builder.addCase(fetchReactDetailedIssueById.pending, (state, action) => {
            if (state.loading === AsyncTaskLoadingState.Idle) {
                state.loading = AsyncTaskLoadingState.Pending;
            }
        });
        builder.addCase(fetchReactDetailedIssueById.fulfilled, (state, action) => {
            if (state.loading === AsyncTaskLoadingState.Pending && action.payload) {
                state.loading = AsyncTaskLoadingState.Idle;
                state.selectedIssue = action.payload;
            }
        });
        builder.addCase(fetchReactDetailedIssueById.rejected, (state, action) => {
            if (state.loading === 'pending' && (action.meta.aborted || action.error)) {
                state.loading = AsyncTaskLoadingState.Idle;
                state.error = action.error;
                state.issues = null;
            }
        });
    }
});

export const {
    setIssueSearchText,
    getRepoDetailedIssueSuccess,
    getRepoDetailedIssueFailed,
    getRepoIssuesSuccess,
    getRepoIssuesFailed,
    resetRepoSuggestedIssuesList,
    resetRepoIssuesList,
    resetRepoDetailedIssue
} = repoIssues.actions;

export default repoIssues.reducer;
