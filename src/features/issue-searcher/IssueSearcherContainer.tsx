import React, {useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { isEqual } from 'lodash';
import { createStyles, Grid, makeStyles, Snackbar, Theme, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { AppDispatch, RootState } from './../../redux/store';
import { IssueSearchResult } from '../../utils/models/github';
import { parseAPIIssuesListAsUIOptions } from '../../utils/ui/helper';
import { IssuesSearchQuantity, ReactIssueOptionList } from '../../utils/models/ui';
import RISLayout from '../../components/RISLayout';
import RISAutocomplete from '../../components/RISAutocomplete';
import RISList from '../../components/RISList';
import {
    fetchReactDetailedIssueById,
    fetchReactIssuesListByName,
    resetRepoDetailedIssue,
    resetRepoIssuesList,
    resetRepoSuggestedIssuesList
} from './issueSearcherSlice';
import {
    setIssueAutocompleteLoadingFlag,
    setIssueAutocompleteUIOptions,
    setIssueListLoadingFlag,
    setIssueListUIOptions,
    setIssueErrorAlertUIFlag,
    setIssueAutocompleteFocusFlag
} from './issueSearcherUISlice';
import RISInfoCard from '../../components/RISInfoCard';

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        container: {
            padding: '10px 0'
        },
        title: {
            paddingTop: '0.25em'
        },
        autoCompleteContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
        },
        detailedInfoContainer: {
            padding: '10px 0',
            width: 400,
        }
    })
});

const IssueSearcherContainer: React.FC<{}> = () => {
    const {
        issues,
        selectedIssue,
        suggestedIssues,
        error
    } = useSelector((state: RootState) => state.issues);
    const {
        autocomplete,
        list,
        alert
    } = useSelector((state: RootState) => state.issuesUI);
    const dispatch = useDispatch<AppDispatch>();
    const previousSuggestedIssues = useRef<IssueSearchResult|null>(null);
    const previousIssues = useRef<IssueSearchResult|null>(null);
    const classes = useStyles();
    
    useEffect(() => {
        if (isEqual(previousSuggestedIssues.current, suggestedIssues)) {
            autocomplete.loading && dispatch(setIssueAutocompleteLoadingFlag(false));
        } else if (suggestedIssues && suggestedIssues.items) {
            dispatch(setIssueAutocompleteUIOptions([...parseAPIIssuesListAsUIOptions(suggestedIssues.items)]));
            dispatch(setIssueAutocompleteLoadingFlag(false));
        }
    });

    useEffect(() => {
        if (isEqual(previousIssues.current, issues)) {
            list.loading && dispatch(setIssueListLoadingFlag(false));
        } else if (issues && issues.items) {
            suggestedIssues && dispatch(resetRepoSuggestedIssuesList());
            dispatch(setIssueListUIOptions([...parseAPIIssuesListAsUIOptions(issues.items)]));
            dispatch(setIssueListLoadingFlag(false));
        }
    });
    
    useEffect(() => {
        previousSuggestedIssues.current = suggestedIssues;
        previousIssues.current = issues;
    });

    useEffect(() => {
        dispatch(setIssueErrorAlertUIFlag(Boolean(error)));
    }, [error]);

    useHotkeys('shift+e', () => {
        dispatch(setIssueAutocompleteFocusFlag(true));
    });

    const handleSearchText = (name: string, quantity: number) => {
        quantity === IssuesSearchQuantity.Small && dispatch(setIssueAutocompleteLoadingFlag(true));
        selectedIssue && dispatch(resetRepoDetailedIssue());
        dispatch(fetchReactIssuesListByName({name, quantity}));
    };

    const handleDisplayingSelectedIssue = (option: ReactIssueOptionList|null) => {
        issues && dispatch(resetRepoIssuesList());
        option && dispatch(fetchReactDetailedIssueById(option.id));
    }

    const handleCloseErrorAlert = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        dispatch(setIssueErrorAlertUIFlag(false));
    };

    const RISDetailedUsageInfo: React.FC<{}> = () => {
        return (
            <div className={classes.detailedInfoContainer}>
                <Typography variant="subtitle2" display="block" gutterBottom>
                    There are two ways of using this searching tool:
                </Typography>
                <Typography variant="caption" display="block" gutterBottom>
                    1. Search an issue by name and select one from the list to display detailed info about it.
                </Typography>
                <Typography variant="caption" display="block" gutterBottom>
                    2. Search an issue by name and hit 'Enter' key without selecting one from its list.
                    The app will display more records in a different list which will show up below the autocomplete component.
                    The list items are selectable as well to display issue's detailed info.  
                </Typography>
                <Typography variant="caption" display="block" gutterBottom>
                    Press <i>Shift + e</i> in order to set focus on autocomplete input field and start searching.
                </Typography>
            </div>
        )
    };

    return (
        <RISLayout id="layoutContainer">
            <Grid className={classes.container} container justify="center" alignItems="center" direction="column">
                <Typography className={classes.title} variant="h3" component="h1" gutterBottom>React Issue Searcher</Typography>
                <Grid item xs={12} lg={8} className={classes.autoCompleteContainer}>
                    <RISAutocomplete searchIssue={handleSearchText} displaySelectedIssue={handleDisplayingSelectedIssue} />
                    <RISDetailedUsageInfo />
                </Grid>
                {
                    (!selectedIssue && issues && issues.items && issues.items.length > 0) ?
                        <Grid item xs={12} lg={8}>
                            <RISList displaySelectedIssue={handleDisplayingSelectedIssue}></RISList>
                        </Grid>
                    :   selectedIssue ? 
                            <Grid item xs={12} lg={8}>
                                <RISInfoCard />
                            </Grid>
                            : null
                }
                {
                    alert.error.show ?
                    <Snackbar open={alert.error.show} autoHideDuration={4000} onClose={handleCloseErrorAlert}>
                        <Alert severity="error">
                            Something wrong has happened, please try again.
                        </Alert>
                    </Snackbar>
                    : null
                }
            </Grid>
        </RISLayout>
    );
}

export default IssueSearcherContainer;