# Gaza Care Medic App

Web app to allow Medics to upload First Aid materials to be served in the First Aid app.

## Tech Stack

Runs on Serverless Cloudflare Pages

## Running locally

The following steps will help you get the app running locally. You will need to install dependencies, 
run a build and then serve it locally with Cloudflare's wrangler tool. Since it will run in wrangler, 
you will need to continuously build after any change is made. 
You can achieve this via the `--watch` argument to the `wrangler` command.

### Install dependencies

```
npx yarn install
```

### .dev.vars File
Copy the .dev.vars.example file to .dev.vars and fill in the variables delineated with <variable-name> with the appropriate values. Ask a team member for the values.


### Start the continuous build

```
npx yarn build:dev --watch
```

### Start the development server
```
npx wrangler pages dev dist
```

The app is now running, the instructions onscreen will have the port where the app will be running. Usually 8788.

## Contributing Guidelines

- Cut a branch from master of the form `ab/short-describe-changes`
  Where `ab` is your initials or some form of your github identifier.

- Make your changes

- Push your branch and create a pull request

- Once approved, try to merge your PR as soon as possible

### Commit Messages

We follow [Tim Pope's convention for commit messages](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html):

```
Capitalized, short (50 chars or less) summary

More detailed explanatory text, if necessary.  Wrap it to about 72
characters or so.  In some contexts, the first line is treated as the
subject of an email and the rest of the text as the body.  The blank
line separating the summary from the body is critical (unless you omit
the body entirely); tools like rebase can get confused if you run the
two together.

Write your commit message in the imperative: "Fix bug" and not "Fixed bug"
or "Fixes bug."  This convention matches up with commit messages generated
by commands like git merge and git revert.

Further paragraphs come after blank lines.

- Bullet points are okay, too

- Typically a hyphen or asterisk is used for the bullet, followed by a
  single space, with blank lines in between, but conventions vary here

- Use a hanging indent

Final line should include Issue number and what the commit does for the
issue.

Closes Issue:

[Closes #ISSUE-NUMBER]

Related to Issue:

[#ISSUE-NUMBER]
```

#### Example

```
Add success message after uploading video

- Refactor to `useState` hooks to `useReducer` to simplify and
  improve maintainability.

[#4]
```

### Project structure

The project structure is quite basic.

- React components reside in their own folder which contains all files necessary
  for the component. Code will reside in `index.js`, css in `styles.css`, and tests
  in `tests.js`.
  Example for a component named `FlasMessage`:

  Folder is named `src/components/FlashMessage`.

  Folder contains `index.js`, `styles.css` and `tests.js`. Component is imported like so:
  `import FlashMessage from '@components/FlashMessage';`

- React components should maintain functional purity. Any side effect code should be declared
  in the `actions/index.js` file and imported for us in the component either in a `useEffect`
  hook or in response to user actions.

- The typical pattern is as follows:

  - User does something -> dispatch an event with the necessary data -> reducer will process
    the even according to the event type, a new state will be returned from the reducer ->
    the component now reflects the new state.


- Most changes you will need to make will be in the `components` folder, the `actions/index.js`
  file, or the `reducer/index.js` file.
