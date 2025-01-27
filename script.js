document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addButton = document.getElementById('addButton');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const clearCompleted = document.getElementById('clearCompleted');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateTaskCount();
    }

    function updateTaskCount() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.textContent = task.text;
        if (task.completed) {
            li.classList.add('checked');
        }

        const deleteBtn = document.createElement('span');
        deleteBtn.innerHTML = '×';
        li.appendChild(deleteBtn);

        // Toggle task completion
        li.addEventListener('click', (e) => {
            if (e.target !== deleteBtn) {
                li.classList.toggle('checked');
                task.completed = !task.completed;
                saveTasks();
            }
        });

        // Delete task
        deleteBtn.addEventListener('click', () => {
            tasks = tasks.filter(t => t !== task);
            li.remove();
            saveTasks();
        });

        return li;
    }

    function addTask(text) {
        if (text.trim()) {
            const task = {
                id: Date.now(),
                text: text,
                completed: false
            };
            tasks.push(task);
            taskList.appendChild(createTaskElement(task));
            saveTasks();
        }
    }

    function filterTasks(filterType) {
        const allTasks = taskList.getElementsByTagName('li');
        for (let task of allTasks) {
            switch (filterType) {
                case 'all':
                    task.style.display = '';
                    break;
                case 'active':
                    task.style.display = task.classList.contains('checked') ? 'none' : '';
                    break;
                case 'completed':
                    task.style.display = task.classList.contains('checked') ? '' : 'none';
                    break;
            }
        }
    }

    // Event Listeners
    addButton.addEventListener('click', () => {
        addTask(taskInput.value);
        taskInput.value = '';
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(taskInput.value);
            taskInput.value = '';
        }
    });

    clearCompleted.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        taskList.innerHTML = '';
        tasks.forEach(task => taskList.appendChild(createTaskElement(task)));
        saveTasks();
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterTasks(button.getAttribute('data-filter'));
        });
    });

    // Initial render
    tasks.forEach(task => taskList.appendChild(createTaskElement(task)));
    updateTaskCount();
}); 