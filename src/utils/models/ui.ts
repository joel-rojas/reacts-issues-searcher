export interface ChildrenComponents {
    children: React.ReactNode
}

export interface RISAutoCompleteProps {
    searchIssue: (name: string, quantity: number) => void;
    displaySelectedIssue: (option: ReactIssueOptionList|null) => void
}

export interface RISListProps {
    displaySelectedIssue: (option: ReactIssueOptionList|null) => void
}

export interface IssueLabelType {
    id: number;
    title: string;
    color: string;
}

export interface ReactIssueOptionList {
    label: string;
    id: number;
    issueLabelType: IssueLabelType[] | null;
}

export enum AvoidAutocompleteKeysList {
    Enter = 'Enter',
    ArrowDown = 'ArrowDown',
    ArrowUp = 'ArrowUp',
    ArrowLeft = 'ArrowLeft',
    ArrowRight = 'ArrowDown',
}

export enum NonInputKeys {
    KeyDown = 'keydown',
    KeyUp = 'keyup'
}

export enum IssuesSearchQuantity {
    Big = 100,
    Small = 5
}
