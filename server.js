const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

let tasks = []; // Store tasks in memory (for simplicity)

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // For parsing JSON requests

// Serve the main page (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API to get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// API to add a new task
app.post('/tasks', (req, res) => {
  const task = req.body.task;
  if (task) {
    tasks.push({ id: Date.now(), task, completed: false, createdAt: new Date(), completedAt: null });
    res.status(201).json({ message: 'Task added' });
  } else {
    res.status(400).json({ message: 'Task content is required' });
  }
});

// API to delete a task
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter(task => task.id !== taskId);
  res.status(200).json({ message: 'Task deleted' });
});

// API to toggle the completion status of a task
app.patch('/tasks/:id/toggle', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(task => task.id === taskId);
  if (task) {
    task.completed = !task.completed;  // Toggle completion
    task.completedAt = task.completed ? new Date() : null; // Set or clear completedAt
    res.status(200).json({ message: 'Task completion status toggled', completed: task.completed });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// API to save a completed task
app.post('/saveCompletedTask', (req, res) => {
    const completedTask = req.body.task;
    if (completedTask) {
        // Read the existing completed tasks from the JSON file
        fs.readFile('completedTasks.json', 'utf8', (err, data) => {
            if (err && err.code !== 'ENOENT') {
                return res.status(500).json({ error: 'Failed to read completed tasks' });
            }

            let completedTasks = [];
            if (data) {
                completedTasks = JSON.parse(data);
            }

            // Add the new completed task
            completedTasks.push(completedTask);

            // Write the updated completed tasks back to the JSON file
            fs.writeFile('completedTasks.json', JSON.stringify(completedTasks, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to save completed task' });
                }
                res.json({ message: 'Task saved successfully' });
            });
        });
    } else {
        res.status(400).json({ error: 'Invalid task data' });
    }
});

// API to clear all completed tasks
app.delete('/clearCompletedTasks', (req, res) => {
    fs.writeFile('completedTasks.json', JSON.stringify([], null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to clear completed tasks' });
        }
        res.json({ message: 'Completed tasks cleared successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
