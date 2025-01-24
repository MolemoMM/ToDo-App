# Live WebsiteLink: https://to-do-app-t5sp-molemo-mamashelas-projects.vercel.app/
# ToDo App
A powerful and intuitive ToDo application designed to help you manage your tasks efficiently. The app supports task categorization, completion tracking, a recycle bin for completed tasks, and offers a seamless user experience. All completed tasks are stored in a JSON file for easy retrieval and restoration.

### Languages and Tools used in this project:
  <a href="https://www.w3schools.com/css/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="40" height="40"/>
  </a>
  <a href="https://git-scm.com/" target="_blank" rel="noreferrer">
    <img src="https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg" alt="git" width="40" height="40"/>
  </a>
  <a href="https://www.w3.org/html/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="40" height="40"/>
  </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/>
  </a>
  <a href="https://nodejs.org/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/>
  </a>
</p>

## 🎬 Usage

### 1. Adding a Task

- **Step 1**: Enter a task in the input field.
- **Step 2**: Select a category from the dropdown menu.
- **Step 3**: Click the **Add Task** button to add the task to your list.

### 2. Marking a Task as Completed

- **Step 1**: Click on the task you want to mark as completed.
- **Step 2**: The task will move to the recycle bin automatically.

### 3. Restoring a Task

- **Step 1**: Click the **Recycle Bin** icon to view completed tasks.
- **Step 2**: Click the **Restore** button next to any task to bring it back to your task list.

### 4. Clearing Tasks

- **Clear All Data**: To delete all tasks, click the **Clear All Data** button.
- **Clear Recycle Bin**: To empty the recycle bin, click the **Clear Recycle Bin** button.

### 5. Filtering Tasks by Category

- **Step 1**: Select a category from the **Filter by Category** dropdown menu.
- **Step 2**: The task list will automatically update to show tasks in the selected category.

## 🚀 Features

- **Task Creation**: Easily add new tasks and assign them to categories.
- **Mark as Completed**: Mark tasks as completed with a simple click.
- **Recycle Bin**: Move completed tasks to the recycle bin and restore them at any time.
- **Task Management**: Delete tasks or clear the recycle bin to free up space.
- **Category Filter**: Quickly filter tasks by category to stay organized.
- **Data Persistence**: Completed tasks are stored in a JSON file, ensuring data is never lost.
- **Responsive Design**: The app is fully responsive, making it perfect for both desktop and mobile use.
- **User-Friendly Interface**: Clean and modern UI for an intuitive experience.



## 📦 Prerequisites

Before running the app, ensure that you have the following installed on your system:

- **Node.js**: Make sure Node.js is installed. You can download it from [nodejs.org](https://nodejs.org/).
- **Nodemon**: Nodemon is used for automatically restarting the server when file changes are detected. It is installed as a development dependency. If you don't have it installed, you can run:
    ```bash
    npm install -g nodemon
    ```

## 📦 Installation

To set up the ToDo app locally, follow these simple steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/todo-app.git
    cd todo-app
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Run the development server**:
    ```bash
    npm run dev
    ```

4. **Open the app**:
    Navigate to `http://localhost:3000` in your browser to view the app.

## 📂 File Structure

Here’s a breakdown of the project directory:

### `completedTasks.json`
- Stores the list of completed tasks.

### `package.json`
- Contains project metadata, scripts, and dependencies.

### `public/`
- Static files for the frontend.

  - `images/`: Contains image assets.
  - `index.html`: Main HTML file for the app.
  - `index.js`: Main JavaScript file handling frontend functionality.
  - `style.css`: Main CSS file for styling the app.

### `server.js`
- Handles API requests and serves the frontend.

### `README.md`
- This file, containing documentation for the project.

## 🔧 API Endpoints

Here are the available API endpoints for interacting with the app:

- **GET `/tasks`**: Retrieve all tasks (returns a JSON array of tasks).
- **POST `/tasks`**: Add a new task (requires a JSON object with a `task` field).
- **DELETE `/tasks/:id`**: Delete a specific task by ID (returns a confirmation message).
- **PATCH `/tasks/:id/toggle`**: Toggle the completion status of a task (returns updated task status).
- **POST `/saveCompletedTask`**: Save a completed task (requires a JSON object with a `task` field).
- **DELETE `/clearCompletedTasks`**: Clear all completed tasks (returns a confirmation message).

## 🔌 Recommended Extensions for Development

Enhance your development experience by installing the following Visual Studio Code extensions:

- **Live Server**: Instantly launch a local development server with live reload support.
- **Prettier**: Automatically format your code to maintain a clean and consistent code style.
- **ESLint**: Integrates JavaScript linting to identify and fix code issues.
- **Path Intellisense**: Provides autocompletion for filenames, making file navigation easier.
- **Bracket Pair Colorizer**: Colorizes matching brackets to make code more readable.

## License

This project is licensed under the terms specified by the author, Molemo Mamashela. All rights reserved.
