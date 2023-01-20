import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
    Home,
    About,
    Header,
} from "./components";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <BrowserRouter>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                    </Routes>
                </BrowserRouter>
            </header>
        </div>
    );
}

export default App;
