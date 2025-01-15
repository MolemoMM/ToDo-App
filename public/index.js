document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const recycleBin = document.getElementById('recycleBin');
    const categorySelect = document.getElementById('categorySelect');
    const filterCategory = document.getElementById('filterCategory');

    // Load tasks from the server when the page loads
    loadTasks();

    addTaskButton.addEventListener('click', addTask);
    filterCategory.addEventListener('change', filterTasks);

    function addTask() {
        const taskText = taskInput.value.trim();
        const category = categorySelect.value;

        if (taskText === '') return;

        const li = document.createElement('li');
        li.classList.add('task-item');
        li.dataset.category = category;

        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;

        const categorySpan = document.createElement('span');
        categorySpan.textContent = category;
        categorySpan.classList.add('category');

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.addEventListener('click', () => {
            moveToRecycleBin(li);
        });

        li.appendChild(taskSpan);
        li.appendChild(categorySpan);
        li.appendChild(completeButton);
        taskList.appendChild(li);

        taskInput.value = '';
        categorySelect.value = 'all';
    }

    // Load tasks from the server
    function loadTasks() {
        fetch('/tasks')
            .then(response => response.json())
            .then(data => {
                taskList.innerHTML = '';  // Clear the list before adding new tasks
                data.forEach(task => {
                    displayTask(task);
                });
            })
            .catch(err => console.error('Error loading tasks:', err));
    }

    // Display a task in the list
    function displayTask(task) {
        const li = document.createElement('li');
        li.textContent = task.task;
        li.classList.toggle('completed', task.completed);  // Add "completed" class if the task is completed
        li.dataset.category = task.category;

        const categorySpan = document.createElement('span');
        categorySpan.textContent = task.category;
        categorySpan.classList.add('category');
        li.appendChild(categorySpan);

        // Mark task as completed when clicked
        li.addEventListener('click', () => {
            toggleTaskCompletion(task.id, li);
        });

        // Edit task button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn');
        editButton.onclick = (e) => {
            e.stopPropagation();  // Prevent triggering the click event to mark as complete
            editTask(task, li);
        };

        // Delete task button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.onclick = (e) => {
            e.stopPropagation();  // Prevent triggering the click event to mark as complete
            deleteTask(task.id, li);
        };

        li.appendChild(editButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    }

    // Toggle task completion (mark as completed or not)
    function toggleTaskCompletion(taskId, li) {
        fetch(`/tasks/${taskId}/toggle`, { method: 'PATCH' })
            .then(response => response.json())
            .then(data => {
                li.classList.toggle('completed', data.completed);
            })
            .catch(err => console.error('Error toggling completion:', err));
    }

    // Delete a task
    function deleteTask(taskId, li) {
        fetch(`/tasks/${taskId}`, { method: 'DELETE' })
            .then(() => {
                li.remove();
            })
            .catch(err => console.error('Error deleting task:', err));
    }

    function filterTasks() {
        const filter = filterCategory.value;
        const tasks = taskList.getElementsByTagName('li');

        Array.from(tasks).forEach(task => {
            if (filter === 'all' || task.dataset.category === filter) {
                task.style.display = '';
            } else {
                task.style.display = 'none';
            }
        });
    }

    function moveToRecycleBin(li) {
        li.classList.add('completed');
        recycleBin.appendChild(li);
    }
});
