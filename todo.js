const fs = require("fs");
const path = require("path");

const TODO_FILE = path.join(__dirname, "todos.json");

function loadTodos() {
  if (!fs.existsSync(TODO_FILE)) {
    return [];
  }

  try {
    const data = fs.readFileSync(TODO_FILE, "utf8").trim();

    if (data === "") {
      return [];
    }

    const todos = JSON.parse(data);

    if (!Array.isArray(todos)) {
      console.log("todos.json 형식이 올바르지 않습니다.");
      process.exit(1);
    }

    return todos;
  } catch (error) {
    console.log("todos.json 파일을 읽는 중 오류가 발생했습니다.");
    process.exit(1);
  }
}

function saveTodos(todos) {
  try {
    fs.writeFileSync(TODO_FILE, JSON.stringify(todos, null, 2), "utf8");
  } catch (error) {
    console.log("todos.json 파일을 저장하는 중 오류가 발생했습니다.");
    process.exit(1);
  }
}

function getNextId(todos) {
  if (todos.length === 0) {
    return 1;
  }

  return Math.max(...todos.map((todo) => todo.id)) + 1;
}

function addTodo(content) {
  if (!content || content.trim() === "") {
    console.log("추가할 Todo 내용을 입력해주세요.");
    return;
  }

  const todos = loadTodos();
  const newTodo = {
    id: getNextId(todos),
    content: content.trim(),
    done: false,
  };

  todos.push(newTodo);
  saveTodos(todos);

  console.log(`Todo가 추가되었습니다: ${newTodo.content}`);
}

function listTodos() {
  const todos = loadTodos();

  if (todos.length === 0) {
    console.log("Todo가 없습니다.");
    return;
  }

  todos.forEach((todo) => {
    const status = todo.done ? "[x]" : "[ ]";
    console.log(`${status} ${todo.id}. ${todo.content}`);
  });
}

function findTodoIndexById(todos, id) {
  return todos.findIndex((todo) => todo.id === id);
}

function doneTodo(id) {
  const todoId = Number(id);

  if (Number.isNaN(todoId)) {
    console.log("올바른 ID를 입력해주세요.");
    return;
  }

  const todos = loadTodos();
  const index = findTodoIndexById(todos, todoId);

  if (index === -1) {
    console.log("해당 ID를 찾을 수 없습니다.");
    return;
  }

  todos[index].done = true;
  saveTodos(todos);

  console.log(`ID ${todoId}번 항목이 완료되었습니다.`);
}

function deleteTodo(id) {
  const todoId = Number(id);

  if (Number.isNaN(todoId)) {
    console.log("올바른 ID를 입력해주세요.");
    return;
  }

  const todos = loadTodos();
  const index = findTodoIndexById(todos, todoId);

  if (index === -1) {
    console.log("해당 ID를 찾을 수 없습니다.");
    return;
  }

  const deletedTodo = todos[index];
  todos.splice(index, 1);
  saveTodos(todos);

  console.log(`ID ${todoId}번 항목이 삭제되었습니다: ${deletedTodo.content}`);
}

function updateTodo(id, newContent) {
  const todoId = Number(id);

  if (Number.isNaN(todoId)) {
    console.log("올바른 ID를 입력해주세요.");
    return;
  }

  if (!newContent || newContent.trim() === "") {
    console.log("새 Todo 내용을 입력해주세요.");
    return;
  }

  const todos = loadTodos();
  const index = findTodoIndexById(todos, todoId);

  if (index === -1) {
    console.log("해당 ID를 찾을 수 없습니다.");
    return;
  }

  todos[index].content = newContent.trim();
  saveTodos(todos);

  console.log(`ID ${todoId}번 항목이 수정되었습니다: ${todos[index].content}`);
}

function printUsage() {
  console.log("사용법:");
  console.log('  node todo.js add "할 일 내용"');
  console.log("  node todo.js list");
  console.log("  node todo.js done [ID]");
  console.log("  node todo.js delete [ID]");
  console.log('  node todo.js update [ID] "새 내용"');
}

function main() {
  const [, , command, ...args] = process.argv;

  switch (command) {
    case "add":
      addTodo(args.join(" "));
      break;

    case "list":
      listTodos();
      break;

    case "done":
      doneTodo(args[0]);
      break;

    case "delete":
      deleteTodo(args[0]);
      break;

    case "update":
      updateTodo(args[0], args.slice(1).join(" "));
      break;

    default:
      printUsage();
      break;
  }
}

main();