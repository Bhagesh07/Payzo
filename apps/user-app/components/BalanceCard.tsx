import { Card } from "@repo/ui/card";

export const BalanceCard = ({ amount, locked }: { amount: number; locked: number }) => {
    const formatINR = (value: number) =>
        value.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });

    return (
        <Card title="Balance">
            <div className="flex justify-between border-b border-slate-300 pb-2">
                <div>Unlocked balance</div>
                <div className="font-semibold text-green-700">
                    {formatINR(amount / 100)}
                </div>
            </div>
            <div className="flex justify-between border-b border-slate-300 py-2">
                <div>Total Locked Balance</div>
                <div className="font-semibold text-yellow-700">
                    {formatINR(locked / 100)}
                </div>
            </div>
            <div className="flex justify-between border-b border-slate-300 py-2">
                <div>Total Balance</div>
                <div className="font-bold text-indigo-700">
                    {formatINR((locked + amount) / 100)}
                </div>
            </div>
        </Card>
    );
};