import { Route, Routes } from "react-router-dom";
// @ts-ignore
import "./App.css";
import Welcome from "./pages/Welcome/Welcome";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Welcome />} />
        </Routes>
    );
}

export default App;
