import { RepoIssue } from "../models/github";
import { IssueLabelType, ReactIssueOptionList } from "../models/ui";

export const parseAPIIssuesListAsUIOptions = (list: RepoIssue[]): ReactIssueOptionList[] => {
    return list.map(item => (
        {
            id: item.id,
            label: item.title,
            issueLabelType: item.labels.map(lb => (
                {
                    id: lb.id,
                    color: lb.color,
                    title: lb.name
                }
            )) as IssueLabelType[]
        }
    ));
}