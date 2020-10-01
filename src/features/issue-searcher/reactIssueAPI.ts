const {REACT_APP_GH_PERSONAL_TOKEN} = process.env;

export const fetchIssuesList = async (name: string, resultQuantity: number) => {
    const formattedName = name.split('\ ').join('+');
    return fetch(`https://api.github.com/search/issues?q=${formattedName}`+
        `+type:issue+repo:facebook/react&per_page=${resultQuantity}`, {
        method: 'GET',
        headers: {
            'Authorization': `token ${REACT_APP_GH_PERSONAL_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
        },
    })
    .then(response => response.json())
    .catch(error => error)
};

export const fetchDetailedIssue = async (id: number) => {
    return fetch(`https://api.github.com/repos/facebook/react/issues/${id}`,  {
        method: 'GET',
        headers: {
            'Authorization': `token ${REACT_APP_GH_PERSONAL_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
        },
    })
    .then(response => response.json())
    .catch(error => error)
};
