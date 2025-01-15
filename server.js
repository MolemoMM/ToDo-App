const express = require('express');
const path = require('path');
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
    tasks.push({ id: Date.now(), task, completed: false });
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
    res.status(200).json({ message: 'Task completion status toggled', completed: task.completed });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
