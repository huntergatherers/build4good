import { Transaction } from "@prisma/client";

interface TransactionStatusTagProps {
    transaction: Transaction;
}
export default function TransactionStatusTag({
    transaction,
}: TransactionStatusTagProps) {
    return (
        <div>
            {transaction.approved_at ? (
                transaction.completed_at ? (
                    <div className="bg-green-600 rounded-md px-2 font-semibold">
                        Completed
                    </div>
                ) : (
                    <div className="bg-orange-400 rounded-md px-2 font-semibold">
                        Approved
                    </div>
                )
            ) : (
                <div className="bg-yellow-500 rounded-md px-2 font-semibold">
                    Pending
                </div>
            )}
        </div>
    );
}
