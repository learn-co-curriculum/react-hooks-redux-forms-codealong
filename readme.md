Creating Items with Redux
==============

In this lesson, we'll begin our journey into implementing CRUD actions while using the Redux pattern.  By the end of this lesson, you will be able to:

  * Take user input from our React application and send information to Redux

## Our Goal

We'll build a form in Redux that allows us to create a list of todos.  So this is a form that would have only one input, for the name of the todo, and the submit button.  

# Create The Form in React

If you boot up the application, you'll see that in the `App.js` file we reference a `createTodo` form located in `components/todos/createTodo.js`.  That's where we need to build our form.

In that file, we change our `render` function to look like the following:

```javascript

	render(){
		return(
			<form>
				<p>
					<label>add todo</label>
					<input type="text" />
				</p>
				<input type="submit" />
			</form>
		)
	}

```

# Integrating Redux

Now let's think about how we want to integrate this form functionality into Redux.  Essentially, upon submitting the form, we would like to dispatch the following action to the store:

```javascript

	{type: 'ADD_TODO', payload: todo}.  

```

If the user has typed in `buy groceries`, our action would look like:

```javascript

	{type: 'ADD_TODO', payload: 'buy groceries'}
	
```

But how do we get that text from the form's input?  We can use our standard React trick of updating the *`createTodo` component's* state whenever someone types something into the form.  Then, when the user clicks on the submit button, we can grab that state, and call `store.dispatch({type: 'ADD_TODO', payload: this.state})`.  Let's implemement it! Step one will be updating the component state whenever someone types in the form.

1. Update component state by adding an `onChange` event handler

Every time the input is changed, we want to change the state.  To do this we first add an event handler for every input that changes. Inside the `createTodo` component, we change our `render` function to the following.

```javascript

	// src/components/todos/createTodo
	...
	render(){
		return(
			<div>
				<form>
					<p>
						<label>add todo</label>
						<input type="text" onChange={this.handleChange.bind(this)}/>
					</p>
					<input type="submit" />
				</form>
				{this.state.text}
			</div>
		)
	}

```

