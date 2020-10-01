import {configureStore} from '@reduxjs/toolkit';
import repoIssuesReducer from '../features/issue-searcher/issueSearcherSlice';
import issuesUIReducer from '../features/issue-searcher/issueSearcherUISlice';

const store = configureStore({
    reducer: {
        issues: repoIssuesReducer,
        issuesUI: issuesUIReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;

