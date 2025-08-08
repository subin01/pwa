'use client';

import { id, i, init, InstaQLEntity } from '@instantdb/react';

// Visit https://instantdb.com/dash to get your APP_ID :)
const APP_ID = '4a678083-214a-4c69-8482-3ae0dc593b77';

// Optional: Declare your schema!
const schema = i.schema({
  entities: {
    todos: i.entity({
      text: i.string(),
      done: i.boolean(),
      createdAt: i.number(),
    }),
  },
  rooms: {
    todos: {
      presence: i.entity({}),
    },
  },
});

type Todo = InstaQLEntity<typeof schema, 'todos'>;

const db = init({ appId: APP_ID, schema });
const room = db.room('todos');

function Todos() {
  // Read Data
  const { isLoading, error, data } = db.useQuery({ todos: {} });
  const { peers } = db.rooms.usePresence(room);
  const numUsers = 1 + Object.keys(peers).length;
  if (isLoading) {
    return;
  }
  if (error) {
    return <div className="text-red-500 p-4">Error: {error.message}</div>;
  }
  const { todos } = data;
  return (
    <div className="todos">
      <div className="todos__user-count">
        Number of users online: {numUsers}
      </div>
      <h2 className="todos__title">todos</h2>
      <div className="todos__container">
        <TodoForm todos={todos} />
        <TodoList todos={todos} />
        <ActionBar todos={todos} />
      </div>
      <div className="todos__realtime-note">
        Open another tab to see todos update in realtime!
      </div>
    </div>
  );
}

// Write Data
// ---------
function addTodo(text: string) {
  db.transact(
    db.tx.todos[id()].update({
      text,
      done: false,
      createdAt: Date.now(),
    })
  );
}

function deleteTodo(todo: Todo) {
  db.transact(db.tx.todos[todo.id].delete());
}

function toggleDone(todo: Todo) {
  db.transact(db.tx.todos[todo.id].update({ done: !todo.done }));
}

function deleteCompleted(todos: Todo[]) {
  const completed = todos.filter((todo) => todo.done);
  const txs = completed.map((todo) => db.tx.todos[todo.id].delete());
  db.transact(txs);
}

function toggleAll(todos: Todo[]) {
  const newVal = !todos.every((todo) => todo.done);
  db.transact(
    todos.map((todo) => db.tx.todos[todo.id].update({ done: newVal }))
  );
}

// Components
// ----------
function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 20 20">
      <path
        d="M5 8 L10 13 L15 8"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
      />
    </svg>
  );
}

function TodoForm({ todos }: { todos: Todo[] }) {
  return (
    <div className="todos__form">
      <button
        className="todos__toggle-all-btn"
        onClick={() => toggleAll(todos)}
        title="Toggle all todos"
        aria-label="Toggle all todos"
      >
        <div className="todos__chevron-icon">
          <ChevronDownIcon />
        </div>
      </button>
      <form
        className="todos__form-element"
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.input as HTMLInputElement;
          addTodo(input.value);
          input.value = '';
        }}
      >
        <input
          className="todos__input"
          autoFocus
          placeholder="What needs to be done?"
          type="text"
          name="input"
        />
      </form>
    </div>
  );
}

function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <div className="todos__list">
      {todos.map((todo) => (
        <div key={todo.id} className="todos__item">
          <div className="todos__checkbox-container">
            <div className="todos__checkbox-wrapper">
              <input
                type="checkbox"
                className="todos__checkbox"
                checked={todo.done}
                onChange={() => toggleDone(todo)}
                aria-label={`Mark "${todo.text}" as ${todo.done ? 'incomplete' : 'complete'}`}
                title={`Mark "${todo.text}" as ${todo.done ? 'incomplete' : 'complete'}`}
              />
            </div>
          </div>
          <div className="todos__text-container">
            {todo.done ? (
              <span className="todos__text todos__text--completed">
                {todo.text}
              </span>
            ) : (
              <span className="todos__text">{todo.text}</span>
            )}
          </div>
          <button
            className="todos__delete-btn"
            onClick={() => deleteTodo(todo)}
            title={`Delete "${todo.text}"`}
            aria-label={`Delete "${todo.text}"`}
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
}

function ActionBar({ todos }: { todos: Todo[] }) {
  return (
    <div className="todos__action-bar">
      <div>Remaining todos: {todos.filter((todo) => !todo.done).length}</div>
      <button
        className="todos__delete-completed-btn"
        onClick={() => deleteCompleted(todos)}
      >
        Delete Completed
      </button>
    </div>
  );
}

export default Todos;
