import React, { ChangeEvent, KeyboardEvent } from 'react';
import { useSelector } from 'react-redux';
import { CircularProgress, createStyles, makeStyles, TextField, Theme } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { AvoidAutocompleteKeysList, IssuesSearchQuantity, NonInputKeys, ReactIssueOptionList, RISAutoCompleteProps } from '../utils/models/ui';
import { RootState } from '../redux/store';

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        autoComplete: {
            width: 400
        },
        itemIssueColorLabel: {
            display: 'inline-block',
            flexShrink: 0,
            borderRadius: 3,
            padding: 3,
            marginRight: 2,
            '&:last-child': {
                marginRight: 0
            }
        },
        itemText: {
            flexGrow: 1,
        },
    })
});

const RISAutocomplete: React.FC<RISAutoCompleteProps> = ({searchIssue, displaySelectedIssue}) => {
    const {options, loading} = useSelector((state: RootState) => state.issuesUI.autocomplete);
    const classes = useStyles();

    const handleInputChange = (event: KeyboardEvent<HTMLInputElement>) => {
        const value = (event.target as HTMLInputElement).value;
        if (event.key === AvoidAutocompleteKeysList.Enter) {
            searchIssue(value, IssuesSearchQuantity.Big);
            return;
        }
        searchIssue(value, IssuesSearchQuantity.Small);
    };

    const handleItemChange = (event: ChangeEvent<{}>, value: ReactIssueOptionList|null) => {
        displaySelectedIssue(value);
    }

    return (
        <>
            <Autocomplete
                id="risAutocomplete"
                className={classes.autoComplete}
                getOptionSelected={(option, value) => option.label.toLowerCase() === value.label.toLowerCase() && option.id === value.id}
                getOptionLabel={(option) => option.label}
                options={options}
                loading={loading}
                onChange={handleItemChange}
                renderInput={(params) => (
                    <TextField
                    {...params}
                        label="Search issue by name"
                        onKeyUp={handleInputChange}
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
                renderOption={(option) => (
                    <>
                        <div className={classes.itemText}>
                            {option.label}
                            {   option.issueLabelType ?
                                <>
                                    <br />
                                    {
                                        option.issueLabelType.map(item => (
                                            <div
                                                key={item.id}
                                                className={classes.itemIssueColorLabel}
                                                style={{ 
                                                    backgroundColor: `#${item.color}`
                                                }}>
                                                {item.title}
                                            </div>
                                        ))
                                    }
                                </> : null
                            }
                        </div>
                    </>
                )}
            />
        </>
    );
}

export default RISAutocomplete;