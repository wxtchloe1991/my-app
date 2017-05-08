import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import jstz from 'jstz';
import moment from 'moment-timezone'
import {Provider} from 'react-redux'
function Square(props){
  return(
    <button className="square" onClick={() => props.onClick()}>
               {props.value}
    </button>
  );
}
class Board extends React.Component {

  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>;
  }
  render() {

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }


}

class Game extends React.Component {
  constructor(){
    super();
    this.state = {
      history : [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNExt : true
    }
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    const moves = history.map((step, move) => {
      const desc = move ? 'Move # ' + move : 'Game Start';
      return (<li key={move}> <a href="'#" onClick={() => this.jumpTo(move)}>{desc}</a></li>);
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
  jumpTo(step){
    this.setState({
        stepNumber : step,
        xIsNext: (step % 2) ? false : true,
      }
    );
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const xIsNext = this.state.xIsNext;
    squares[i]= xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat({squares : squares}),
      xIsNext : ! xIsNext,
      stepNumber: history.length})
  }
}

// ========================================


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}

const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};


function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    // this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}

class Calculator extends React.Component {

  constructor(props){
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature : '', scale : 'c'};
  }

  handleCelsiusChange(temperature){
    this.setState({scale : 'c', temperature : temperature});
  }

  handleFahrenheitChange(temperature){
    this.setState({scale : 'f', temperature : temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;
    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange}
        />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange}
        />
        <BoilingVerdict
          celsius={celsius}
        />
      </div>
    );
  }

}




// ReactDOM.render(
//   <Calculator/>,
//   document.getElementById('root')
// );


//Redux Tutorial EggHead Starts here
var Redux = require('redux');
import deepFreeze from 'deep-freeze';
import expect from 'expect'
const {createStore} = Redux;

const counter = (state = 0, action) => {
  switch(action.type){
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

const Counter = ({value, onIncrement, onDecrement}) => (
  <div>
   <h1>{value}</h1>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
  </div>
);

const creatStoreFromScratch = (reducer) => {
  let state;
  let listeners = []
  const getState = () => state;
  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  }
  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !==listener);
    }
  }
  dispatch({});
  return {getState, dispatch, subscribe}
}
// console.log(store.getState());
// store.dispatch({type : 'INCREMENT'});
// console.log(store.getState());


// document.addEventListener('click', () => {
//   store.dispatch({type : 'INCREMENT'});
// });


//Redux Part II : deep freeze
const addCount = (list) => {
  //list.push(0); //modify list
  //list.concat([0]);//return new list, =below
  return [...list, 0];
};

const testAddCounter = () => {
  const listBefore = [];
  const listAfter = [0];
  deepFreeze(listBefore);

  expect(addCount(listBefore)).toEqual(listAfter);
};


const removeCounter = (list, index) => {
    // list.splice(index, 1); //modify array
    // return list;
  // return list.slice(0, index).concat(list.slice(index + 1));//new array,=below
  return [...list.slice(0, index), ...list.slice(index + 1)]
}
const testRemoveCounter = () => {
  const listBefore = [0, 10, 20];
  const listAfter = [0, 20];
  deepFreeze(listBefore);
  expect(removeCounter(listBefore, 1)).toEqual(listAfter);
};

const incrementCounter = (list, index) => {
  // list[index] ++;
  // return list;
  // return list.slice(0, index).concat(list[index] + 1).concat(list.slice(index + 1));
  return [...list.slice(0, index), list[index] + 1, ...list.slice(index + 1)];
}
const testIncrementCounter = () => {
  const listBefore = [0,10,20];
  const listAfter = [0,11,20];
  deepFreeze(listBefore);
  expect(incrementCounter(listBefore, 1)).toEqual(listAfter);
};
// testAddCounter();
// testRemoveCounter();
// testIncrementCounter();
// console.log('all tests passed.');

//Redux Part III : Modify the value of a certain key

const toggleTodo = (todos, action) =>{
  // todo.completed = ! todo.completed;
  // return todo;
  // return {
  //   id : todo.id,
  //   text : todo.text,
  //   completed : ! todo.completed
  // };

  // return Object.assign({}, todo, {completed : !todo.completed});
  return todos.map((each) => {
    if (each.id !== action.id) {
      return each;
    } else {
      return {
        ...each, completed: !each.completed
      }
    }
  });
}

// console.log('all tests passed');

//Redux Part IV :
const todo = (state, action) => {
  switch(action.type){
    case 'ADD_TODO':
      return {
        id : action.id,
        text: action.text,
        completed : false
      };
    case 'TOGGLE_TODO':
      if(state.id !== action.id){
        return state;
      }
      return {...state, completed : ! state.completed}
    default :
      return state;
  }
};

