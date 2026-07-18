import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

const Home = lazy(() => import('./pages/Home'))
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

function RouteFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-cream">
      <span className="eyebrow animate-pulse">Loading…</span>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
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
