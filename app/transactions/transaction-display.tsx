'use client';

import React from 'react';
import { TransactionDropdown } from './transaction-dropdown';
import TransactionItem from './transaction-item';
import { HandHelping, Handshake } from 'lucide-react';

interface TransactionDisplayProps {
  transactionsReceive: any[];
  transactionsGive: any[];
}

export default function TransactionDisplay({
  transactionsReceive,
  transactionsGive,
}: TransactionDisplayProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('receive');

  return (
    <div className="w-full">
      <TransactionDropdown
        open={open}
        setOpen={setOpen}
        value={value}
        setValue={setValue}
      />
      <div className="mt-4"></div>
      <div className="space-y-4">
        {value === 'receive' ? (
          transactionsReceive.length > 0 ? (
            transactionsReceive.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                type={'receive'}
              />
            ))
          ) : (
            <div className="flex flex-col justify-center items-center mt-24 mx-auto">
              <HandHelping
                size={40}
                color="gray"
                className="text-center mx-auto"
              />
              <p className="text-gray-400 text-center">No pending offers</p>
            </div>
          )
        ) : value === 'give' && transactionsGive.length > 0 ? (
          transactionsGive.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              type={'give'}
            />
          ))
        ) : (
          <div className="flex flex-col justify-center items-center mt-24 mx-auto">
            <Handshake size={40} color="gray" className="text-center mx-auto" />
            <p className="text-gray-400 text-center">No transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
