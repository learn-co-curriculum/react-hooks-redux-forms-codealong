# Creating Items with Redux

## Learning Goals

- Dispatch actions to the Redux store from a React component
- Update state in Redux based on an action

## Introduction

With this lesson, we will begin our journey in implementing the CRUD actions
while using the Redux pattern.

## Our Goal

We'll build a form in Redux that allows us to create a list of todos. This is a
form that would have only one input, for the name of the todo, and the submit
button.

## Create The Form in React

If you boot up the application (run `npm install && npm start`), you'll see that
there in the `src/App.js` file we reference a `CreateTodo` form located at
`src/features/todos/CreateTodo.js`. That's where we need to build our form.

So in that file we want to change our component to look like the following:

```jsx
// ./src/features/todos/CreateTodo.js

import React from "react";

function CreateTodo() {
  return (
    <div>
      <form>
        <p>
          <label>add todo</label>
          <input type="text" />
        </p>
        <input type="submit" />
      </form>
    </div>
  );
}

export default CreateTodo;
```

## Plan for Integrating into Redux

Let's think about how we want to integrate this into Redux. Upon submitting the
form, we would like to dispatch the following action to the store:

```js
const action = {
  type: "todos/todoAdded",
  payload: todo,
};
```

If the user has typed in buy groceries, our action would look like:

```js
const action = {
  type: "todos/todoAdded",
  payload: "buy groceries",
};
```

How do we get that text from the form's input? Well, we can use our normal React
trick of updating the `CreateTodo` component's state whenever someone types
something into the form. Then, when the user clicks on the submit button, we can
grab that state, and call:

```js
dispatch({ type: "todos/todoAdded", payload: text });
```

Time to implement it! Step one will be updating the component state whenever
someone types in the form.

### 1. Create a Controlled Form

Every time the input is changed, we want to change the state. To do this we
first add an event handler for every input that changes. Inside the `CreateTodo`
component, we change our returned JSX to the following:

```jsx
// ./src/features/todos/CreateTodo.js
function CreateTodo() {
  return (
    <div>
      <form>
        <p>
          <label>add todo</label>
          <input type="text" onChange={handleChange} />
        </p>
        <input type="submit" />
      </form>
    </div>
  );
}
```

All this code does is say that every time the user changes the input field (that
is, whenever the user types something in) we should call our `handleChange()`
function (which we haven't written yet).

Our code calls the `handleChange()` function each time the user types in the
input, but we still need to write that `handleChange` function. Let's start with
the old way, setting a state value:

```jsx
// ./src/features/todos/CreateTodo.js
import React, { useState } from "react";

function CreateTodo() {
  const [text, setText] = useState("");

  function handleChange(event) {
    setText(event.target.value);
  }

  return (
    <div>
      <form>
        <p>
          <label>add todo</label>
          <input type="text" onChange={handleChange} />
        </p>
        <input type="submit" />
      </form>
    </div>
  );
}
```

To make a completely controlled form, we will also need to set the `value`
attribute of our `input` element to our `text` state variable. This way, every
key stroke within `input` will call a `setText` from within `handleChange`, the
component will re-render and display the new value for `text`.

The `CreateTodo` component should look like the following now:

```jsx
// ./src/features/todos/CreateTodo.js
import React, { useState } from "react";

function CreateTodo() {
  const [text, setText] = useState("");

  function handleChange(event) {
    setText(event.target.value);
  }

  return (
    <div>
      <form>
        <p>
          <label>add todo</label>
          <input type="text" onChange={handleChange} value={text} />
        </p>
        <input type="submit" />
      </form>
      <p>Form Text: {text}</p>
    </div>
  );
}

export default CreateTodo;
```

**Note**: Inside the returned JSX, we wrapped our form in a `div`, and then at
the bottom of that `div` we've added a `<p>` tag to display the text from state.
This isn't necessary for functionality, but we do this just to visually confirm
that we are properly changing the state. If we see our DOM change with every
character we type in, we're in good shape.

It's on to step 2.

### 2. Handle Form Submit and Dispatch an Action

We need to make changes to our form so that when the user clicks submit, we
dispatch an action to the store. Notice that a lot of the setup for Redux is
already done for you. Open up the `./src/index.js` file. There you'll see the
following:

```jsx
// ./src/index.js
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

Our application is wrapped in the `Provider` component from `react-redux`, which
allows us to access our Redux store from any component we like.

Let's give the `CreateTodo` component a way to update the store. We'll want to
import `useDispatch`, as well as our action creator:

```js
// ./src/features/todos/CreateTodo.js
import { useDispatch } from "react-redux";
import { todoAdded } from "./todosSlice";

function CreateTodo() {
  const dispatch = useDispatch();
  // ...
}
```

On submission of the form in our component, we want to send the value we've
captured in the local state to be added to our Redux store by dispatching the
action.

Now we need to update the `CreateTodo` component to call a callback on the
submission of a form:

```jsx
// ./src/features/todos/CreateTodo.js

<form onSubmit={handleSubmit}>
```

The `handleSubmit()` function:

```js
// ./src/features/todos/CreateTodo.js

function handleSubmit(event) {
  event.preventDefault();
  dispatch(todoAdded(text));
}

// ...
```

When `handleSubmit()` is called, whatever is currently stored in `text` will be
sent off to our reducer via our dispatched action. The full component ends up
looking the like the following:

```jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { todoAdded } from "./todosSlice";

function CreateTodo() {
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  function handleChange(event) {
    setText(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    dispatch(todoAdded(text));
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>
          <label>add todo</label>
          <input type="text" onChange={handleChange} value={text} />
        </p>
        <input type="submit" />
      </form>
      <p>Form Text: {text}</p>
    </div>
  );
}

export default CreateTodo;
```

Now, when the form is submitted, whatever the `text` is will be dispatched to
the reducer with the action.

### 3. Update State

We are properly dispatching the action, but the state is not being updated. What
could be the problem? Well remember our crux of Redux flow:

```txt
Action -> Reducer -> New State
```

If the action is properly dispatched, our problem must lie with our reducer.
Open up the file `./src/features/todos/todoSlice.js`.

There is a `todoAdded` method in our reducer, but currently it does nothing:

```js
  reducers: {
    todoAdded(state, action) {
      // update meeee
    },
  },
```

In this function, you'll want to add the new todo from the action into state.
Normally, we'd have to worry about creating a new state without mutating state.
**However**, since we're using the `createSlice` function from Redux Toolkit to
set up our reducer, we can just push the new todo into our array!

```js
todoAdded(state, action) {
  // using createSlice lets us mutate state!
  state.entities.push(action.payload);
},
```

Once you change the `todoAdded()` reducer to the above function, open up the
Redux DevTools in your browser, and try clicking the submit button a few times.
The DevTools will show that our reducer is adding new values every time the form
is submitted!

## Conclusion

There's a lot of typing in this section, but three main steps.

- First, we made sure the React component of our application was working. We did
  this by building a form, and then making sure that whenever the user typed in
  the form's input, the state was updated.
- Second, we connected the component to Redux by importing the `useDispatch`
  hook, along with the action creator
- Third, we built our reducer such that it responded to the appropriate event
  and concatenated the payload into our array of todos.
