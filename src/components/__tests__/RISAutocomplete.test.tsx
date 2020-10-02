import React from 'react';
import {render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MockStoreEnhanced } from 'redux-mock-store';
import { generateMockStore } from '../../redux/mockStore';
import { RootState } from '../../redux/store';
import { IssuesSearchQuantity, ReactIssueOptionList } from '../../utils/models/ui';
import { AsyncTaskLoadingState } from '../../utils/models/github';
import RISAutocomplete from '../RISAutocomplete';

describe('<RISAutocomplete />', () => {
    let store: MockStoreEnhanced<RootState>;
    let searchIssueMock: jest.Mock<void, [string, number]>;
    let displaySelectedIssueMock: jest.Mock<void, [ReactIssueOptionList|null]>;
    
    beforeEach(() => {
        store = generateMockStore({
            issues: {
                error: null,
                issues: null,
                loading: AsyncTaskLoadingState.Idle,
                searchedText: null,
                selectedIssue: null,
                suggestedIssues: null,
            },
            issuesUI: {
                alert: {
                    error: {
                        show: false
                    }
                },
                autocomplete: {
                    focus: false,
                    loading: false,
                    options: []
                },
                list: {
                    items: [],
                    loading: false
                }
            }
        });
        store.clearActions();
        searchIssueMock = jest.fn((name: string, quantity: number) => {
            const value = name.trim();
            console.log(`Some input search happened with value name: ${value} and quantity: ${quantity}`);
        });
        displaySelectedIssueMock = jest.fn((selectedOption: ReactIssueOptionList|null) => {
            console.log('Some issue is selected with name', selectedOption?.label);
        });
    });
    test('searching an issue text value will call searchIssueMock function', () => {
        const {container} = render(
            <Provider store={store}>
                <RISAutocomplete searchIssue={searchIssueMock} displaySelectedIssue={displaySelectedIssueMock} />);
            </Provider>
        )
        const autocompleteEl = container.querySelector('#risAutocomplete');
        expect(autocompleteEl).toBeInTheDocument();
        fireEvent.keyUp(autocompleteEl as Element, {
            target: {value: 'Test'}
        });
        expect(searchIssueMock).toHaveBeenCalledWith('Test', IssuesSearchQuantity.Small);
        fireEvent.keyUp(autocompleteEl as Element, {
            target: {value: 'Testing'},
            key: 'Enter'
        });
        expect(searchIssueMock).toHaveBeenCalledWith('Testing', IssuesSearchQuantity.Big);
    });
})