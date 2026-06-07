// Avoid importing '@shopify/remix-oxygen' types which may not be installed.
// Use a generic any type for the loader args to prevent module not found errors.

export async function loader({context}: any) {
  return context.customerAccount.authorize();
}