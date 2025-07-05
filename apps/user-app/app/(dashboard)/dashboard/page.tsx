import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";

async function getBalance(userId: number) {
  const balance = await prisma.balance.findFirst({
    where: { userId },
  });
  return {
    amount: balance?.amount || 0,
    locked: balance?.locked || 0,
  };
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  let balance = { amount: 0, locked: 0 };
  if (user?.id) {
    balance = await getBalance(Number(user.id));
  }

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white rounded shadow p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome{user?.name ? `, ${user.name}` : ""}!</h1>
      <div className="mb-2 text-gray-700">Phone: <span className="font-mono">{user?.email}</span></div>
      <div className="mb-8 text-gray-700">User ID: <span className="font-mono">{user?.id}</span></div>
      <div className="bg-indigo-50 rounded p-4 mb-4">
        <div className="text-lg font-semibold">Your Balance</div>
        <div className="text-2xl font-bold text-indigo-700 mt-2">₹ {balance.amount / 100}</div>
        <div className="text-sm text-gray-500">Locked: ₹ {balance.locked / 100}</div>
      </div>
      <div className="text-gray-600">You can now send money, view transactions, and more from the sidebar!</div>
    </div>
  );
}