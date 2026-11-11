'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, FolderArchive, Users, LogOut, Menu, X, Lock, User as UserIcon, Settings } from 'lucide-react';
import { useAuth } from '../../auth';
import { ThemeToggle } from './ThemeToggle';
import { ProfileSettingsModal } from './ProfileSettingsModal';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <>
      <header className="w-full border-b border-grafito-light bg-grafito/95 backdrop-blur sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo / Marca Forense */}
            <div className="flex items-center gap-3">
              <Link
                href={isAuthenticated ? '/cases' : '/'}
                className="flex items-center gap-2 group outline-none focus:outline-none select-none"
                aria-label="Ir a inicio de Expediente Forense"
              >
                <div className="w-8 h-8 bg-grafito-dark border border-grafito-light flex items-center justify-center text-alerta group-hover:border-alerta transition-colors">
                  <Shield className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-base sm:text-lg tracking-wider text-papel border-l-2 border-evidencia pl-2.5 leading-none">
                    EXPEDIENTE FORENSE
                  </span>
                  <span className="text-[9px] font-mono tracking-widest text-papel-muted pl-2.5 mt-0.5">
                    DIVISIÓN DE INVESTIGACIÓN
                  </span>
                </div>
              </Link>

              {/* Sello de confidencialidad */}
              <div className="hidden lg:block ml-4 pl-4 border-l border-grafito-light">
                <span className="font-mono text-[10px] tracking-widest uppercase text-alerta/80 border border-alerta/30 px-2 py-0.5 select-none">
                  CONFIDENCIAL
                </span>
              </div>
            </div>

            {/* Menú y perfil para pantallas medianas/grandes */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/cases"
                    className={`inline-flex items-center gap-1.5 font-mono text-xs uppercase px-3 py-1.5 border transition-colors ${
                      isActive('/cases')
                        ? 'bg-grafito-light border-alerta text-papel font-bold'
                        : 'border-transparent text-papel-dark hover:border-grafito-light hover:text-papel'
                    }`}
                  >
                    <FolderArchive className="w-3.5 h-3.5 text-alerta" aria-hidden="true" />
                    <span>EXPEDIENTES</span>
                  </Link>

                  {user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className={`inline-flex items-center gap-1.5 font-mono text-xs uppercase px-3 py-1.5 border transition-colors ${
                        isActive('/admin')
                          ? 'bg-grafito-light border-evidencia text-papel font-bold'
                          : 'border-transparent text-papel-dark hover:border-grafito-light hover:text-papel'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-evidencia" aria-hidden="true" />
                      <span>ADMINISTRACIÓN</span>
                    </Link>
                  )}

                  <div className="h-4 w-px bg-grafito-light mx-1" aria-hidden="true" />

                  {/* Perfil del detective / agente - Clic para abrir edición y ajustes */}
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(true)}
                    className="flex items-center gap-2.5 text-right p-1.5 rounded hover:bg-grafito-light/50 border border-transparent hover:border-grafito-light transition-all group cursor-pointer focus:outline-none focus:ring-1 focus:ring-alerta"
                    title="Ajustes y credencial de investigador"
                    aria-label="Abrir perfil y ajustes del investigador"
                  >
                    <div className="flex flex-col text-right">
                      <span className="text-xs font-mono text-papel font-medium leading-tight truncate max-w-[150px] group-hover:text-alerta transition-colors">
                        {user?.name}
                      </span>
                      <span className="text-[10px] font-mono text-alerta tracking-wider uppercase">
                        {user?.role === 'ADMIN' ? 'COMISARIO' : 'DETECTIVE'}
                      </span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-grafito-dark border border-grafito-light flex items-center justify-center text-papel-muted group-hover:text-alerta group-hover:border-alerta transition-colors shrink-0">
                      <UserIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                  </button>

                  {/* ThemeToggle */}
                  <ThemeToggle />

                  {/* Botón Salir */}
                  <button
                    type="button"
                    onClick={logout}
                    title="Cerrar sesión segura"
                    aria-label="Cerrar sesión segura"
                    className="inline-flex items-center gap-1 font-mono text-xs uppercase text-papel-muted hover:text-evidencia px-2 py-1.5 border border-transparent hover:border-evidencia/40 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="sr-only sm:not-sr-only">SALIR</span>
                  </button>
                </>
              ) : (
                <>
                  <ThemeToggle />
                  <Link
                    href="/login"
                    className="font-mono text-xs uppercase text-papel-dark hover:text-papel px-3 py-1.5 transition-colors"
                  >
                    INGRESAR
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-1.5 font-mono text-xs uppercase px-3 py-1.5 bg-evidencia hover:bg-evidencia-hover text-white transition-colors border border-evidencia"
                  >
                    <Lock className="w-3 h-3" aria-hidden="true" />
                    <span>REGISTRO</span>
                  </Link>
                </>
              )}
            </div>

            {/* Menú móvil y toggle de tema */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 border border-grafito-light bg-grafito text-papel hover:text-white"
                aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-grafito-light bg-grafito-dark p-4 space-y-3 font-mono text-xs">
            {isAuthenticated ? (
              <>
                <div className="pb-3 border-b border-grafito-light flex items-center justify-between">
                  <div>
                    <p className="text-papel font-bold">{user?.name}</p>
                    <p className="text-[10px] text-alerta uppercase tracking-wider">
                      {user?.role === 'ADMIN' ? 'COMISARIO' : 'DETECTIVE'} &bull;{' '}
                      {user?.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsProfileOpen(true);
                    }}
                    className="px-2.5 py-1.5 border border-grafito-light text-alerta hover:bg-grafito-light font-mono text-[10px] uppercase flex items-center gap-1.5 transition-colors"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Ajustes</span>
                  </button>
                </div>

                <Link
                  href="/cases"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 px-3 border ${
                    isActive('/cases')
                      ? 'bg-grafito border-alerta text-papel font-bold'
                      : 'border-grafito-light text-papel-dark'
                  }`}
                >
                  EXPEDIENTES CRIMINALES
                </Link>

                {user?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 px-3 border ${
                      isActive('/admin')
                        ? 'bg-grafito border-evidencia text-papel font-bold'
                        : 'border-grafito-light text-papel-dark'
                    }`}
                  >
                    ADMINISTRACIÓN DE AGENTES
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsProfileOpen(true);
                  }}
                  className="w-full text-left py-2 px-3 border border-grafito-light text-papel-dark hover:text-papel hover:bg-grafito-light transition-colors flex items-center justify-between"
                >
                  <span>EDITAR PERFIL Y AJUSTES</span>
                  <Settings className="w-3.5 h-3.5 text-alerta" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left py-2 px-3 border border-evidencia/60 text-evidencia hover:bg-evidencia hover:text-white transition-colors"
                >
                  CERRAR SESIÓN FORENSE
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 px-3 border border-grafito-light bg-grafito text-papel"
                >
                  INGRESAR AL SISTEMA
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 px-3 bg-evidencia text-white border border-evidencia font-bold"
                >
                  REGISTRO DE AGENTE
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Modal de Edición de Perfil y Ajustes */}
      <ProfileSettingsModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
};
