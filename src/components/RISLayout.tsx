import * as React from 'react';
import { Container, createStyles, makeStyles, Theme } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { ChildrenComponents } from '../utils/models/ui';
import { AppDispatch } from '../redux/store';
import { setIssueAutocompleteFocusFlag } from '../features/issue-searcher/issueSearcherUISlice';

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        container: {
            height: '100vh',
        },
    })
});

const RISLayout: React.FC<ChildrenComponents> = ({children, id}) => {
    const dispatch = useDispatch<AppDispatch>();
    const classes = useStyles();

    const handleOutsideClick = () => {
        dispatch(setIssueAutocompleteFocusFlag(false));
    };

    return (
        <>
            <Container id={id} fixed onClick={handleOutsideClick}>
                <div className={classes.container}>{children}</div>
            </Container>
        </>
    );
}

export default RISLayout;