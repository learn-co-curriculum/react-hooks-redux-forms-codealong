# Creating Items with Redux

## Introduction

With this lesson, we will begin our journey in implementing the CRUD actions while
using the Redux pattern.

## Objectives

By the end of this lesson, you will be able to:

- Take user input from our **React** application and send information to **Redux**

## Our Goal

We'll build a form in **Redux** that allows us to create a list of todos. So
this is a form that would have only one input, for the name of the todo, and the
submit button.

## Create The Form in React

Okay, if you boot up the application (run `npm install && npm start`), you'll
see that there in the `./src/App.js` file we reference a createTodo form located
at `./src/components/todos/createTodo.js`. That's where we need to build our
form.

So in that file we want to change our component to look like the following:

```JavaScript
// ./src/components/todos/CreateTodo.js

import React, { Component } from 'react'

class CreateTodo extends Component {
  render() {
    return(
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
};

export default CreateTodo;
```

## Plan for Integrating into Redux

Now let's think about how we want to integrate this into **Redux**. Essentially,
upon submitting the form, we would like to dispatch the following action to the
store:

```JavaScript
{
  type: 'ADD_TODO',
  todo: todo
}
```

So if the user has typed in buy groceries, our action would look like:

```JavaScript
{
  type: 'ADD_TODO',
  todo: 'buy groceries'
}
```

But how do we get that text from the form's input? Well, we can use our normal
React trick of updating the _createTodo component's_ state whenever someone
types something into the form. Then, when the user clicks on the submit button,
we can grab that state, and call `store.dispatch({ type: 'ADD_TODO', todo: this.state })`. Ok, time to implement it. Step one will be updating the
component state whenever someone types in the form.

### 1. Create a Controlled Form Using State and an `onChange` Event Handler

Every time the input is changed, we want to change the state. To do this we
first add an event handler for every input that changes. So inside the
createTodo component, we change our render function to the following.

```JavaScript
// ./src/components/todos/createTodo

...

render(){
  return(
    <div>
      <form>
        <p>
          <label>add todo</label>
          <input type="text" onChange={(event) => this.handleChange(event)}/>
        </p>
        <input type="submit" />
      </form>
    </div>
  );
}

...
```

All this code does is say that every time the user changes the input field (that
is, whenever the user types something in) we should call our `handleChange()`
function (which we haven't written yet).

Okay, our code calls the `handleChange()` function each time the user types in
the input, but we still need to write that handleChange function. Let's start
with the old way, setting a state value:

```JavaScript
// ./src/components/todos/createTodo

...
constructor() {
  super();
  this.state = {
    text: '',
  };
}

handleChange(event) {
  this.setState({
    text: event.target.value
  });
};

render(){
  return(
    <div>
      <form>
        <p>
          <label>add todo</label>
          <input type="text" onChange={(event) => this.handleChange(event)}/>
        </p>
        <input type="submit" />
      </form>
    </div>
  );
}
...
```

Notice that we pass through the event, which comes from the `onChange` event
handler. The event's target is the input that was listening for the event (the
text field), and the value is the current value of that text field.

Currently, we're using class method syntax to define `handleChange()` on our
component. The JSX code within our `render()` method is particular to a specific
instance of the component, but, by default, **class methods are called the
context of the [prototype chain][], not an instance**. In order for `this` to
correctly reference _this_ specific instance of our component, we need to either
bind it (often done in the `constructor()`), or use an arrow function in our
`onChange` event handler. Because arrow functions don't define their own version
of `this`, they'll default to the context they are in.

We never intend for `handleChange()` to be used any other way. In modern
JavaScript, we are able to directly class assign properties instead of assigning
them inside a `constructor()`. This means that, instead of writing
`handleChange()` as a class method, we could declare it as a class property
and assign an arrow function to it:

```js
handleChange = event => {
	this.setState({
		text: event.target.value
	});
};
```

The result is that `handleChange()` will always be bound to the particular
instance of the component it is defined in.

