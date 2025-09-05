import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { NotesProvider } from './context/NotesContext.jsx';
import Navbar from './components/Navbar.jsx';
const NotesList = React.lazy(() => import('./components/NotesList.jsx'));
const NoteEditor = React.lazy(() => import('./components/NoteEditor.jsx'));
const NoteViewer = React.lazy(() => import('./components/NoteViewer.jsx'));
import Spinner from './components/Spinner.jsx';

function App() {
  return (
    <NotesProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={<div className="py-24 flex justify-center"><Spinner size="lg" /></div>}>
              <Routes>
                <Route path="/" element={<NotesList />} />
                <Route path="/new" element={<NoteEditor />} />
                <Route path="/edit/:id" element={<NoteEditor />} />
                <Route path="/note/:id" element={<NoteViewer />} />
                <Route path="/share/:id" element={<NoteViewer isShared={true} />} />
              </Routes>
            </Suspense>
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </NotesProvider>
  );
}

export default App;
