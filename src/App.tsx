import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'

/**
 * Route registry — add new pages here, nothing else changes.
 *
 * Future routes (uncomment as features are built):
 *   { path: '/blog',           lazy: () => import('./pages/Blog') },
 *   { path: '/blog/:slug',     lazy: () => import('./pages/BlogPost') },
 *   { path: '/store',          lazy: () => import('./pages/Store') },
 *   { path: '/store/:slug',    lazy: () => import('./pages/Product') },
 *   { path: '/community',      lazy: () => import('./pages/Community') },
 *   { path: '/tools',          lazy: () => import('./pages/Tools') },
 *   { path: '/login',          lazy: () => import('./pages/Login') },
 *   { path: '/account',        lazy: () => import('./pages/Account') },
 */
const router = createBrowserRouter([
  { path: '/', element: <Home /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
