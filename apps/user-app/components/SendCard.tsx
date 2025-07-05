"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";

export function SendCard() {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState(""); // Add feedback state

    return (
        <div className="h-[90vh]">
            <Center>
                <Card title="Send">
                    <div className="min-w-72 pt-2">
                        <TextInput
                            placeholder={"Number"}
                            label="Number"
                            onChange={setNumber}
                        />
                        <TextInput
                            placeholder={"Amount"}
                            label="Amount"
                            onChange={setAmount}
                        />
                        <div className="pt-4 flex justify-center">
                            <Button onClick={async () => {
                                setMessage(""); // Clear previous
                                const res = await p2pTransfer(number, Number(amount));
                                setMessage(res.message); // Show backend message
                            }}>
                                Send
                            </Button>
                        </div>
                        {message && (
                            <div className="pt-4 text-center text-sm text-indigo-700">
                                {message}
                            </div>
                        )}
                    </div>
                </Card>
            </Center>
        </div>
    );
}