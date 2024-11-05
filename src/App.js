import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import Login from './components/Login';
import TodoPage from './components/TodoPage';
import store from './redux/store';
import { SnackbarProvider } from './context/SnackbarContext';

function App() {
    return (
        <Provider store={store}>
             <SnackbarProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/todos" element={<TodoPage />}/>
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </Router>
             </SnackbarProvider>
          
        </Provider>
    );
}

export default App;
