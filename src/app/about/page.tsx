// app/about/page.tsx - About page
import { Metadata } from 'next'
import { GraduationCap, Brain, Stethoscope, Code } from 'lucide-react'
import NavLink from '@/components/NavLink'

export const metadata: Metadata = {
  title: 'About - Cameron Brady',
  description: 'Learn about Cameron Brady\'s journey from Cornell CS graduate to machine learning researcher focused on computational neuroscience.',
}

export default function AboutPage() {
  return (
    <div className="pt-20 pb-16 min-h-screen bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-4">
              About Cameron
            </h1>
            <p className="text-xl text-slate-600">
              Bridging the gap between AI research and clinical medicine
            </p>
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-8 border border-slate-200">
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">My Journey</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed mb-4">
                    I'm a Cornell University Computer Science graduate with a passion for leveraging 
                    artificial intelligence to solve complex problems in healthcare and neuroscience. 
                    My work focuses on developing machine learning solutions for early detection of 
                    neurological disorders, particularly Parkinson's disease.
                  </p>
                  
                  <p className="text-slate-600 leading-relaxed mb-4">
                    Currently, I'm working on groundbreaking research that uses vocal biomarkers 
                    and machine learning algorithms to detect Parkinson's disease in its early stages. 
                    This work represents the intersection of my technical expertise and my long-term 
                    goal of becoming a neurosurgeon.
                  </p>
                  
                  <p className="text-slate-600 leading-relaxed">
                    My ultimate vision is to bridge the gap between cutting-edge AI research and 
                    clinical practice, bringing innovative technological solutions directly to 
                    patient care and improving outcomes for neurological disorders.
                  </p>
                </div>
              </div>
              
              {/* Skills & Expertise */}
              <div className="bg-white rounded-xl p-8 border border-slate-200">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6">Skills & Expertise</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-slate-700 mb-3">Machine Learning</h3>
                    <div className="space-y-2">
                      {['Deep Learning', 'Computer Vision', 'NLP', 'Signal Processing', 'Ensemble Methods'].map((skill) => (
                        <span key={skill} className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm mr-2 mb-2">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-slate-700 mb-3">Development</h3>
                    <div className="space-y-2">
                      {['Python', 'TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL'].map((skill) => (
                        <span key={skill} className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mr-2 mb-2">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-slate-700 mb-3">Research Tools</h3>
                    <div className="space-y-2">
                      {['TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Jupyter'].map((skill) => (
                        <span key={skill} className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm mr-2 mb-2">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-slate-700 mb-3">Medical Knowledge</h3>
                    <div className="space-y-2">
                      {['Neuroscience', 'Neuroanatomy', 'Medical Imaging', 'Biostatistics'].map((skill) => (
                        <span key={skill} className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm mr-2 mb-2">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Education */}
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="text-blue-600" size={24} />
                  <h3 className="text-lg font-semibold text-slate-800">Education</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-slate-700">Cornell University</p>
                    <p className="text-sm text-slate-600">Bachelor of Science</p>
                    <p className="text-sm text-slate-600">Computer Science</p>
                  </div>
                </div>
              </div>
              
              {/* Current Focus */}
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="text-purple-600" size={24} />
                  <h3 className="text-lg font-semibold text-slate-800">Current Focus</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">• Parkinson's disease detection research</p>
                  <p className="text-sm text-slate-600">• Vocal biomarker analysis</p>
                  <p className="text-sm text-slate-600">• Medical school preparation</p>
                  <p className="text-sm text-slate-600">• AI in healthcare applications</p>
                </div>
              </div>
              
              {/* Future Goals */}
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <Stethoscope className="text-green-600" size={24} />
                  <h3 className="text-lg font-semibold text-slate-800">Future Goals</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">• Neurosurgery residency</p>
                  <p className="text-sm text-slate-600">• AI-assisted surgical techniques</p>
                  <p className="text-sm text-slate-600">• Clinical research integration</p>
                  <p className="text-sm text-slate-600">• Patient outcome improvement</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Call to action */}
          <div className="text-center">
            <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                Let's Connect
              </h2>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                I'm always interested in discussing research opportunities, collaboration possibilities, 
                or innovative applications of AI in healthcare.
              </p>
              <NavLink
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Get In Touch
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}