# Data Anlaysis Plugin

This plugin allows you to statistically analyse the metadata fields in your vault.

To set it up, you first need to go to settings, and give a list of all the metadata fields you want to be checked for data, in a comma-separated list.

![](https://imgur.com/j2HPKGP.png)

## Views

It comes with two views, the Chart View, and the Stats View.

### Chart View

The Chart View is a simple way to visualize the data in your vault.

![](https://imgur.com/eaUtorl.png)

### Stats View

The Stats View gives more detailed numbers about each metadata field.

![](https://imgur.com/RMFZb8p.png)

### Correlation View

The Correlation View shows the correlations between all the fields in the active note, and every other field in the vault.

It has a double slider which allows you to choose an upper and lower bound. Only the values between the bounds will be shown.

![](https://imgur.com/p8WhIGL.png)

## Development

### Running the plugin for the first time

1. `npm i --legacy-peer-deps`.
2. `npm run dev`.
3. The [Hot Reload plugin](https://github.com/pjeby/hot-reload) helps to quickly refresh and see your changes.

### Making changes

We use a framework called [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) to write commit messages. Please try write your messages using this system, it has alot of benefits. VS Code has an extension to make this easier.

### Making a new release

We use [Standard Version](https://github.com/conventional-changelog/standard-version) to automatically handle creating a new release. It increments the version number based on the types of changes made, and auto-updates the changelog using the conventional commit messages.

Before making a new release, make sure you have Standard Version installed as a devDependency `npm i --save-dev standard-version`.

1. Make changes, and commit them.
2. `npm run release` (increments version number & updates changelog).
3. `git push --follow-tags origin master` (pushes changes to GitHub, and triggers the Action to create a release package).
