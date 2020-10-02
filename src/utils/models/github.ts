export enum AsyncTaskLoadingState {
    Pending = 'pending',
    Idle = 'idle'
}

export interface GithubPullRequestUrlInfo {
    url: string|null;
    html_url: string|null;
    diff_url: string|null;
    patch_url: string|null;
}

export interface GithubUser {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: string;
}

export interface GithubRepoMilestone {
    url: string;
    html_url: string;
    labels_url: string;
    id: number;
    node_id: string;
    number: number
    state: string;
    title: string;
    description: string;
    creator: GithubUser;
    open_issues: number;
    closed_issues: number;
    created_at: Date|string;
    updated_at: Date|string;
    closed_at: Date|string;
    due_on: Date|string;
}

export interface RepoIssueLabel {
    id: number;
    node_id: string;
    url: string;
    name: string;
    color: string;
}

export interface RepoIssue {
    url: string;
    repository_url: string;
    labels_url: string;
    comments_url: string;
    events_url: string;
    html_url: string;
    id: number,
    node_id: string;
    number: number,
    title: string;
    user: GithubUser,
    labels: RepoIssueLabel[]
    state: string,
    assignee: string|GithubUser;
    milestone: string|GithubRepoMilestone;
    comments: number;
    created_at: Date|string|null;
    updated_at: Date|string|null;
    closed_at: Date|string|null;
    pull_request: GithubPullRequestUrlInfo;
    body: string;
    score: number;
}

export interface RepoDetailedIssue extends RepoIssue {
    closed_by: GithubUser;
    assignees: GithubUser[];
    milestone: GithubRepoMilestone;
    locked: boolean;
    active_lock_reason: string;
    author_association: string;
    performed_via_github_app: string;
}

export interface IssueSearchResult {
    total_count: number;
    incomplete_results: boolean;
    items: RepoIssue[]
}

export interface IssueSearchResultRequest {
    name: string;
    quantity: number;
}

export interface GithubErrorResponse {
    error: string;
}
