import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Create from "./components/Create";
import Update from "./components/Update";
import Home from "./components/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
function App() {
  return (
    <Router>
      <Header></Header>
      <Switch>
        <Route path="/update">
          <Update />
        </Route>
        <Route path="/create">
          <Create />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
      <Footer></Footer>
    </Router>
  );
}

export default App;
