import { createContext, useContext, useEffect, useState } from 'react';

type Toast = {
  id: number;
  title: string;
  description?: string;
  variant?: 'success' | 'error' | 'info' | 'warning';
};

type UI = {
  sidebarOpen: boolean;
  setSidebarOpen: (b: boolean) => void;
  toggleSidebar: () => void;
  commandOpen: boolean;
  setCommandOpen: (b: boolean) => void;
  aiOpen: boolean;
  setAiOpen: (b: boolean) => void;
  notifOpen: boolean;
  setNotifOpen: (b: boolean) => void;
  toasts: Toast[];
  toast: (t: Omit<Toast, 'id'>) => void;
  dismiss: (id: number) => void;
};

const UIContext = createContext<UI | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random();
    setToasts((p) => [...p, { ...t, id }]);
    setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), 4200);
  };

  const dismiss = (id: number) => setToasts((p) => p.filter((x) => x.id !== id));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen((v) => !v);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        setAiOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <UIContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar: () => setSidebarOpen((v) => !v),
        commandOpen,
        setCommandOpen,
        aiOpen,
        setAiOpen,
        notifOpen,
        setNotifOpen,
        toasts,
        toast,
        dismiss,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const c = useContext(UIContext);
  if (!c) throw new Error('useUI must be used inside UIProvider');
  return c;
}
