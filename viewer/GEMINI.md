# Udon Exposed Diff Viewer

This project is a web application for viewing the differences between various versions of [UdonExposed](https://github.com/Merlin-san/UdonExposed).

## Project Overview

- **Framework**: React (using Vite)
- **UI Library**: Bootstrap
- **Core Functionality**:
    - Allows users to select two different versions of UdonExposed and view a diff of the files between them.
    - The diff data is pre-generated during the build process by the `scripts/prepare-data.js` script. This script reads its data from a local clone of the `UdonExposed` repository, which is expected to be located at `../UdonExposed` relative to the project's root directory.

## Development

### Prerequisites

Before running the application, you need to have a local clone of the `UdonExposed` repository in the parent directory of this project.

```sh
git clone https://github.com/Merlin-san/UdonExposed.git ../UdonExposed
```

### Scripts

- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Generates the diff data by running `scripts/prepare-data.js` and then builds the project for production.
- **`npm run lint`**: Runs ESLint to check the code for any issues.
- **`npm run preview`**: Previews the built application.
