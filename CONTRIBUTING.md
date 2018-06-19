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

#### Example

```bash
git commit -m "feat(close-channel): wire up close channel to UI"
```

Please make sure to run the tests before you commit your changes. You can run `npm test` which will run the test suite.

### Opt into git hooks

There are git hooks set up with this project that are automatically installed when you install dependencies. They're really handy, but are turned off by default (so as to not hinder new contributors). You can opt into these by creating a file called `.opt-in` at the root of the project and putting this inside:

```
commit-msg
pre-commit
```

### Branch Names

Branch names should start with a valid conventional commit type followed by `/description_of_branch`.

#### Example

```bash
git branch feat/close-channel-ui
```

### Pull Requests

The `master` branch will be used for all pull requests for the time being. This may change as the repo and contributors grow.

### Style Guide

This project has eslint rules and pull requests should pass `npm run lint` before being merged. The eslint rules are not final by any means and can be changed if necessary.

### Tests

Tests should try to be written for every feature/fix and pass `npm run test` before being merged. With the demand for the Lightning Network and Zap rising, rapid development will naturally leave some code untested but we should all try our best.

[issues]: https://github.com/LN-Zap/zap-desktop/issues
[slack]: https://join.slack.com/t/zaphq/shared_invite/enQtMzMxMzIzNDU0NTY3LTgyM2QwYzAyZTA5OTAyMjEwMTQxZmZmZmZkNWUzMTU2MmMyNmMxNjY4Y2VjY2FiYTRkMTkwMTRlMTE4YjM2MWY
