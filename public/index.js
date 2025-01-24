document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const recycleBin = document.getElementById('recycleBin');
    const categorySelect = document.getElementById('categorySelect');
    const filterCategory = document.getElementById('filterCategory');
    const clearRecycleBinButton = document.getElementById('clearRecycleBinButton');
    const clearAllDataButton = document.getElementById('clearAllDataButton');
    const recycleBinIcon = document.getElementById('recycleBinIcon');
    const backgroundImages = [
        './images/pic14.jpg',
        './images/pic13.jpg',
        './images/pic12.jpg',
       
    ];
    let currentImageIndex = 0;

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

    // Function to add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        const category = categorySelect.value;

        if (taskText === '') return false;

        const task = {
            id: Date.now(),
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

    // Function to save a task to localStorage
    function saveTask(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to load tasks from localStorage
    function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        let recycleBinTasks = JSON.parse(localStorage.getItem('recycleBinTasks')) || [];

        tasks.forEach(task => {
            displayTask(task);
        });

        recycleBinTasks.forEach(task => {
            displayTask(task, true);
        });
    }

    // Display a task in the list
    function displayTask(task, isRecycleBin = false) {
        const li = document.createElement('li');
        li.classList.add('task-item');
        li.dataset.category = task.category;

        const taskSpan = document.createElement('span');
        taskSpan.textContent = task.text;
        taskSpan.classList.add('task-text');
        taskSpan.setAttribute('data-full-text', task.text);

        const taskDetails = document.createElement('div');
        taskDetails.classList.add('task-details');

        const categorySpan = document.createElement('span');
        categorySpan.textContent = task.category;
        categorySpan.classList.add('category');

        const timestampSpan = document.createElement('span');
        if (isRecycleBin) {
            timestampSpan.textContent = `Completed: ${task.completedAt}`;
        } else {
            timestampSpan.textContent = `Added: ${task.createdAt}`;
        }
        timestampSpan.classList.add('timestamp');

        const actionButton = document.createElement('button');
        if (isRecycleBin) {
            actionButton.innerHTML = '<i class="fas fa-undo"></i>'; // Restore icon
            actionButton.classList.add('restore-button');
            actionButton.addEventListener('click', () => {
                restoreTask(task, li);
            });
        } else {
            actionButton.innerHTML = '<i class="fas fa-check"></i>'; // Complete icon
            actionButton.addEventListener('click', () => {
                moveToRecycleBin(li, task);
            });
        }

        taskDetails.appendChild(categorySpan);
        taskDetails.appendChild(timestampSpan);
        taskDetails.appendChild(actionButton);

        if (!isRecycleBin) {
            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="fas fa-edit"></i>'; // Edit icon
            editButton.classList.add('edit-button');
            editButton.addEventListener('click', () => {
                editTask(task, taskSpan);
            });
            taskDetails.appendChild(editButton); // Append the edit button after the action button
        }

        li.appendChild(taskSpan);
        li.appendChild(taskDetails);

        if (isRecycleBin) {
            recycleBin.appendChild(li);
            li.classList.add('completed');
        } else {
            taskList.appendChild(li);
        }

        // Add animation class
        li.classList.add('fade-in');

        // Add click event to show full text
        taskSpan.addEventListener('click', () => {
            alert(task.text);
        });

        // Add hover event to show full text
        taskSpan.addEventListener('mouseover', () => {
            taskSpan.title = task.text;
        });
    }

    // Function to edit a task
    function editTask(task, taskSpan) {
        const newTaskText = prompt('Edit task:', task.text);
        if (newTaskText !== null && newTaskText.trim() !== '') {
            task.text = newTaskText.trim();
            taskSpan.textContent = task.text;
            taskSpan.setAttribute('data-full-text', task.text);
            updateTaskInLocalStorage(task);
        }
    }

    // Function to update a task in localStorage
    function updateTaskInLocalStorage(updatedTask) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Toggle task completion (mark as completed or not)
    function toggleTaskCompletion(taskId, li) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toLocaleString() : null;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            li.classList.toggle('completed', task.completed);
            li.classList.add('slide-in');
        }
    }

    // Delete a task
    function deleteTask(taskId, li) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        li.remove();
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

    // Function to move a task to the recycle bin
    function moveToRecycleBin(li, task) {
        li.classList.add('completed');
        task.completed = true;
        task.completedAt = new Date().toLocaleString();

        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(t => t.id !== task.id);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        let recycleBinTasks = JSON.parse(localStorage.getItem('recycleBinTasks')) || [];
        recycleBinTasks.push(task);
        localStorage.setItem('recycleBinTasks', JSON.stringify(recycleBinTasks));

        recycleBin.appendChild(li);

        // Update the timestamp to show the completed time
        const timestampSpan = li.querySelector('.timestamp');
        timestampSpan.textContent = `Completed: ${task.completedAt}`;

        // Replace "Complete" button with "Restore" button
        const completeButton = li.querySelector('button');
        completeButton.innerHTML = '<i class="fas fa-undo"></i>'; // Restore icon
        completeButton.classList.add('restore-button');
        completeButton.removeEventListener('click', () => moveToRecycleBin(li, task));
        completeButton.addEventListener('click', () => restoreTask(task, li));

        // Remove the edit button if it exists
        const editButton = li.querySelector('.edit-button');
        if (editButton) {
            editButton.remove();
        }
    }

    // Function to restore a task from the recycle bin
    function restoreTask(task, li) {
        li.classList.remove('completed');
        task.completed = false;
        task.completedAt = null;

        let recycleBinTasks = JSON.parse(localStorage.getItem('recycleBinTasks')) || [];
        recycleBinTasks = recycleBinTasks.filter(t => t.id !== task.id);
        localStorage.setItem('recycleBinTasks', JSON.stringify(recycleBinTasks));

        saveTask(task);
        taskList.appendChild(li);

        // Replace "Restore" button with "Complete" button
        const restoreButton = li.querySelector('button');
        restoreButton.innerHTML = '<i class="fas fa-check"></i>'; // Complete icon
        restoreButton.classList.remove('restore-button');
        restoreButton.removeEventListener('click', () => restoreTask(task, li));
        restoreButton.addEventListener('click', () => moveToRecycleBin(li, task));

        // Add the edit button back
        const taskDetails = li.querySelector('.task-details');
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fas fa-edit"></i>'; // Edit icon
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', () => {
            editTask(task, li.querySelector('.task-text'));
        });
        taskDetails.appendChild(editButton);
    }

    // Function to clear the recycle bin
    function clearRecycleBin() {
        recycleBin.innerHTML = '';
        localStorage.setItem('recycleBinTasks', JSON.stringify([]));
    }

    // Function to clear all data
    function clearAllData() {
        taskList.innerHTML = '';
        recycleBin.innerHTML = '';
        localStorage.setItem('tasks', JSON.stringify([]));
        localStorage.setItem('recycleBinTasks', JSON.stringify([]));
    }

    function toggleRecycleBin() {
        recycleBin.classList.toggle('hidden');
    }

    // Slideshow functionality
    function changeBackgroundImage() {
        currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
        document.body.style.backgroundImage = `url(${backgroundImages[currentImageIndex]})`;
    }

    // Change background image every 5 seconds
    setInterval(changeBackgroundImage, 5000);

    // Set initial background image
    document.body.style.backgroundImage = `url(${backgroundImages[currentImageIndex]})`;

    // Fire confetti
    function fireConfetti() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
});