const visibilityFilter = (
  state = 'SHOW_ALL', action
) => {
  switch(action.type){
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default :
      return state;
  }
};

const todos = (state = [], action) => {
  switch(action.type){
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

// const render = () => {
//   ReactDOM.render(<Counter value={store.getState()}
//                            onIncrement={() => {store.dispatch({type:'INCREMENT'})}}
//                            onDecrement={() => {store.dispatch({type:'DECREMENT'})}}/>,
//     document.getElementById('root'));
// }
// render();
const testAddTodo = () => {
  const stateBefeore = [];
  const action = {
    type : 'ADD_TODO',
    id : 0,
    text : 'Learn Redux'
  };

  const stateAfter = [
    {
      completed : false,
      id : 0,
      text : 'Learn Redux'
     }
  ];

  deepFreeze(stateBefeore);
  deepFreeze(action);
  expect(todos(stateBefeore, action)).toEqual(stateAfter);
};
const testToggleTodo = () => {
  const stateBefore = [
    {
      id : 0,
      text : 'Learn Redux',
      completed : false
    },{
      id : 1,
      text : 'Go Shopping',
      completed : false
    }
  ];

  const action = {
    type : 'TOGGLE_TODO',
    id : 1
  };

  const stateAfter = [{
    id : 0,
    text : 'Learn Redux',
    completed : false
  },{
    id : 1,
    text : 'Go Shopping',
    completed : true
  }];
  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(toggleTodo(stateBefore, action)).toEqual(stateAfter);
};


// testAddTodo();
// testToggleTodo();
// console.log('all tests passed.');

//Course 13
//retrive todo from todos
//Course 14


// const todoApp = (state = {}, action) => {
//   return {
//     todos : todos(state.todos, action),
//     visibilityFilter : visibilityFilter(state.visibilityFilter, action)
//   };
// };

//Equivalent to Avove:

const {combineReducers} = Redux;
// const todoApp = combineReducers({
//   todos : todos,
//   visibilityFilter: visibilityFilter
//   //state field name : reducer name
// });

//Equivalent to above
const todoApp = combineReducers({
  todos, visibilityFilter
  //eliminate key because key and value name are the same, use ES6 here
});

//Construct combineREduces from scratch
const combineReducersScratch = (reducers) => {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce(
      (nextState, key) => {
        nextState[key] = reducers[key](
          state[key], action
        );
        return nextState;
      },
      {}
    );
  }
};
console.log('Dispatching ADD_TODO');
// store.dispatch({
//   type : 'ADD_TODO',
//   id : 0,
//   text : 'Learn Redux'
// });

console.log('Current State:');
// console.log(store.getState());
console.log('-----------------------');

console.log('Dispatching ADD_TODO');
// store.dispatch({
//   type : 'ADD_TODO',
//   id : 1,
//   text : 'Go Shopping'
// });

console.log('Current State:');
// console.log(store.getState());
console.log('-----------------------');

console.log('Dispatching TOGGLE_TODO');
// store.dispatch({
//   type : 'TOGGLE_TODO',
//   id : 0
// });

console.log('Current State:');
// console.log(store.getState());
console.log('-----------------------');



console.log('Dispatching SET_VISIBILITY_FILTER');
// store.dispatch({
//   type : 'SET_VISIBILITY_FILTER',
//   filter : 'SHOW_COMPLETED'
// });
console.log('Current State:');
// console.log(store.getState());
console.log('-----------------------');

//Course 17
var nextTodoId = 2;
const addTodo = (text) => {
  return {
    type: 'ADD_TODO',
    id: nextTodoId ++,
    text
  }
}
const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
      filter
  }
}
const toggleTodo2 = (id) => {
  return {type: 'TOGGLE_TODO', id}
}
//extract action creator functions from the components can tell what actions our app can create, which is good for large app
const getVisibleTodos = (todos, filter) => {
  switch(filter){
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed);
  }
};
const Todo = ({
  onClick,
  completed,
  text
              }) => (
  <li onClick={onClick}
      style={{
        textDecoration: completed ? 'line-through' : 'none'
      }}
  >{text}</li>
);

const TodoList = ({
  todos,
  onTodoClick
                  }) => (
  <ul>
    {todos.map(todo =>
    <Todo
      key={todo.id}
      {...todo}
      onClick={() => onTodoClick(todo.id)}
    />)}
  </ul>
);

