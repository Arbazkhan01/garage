import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, X, ZoomIn, CheckCircle2, ArrowLeft, ArrowRight, Shield } from 'lucide-react';
import { GALLERY_PROJECTS } from '../data/automotiveData';
import { GalleryProject } from '../types';

export const GallerySection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<GalleryProject | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', 'Engine Work', 'Brake Service', 'Diagnostics', 'Detailing', 'Workshop Facility'];

  const filteredProjects = filterCategory === 'all'
    ? GALLERY_PROJECTS
    : GALLERY_PROJECTS.filter(p => p.category === filterCategory);

  const handleNextProject = () => {
    if (!selectedProject) return;
    const currentIndex = GALLERY_PROJECTS.findIndex(p => p.id === selectedProject.id);
    const nextIndex = (currentIndex + 1) % GALLERY_PROJECTS.length;
    setSelectedProject(GALLERY_PROJECTS[nextIndex]);
  };

  const handlePrevProject = () => {
    if (!selectedProject) return;
    const currentIndex = GALLERY_PROJECTS.findIndex(p => p.id === selectedProject.id);
    const prevIndex = (currentIndex - 1 + GALLERY_PROJECTS.length) % GALLERY_PROJECTS.length;
    setSelectedProject(GALLERY_PROJECTS[prevIndex]);
  };

  return (
    <section id="our-work" className="relative py-24 bg-[#0a0c10] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161a24] border border-white/10 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500]" />
              <span className="text-[11px] font-tech font-bold uppercase tracking-widest text-[#ff5500]">
                TRACK RECORD & PRECISION BUILDS
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
              Our Work in the Bay.
            </h2>

            <p className="text-sm sm:text-base text-neutral-400 mt-3 max-w-xl">
              Inspect recent builds, major engine overhauls, ceramic applications, and precision brake calibrations executed at our Pune center.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-6 md:mt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-tech uppercase tracking-wider transition-all ${
                  filterCategory === cat
                    ? 'bg-[#ff5500] text-white shadow-md'
                    : 'bg-[#121620] text-neutral-400 hover:text-white border border-white/6'
                }`}
              >
                {cat === 'all' ? 'All Builds' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative h-80 rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 cursor-pointer shadow-xl"
              onClick={() => setSelectedProject(project)}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-center filter brightness-[0.8] contrast-[1.08] transform group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#090b0f] via-[#090b0f]/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Category Tag */}
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 rounded-md bg-[#090c12]/80 backdrop-blur-md border border-white/10 text-[11px] font-tech font-bold uppercase tracking-wider text-[#ff5500]">
                  {project.category}
                </span>
              </div>

              {/* Hover Overlay with "VIEW PROJECT" Button */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="text-xs font-tech text-neutral-400 uppercase tracking-widest mb-1">
                    {project.carModel}
                  </div>
                  <h3 className="text-base sm:text-lg font-display font-bold text-white leading-snug group-hover:text-[#ff5500] transition-colors">
                    {project.title}
                  </h3>
                </div>

                {/* View Project Pill */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-xs font-tech font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5 text-[#ff5500]" />
                    VIEW PROJECT
                  </span>
                  <span className="text-[11px] text-neutral-400 font-tech">Click to expand</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fullscreen Lightbox Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ scale: 0.93, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.93, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#11151e] border border-white/15 shadow-2xl"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-[#ff5500] text-white flex items-center justify-center border border-white/20 transition-colors shadow-lg"
                  aria-label="Close Lightbox"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Navigation arrows */}
                <button
                  onClick={handlePrevProject}
                  className="absolute left-4 top-1/3 z-20 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-[#ff5500] text-white hidden sm:flex items-center justify-center border border-white/20 transition-colors"
                  aria-label="Previous project"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextProject}
                  className="absolute right-4 top-1/3 z-20 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-[#ff5500] text-white hidden sm:flex items-center justify-center border border-white/20 transition-colors"
                  aria-label="Next project"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Large Project Image */}
                <div className="relative h-72 sm:h-96 w-full bg-black">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover filter brightness-[0.9]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11151e] via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-6">
                    <span className="px-3 py-1 rounded-md bg-[#ff5500] text-white font-tech font-bold text-xs uppercase tracking-wider">
                      {selectedProject.category}
                    </span>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
                    <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                      {selectedProject.title}
                    </h3>
                    <span className="text-xs font-tech text-[#ff5500] uppercase font-bold tracking-wider">
                      {selectedProject.carModel}
                    </span>
                  </div>

                  <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                    {selectedProject.description}
                  </p>

                  <div className="p-4 rounded-xl bg-white/4 border border-white/6 mb-6">
                    <h4 className="text-xs font-tech font-bold uppercase tracking-wider text-neutral-300 mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#ff5500]" />
                      Workshop Workscope Performed:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProject.workDone.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#ff5500] flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-tech text-neutral-400">
                    <span>Pune Facility • Bay No. 4</span>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="px-5 py-2 rounded-lg bg-[#ff5500] text-white font-bold uppercase hover:bg-[#ff6a1a] transition-colors"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
