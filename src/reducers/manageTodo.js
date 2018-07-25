export default function manageTodo(state = {
  todos: [],
}, action) {

  console.log("reducer received this action:", action);

  return state;
}
