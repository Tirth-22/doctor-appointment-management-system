import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('main.jsx starting...');

const root = document.getElementById('root')
console.log('Root element found:', !!root, root)

if (!root) {
  console.error('FATAL: Root element not found!');
  document.body.innerHTML = '<h1 style="color: red; padding: 20px; font-size: 24px;">FATAL ERROR: Root element not found!</h1>'
} else {
  try {
    console.log('Creating React root...');
    const reactRoot = ReactDOM.createRoot(root)
    console.log('React root created');
    
    console.log('Rendering App component...');
    reactRoot.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
    console.log('App component rendered successfully');
  } catch (error) {
    console.error('Error during React rendering:', error);
    document.body.innerHTML = `<h1 style="color: red; padding: 20px;">React Render Error: ${error.message}</h1>`
  }
}