```js
constructor() {
  super();
  this.state = {
    text: '',
  };
}

handleChange = (event) => {
  this.setState({
    text: event.target.value
  });
};

render(){
  return(
    <div>
      <form>
        <p>
          <label>add todo</label>
          <input type="text" onChange={(event) => this.handleChange(event)}/>
        </p>
        <input type="submit" />
      </form>
    </div>
  );
}
```

Now that `handleChange()` is defined using an arrow function, we can actually
write an even shorter `onChange` callback: `onChange={this.handleChange}`. In
this case, `this.handleChange` refers to the definition of a function that
takes in the event as an argument. No need for the `onChange` arrow function
callback anymore!

To make a completely controlled form, we will also need to set the `value`
attribute of our `input` element to `this.state.text`. This way, every key
stroke within `input` will call a `setState` from within `handleChange`, the
component will re-render and display the new value for `this.state.text`.

The _CreateTodo_ component should look like the following now:

```JavaScript
// ./src/components/todos/CreateTodo.js

import React, { Component } from 'react';

class CreateTodo extends Component {

  constructor() {
    super();
    this.state = {
      text: '',
    };
  }

  handleChange = event => {
    this.setState({
      text: event.target.value
    });
  }

  render() {
    return(
      <div>
        <form>
    	  <p>
      	    <label>add todo</label>
            <input
	      type="text"
	      onChange={this.handleChange} value={this.state.text}/>
          </p>
          <input type="submit" />
       </form>
       {this.state.text}
     </div>
   );
  }
};

export default CreateTodo;
```

**Note**: Inside the render function, we wrapped our form in a `div`, and then
at the bottom of that `div` we've added the line `{this.state.text}`. This isn't
necessary for functionality, but we do this just to visually confirm that we are
properly changing the state. If we see our DOM change with every character we
type in, we're in good shape.

It's on to step 2.

### 2. On Submission of Form, Dispatch an Action to the Store

Okay, so now we need to make changes to our form so that when the user clicks
submit, we dispatch an action to the store. Notice that a lot of the setup for
Redux is already done for you. Open up the `./src/index.js` file. There you'll
see the following:

```JavaScript
// ./src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import manageTodo from './reducers/manageTodo';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

let store = createStore(manageTodo);


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

Just below the `import` statements, you can see that we create the store using
`createStore`, provided by `redux`. Then, further down, we pass the store into
the `Provider`. This will allow us access when we _connect_ our components.

Ok, let's connect the CreateTodo. First, we want to import `connect` from
`react-redux` and modify our export statement:

```js
// ./src/components/todos/CreateTodo.js
import { connect } from 'react-redux';

...

export default connect(null, mapDispatchToProps)(CreateTodo);
```

In this component, we are not currently concerned with writing a
`mapStateToProps()` function (the first argument passed to `connect`) as this
component doesn't need any state. Since we only need to dispatch an action here
and we are not getting information from our store, we can use `null` instead of
`mapStateToProps` as the first argument.

Next, as we write out our `mapDispatchToProps()` function, we'll need to decide
on how to structure our data and the related action. The basic frame of the
function will look like the following:

```js
// ./src/components/todos/CreateTodo.js

const mapDispatchToProps = dispatch => {
  return {
    addTodo: () => dispatch(<some action>)
  }
}
```

On submission of the form in our component, we want to send the value we've
captured in the local state to be added to our **Redux** store. With the above
set up, `addTodo` becomes a function in props that is able take arguments.

```js
const mapDispatchToProps = dispatch => {
  return {
    addTodo: formData => dispatch(<some action>)
  }
}
```

From the Redux docs, we know that <some action> needs to be a plain javascript object
with a `type` key describing the type of action. We also need to include the data from
the form - in this case, we'll call that key 'payload'.

```js
const mapDispatchToProps = dispatch => {
  return {
    addTodo: formData => dispatch({ type: 'ADD_TODO', payload: formData })
  };
};
```

In our component, we could call something like `this.props.addTodo(this.state)`.
Since `this.state` is an object with only one property, `text`.

Now we need to update the **render()** function of the **CreateTodo** component
to call a callback on the submission of a form:

```JavaScript
// ./src/components/todos/CreateTodo.js

