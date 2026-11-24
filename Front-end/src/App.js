import './App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom';

import NavBar from './components/navbar';
import Home from './pages/home';
import Produtos from './pages/produtos';

function App() {
    return (
        <div className="App">
            <Router>
                <NavBar />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/produtos" element={<Produtos />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;