import React, { ChangeEvent, KeyboardEvent, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { CircularProgress, createStyles, makeStyles, TextField, Theme } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { RootState } from '../redux/store';
import {
    AvoidAutocompleteKeysList,
    IssuesSearchQuantity,
    ReactIssueOptionList,
    RISAutoCompleteProps
} from '../utils/models/ui';

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

/**
 * Function Component to render and set its UI functionality as Autocomplete component by using Material-UI's Autocomplete
 * component. It works by constantly communicating with App's store and making API requests to Github's APIs to search
 * React's issues by typing into its UI input.
 * @param {RISAutoCompleteProps} - Props passed to this component which represent methods to be called within its UI events like
 * changing input value or selecting an item from its UI list rendered once one or more records have been found through its 
 * searching ability. 
 * @author [Emerson Rojas](https://github.com/joel-rojas)
 */
const RISAutocomplete: React.FC<RISAutoCompleteProps> = ({searchIssue, displaySelectedIssue}: RISAutoCompleteProps) => {
    const {autocomplete} = useSelector((state: RootState) => state.issuesUI);
    const textFieldRef = useRef<HTMLInputElement>(null);
    const classes = useStyles();

    useEffect(() => {
        if (autocomplete.focus) {
            textFieldRef.current?.focus();
        } 
    });

    const handleInputChange = (event: KeyboardEvent<HTMLInputElement>) => {
        const value = (event.target as HTMLInputElement).value;
        if (value.trim().length > 0) {
            if (event.key === AvoidAutocompleteKeysList.Enter) {
                searchIssue(value, IssuesSearchQuantity.Big);
                return;
            }
            searchIssue(value, IssuesSearchQuantity.Small);
        }
    };

    const handleItemChange = (event: ChangeEvent<{}>, value: ReactIssueOptionList|null) => {
        displaySelectedIssue(value);
    }

    return (
        <>
            <Autocomplete
                id="risAutocomplete"
                className={classes.autoComplete}
                getOptionSelected={(option, value) =>
                    option.label.toLowerCase() === value.label.toLowerCase() && option.id === value.id
                }
                getOptionLabel={(option) => option.label}
                options={autocomplete.options}
                loading={autocomplete.loading}
                onChange={handleItemChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        id="risAutocompleteInput"
                        label="Search issue by name"
                        onKeyUp={handleInputChange}
                        inputRef={textFieldRef}
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {autocomplete.loading ? <CircularProgress color="inherit" size={20} /> : null}
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