'use client';

import { useEffect } from 'react';
import { useExperimentStore } from '@/lib/store';
import { loadLocalExperiments, replaceLocalExperiments } from '@/lib/persistence';
import { fetchExperiments } from '@/lib/api';

export default function ExperimentsHydrator() {
  const setExperiments = useExperimentStore((s) => s.setExperiments);

  useEffect(() => {
    let mounted = true;

    // Load local cache first for instant UI
    loadLocalExperiments()
      .then((local) => {
        if (!mounted) return;
        if (Array.isArray(local) && local.length > 0) {
          setExperiments(local as any[]);
        }
      })
      .catch(() => {
        // ignore local load failures
      })
      .finally(() => {
        // Then fetch from server and reconcile
        fetchExperiments()
          .then((server) => {
            if (!mounted) return;
            if (Array.isArray(server) && server.length > 0) {
              setExperiments(server as any[]);
              // Replace local cache to reflect server canonical state
              replaceLocalExperiments(server as any[]).catch(() => {});
            }
          })
          .catch(() => {
            // server unreachable; keep local cache
          });
      });

    return () => { mounted = false; };
  }, [setExperiments]);

  return null;
}
