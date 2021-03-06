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

/**
 * Function Component which serve as wrapper component to render all its UI children components.
 * @param {ChildrenComponents} - Props passed to this component which represent UI children components to be rendered
 * and an 'id' text to be set as HTML ID attribute in its Container component. 
 * @author [Emerson Rojas](https://github.com/joel-rojas)
 */
const RISLayout: React.FC<ChildrenComponents> = ({children, id}: ChildrenComponents) => {
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