import Route from "./route";
import FirebaseProvider from "./shared/contexts/FirebaseContext";
import AuthProvider from "./shared/contexts/AuthContext";
import AppProvider from "./shared/contexts/AppContext";
import { BrowserRouter as Router } from "react-router-dom";
function App() {
  return (
    <Router>
      <FirebaseProvider>
        <AuthProvider>
          <AppProvider>
            <Route />
          </AppProvider>
        </AuthProvider>
      </FirebaseProvider>
    </Router>
  );
}

export default App;
