import React, {useEffect, useRef } from 'react';
import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import { AppDispatch, RootState } from './../../redux/store';
import { IssueSearchResult } from '../../utils/models/github';
import { parseAPIIssuesListAsUIOptions } from '../../utils/ui/helper';
import { IssuesSearchQuantity, ReactIssueOptionList } from '../../utils/models/ui';
import Layout from '../../components/Layout';
import RISAutocomplete from '../../components/RISAutocomplete';
import RISList from '../../components/RISList';
import { fetchReactDetailedIssueById, fetchReactIssuesListByName } from './issueSearcherSlice';
import { setIssueAutocompleteLoadingFlag, setIssueAutocompleteUIOptions, setIssueListLoadingFlag, setIssueListUIOptions } from './issueSearcherUISlice';

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
    })
});

const IssueSearcherContainer: React.FC<{}> = () => {
    const {
        issues,
        selectedIssue,
        suggestedIssues
    } = useSelector((state: RootState) => state.issues);
    const {
        autocomplete,
        list
    } = useSelector((state: RootState) => state.issuesUI);
    const dispatch = useDispatch<AppDispatch>();
    const previousSuggestedIssues = useRef<IssueSearchResult|null>(null);
    const previousIssues = useRef<IssueSearchResult|null>(null);
    const classes = useStyles();
    
    useEffect(() => {
        if (isEqual(previousSuggestedIssues.current, suggestedIssues)) {
            autocomplete.loading && dispatch(setIssueAutocompleteLoadingFlag(false));
            return;
        }
        if (suggestedIssues && suggestedIssues.items) {
            dispatch(setIssueAutocompleteUIOptions([...parseAPIIssuesListAsUIOptions(suggestedIssues.items)]));
            dispatch(setIssueAutocompleteLoadingFlag(false));
        }
    });

    useEffect(() => {
        if (isEqual(previousIssues.current, issues)) {
            list.loading && dispatch(setIssueListLoadingFlag(false));
            return;
        }
        if (issues && issues.items) {
            dispatch(setIssueListUIOptions([...parseAPIIssuesListAsUIOptions(issues.items)]));
            dispatch(setIssueListLoadingFlag(false));
        }
    })
    
    useEffect(() => {
        previousSuggestedIssues.current = suggestedIssues;
        previousIssues.current = issues;
    });

    const handleSearchText = (name: string, quantity: number) => {
        quantity === IssuesSearchQuantity.Small && dispatch(setIssueAutocompleteLoadingFlag(true));
        dispatch(fetchReactIssuesListByName({name, quantity}));
    };

    const handleDisplayingSelectedIssue = (option: ReactIssueOptionList|null) => {
        option && dispatch(fetchReactDetailedIssueById(option.id));
    }

    return (
        <Layout>
            <Grid container justify="center" alignItems="center" direction="column">
                <h1>React Issue Searcher</h1>
                <Grid item xs={12} lg={8}>
                    <RISAutocomplete searchIssue={handleSearchText} displaySelectedIssue={handleDisplayingSelectedIssue} />
                </Grid>
                {
                    (!selectedIssue && issues && issues.items && issues.items.length > 0) ?
                        <Grid item xs={12} lg={8}>
                            <RISList displaySelectedIssue={handleDisplayingSelectedIssue}></RISList>
                        </Grid>
                    :   <Grid item xs={12} lg={8}>
                        </Grid>
                }
            </Grid>
        </Layout>
    );
}

export default IssueSearcherContainer;