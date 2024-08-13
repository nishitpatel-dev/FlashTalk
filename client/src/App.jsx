import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute";
import Loader from "./components/layout/Loaders";
import axios from "axios";
import { server } from "./constants/config";
import { useDispatch, useSelector } from "react-redux";
import { userDoesNotExist } from "./redux/reducers/auth";
import { Toaster } from "react-hot-toast";

const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const Login = React.lazy(() => import("./pages/Login"));
const Chat = React.lazy(() => import("./pages/Chat"));
const Groups = React.lazy(() => import("./pages/Groups"));
const Error = React.lazy(() => import("./pages/Error"));
const AdminLogin = React.lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = React.lazy(() => import("./pages/admin/Dashboard"));
const UserManagement = React.lazy(() => import("./pages/admin/UserManagement"));
const MessageManagement = React.lazy(() =>
  import("./pages/admin/MessageManagement")
);
const ChatManagement = React.lazy(() => import("./pages/admin/ChatManagement"));

const App = () => {
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {        
        dispatch(userDoesNotExist());
      });

    return () => {};
  }, []);

  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<ProtectRoute user={user} />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/chat/:chatId" element={<Chat />} />
          </Route>

          <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
          />

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/chats" element={<ChatManagement />} />
          <Route path="/admin/messages" element={<MessageManagement />} />

          <Route path="*" element={<Error />} />
        </Routes>
      </Suspense>

      <Toaster position="top-center" />
    </Router>
  );
};

export default App;
