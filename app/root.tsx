// Note: ambient module declarations belong in a separate .d.ts file.
// Having `declare module '...'` in this module file causes TypeScript
// to treat them as augmentations, which errors when the original module
// cannot be found. Runtime fallbacks are provided below.

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Minimal local React stub to avoid requiring the 'react' package in environments
// where it's not installed. This provides the parts of React used in this file.
const React = {
  createElement: (type: any, props?: any, ...children: any[]) => {
    if (typeof type === 'function') {
      return type({ ...(props || {}), children: children.length ? (children.length === 1 ? children[0] : children) : undefined });
    }
    return { type, props: { ...(props || {}), children: children.length ? (children.length === 1 ? children[0] : children) : undefined } };
  }
} as any;

declare namespace React {
  type ComponentType<P = any> = (props: P) => any;
  type ReactNode = any;
}

/**
 * Minimal runtime fallbacks for @remix-run/react exports.
 * These stop TypeScript from erroring in environments where
 * @remix-run/react isn't installed. They are intentionally
 * simple stubs and can be replaced by the real exports when
 * the package is available.
 */
const Outlet: React.ComponentType<any> = (props: any) => props.children ?? null;
const Links: React.ComponentType<any> = (_props: any) => null;
const Meta: React.ComponentType<any> = (_props: any) => null;
const Scripts: React.ComponentType<any> = (_props: any) => null;
const ScrollRestoration: React.ComponentType<{ nonce?: string }> = (_props: any) => null;
const useRouteError: () => any = () => undefined;
const isRouteErrorResponse: (error: any) => boolean = (_error: any) => false;

type PageLayoutProps = {
  header?: any;
  footer?: any;
  children?: React.ReactNode;
};

export function PageLayout({ header, footer, children }: PageLayoutProps) {
  const headerContent = header?.menu?.items
    ? React.createElement(
        'nav',
        { className: 'container' },
        React.createElement(
          'ul',
          { className: 'nav-list' },
          header.menu.items.map((item: any, idx: number) =>
            React.createElement(
              'li',
              { key: idx },
              React.createElement('a', { href: item.url ?? '#' }, item.title ?? 'Menu item')
            )
          )
        )
      )
    : React.createElement('div', { className: 'container' }, 'Store Header');

  const footerContent = footer?.menu?.items
    ? React.createElement(
        'nav',
        { className: 'container' },
        React.createElement(
          'ul',
          { className: 'nav-list' },
          footer.menu.items.map((item: any, idx: number) =>
            React.createElement(
              'li',
              { key: idx },
              React.createElement('a', { href: item.url ?? '#' }, item.title ?? 'Footer item')
            )
          )
        )
      )
    : React.createElement('div', { className: 'container' }, 'Store Footer');

  return React.createElement(
    'div',
    { className: 'page-layout-root' },
    React.createElement('header', { className: 'site-header' }, headerContent),
    React.createElement('main', { className: 'content' }, children),
    React.createElement('footer', { className: 'site-footer' }, footerContent)
  );
}

export function links() {
  return [
    { rel: 'preconnect', href: 'https://cdn.shopify.com' },
    { rel: 'preconnect', href: 'https://shop.app' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    // External stylesheet - create this file at /public/styles/root.css
    { rel: 'stylesheet', href: '/styles/root.css' },
  ];
}

export function Layout({ children }: { children?: React.ReactNode }) {
  return React.createElement(
    'html',
    { lang: 'en' },
    React.createElement(
      'head',
      null,
      React.createElement(Meta, null),
      React.createElement(Links, null),
      React.createElement('meta', { charSet: 'utf-8' }),
      React.createElement('meta', { name: 'viewport', content: 'width=device-width,initial-scale=1' })
    ),
    React.createElement('body', null, children, React.createElement(ScrollRestoration, null), React.createElement(Scripts, null))
  );
}

export default function App() {
  return React.createElement(
    Layout,
    null,
    React.createElement(PageLayout, null, React.createElement(Outlet, null))
  );
}

export function ErrorBoundary() {
  const error: any = useRouteError();
  let status = 500;
  let message = 'Unknown error';

  if (isRouteErrorResponse(error)) {
    status = error.status;
    message = typeof error.data === 'string' ? error.data : error.data?.message ?? message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return React.createElement(
    Layout,
    null,
    React.createElement(
      'div',
      { className: 'error-container' },
      React.createElement('h1', null, 'Something went wrong'),
      React.createElement('h2', null, String(status)),
      React.createElement('pre', { className: 'error-message' }, message)
    )
  );
}
