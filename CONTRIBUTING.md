<h1 align='center'>Contributing</h1>
(Even after a recent refactor the code is still a bit sloppy, in a bit of a segwit rush, apologize in advance for any "wtf is this?")

## Pull Requests
The branch to be PR'd against will be master for the time being. This may change as the repo and contributors grow.

Branch names should start with `feature` or `fix` followed by `/description_of_branch`
```bash
# example
git branch feature/list-onchain-txs
```

Commit messages should start with `feature`, `fix`, or `test` followed by `(subject_of_commit)` and ending with `: description_of_commit`
```bash
#example
git commit -m "feature(list-onchain-txs): create hard code mock of onchain-txs list"
```

## eslint:
This project has eslint rules and PRs should pass `npm run lint` before being merged. The eslint rules are not final by any means and can be changed if necessary

## Tests:
Tests should try to be written for every feature and fix. With segwit activating soon and the demand for Zap rising rapid development will naturally leave some code untested but we should all try our best.

PRs should pass `npm run test` before they are merged
