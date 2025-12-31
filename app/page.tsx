"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  username:string;
  email: string;
  image:string;
  birthDate:string;
  bank: {
    cardExpire: string;
    cardType:string;
  };
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error();

        const data = await res.json();
        setUsers(data.users);
      } catch {
        setError("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const isExpired = (date: string) => {
    return new Date(date) < new Date();
  };

  if (loading) return <p className="p-4">Chargement...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <input
        className="w-full border p-2 mb-4"
        placeholder="Search by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
<div className="bg-white rounded-lg border">
  
  
  <div className="grid grid-cols-5 px-4 py-2 text-sm text-gray-500 font-medium border-b">
    <div>User</div>
    <div>Birthdate</div>
    <div>Renew Date</div>
    <div>Card Type</div>
    <div></div>
  </div>

  
  {filteredUsers.map((user) => {
    const expired = isExpired(user.bank.cardExpire);

    return (
      <div
        key={user.id}
        className="grid grid-cols-5 px-4 py-3 items-center border-b hover:bg-gray-50"
      >
        
        <div className="flex items-center gap-3">
          <img
            src={user.image}
            alt=""
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold">
              {user.firstName}_{user.lastName}
            </p>
            <p className="text-sm text-gray-500">
              @{user.username}
            </p>
          </div>
        </div>

      
        <div>
          <p className="font-medium">
            {new Date(user.birthDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500">Birthdate</p>
        </div>

        
        <div>
          <p className="font-medium">
            {expired ? "None" : user.bank.cardExpire}
          </p>
          <p className="text-sm text-gray-500">
            {expired ? "Expires soon" : "Renew Date"}
          </p>
        </div>

        
        <div>
          <p className="font-medium">Maestro</p>
          <p className="text-sm text-gray-500">Card Type</p>
        </div>

        
        <div className="flex justify-end">
          <button
            className={`px-4 py-2 rounded border text-sm font-medium ${
              expired
                ? "border-gray-300 text-gray-700"
                : "border-red-300 text-red-600"
            }`}
          >
            {expired ? "Renew" : "Cancel"}
          </button>
        </div>
      </div>
    );
  })}
</div>
     
    </div>
  );
}
