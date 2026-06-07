// Minimal local type to avoid requiring '@shopify/remix-oxygen' types
type LoaderFunctionArgs = {
  context: {
    customerAccount: {
      login: (...args: any[]) => Promise<unknown> | unknown;
    };
  };
};

export async function loader({context}: LoaderFunctionArgs) {
  return context.customerAccount.login();
}