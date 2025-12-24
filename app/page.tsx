'use client';

import { useState, useEffect } from 'react';

export default function UserList() {
const [users, setUsers] = useState<any[]>([]);
const [search, setSearch] = useState("");
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null); 
  
  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

 
  const filteredUsers = users.filter((u) => {
    const fullName = '${u.firstName} ${u.lastName}'.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  const isExpired = (expiry:string) => {
    if (!expiry) return false;
    const [month, year] = expiry.split('/').map(Number);
    const now = new Date();

    const expiryDate = new Date(2000 + year, month - 1, 1);
    return expiryDate < now;
  };

  if (loading) return <p className="p-10 text-center">Chargement...</p>;

  return (
    <main className="max-w-2xl mx-auto p-6 font-sans">
      <h1 className="text-2xl font-bold mb-6">Liste des Utilisateurs</h1>

      <input
        type="text"
        placeholder="Rechercher par nom..."
        className="w-full p-3 border rounded-lg mb-8 shadow-sm text-black outline-none focus:border-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="flex justify-between items-center p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="font-bold text-gray-800">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <button
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isExpired(user.bank?.cardExpire)
                  ? 'bg-red-500 text-white' 
                  : 'bg-green-500 text-white' 
              }`}
            >
              {isExpired(user.bank?.cardExpire) ? 'Renew' : 'Cancel'}
            </button>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <p className="text-center text-gray-400">Aucun utilisateur trouvé.</p>
        )}
      </div>
    </main>
  );
}