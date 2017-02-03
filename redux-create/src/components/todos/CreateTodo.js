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
