"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
  try {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
    if (!from) {
      return { message: "Error while sending" };
    }
    const toUser = await prisma.user.findFirst({
      where: { number: to }
    });
    if (!toUser) {
      return { message: "User not found" };
    }
    await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;

      const fromBalance = await tx.balance.findUnique({
        where: { userId: Number(from) },
      });
      if (!fromBalance || fromBalance.amount < amount) {
        throw new Error('Insufficient funds');
      }

      await tx.balance.update({
        where: { userId: Number(from) },
        data: { amount: { decrement: amount } },
      });

      // Ensure recipient has a Balance row
      let toBalance = await tx.balance.findUnique({
        where: { userId: toUser.id }
      });
      if (!toBalance) {
        await tx.balance.create({
          data: {
            userId: toUser.id,
            amount: 0,
            locked: 0
          }
        });
      }

      await tx.balance.update({
        where: { userId: toUser.id },
        data: { amount: { increment: amount } },
      });

      await tx.p2pTransfer.create({
        data: {
          fromUserId: Number(from),
          toUserId: toUser.id,
          amount,
          timestamp: new Date()
        }
      });
    });
    return { message: "Transfer successful" };
  } catch (e: any) {
    return { message: e?.message || "Error while sending" };
  }
}