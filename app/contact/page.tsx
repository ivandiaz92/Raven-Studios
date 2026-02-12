'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ContactPage() {
  useEffect(() => {
    gsap.fromTo(
      '.contact-item',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.contact-item',
          start: 'top 80%',
        },
      }
    )
  }, [])

  return (
    <div className="pt-20 pb-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12 contact-item">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-gray-400 text-lg">
            Have a project in mind? Let's discuss how we can bring your vision to life.
          </p>
        </div>

        <div className="contact-item bg-gradient-to-br from-gray-900 to-black rounded-lg border border-gray-800 p-8">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="mt-12 text-center contact-item">
          <p className="text-gray-400 mb-4">Or reach out directly:</p>
          <div className="flex justify-center space-x-6">
            <a
              href="mailto:hello@ravenstud.io"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              hello@ravenstud.io
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

