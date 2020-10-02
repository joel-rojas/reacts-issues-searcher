import React from 'react';
import { useSelector } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Virtuoso } from 'react-virtuoso';
import { RootState } from '../redux/store';
import { IssueLabelType, ReactIssueOptionList, RISListProps } from './../utils/models/ui';

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        container: {
            width: 400,
            height: 400,
            marginTop: 10,
            backgroundColor: theme.palette.background.paper,
        },
        itemColorLabel: {
            display: 'inline-block',
            flexShrink: 0,
            borderRadius: 3,
            padding: 3,
            marginRight: 2,
            '&:last-child': {
                marginRight: 0
            }
        }
    })
});

const RISList: React.FC<RISListProps> = ({displaySelectedIssue}) => {
    const {
        items
    } = useSelector((state: RootState) => state.issuesUI.list);
    const classes = useStyles();

    return (
        <>
            <div className={classes.container}>
                <Virtuoso
                    style={{ width: '100%', height: '400px' }}
                    totalCount={items.length}
                    item={ index => {
                        const data = items[index];
                        const handleListItemClick = (data: ReactIssueOptionList) => {
                            displaySelectedIssue(data);
                        }
                        return (
                            <ListItem button key={index} onClick={() => handleListItemClick(data)}>
                                <ListItemText
                                    primary={data.label}
                                    secondary={
                                        data.issueLabelType ?
                                            data.issueLabelType.map((it: IssueLabelType) => (
                                                <span
                                                    key={it.id}
                                                    className={classes.itemColorLabel}
                                                    style={{ 
                                                        backgroundColor: `#${it.color}`
                                                    }}>
                                                    {it.title}
                                                </span>
                                            ))
                                        : '-'}
                                />
                            </ListItem>
                        )
                    }}
                />
            </div>
        </>
    );
}

export default RISList;