import type { ReactElement } from 'react';
import { act } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';

// ----------------------------------------------------------------------
// Custom renderer for React 19 + jsdom compatibility.
// React 19's createRoot renders asynchronously by default.
// We wrap flushSync + act for synchronous DOM assertion support.
// ----------------------------------------------------------------------

const mountedRoots = new Map<HTMLElement, ReturnType<typeof createRoot>>();

export interface CustomRenderResult {
  container: HTMLElement;
  baseElement: HTMLElement;
  unmount: () => void;
  rerender: (ui: ReactElement) => void;
  debug: () => void;
  asFragment: () => DocumentFragment;
}

export function render(
  ui: ReactElement,
  baseElement?: HTMLElement
): CustomRenderResult {
  (globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

  const rootEl = baseElement ?? document.body;
  const container = rootEl.appendChild(document.createElement('div'));

  let root = mountedRoots.get(container);
  if (!root) {
    root = createRoot(container);
    mountedRoots.set(container, root);
  }

  act(() => {
    flushSync(() => {
      root!.render(ui);
    });
  });

  const unmount = () => {
    act(() => {
      flushSync(() => {
        root!.unmount();
      });
    });
    mountedRoots.delete(container);
    container.remove();
  };

  const rerender = (newUi: ReactElement) => {
    act(() => {
      flushSync(() => {
        root!.render(newUi);
      });
    });
  };

  return {
    container,
    baseElement: rootEl,
    unmount,
    rerender,
    debug: () => console.log(container.innerHTML),
    asFragment: () => document.createRange().createContextualFragment(container.innerHTML),
  };
}
