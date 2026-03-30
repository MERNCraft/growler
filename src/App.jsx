/**
 * App.jsx
 */

import { HashRouter as Router } from 'react-router-dom'
import { GrowlProvider } from './GrowlContext';
import { RouteProvider } from './RouteContext';
import Routing from './Routing';


export function App() {
  return (
    <Router>
      <GrowlProvider>
        <RouteProvider>
          <Routing />
        </RouteProvider>
      </GrowlProvider>
    </Router>
  );
}
