'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CirclePlus, Folder } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { href: '/new-experiment', label: 'New Experiment', icon: <CirclePlus className="w-5 h-5" /> },
    { href: '/experiments', label: 'Previous Experiments', icon: <Folder className="w-5 h-5" /> },
  ];

  return (
    <div className="navbar bg-black shadow-lg">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl">
          🐝 Bee Algorithm
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
                title={item.label}
                className={`btn btn-sm ${pathname === item.href ? 'btn-primary' : 'btn-ghost'}`}
              >
                {item.icon}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="navbar-end">
        
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-52">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  title={item.label}
                  className={`btn w-full justify-start ${pathname === item.href ? 'btn-primary' : 'btn-ghost'}`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </Link>
              </li>
            ))}
            
          </ul>
        </div>
      </div>
    </div>
  );
}
