const todoAPI = "http://localhost:3000/todo"
const getTodos = (handleRender) => {
    fetch(todoAPI)
        .then(response => response.json())
        .then(todos => {
            handleRender(todos)
        })
        .catch(error => console.log(error))
}

function app() {
    getTodos(renderTodos);
    handleAddJob();
    handleRemoveJob();
    handleCompleteJob();

}
app();

function renderTodos(todos) {
    const todoBox = document.querySelector(".box-content")
    const contentRender = todos.map(todo => {
        var finishIcon = "";
        var completeBtn = `<button id="${todo.id}"class="complete-btn material-icons">done</button>`;
        if (todo.isFinished == true) {
            finishIcon = `<span class="material-icons todo_completed">
            check_circle
        </span>`;
            completeBtn = "";
        }
        return `<li class="content-item">
        <span>${todo.description} ${finishIcon}</span>
        <div class="todo-btns">
        ${completeBtn}
        <button id="${todo.id}" class="delete-btn material-icons">clear</button>
        </div>
                </li>`
    })
    if (contentRender.length > 0) {
        todoBox.innerHTML = contentRender.join('')
    } else {
        todoBox.innerHTML = `<p class="content--no-job">Chưa có công việc nào</p>`
    }
}

function handleAddJob(e) {
    const addJobBtn = document.querySelector(".create-btn");
    addJobBtn.onclick = () => {
        const description = document.querySelector(".todo-input").value;
        const todo = {
            description: description,
            isFinished: false
        };
        const pushData = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(todo)

        };
        fetch(todoAPI, pushData)
            .then(response => response.json());
        getTodos(renderTodos);
        document.querySelector(".todo-input").value = "";
        document.querySelector(".todo-input").focus();
    }
}

function handleRemoveJob(e) {
    const todoBtns = document.querySelector(".box-content");
    todoBtns.addEventListener("click", (e) => {
        const todoElement = e.target.closest(".content-item");
        if (e.target.closest(".delete-btn")) {
            const id = e.target.closest(".delete-btn").id;
            const deleteData = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            };
            fetch(todoAPI + "/" + id, deleteData)
            todoElement.remove();
        }
    })
}

function handleCompleteJob(e) {
    const todoBtns = document.querySelector(".box-content");
    todoBtns.addEventListener("click", (e) => {
        if (e.target.closest(".complete-btn")) {
            const id = e.target.closest(".complete-btn").id;
            console.log(id);
            const completeData = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    isFinished: true
                })
            };
            fetch(todoAPI + "/" + id, completeData)
            getTodos(renderTodos);
        }
    })
}

