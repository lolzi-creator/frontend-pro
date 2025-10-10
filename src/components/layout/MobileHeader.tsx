import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import MobileNav from '../MobileNav'

const MobileHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">IS</span>
              </div>
              <h1 className="text-base font-bold text-gray-900" style={{fontFamily: 'Poppins'}}>InvoSmart</h1>
            </Link>

            {/* User Profile */}
            <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-medium text-xs">JD</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  )
}

export default MobileHeader


