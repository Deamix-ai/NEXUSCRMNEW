import { useAuth } from '@/contexts/AuthContext';

'use client';



export function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-medium text-gray-900">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>
      </div>
      <button
        onClick={logout}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        Logout
      </button>
    </div>
  );
}