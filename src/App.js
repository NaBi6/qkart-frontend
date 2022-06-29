import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import {Route, Switch} from "react-router-dom"

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/register">
           <Register /> 
        </Route>
      </Switch>
          
    </div>
  );
}

export default App;
