import React from 'react'
import ReactDOM from 'react-dom';
import {createRoot} from 'react-dom/client'
import './style.css'
import App from './App'
import  { MyNewContext, NewProvider } from './MyProvider';


/*
ReactDOM.render(
    <newProvider>
        <App />
    </newProvider>,
    document.getElementById('root')
)
*/



const container = document.getElementById('root')
const root = createRoot(container)

root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)
