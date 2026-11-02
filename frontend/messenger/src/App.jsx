import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Chat from "./pages/chat";
import Admin from "./pages/admin";
import OAuthCallback from "./pages/oAuthCallback";

function App() {
return ( <BrowserRouter> <Routes>
<Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/home" element={<Home />} />
    <Route path="/chat" element={<Chat />} />
    <Route path="/admin" element={<Admin />} />
    <Route path="/oauth/callback" element={<OAuthCallback />} />
  </Routes>
</BrowserRouter>
);
}

export default App;
