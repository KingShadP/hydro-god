type ActionFunctionArgs = { context: any };

export async function action({ context }: ActionFunctionArgs) {
    return context.customerAccount.logout();
}