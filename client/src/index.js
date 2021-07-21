import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import 'antd/dist/antd.css';
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers';



const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore)
//원래는 createStore만 해서 스토어를 리덕스에서 생성시키는 것이지만 그냥 store는 객체밖에 못받기때문에
//funtion과 promise도 받을 수 있게applyMiddleware를 함께 넣어주는것
//이렇게 createStoreWithMiddleware 스토어를 완성

ReactDOM.render(
  <Provider
      store={createStoreWithMiddleware(Reducer,
          window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()//익스텐션
      )}
  >
      <App />
  </Provider>
  , document.getElementById('root'));

  reportWebVitals();