let AddToDo = ({dispatch}) => {
  let input;
  return (
    <div>
      <input ref={node => {
        input = node;
      }}/>
      <button
        onClick={() => {
          dispatch(addTodo(input.value))
          input.value = '';
        }
      }
      >Add Todo</button>
    </div>);
};

AddToDo = connect ( // only send dispatch
  // null,
  // disptach => {
  //   return {dispatch}
  // }    -> null, null //second null will still send dispatch
)(AddToDo)

const Link = ({active,children,onClick}) => {//presentational component
  if(active){
    return <span>{children}</span>;
  }
  return <a href="#"
            onClick={e=>{
              e.preventDefault();
              onClick();
              }}>{children}</a>;
};

const mapStateToLinkProps = (state, ownProps) => {
  return {
    active : ownProps.filter === state.visibilityFilter
  }
}

const mapDispatchToLinkProps = (dispatch, ownProps) => {
  return {
    onClick : () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  }
}
const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link)

// class FilterLink extends React.Component {//read props and store.getState()
//   //container component
//   componentDidMount() {
//     const {store} = this.context
//
//     this.unsubscribe = store.subscribe(() => this.forceUpdate());
//     //When the store state updates, we force the container object to update
//   }
//
//   componentWillUnmount() {
//     this.unsubscribe()
//   }
//
//   render() {
//     const {store} = this.context
//     const props = this.props;
//     const state = store.getState();
//     return (
//       //Delegate all the presentational work to Link Component, left only the job to be calculate the props
//       //After the actions are dispatched, store will remember the new state returned by the reducers, andcall every subsriber to the store
//       <Link active={props.filter === state.visibilityFilter}
//             onClick={() => {
//               store.dispatch({
//                 type: 'SET_VISIBILITY_FILTER',
//                 filter: props.filter
//               })
//             }}>{props.children}</Link>
//     );
//
//   }
// }
//
// FilterLink.contextTypes = {
//   store : React.PropTypes.object
// }
const Footer = () => (
  //FilterLInk is container component and it can be used inside a presentational component
  //without passing additional props to get the data from the store and specify the behavior, this keep
  //the Footer Component simple and decoupled from the data and the behavior that its child component need
  <p> Show {' '}
    <FilterLink filter='SHOW_ALL'> All </FilterLink>
    ,
    <FilterLink filter='SHOW_COMPLETED'> Completed </FilterLink>
    ,
    <FilterLink filter='SHOW_ACTIVE'> Active </FilterLink>
  </p>
);

const mapStateToTodoListProps = (state) => {
  return {
    todos: getVisibleTodos(
      state.todos,
      state.visibilityFilter
    )
  }
}

const mapDispatchToTodoListProps = (dispatch) => {
  return {
      onTodoClick: (id) => {dispatch(toggleTodo2(id))}
  }
}

import {connect} from 'react-redux'
const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList)

// class VisibleTodoList extends React.Component{
//   componentDidMount() {
//     const {store} = this.context
//     this.unsubscribe = store.subscribe(() => this.forceUpdate());
//     //When the store state updates, we force the container object to update
//   }
//
//   componentWillUnmount() {
//     this.unsubscribe()
//   }
//   render(){
//     const {store} = this.context
//     const props = this.props;
//     const state = store.getState();
//
//     return (
//       <TodoList
//         // todos={} go to mapStateToProps
//         // onTodoClick={} go to mapDispatchToProps
//       />
//     );
//
//   }
// }
//
// VisibleTodoList.contextTypes = {
//   store : React.PropTypes.object
// }

const TimeZone = () => {
  const timezone = jstz.determine();
  const zoneName = timezone.name();
  const timeWithTimeZone = moment().tz(zoneName).format('M/D/YYYY') + ' ' + moment().tz(zoneName).format('h:mm a') + ' ' + moment.tz(zoneName).zoneAbbr();
  return (
    <div>
      <p>{zoneName}</p>
      <p>{timeWithTimeZone}</p>
    </div>
  )
}
const TodoApp = () => (
      <div>
        <AddToDo />
        <VisibleTodoList />
        <Footer />
        <TimeZone />
      </div>
);


//Below are our Provider Component from scratch
// class Provider extends React.Component{
//   //This Provider will make its props available to any of its children, includes grandchildren
//   getChildContext(){
//     return {
//       store : this.props.store
//     }
//   }
//   render(){
//     return this.props.children;
//   }
// }
//
//
// Provider.childContextTypes = {
//   store : React.PropTypes.object
// }

const store = createStore(todoApp);
ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);
