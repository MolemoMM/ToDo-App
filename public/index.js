document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const recycleBin = document.getElementById('recycleBin');
    const categorySelect = document.getElementById('categorySelect');
    const filterCategory = document.getElementById('filterCategory');
    const clearRecycleBinButton = document.getElementById('clearRecycleBinButton');
    const clearAllDataButton = document.getElementById('clearAllDataButton');
    const recycleBinIcon = document.getElementById('recycleBinIcon');

    // Initialize Typed.js for the h1 heading
  

    // Load tasks from localStorage when the page loads
    loadTasks();

    addTaskButton.addEventListener('click', () => {
        if (addTask()) {
            fireConfetti();
        }
    });
    filterCategory.addEventListener('change', filterTasks);
    clearRecycleBinButton.addEventListener('click', clearRecycleBin);
    clearAllDataButton.addEventListener('click', clearAllData);
    recycleBinIcon.addEventListener('click', toggleRecycleBin);

    function addTask() {
        const taskText = taskInput.value.trim();
        const category = categorySelect.value;

        if (taskText === '') return false;

        const task = {
            text: taskText,
            category: category,
            completed: false,
            createdAt: new Date().toLocaleString(),
            completedAt: null
        };

        saveTask(task);
        displayTask(task);

        taskInput.value = '';
        categorySelect.value = 'all';

        return true;
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

        const createdAtSpan = document.createElement('span');
        createdAtSpan.textContent = `Added: ${task.createdAt}`;
        createdAtSpan.classList.add('timestamp');

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.addEventListener('click', () => {
            moveToRecycleBin(li, task);
        });

        li.appendChild(taskSpan);
        li.appendChild(categorySpan);
        li.appendChild(createdAtSpan);
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

    function moveToRecycleBin(li, task) {
        li.classList.add('completed');
        recycleBin.appendChild(li);

        // Add Restore button
        const restoreButton = document.createElement('button');
        restoreButton.textContent = 'Restore';
        restoreButton.classList.add('restore-button');
        restoreButton.addEventListener('click', () => {
            restoreTask(li);
        });
        li.appendChild(restoreButton);

        // Add completed timestamp
        const completedAtSpan = document.createElement('span');
        completedAtSpan.textContent = `Completed: ${new Date().toLocaleString()}`;
        completedAtSpan.classList.add('timestamp');
        li.appendChild(completedAtSpan);

        // Save to JSON file
        saveCompletedTask(task);
    }

    function restoreTask(li) {
        li.classList.remove('completed');
        taskList.appendChild(li);
        const restoreButton = li.querySelector('.restore-button');
        if (restoreButton) {
            restoreButton.remove();
        }
        const completedAtSpan = li.querySelector('.timestamp');
        if (completedAtSpan) {
            completedAtSpan.remove();
        }
    }

    function clearRecycleBin() {
        while (recycleBin.firstChild) {
            recycleBin.removeChild(recycleBin.firstChild);
        }
    }

    function clearAllData() {
        localStorage.removeItem('tasks');
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }
        clearRecycleBin();
    }

    function fireConfetti() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    function toggleRecycleBin() {
        recycleBin.classList.toggle('hidden');
    }

    function saveCompletedTask(task) {
        fetch('/saveCompletedTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task: task.textContent })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Task saved:', data);
        })
        .catch(err => console.error('Error saving task:', err));
    }
});