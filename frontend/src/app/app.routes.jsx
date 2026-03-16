import { createBrowserRouter } from 'react-router'


export const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Hello</h1>
  },
  {
    path: '/register',
    element: <h1>Register</h1>
  },
  {
    path: '/login',
    element: <h1>Login</h1>
  }
])