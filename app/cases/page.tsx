'use client';

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { CasesList } from '../../src/features/cases/components/CasesList';
import { Button } from '../../src/features/common/components';
import { useAuth } from '../../src/features/auth';

export default function CasesPage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      {/* Cabecera de expedientes periciales */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-grafito-light">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-alerta">
            ARCHIVO GENERAL DE INVESTIGACIONES FORENSES
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-papel mt-1">
            Expedientes Criminales
          </h1>
          <p className="text-xs font-mono text-papel-muted mt-0.5">
            Agente en servicio: <strong className="text-papel">{user?.name}</strong> &bull;{' '}
            <span className="text-alerta uppercase">
              {user?.role === 'ADMIN' ? 'Comisario Principal' : 'Detective de Campo'}
            </span>
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          <Link href="/cases/new">
            <Button variant="primary" className="inline-flex items-center gap-2 text-xs">
              <Plus className="w-4 h-4" />
              <span>NUEVO EXPEDIENTE</span>
            </Button>
          </Link>
          {user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="px-3 py-2 text-xs font-mono uppercase bg-grafito border border-grafito-light text-papel hover:bg-grafito-light transition-colors"
            >
              PANEL ADMIN
            </Link>
          )}
          <Button variant="ghost" onClick={logout} className="text-xs font-mono">
            CERRAR SESIÓN
          </Button>
        </div>
      </div>

      {/* Listado central de casos */}
      <CasesList />
    </div>
  );
}
