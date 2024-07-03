import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const Login = React.lazy(() => import("./pages/Login"));
const Chat = React.lazy(() => import("./pages/Chat"));
const Groups = React.lazy(() => import("./pages/Groups"));


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/chat/:chatId" element={<Chat />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/login" element={<Login />} />

      </Routes>
    </Router>
  );
};

export default App;
