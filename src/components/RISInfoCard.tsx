import { Button, Card, CardActions, CardContent, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const useStyles = makeStyles({
    root: {
      width: 400,
      marginTop: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold'
    },
    subTitle: {
        fontSize: 12,
    },
    labelContainer: {
        margin: '2px 0'
    },
    labelItemsList: {
        fontSize: 14,
        borderRadius: 3,
        padding: 3,
    },
    cardActionContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'row'
    }
  });

const RISInfoCard = () => {
    const classes = useStyles();
    const {
        selectedIssue
    } = useSelector((state: RootState) => state.issues);
    return (
        <>
            <Card className={classes.root}>
                <CardContent>
                    <Typography className={classes.title} variant="h6" gutterBottom>
                        {selectedIssue?.title}
                    </Typography>
                    <Typography variant="body1" component="div">
                        {selectedIssue?.labels?.map(lb => (
                            <div key={lb.id} className={classes.labelContainer}>
                                <div
                                    className={classes.labelItemsList}
                                    style={{backgroundColor: `#${lb.color}`}}
                                >
                                    {lb.name}
                                </div>
                            </div>
                        ))}
                    </Typography>
                    <Typography className={classes.subTitle} variant="body2" color="textPrimary" component="p">
                        Username: {selectedIssue?.user?.login}
                    </Typography>
                    <Typography className={classes.subTitle} variant="body2" color="textSecondary" component="p">
                        Comments: {selectedIssue?.comments}
                    </Typography>
                    <Typography className={classes.subTitle} component="p" variant="body2" color="textSecondary">
                        Description: {selectedIssue?.body ? (selectedIssue.body.slice(0, 200) + '...') : '-'}
                    </Typography>
                </CardContent>
                <CardActions className={classes.cardActionContainer}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        href={`https://github.com/facebook/react/issues/${selectedIssue?.number}`} >
                            Learn More
                    </Button>
                </CardActions>
            </Card>
        </>
    )
}

export default RISInfoCard;