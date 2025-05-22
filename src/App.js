import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProspectingPreview from './pages/ProspectingPreview';
import Home from './components/Home';
import IndustryExpertise from './components/IndustryExpertise';
import ProspectingForm from './pages/ProspectingForm';
import PrepForm from './components/Prep/PrepForm';
import PostCallForm from './components/PostCall/PostCallForm';

// Stubs for upcoming modules
const Prospecting = () => <h2 style={{ padding: '40px' }}>🚧 Prospecting Intelligence – Coming Soon</h2>;
const PreCall = () => <h2 style={{ padding: '40px' }}>🚧 Pre-Call Preparation – Coming Soon</h2>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/industry" element={<IndustryExpertise />} />
        <Route path="/prospecting" element={<Prospecting />} />
        <Route path="/prospecting-preview" element={<ProspectingPreview />} />
        <Route path="/build-campaign" element={<ProspectingForm />} />
        <Route path="/pre-call" element={<PreCall />} />
        <Route path="/prep" element={<PrepForm />} />
        <Route path="/post-call" element={<PostCallForm />} />
        <Route path="/ask-alfred" element={<h2 style={{ padding: '40px' }}>🤖 Ask Alfred – Coming Soon</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
