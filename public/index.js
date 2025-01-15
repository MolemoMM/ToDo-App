document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const recycleBin = document.getElementById('recycleBin');
    const categorySelect = document.getElementById('categorySelect');
    const filterCategory = document.getElementById('filterCategory');

    // Initialize Typed.js for the h1 heading
    var typed = new Typed(".input", {
        strings: [

            "Organize Your Tasks!", "Make Life Easier!"
        ],
        typeSpeed: 120,
        backSpeed: 70,
        loop: true,
        preStringTyped: (arrayPos, self) => {
            const colors = [' var(--main-color)', ' var(--main-color)'];
            document.querySelector('.input').style.color = colors[arrayPos % colors.length];
        }
    });

    // Load tasks from localStorage when the page loads
    loadTasks();

    addTaskButton.addEventListener('click', addTask);
    filterCategory.addEventListener('change', filterTasks);

    function addTask() {
        const taskText = taskInput.value.trim();
        const category = categorySelect.value;

        if (taskText === '') return;

        const task = {
            text: taskText,
            category: category,
            completed: false
        };

        saveTask(task);
        displayTask(task);

        taskInput.value = '';
        categorySelect.value = 'all';

        // Add animation class
        li.classList.add('fade-in');
    }

    function saveTask(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            displayTask(task);
        });
    }

    // Display a task in the list
    function displayTask(task) {
        const li = document.createElement('li');
        li.classList.add('task-item');
        li.dataset.category = task.category;

        const taskSpan = document.createElement('span');
        taskSpan.textContent = task.text;

        const categorySpan = document.createElement('span');
        categorySpan.textContent = task.category;
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

        // Add animation class
        li.classList.add('fade-in');
    }

    // Toggle task completion (mark as completed or not)
    function toggleTaskCompletion(taskId, li) {
        fetch(`/tasks/${taskId}/toggle`, { method: 'PATCH' })
            .then(response => response.json())
            .then(data => {
                li.classList.toggle('completed', data.completed);
                // Add animation class
                li.classList.add('slide-in');
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
