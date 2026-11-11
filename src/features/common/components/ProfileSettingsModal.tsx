'use client';

import React, { useState, useEffect } from 'react';
import { User as UserIcon, Settings, Shield, X, Check, Sun, Moon, Key, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../auth';
import { Button } from './Button';
import { Input } from './Input';

export interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');

  // Form states
  const [name, setName] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Settings states
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [confirmDelete, setConfirmDelete] = useState(true);
  const [auditMode, setAuditMode] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentTheme = (document.documentElement.getAttribute('data-theme') as 'dark' | 'light') || 'dark';
      setTheme(currentTheme);
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    setSuccessMessage(null);

    setTimeout(() => {
      updateUser({ name: name.trim() });
      setIsSaving(false);
      setSuccessMessage('Datos de credencial actualizados satisfactoriamente.');
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 250);
  };

  const handleToggleTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('crime_report_theme', newTheme);
    }
  };

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Registro Oficial';

  const userRoleDisplay = user.role === 'ADMIN' ? 'Comisario Principal' : 'Detective de Campo';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tinta/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div className="w-full max-w-lg border border-grafito-light bg-grafito shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Encabezado Pericial */}
        <div className="flex items-start justify-between p-5 border-b border-grafito-light bg-grafito-dark/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-alerta animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest uppercase text-alerta font-bold">
                EXPEDIENTE DE PERSONAL // CREDENCIAL FORENSE
              </span>
            </div>
            <h2 id="profile-modal-title" className="font-serif text-lg tracking-wide text-papel mt-1">
              Perfil y Ajustes del Investigador
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-papel-muted hover:text-papel p-1 transition-colors rounded focus:outline-none focus:ring-1 focus:ring-alerta"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector de Pestañas */}
        <div className="flex border-b border-grafito-light bg-grafito-dark/40 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors uppercase tracking-wider ${
              activeTab === 'profile'
                ? 'border-alerta text-alerta font-bold bg-grafito/50'
                : 'border-transparent text-papel-dark hover:text-papel'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Credencial y Perfil</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors uppercase tracking-wider ${
              activeTab === 'settings'
                ? 'border-alerta text-alerta font-bold bg-grafito/50'
                : 'border-transparent text-papel-dark hover:text-papel'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Ajustes del Sistema</span>
          </button>
        </div>

        {/* Contenido desplazable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Tarjeta de Acreditación Policial */}
              <div className="p-4 bg-grafito-dark border border-grafito-light relative overflow-hidden">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-grafito border-2 border-alerta/60 flex items-center justify-center text-alerta font-serif font-bold text-xl shrink-0 shadow-inner">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-papel font-bold truncate">
                        {user.name}
                      </span>
                      <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-widest bg-alerta/20 text-alerta border border-alerta/40">
                        {userRoleDisplay}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-papel-muted truncate">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[10px] font-mono text-papel-muted">
                      <span>ID: {user.id.slice(0, 8).toUpperCase()}</span>
                      <span>&bull;</span>
                      <span>Alta: {formattedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-grafito-light/60 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-papel-muted uppercase tracking-widest">
                    ESTADO DE IDENTIDAD
                  </span>
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> ACREDITACIÓN ACTIVA
                  </span>
                </div>
              </div>

              {/* Mensaje de éxito al actualizar */}
              {successMessage && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>[ÉXITO]: {successMessage}</span>
                </div>
              )}

              {/* Formulario de Edición */}
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <Input
                  label="Nombre Completo del Investigador"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Detective Inspector Pérez"
                  hint="Este nombre se mostrará en los expedientes y en los registros de evidencia"
                  required
                />

                <Input
                  label="Correo Electrónico Institucional (Inmutable)"
                  type="email"
                  value={user.email}
                  disabled
                  hint="El correo electrónico está vinculado a la acreditación de seguridad y no puede modificarse"
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono tracking-wider text-papel-dark uppercase font-semibold">
                    Rango y Atribuciones Procesales
                  </label>
                  <div className="p-3 bg-grafito-dark border border-grafito-light text-xs font-mono text-papel-muted space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-papel font-medium">{userRoleDisplay}</span>
                      <Shield className="w-4 h-4 text-alerta" />
                    </div>
                    <p className="text-[11px] text-papel-muted">
                      {user.role === 'ADMIN'
                        ? 'Acceso irrestricto a todos los expedientes periciales, evidencias y administración de agentes.'
                        : 'Acceso y administración restringida a los expedientes propios asignados.'}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full font-mono uppercase tracking-wider py-2.5 text-xs"
                    loading={isSaving}
                  >
                    GUARDAR CAMBIOS DE CREDENCIAL
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Selector de Tema */}
              <div className="space-y-2">
                <span className="block text-xs font-mono tracking-wider text-papel-dark uppercase font-semibold">
                  Tema Visual del Sistema Forense
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleTheme('dark')}
                    className={`p-3 border text-left font-mono transition-colors rounded ${
                      theme === 'dark'
                        ? 'border-alerta bg-grafito-dark text-papel ring-1 ring-alerta'
                        : 'border-grafito-light bg-grafito-dark/40 text-papel-muted hover:border-grafito-light'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-papel">Modo Noir (Oscuro)</span>
                      <Moon className="w-4 h-4 text-alerta" />
                    </div>
                    <p className="text-[10px] text-papel-muted">Estética clásica de gabinete de investigación nocturno</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleTheme('light')}
                    className={`p-3 border text-left font-mono transition-colors rounded ${
                      theme === 'light'
                        ? 'border-alerta bg-grafito-dark text-papel ring-1 ring-alerta'
                        : 'border-grafito-light bg-grafito-dark/40 text-papel-muted hover:border-grafito-light'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-papel">Modo Expediente (Claro)</span>
                      <Sun className="w-4 h-4 text-alerta" />
                    </div>
                    <p className="text-[10px] text-papel-muted">Papel dossier y archivo pericial de alta legibilidad</p>
                  </button>
                </div>
              </div>

              {/* Preferencias operativas */}
              <div className="space-y-3 pt-3 border-t border-grafito-light">
                <span className="block text-xs font-mono tracking-wider text-papel-dark uppercase font-semibold">
                  Preferencias Operativas Forenses
                </span>

                <label className="flex items-center justify-between p-3 bg-grafito-dark border border-grafito-light cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="text-xs font-mono text-papel block">Confirmar acciones críticas</span>
                    <span className="text-[10px] text-papel-muted block">Solicitar doble confirmación al desactivar casos o evidencias</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={confirmDelete}
                    onChange={(e) => setConfirmDelete(e.target.checked)}
                    className="accent-alerta w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-grafito-dark border border-grafito-light cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="text-xs font-mono text-papel block">Registro de auditoría visual</span>
                    <span className="text-[10px] text-papel-muted block">Mostrar etiquetas de seguridad y códigos correlativos periciales</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={auditMode}
                    onChange={(e) => setAuditMode(e.target.checked)}
                    className="accent-alerta w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>

              {/* Información Criptográfica de la Sesión */}
              <div className="p-4 bg-grafito-dark/80 border border-grafito-light space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-alerta font-bold">
                  <Key className="w-3.5 h-3.5" />
                  <span className="text-[11px] uppercase tracking-wider">Criptografía y Sesión Activa</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-papel-muted pt-1">
                  <div>
                    <span className="text-papel-dark block font-semibold">Algoritmo JWT:</span>
                    <span>HS256 (HMAC SHA-256)</span>
                  </div>
                  <div>
                    <span className="text-papel-dark block font-semibold">Duración Máxima:</span>
                    <span>24 Horas (1 día)</span>
                  </div>
                  <div>
                    <span className="text-papel-dark block font-semibold">Cookie Segura:</span>
                    <span>cr_token (SameSite=Lax)</span>
                  </div>
                  <div>
                    <span className="text-papel-dark block font-semibold">Infraestructura:</span>
                    <span>Render API + Vercel Web</span>
                  </div>
                </div>
              </div>

              {/* Botón de Cierre de Sesión */}
              <div className="pt-2">
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => {
                    onClose();
                    logout();
                  }}
                  className="w-full text-xs font-mono uppercase py-2.5"
                >
                  CERRAR SESIÓN SEGURA DEL SISTEMA
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Pie del modal */}
        <div className="p-4 border-t border-grafito-light bg-grafito-dark/50 flex justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="text-xs font-mono uppercase px-4 py-2"
          >
            CERRAR
          </Button>
        </div>
      </div>
    </div>
  );
};
