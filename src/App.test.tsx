import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MockStoreEnhanced } from 'redux-mock-store';
import { RootState } from './redux/store';
import { generateMockStore } from './redux/mockStore';
import { AsyncTaskLoadingState } from './utils/models/github';
import App from './App';

describe('<App />', () => {
    let store: MockStoreEnhanced<RootState> = generateMockStore(
        {
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
        }
    );
    test('contains App component', () => {
        const {container} = render(
            <Provider store={store}>
                <App/>
            </Provider>
        );
        expect(container).toBeInTheDocument();
    });
})
