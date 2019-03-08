# Contributing

Thanks for being willing to contribute!

## Table of Contents

- [How to Contribute](#How-to-Contribute)
- [Contribution-Guidelines](#Contribution-Guidelines)

## How to Contribute

#### **Did you find a bug?**

- **Do not open up a GitHub issue if the bug is a security vulnerability in Zap**, and instead to refer to our [Security Policy](README#security).

- **Ensure the bug was not already reported** by searching on GitHub under [Issues][issues].

- If you're unable to find an open issue addressing the problem, [open a new one][issues]. Be sure to include a **title and clear description**, and as much relevant information as possible.

#### **Did you write a patch that fixes a bug?**

- Open a new GitHub pull request with the patch.

- Ensure the PR description clearly describes the problem and solution. Include the relevant issue number if applicable.

- Before submitting, please read the [Coding Guidelines](#coding-guidelines) to know more about our coding conventions and practices.

#### **Do you intend to add a new feature or change an existing one?**

- Please join us on [slack][slack] and check [open issues][issues] to see what contributions are needed before tackling a task to avoid duplicate work.

#### **Do you have questions about the source code?**

- Ask any question about the Zap source code in [slack][slack].

## Contribution Guidelines

### Making Changes

We use two primary branches to manage development:

- `master`: Stable branch that corresponds to the current production release. Only bug fixes and release ready code will be merged into the master branch with a view to including in the next patch release (patch number increment).
- `next`: Primary development branch. All new features should be developed against the next branch. The next branch will generally be quite far ahead of the master branch and includes all new features that are being developed for the next major release (major or minor number increment).

In general, most of the time you will want to develop against the `next` branch.

### Committing and Pushing changes

We follow the [conventional changelog standard][convention] for commit messages. You don't have to follow this convention if you don't like to. Just know that when we merge your commit, we'll probably use "Squash and Merge" so we can change the commit message :)

Valid conventional commit types are:

- `build`: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- `chore`: Other changes that don't modify src or test files
- `ci`: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- `docs`: Documentation only changes
- `feat`: A new feature
- `fix`: A bug fix
- `perf`: A code change that improves performance
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `revert`: Reverts a previous commit
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `test`: Adding missing tests or correcting existing tests

**Example:**

```bash
git commit -m "feat(close-channel): wire up close channel to UI"
```

Please make sure to run the tests before you commit your changes. You can run `npm test` which will run the test suite.

### Git hooks

There are git hooks set up with this project that are automatically installed when you install dependencies. They're really handy, with them in place you will get:

1.  Automatic reformatting of changed files on commit via [prettier][prettier]
1.  Automatic lint of changed files on commit (will not allow commit with files that fail lint) via [eslint][eslint]
1.  Automatic validation of commit message format (will not allow commit with invalid commit message) via [commitlint][commitlint]

### Branch Names

Branch names should start with a valid conventional commit type followed by `/description_of_branch`.

**Example:**

```bash
git branch feat/close-channel-ui
```

### Pull Request Reviews

When reviewing Pull Requests (PRs) you should use the following conventions to denote the level of review that you have performed:

- `Concept ACK`: Agree with the idea and overall direction, but haven't reviewed the code changes or tested them.
- `utACK`: (untested ACK) Reviewed and agree with the code changes but haven't actually tested them.
- `Tested ACK`: Reviewed the code changes and have verified the functionality or bug fix.
- `ACK`: A loose ACK can be confusing. It's best to avoid them unless it's a documentation/comment only change in which case there is nothing to test/verify; therefore the tested/untested distinction is not there.
- `NACK`: Disagree with the code changes/concept. Should be accompanied by an explanation.

### Style Guide

This project has eslint rules and pull requests should pass `npm run lint` before being merged. The eslint rules are not final by any means and can be changed if necessary.

### Tests

Tests should try to be written for every feature/fix and pass `npm run test` before being merged. With the demand for the Lightning Network and Zap rising, rapid development will naturally leave some code untested but we should all try our best.

[commitlint]: http://marionebl.github.io/commitlint/#/
[convention]: https://conventionalcommits.org/
[eslint]: https://eslint.org/
[issues]: https://github.com/LN-Zap/zap-desktop/issues
[prettier]: https://prettier.io/
[slack]: https://join.slack.com/t/zaphq/shared_invite/enQtMzgyNDA2NDI2Nzg0LTQwZWQ2ZWEzOWFhMjRiNWZkZWMwYTA4MzA5NzhjMDNhNTM5YzliNDA4MmZkZWZkZTFmODM4ODJkYzU3YmI3ZmI

### Releases

Before making a new release, the version number should be incremented in the following files:

- `package.json`: The main repo package file.
- `app/package.json`: The electron app package file.

If the release is a major or minor number increment (eg, `0.3.x` -> `0.4.x`), you should also update `STABLE_VERSION` in the main app config file to reference the correct new stable version (this is used to determine the app's database namespace):

- `config/default.js`: The app config file.
