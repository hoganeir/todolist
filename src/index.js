import express, { request } from 'express'

let lastIndex = 3;
let state = [{
    id: 1,
    text: "Buy groceries",
    completed: false
}, {
    id: 2,
    text: "Walk the dog",
    completed: false
}]

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/api/todos", function(request, response){
    response.status(200).json(state);
});

// add route for clear list
app.delete("/api/todos/clear-state", function(request, response) {
    state = [];
    response.status(200).send();
});

// app.delete("/api/done/clear-state", function(request, response) {
//     state = [];
//     response.status(200).send();
// });

app.post("/api/todos", function(request, response){
    const data = request.body;
    console.log(data);
    const newTodo = {
        id: lastIndex + 1,
        text: data.text,
        completed: data.completed
    };
    lastIndex++;
    state.push(newTodo);
    response.status(200).json(newTodo);
});

// add route for put for completed
app.put("/api/todos/:id", function(request, response){
    const todoId = parseInt(request.params.id);
    const updatedTodo = request.body;

    const todoIndex = state.findIndex(todo => todo.id === todoId);

    if (todoIndex > -1) {
        state[todoIndex] = { ...state[todoIndex], ...updatedTodo};
        response.status(200).json(state[todoIndex]);
    } else {
        response.status(404).send("Todo not found");
    }
});

// add route for delete item
app.delete("/api/todos/:id", function(request, response) {
    const todoId = parseInt(request.params.id);
    const initialLength = state.length;
    state = state.filter(todo => todo.id !== todoId);

    if (state.length < initialLength) {
        response.status(204).send();
    } else {
        response.status(404).send("Todo not found");
    }
});

console.log('Server is running at http://localhost:3000');
app.listen(3000);