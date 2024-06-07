
import { Routes, Route, Navigate } from "react-router-dom";
import QApage from "./Pages/QApage";
import KeyInsights from "./Pages/Keyinsights";
import EntityRec from "./Pages/EntityRecog";
import QuestionGeneration from "./Pages/QuestionGeneration";
import Navbar from "./Components/Navbar";
import SendMessage from "./Pages/SendMessage";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";

export default function PageRoutes() {
    return (
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<QApage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='/register' element={<Register/>} />
          <Route path="/send" element={<SendMessage />} />
          <Route path="/KeyInsights" element={<KeyInsights />} />
          <Route path="/EntityRec" element={<EntityRec />} />
          <Route path="/QuestionGeneration" element={<QuestionGeneration />} />
        </Routes>
      </div>
    );
  }
  