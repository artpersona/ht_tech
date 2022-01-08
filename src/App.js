import "./App.css";
import Route from "./route";
import FirebaseProvider from "./shared/contexts/FirebaseContext";
import AuthProvider from "./shared/contexts/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";
function App() {
  return (
    <Router>
      <FirebaseProvider>
        <AuthProvider>
          <Route />
        </AuthProvider>
      </FirebaseProvider>
    </Router>
  );
}

export default App;
