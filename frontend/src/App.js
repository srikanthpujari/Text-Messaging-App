import "./App.css";
import HomePage from "./pages/HomePage";
import ChatsPage from "./pages/ChatsPage";
import { Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Route path="/" component={HomePage} exact />
      <Route path="/chats" component={ChatsPage} />
    </div>
  );
}

export default App;
