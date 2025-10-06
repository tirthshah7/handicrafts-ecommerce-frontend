import { useBackend } from '../backend-provider';

export function CartDebug() {
  const { cartItems, isAuthenticated, user } = useBackend();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-3 rounded text-xs z-50 max-w-xs">
      <div className="font-bold mb-2">Cart Debug</div>
      <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>User: {user?.email || 'None'}</div>
      <div>Cart Items: {cartItems.length}</div>
      <div>Cart Total: {cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</div>
      <div className="mt-2 text-xs">
        {cartItems.map(item => (
          <div key={item.id}>
            {item.name} x{item.quantity}
          </div>
        ))}
      </div>
    </div>
  );
}
