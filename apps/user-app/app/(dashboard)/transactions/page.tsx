import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";

export default async function Transactions() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  let txns: any[] = [];
  let userMap: Record<number, { number: string, name: string | null }> = {};

  if (userId) {
    txns = await prisma.p2pTransfer.findMany({
      where: {
        OR: [
          { fromUserId: Number(userId) },
          { toUserId: Number(userId) }
        ]
      },
      orderBy: { timestamp: "desc" },
      take: 10,
    });

    // Collect unique userIds involved in these transactions
    const userIds = Array.from(new Set(txns.flatMap(txn => [txn.fromUserId, txn.toUserId])));
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, number: true, name: true }
    });
    userMap = Object.fromEntries(users.map(u => [u.id, { number: u.number, name: u.name }]));
  }

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white rounded shadow p-8">
      <h1 className="text-2xl font-bold mb-6">Recent Transactions</h1>
      {txns.length === 0 ? (
        <div className="text-gray-500 text-center">No transactions yet. Start sending or receiving money!</div>
      ) : (
        <ul className="space-y-4">
          {txns.map(txn => (
            <li key={txn.id} className="border-b pb-2">
              <div>
                <span className="font-semibold">
                  {txn.fromUserId === Number(userId) ? "Sent" : "Received"}
                </span>
                <span className="mx-2">
                  {txn.amount.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(txn.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {txn.fromUserId === Number(userId)
                  ? `To: ${userMap[txn.toUserId]?.name || userMap[txn.toUserId]?.number || txn.toUserId}`
                  : `From: ${userMap[txn.fromUserId]?.name || userMap[txn.fromUserId]?.number || txn.fromUserId}`}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}