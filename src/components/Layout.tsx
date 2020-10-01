import * as React from 'react';
import { Container, createStyles, makeStyles, Theme } from '@material-ui/core';
import { ChildrenComponents } from '../utils/models/ui';

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        container: {
            height: '100vh',
        },
    })
});

const Layout: React.FC<ChildrenComponents> = (props) => {
    const classes = useStyles();
    return (
        <>
            <Container fixed>
                <div className={classes.container}>{props.children}</div>
            </Container>
        </>
    );
}

export default Layout;