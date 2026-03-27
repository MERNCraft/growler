/**
 * 01-SimplyLazy/App.jsx
 */

import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import { GrowlProvider } from './GrowlContext';
import Frame from './Frame';
import StartGrowl from './StartGrowl';
import Page2 from './Page2';


export function App() {
  return (
    <Router>
      <GrowlProvider>
        <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Frame />} >
              <Route index element={<StartGrowl />} />
              <Route path="page2" element={<Page2 />} />
            {/* REDIRECT FOR UNLISTED PUBLIC PATHS */}
            <Route path="*" element={
              <Navigate
                to="/"
                replace={true}
              />}
            />
          </Route>
        </Routes>
      </GrowlProvider>
    </Router>
  );
}
