// API URL for your Flask backend
const API_URL = "http://127.0.0.1:5000/tasks";  // Ensure this is the correct API URL

// Fetch tasks from the backend
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            const tasks = await response.json();
            renderTasks(tasks);  // Render tasks on the page
        } else {
            console.error("Failed to fetch tasks:", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

// Render tasks on the page
function renderTasks(tasks) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";  // Clear the task list before rendering

    tasks.forEach(task => {
        const listItem = document.createElement("li");
        listItem.textContent = task.content;

        // Add class for completed tasks
        if (task.completed) {
            listItem.classList.add("completed");
        }

        // Create task buttons (Complete/Undo and Delete)
        const taskButtons = document.createElement("div");
        taskButtons.classList.add("task-buttons");

        // Toggle task completion (Complete/Undo)
        const toggleButton = document.createElement("button");
        toggleButton.textContent = task.completed ? "Undo" : "Complete";
        toggleButton.onclick = () => updateTask(task.id, !task.completed);

        // Delete task button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.style.backgroundColor = "#f44336";
        deleteButton.onclick = () => deleteTask(task.id);

        // Append buttons to the task
        taskButtons.appendChild(toggleButton);
        taskButtons.appendChild(deleteButton);

        // Append task and buttons to the list item
        listItem.appendChild(taskButtons);
        taskList.appendChild(listItem);
    });
}

// Add a new task
async function addTask() {
    const taskInput = document.getElementById("newTaskInput");
    const content = taskInput.value.trim();  // Get the content of the task input

    if (content) {
        try {
            // Send a POST request to add the task to the backend
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ content })  // Send task content
            });

            if (response.ok) {
                taskInput.value = "";  // Clear the input field after adding the task
                fetchTasks();  // Refresh the task list
            } else {
                console.error("Failed to add task:", response.statusText);
            }
        } catch (error) {
            console.error("Error adding task:", error);
        }
    }
}

// Update task (Complete/Undo)
async function updateTask(id, completed) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ completed })  // Send updated completion status
        });

        if (response.ok) {
            fetchTasks();  // Refresh the task list
        } else {
            console.error("Failed to update task:", response.statusText);
        }
    } catch (error) {
        console.error("Error updating task:", error);
    }
}

// Delete a task
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"  // DELETE method to remove the task
        });

        if (response.ok) {
            fetchTasks();  // Refresh the task list
        } else {
            console.error("Failed to delete task:", response.statusText);
        }
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

// Fetch tasks when the page loads
window.onload = fetchTasks;  // Automatically fetch tasks when the page is loaded
