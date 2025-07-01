# Udon Exposed Diff Viewer

This is a web application for viewing the differences between various versions of [UdonExposed](https://github.com/Merlin-san/UdonExposed). It allows users to select two different versions and see a clear, color-coded diff of the files.

## Features

- **Version Comparison**: Select any two versions of UdonExposed to see the differences.
- **Side-by-Side Diff**: View changes in a clean, side-by-side format.
- **Syntax Highlighting**: (Future implementation) Code is highlighted for better readability.
- **Responsive Design**: Works on both desktop and mobile devices.

## Tech Stack

- **Framework**: React (with Vite)
- **UI**: Bootstrap
- **Diffing Library**: `diff`

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- A local clone of the [UdonExposed](https://github.com/Merlin-san/UdonExposed) repository.

### Installation

1.  **Clone this repository:**

    ```sh
    git clone https://github.com/your-username/udon-exposed-diff-viewer.git
    cd udon-exposed-diff-viewer/viewer
    ```

2.  **Clone the `UdonExposed` repository into the parent directory:**

    The data generation script expects the `UdonExposed` repository to be located at `../UdonExposed` relative to the project's root.

    ```sh
    git clone https://github.com/Merlin-san/UdonExposed.git ../UdonExposed
    ```

3.  **Install dependencies:**

    ```sh
    npm install
    ```

4.  **Generate the diff data and build the project:**

    This command will run the `prepare-data.js` script to generate the necessary diff files and then build the React application.

    ```sh
    npm run build
    ```

5.  **Preview the application:**

    ```sh
    npm run preview
    ```

    You can now access the application at the URL provided by Vite.

### Development

To run the application in development mode with hot-reloading:

```sh
npm run dev
```

## Available Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Generates diff data and builds the application for production.
-   `npm run lint`: Lints the code using ESLint.
-   `npm run preview`: Serves the production build locally for previewing.

## How It Works

The core of this project is the `scripts/prepare-data.js` script. During the build process, this script:

1.  Reads all the files from the different version directories inside the `UdonExposed` repository.
2.  Calculates the difference between each pair of versions.
3.  Saves these differences as JSON files in the `public/diffs` directory.
4.  Creates a `versions.json` file that lists all available versions.

The React application then fetches these JSON files to display the diffs to the user.

## Author

[@ikuko](https://x.com/magi_ikuko)
