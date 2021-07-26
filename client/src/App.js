import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  //Link
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import Auth from './hoc/auth'

function App() {
  return(
  <Router>
  <div>
    <Switch>
    <Route exact path="/" component={Auth(LandingPage, null )  } />
      {/* LandingPage가 hoc/auth.js에서 지정한 specificComponent를 말함 */
        /**
         *  2번째 인자인 option의 종류
         *  1. null: 아무나 출입이 가능한 페이지
         *  2. true: 로그인한 유저만 출입이 가능한 페이지
         *  3. false: 로그인한 유저는 출입이 불가능한 페이지
         * 
         *  */
      
      }
     <Route exact path="/login" component={Auth(LoginPage, false) } />
     <Route exact path="/register" component={Auth(RegisterPage, false)} />
    </Switch>
  </div>
</Router>
  )}


export default App;


