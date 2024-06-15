import * as React from "react";
import { Check, ChevronDown, ChevronsDown, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const transactionTypes = [
    {
        value: "receive",
        label: "Items I'm receiving",
    },
    {
        value: "give",
        label: "Items I'm giving away",
    },
];

interface TransactionDropdownProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    value: string;
    setValue: (value: string) => void;
}

export function TransactionDropdown({
    open,
    setOpen,
    value,
    setValue,
}: TransactionDropdownProps) {
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? transactionTypes.find(
                              (transaction) => transaction.value === value
                          )?.label
                        : "Select framework..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandGroup>
                            {transactionTypes.map((transactionTypes) => (
                                <CommandItem
                                    key={transactionTypes.value}
                                    value={transactionTypes.value}
                                    onSelect={(currentValue) => {
                                        setValue(
                                            currentValue === value
                                                ? value
                                                : currentValue
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === transactionTypes.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {transactionTypes.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