...

<form onSubmit={ event => this.handleSubmit(event) }>

...
```

The **handleSubmit()** function:

```JavaScript
// ./src/components/todos/CreateTodo.js

...

handleSubmit = event => {
  event.preventDefault();
  this.props.addTodo(this.state)
}

...
```

When `handleSubmit()` is called, whatever is currently stored in `this.state`
will be sent off to our reducer via our dispatched action. The fully
redux'd component ends up looking the like the following:

```js
import React, { Component } from 'react';
import { connect } from 'react-redux';

class CreateTodo extends Component {
  state = {
    text: ''
  };

  handleChange = event => {
    this.setState({
      text: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.addTodo(this.state);
  };

  render() {
    return (
      <div>
        <form onSubmit={event => this.handleSubmit(event)}>
          <p>
            <label>add todo</label>
              <input
                type="text"
                onChange={event => this.handleChange(event)}
                value={this.state.text}
              />
          </p>
          <input type="submit" />
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addTodo: formData => dispatch({ type: 'ADD_TODO', payload: formData })
  };
};

export default connect(
  null,
  mapDispatchToProps
)(CreateTodo);
```

Now, when the form is submitted, whatever the `this.state` is will be dispatched
to the reducer with the action.

#### Alternate `export` statement

Remember that, if not given any arguments, `connect` will return `dispatch` as a
prop to the component we're wrapping with `connect`. So an alternative way to
write the CreateTodo component could be:

```js
import React, { Component } from 'react';
import { connect } from 'react-redux';

class CreateTodo extends Component {
  state = {
    text: ''
  };

  handleChange = event => {
    this.setState({
      text: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.dispatch({ type: 'ADD_TODO', payload: this.state });
  };

  render() {
    return (
      <div>
        <form onSubmit={event => this.handleSubmit(event)}>
          <p>
            <label>add todo</label>
            <input
              type="text"
              onChange={event => this.handleChange(event)}
              value={this.state.text}
            />
          </p>
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default connect()(CreateTodo);
```

Now, if you start up the app and click the submit button, you should see your
actions via a `console.log` in our reducer.

### 3. Update State

So we are properly dispatching the action, but the state is not being updated.
What could be the problem? Well remember our crux of redux flow: Action ->
Reducer -> New State. So if the action is properly dispatched, then our problem
must lie with our reducer. Open up the file `./src/reducers/manageTodo.js`.

This function does nothing. Let's fix that. First we need to provide an initial
state. Because, we want our state to look like:

```JavaScript
state = {
  todos: [
    { text: 'buy groceries' },
    { text: 'watch netflix' },
  ]
}
```

Our initial state should be an empty list of todos, { todos: [] }.

Second, we need to concatenate a new todo each time we receive an action that
looks like `{ type: 'ADD_TODO', payload: { text: 'watch baseball' } }`. Ok, let's
do it.

```JavaScript
// ./src/reducers/manageTodo.js

export default function manageTodo(state = {
  todos: [],
}, action) {
  switch (action.type) {
    case 'ADD_TODO':

      console.log({ todos: state.todos.concat(action.payload.text) });

      return { todos: state.todos.concat(action.payload.text) };

    default:
      return state;
  }
}
```

Ok, once you change the `manageTodo()` reducer to the above function, open up
the console in your browser, and try clicking the submit button a few times. The
log will show that our reducer is concatenating new values every time the form
is submitted!

## Summary

There's a lot of typing in this section, but three main steps.

- First, we made sure the React component of our application was working. We did
  this by building a form, and then making sure that whenever the user typed in
  the form's input, the state was updated.

- Second, We connected the component to **Redux** and designed our `mapDispatchToProps`

- Third, we built our reducer such that it responded to the appropriate event
  and concatenated the payload into our array of todos.

[prototype chain]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
