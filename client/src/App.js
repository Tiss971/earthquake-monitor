import React from 'react';
import Todo from './components/Todo';
import ResponsiveAppBar from './components/AppBar';
import './App.css';


const App = () => {

  return (
    <div className="App">
      <ResponsiveAppBar />
      <Todo />
    </div>
  );
};

export default App;