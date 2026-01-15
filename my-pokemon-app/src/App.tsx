// src/App.tsx
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import PokemonDetailPage from './pages/PokemonDetailPage';
import WelcomePage from './pages/WelcomePage';
import NotFoundPage from './pages/NotFoundPage';
import CreationPage from './pages/CreationPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<WelcomePage/>}/>
                <Route path="/pokemon/:id" element={<PokemonDetailPage/>}/>
                <Route path="/home" element={<HomePage/>}/>
                <Route path="*" element={<NotFoundPage/>}/>
                <Route path="create" element={<CreationPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
