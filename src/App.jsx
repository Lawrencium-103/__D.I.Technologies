import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'

const About = lazy(() => import('./pages/About'))
const EduTech = lazy(() => import('./pages/EduTech'))
const AIHub = lazy(() => import('./pages/AIHub'))
const SSME = lazy(() => import('./pages/SSME'))
const Contact = lazy(() => import('./pages/Contact'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const Framework = lazy(() => import('./pages/Framework'))
const Research = lazy(() => import('./pages/Research'))
const SsmeEvidence = lazy(() => import('./pages/SsmeEvidence'))
const SsmeToolkit = lazy(() => import('./pages/SsmeToolkit'))
const ReportBuilder = lazy(() => import('./pages/ReportBuilder'))
const ReportsLibrary = lazy(() => import('./pages/ReportsLibrary'))
const OpenModels = lazy(() => import('./pages/OpenModels'))

import DITLoader from './components/DITLoader'

function RouteFallback() {
  return <DITLoader isFullPage={true} />
}

function GATracker() {
  const location = useLocation()
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_title: document.title,
      })
    }
  }, [location])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <GATracker />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/edutech" element={<EduTech />} />
            <Route path="/ai-hub" element={<AIHub />} />
            <Route path="/s-sme" element={<SSME />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/framework" element={<Framework />} />
            <Route path="/research" element={<Research />} />
            <Route path="/s-sme/evidence" element={<SsmeEvidence />} />
            <Route path="/s-sme/toolkit" element={<SsmeToolkit />} />
            <Route path="/report" element={<ReportBuilder />} />
            <Route path="/reports" element={<ReportsLibrary />} />
            <Route path="/open-models" element={<OpenModels />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
