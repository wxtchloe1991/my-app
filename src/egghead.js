/**
 * Created by chloewang on 5/2/17.
 */
var Redux = require('redux');
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

const {createStore} = Redux;
const store = createStore(counter);
console.log(store.getState());
store.dispatch({type : 'INCREMENT'});
console.log(store.getState());

store.subscribe(() => {
  document.body.innerText = store.getState();
  }
);

document.addEventListener('click', () => {
  store.dispatch({type : 'INCREMENT'});
});