All this code does is say that every time the user changes the input field (that is, whenever she types something in) we should call our `handleChange` function (which we didn't write yet).  

	> *Why bind(this) ?*
	>
	> Notice that our code says `onChange={this.handleChange.bind(this)}`.  The `bind(this)` is because in React, if we call a callback function like `handleChange` each time a user types in something, the context inside that callback function will be global.  We prevent that from happening by binding the function to `this`. This works because `handleChange` is bound to `this` when the component is first defined.  And at that moment, the context (that is, `this`) is the current component.  Then by binding the callback function to the current component, we say that whenever this callback `handleChange` gets called, ensure that inside of it, `this` is that `createTodo` component.

Ok, our code calls the `handleChange` callback each time the user types in the input, but we still need to write that `handleChange` method.  We add a method called `handleChange` to set the state every time it is called from the `onChange` event.

```javascript
	// src/components/todos/createTodo

	handleChange(event){
		this.setState({text: event.target.value})
	}
```

Notice that we pass through the event, which comes from the `onChange` event handler.  The event's target is the input that was listening for the event (the text field), and the value is the current value of that text field.  So in other words, if the user types in 'hello', the last time the `handleChange` method is called, the event target's value will be 'hello', and the handle change method sets that as the state.  

Now our state will update appropriately each time a user types something into the form.  The only other thing to do is to set up the initial state of the component in the constructor.

```javascript

//src/components/todos/createTodo

constructor(props){
	super(props)
	this.state = {text: ''}
}

```

Now the entire component should like the following.

```javascript

	import React, { Component } from 'react'

	class CreateTodo extends Component {
		constructor(props){
			super(props)
			this.state = {text: ''}
		}
		handleChange(event){
			this.setState({text: event.target.value})
		}
		handleSubmit(event){
			event.preventDefault()
			this.props.store.dispatch({type: 'ADD_TODO', payload: this.state})
		}
		render(){
			return(
				<div>
					<form onSubmit={this.handleSubmit.bind(this)}>
						<p>
							<label>add todo</label>
							<input type="text" onChange={this.handleChange.bind(this)}/>
						</p>
						<input type="submit" />
					</form>
					{this.state.text}
				</div>
			)
		}
	}

	export default CreateTodo;
```
 
Notice inside the `render` function, we wrapped our form in a `div`, and then at the bottom of that `div` we added the line `{this.state.text}`.  We do this just to ensure that we are properly changing the state.  If we see our DOM change with every character we type in, we're in good shape.  

2. On submission of the form, dispatch an action to the store

Now we need to make changes to our form so that when the user clicks submit, we dispatch an action to the store.  Notice that a lot of the setup for Redux is already done for you.  Open up the `index.js` file.  There you'll see the following:

```javascript

	let store = createStore(manageTodo)

	export function render(){
		ReactDOM.render(
			<App store={store} />,
			document.getElementById('root')
		);
	}

	store.dispatch({type: '@@INIT'})
```

In the top line, you can see that we create the store with a reducer.  Then, further down, we pass through the store as a prop to our app.  Our `App` component passes the store as a prop down to the `CreateTodo` component.  So if you put a `debugger` right after the line render in `CreateTodo`, and type in `this.props` in the code, you can see we have access to the store as one of the props.

Why did we pass our store in as one of the props?  We did it so that on submit we can call `this.props.store.dispatch({type: 'ADD_TODO', payload: this.state})`, and send our store with our component's state.  

Ok, let's implement this -- it will make more sense as we move along.  First, we update the `render` function of the `CreateTodo` component to call a callback on the submission of a form:

```javascript

	...
	<form onSubmit={this.handleSubmit.bind(this)}>
	...

```

Second, we write a function in the `CreateTodo` component that dispatches an action upon being called.

```javascript

	handleSubmit(event){
		event.preventDefault()
		this.props.store.dispatch({type: 'ADD_TODO', payload: this.state})
	}

```

Notice that our payload is `this.state`. This is because our state always holds the value of our input, and we want to pass that value into our dispatched action.  So for example, if a user types in "add groceries", we will be dispatching, `{type: 'ADD_TODO', payload: {text: "add groceries"}}`.

Click the submit button!  Click the submit button!  Yea, nothing happens.  At least nothing shows up on the page.  But open up your browser's console.  You'll see that we are still logging our actions and that we are dispatching an action called `ADD_TODO`.  If you inspect that action, you should see your input value in the payload.  Things are happening, but our state is not being updated and we are not displaying those updates.  So first, let's make sure that each time we dispatch an action we update the state.

3. Update the state

So we are properly dispatching the action, but the state is not being updated.  What could be the problem?  Well, remember the crux of Redux flow: `Action -> Reducer -> New State`.  So if the action is properly dispatched, then our problem must be in our reducer. Open up the file `reducers/manageTodo.js`.  

This function does nothing.  Let's fix that.  First we need to provide an initial state.  Because, we want our state to look like `{todos: [{text: 'buy groceries'}, {text: 'watch netflix'}]}`, our initial state should be an empty list of todos, `{todos: []}`.  

Second, we need to concatenate a new todo each time we receive an action that looks like `{type: 'ADD_TODO', payload: {text: 'watch baseball'}}`.  Let's do it.

```javascript

	//reducers/manageTodo.js

	export default function manageTodo(state = {todos: []}, action){
		switch (action.type) {
			case 'ADD_TODO':
				return {todos: state.todos.concat(action.payload)}
			default:
				return state;
		}
	}

	store.dispatch({type: 'ADD_TODO', payload: {text: 'watch baseball'}})
		-> {todos: [{text: 'watch baseball'}]}

```

Ok, once you change the `manageTodo` reducer to the above function, open up the console in your browser, and try clicking the submit button again.  Ok, our state is now updating!  The only thing left is to display this state on the page as a list of elements on the page.  We already did a ton here, so we'll leave that to the next section.

## Summary

There's a lot of typing in this section, but there are just three main steps.  First, we made sure the React component of our application was working.  We did this by building a form, and then making sure that whenever the user typed in the form's input, the state was updated.  Once we got React working, we needed to connect it to Redux.  We connected Redux by passing through our store object as a prop, and then dispatching an action every time the user submitted the form.  Finally, we built our reducer such that it responded to the appropriate event and concatenated the payload into our array of todos.  In the next section we'll display our state on the page.  That section is a bit of a review, so feel free to finish this application up on your own after a well-deserved break!
