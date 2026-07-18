import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import EduTech from './pages/EduTech'
import AIHub from './pages/AIHub'
import SSME from './pages/SSME'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Framework from './pages/Framework'
import Research from './pages/Research'
import SsmeEvidence from './pages/SsmeEvidence'
import SsmeToolkit from './pages/SsmeToolkit'
import ReportBuilder from './pages/ReportBuilder'
import ReportsLibrary from './pages/ReportsLibrary'
import OpenModels from './pages/OpenModels'

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}
