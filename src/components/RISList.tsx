import React from 'react';
import { useSelector } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { RootState } from '../redux/store';
import { IssueLabelType, ReactIssueOptionList, RISListProps } from './../utils/models/ui';

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        container: {
            width: '100%',
            height: 400,
            maxWidth: 300,
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

    const ListRow: React.FC<ListChildComponentProps> = ({data, style, index}) => {

        const handleListItemClick = (data: ReactIssueOptionList) => {
            displaySelectedIssue(data);
        }

        return (
            <ListItem button style={{...style, height: 'auto'}} key={index} onClick={() => handleListItemClick(data[index])}>
                <ListItemText
                    primary={data[index].label}
                    secondary={
                        data[index].issueLabelType ?
                            data[index].issueLabelType.map((it: IssueLabelType) => (
                                    <span
                                        key={it.id}
                                        className={classes.itemColorLabel}
                                        style={{ 
                                            backgroundColor: `#${it.color}`
                                        }}>
                                        {it.title}
                                    </span>
                                )
                            )
                            : '-'}/>
            </ListItem>
        )
    }
    return (
        <>
            <div className={classes.container}>
                <FixedSizeList height={400} width={300} itemSize={46} itemData={items} itemCount={items.length}>
                    {ListRow}
                </FixedSizeList>
            </div>
        </>
    );
}

export default RISList;