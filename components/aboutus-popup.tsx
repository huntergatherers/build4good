"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox"; // Import your Checkbox component
import { Info } from "lucide-react";
import { useState, useEffect } from "react";

export default function AboutUsPopUp() {
    const [isOpen, setIsOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    useEffect(() => {
        // Check if the dialog has been shown before
        const hasShownDialog = localStorage.getItem("hasShownAboutUsDialog");
        if (!hasShownDialog) {
            // Open the dialog if it hasn't been shown before
            setIsOpen(true);
        }
    }, []);

    const handleDialogClose = () => {
        setIsOpen(false);
        if (dontShowAgain) {
            localStorage.setItem("hasShownAboutUsDialog", "true");
        }
    };

    return (
        <div className="mt-3 px-3">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger className="bg-transparent border-none">
                    <Info color="#4d4c4c" />
                </DialogTrigger>
                <DialogContent>
                    <div className="">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-4xl font-bold text-green-700 mb-8">
                                About Us
                            </h1>
                            <div className="space-y-8">
                                <p className="text-lg text-gray-700">
                                    Welcome to{" "}
                                    <span className="text-green-500 font-semibold">
                                        ComPost
                                    </span>
                                    !
                                </p>
                                <div className="bg-green-50 border-gray-700 p-6 rounded-lg shadow-lg">
                                    <h1 className="text-xl font-medium text-green-700">
                                        What we do{" "}
                                    </h1>
                                    <p className="text-md text-gray-700">
                                        We're here to connect food scrap donors
                                        and receivers in the composting
                                        community.
                                    </p>
                                </div>
                                <div className="bg-green-50 border-gray-700 p-6 rounded-lg shadow-lg">
                                    <h1 className="text-xl font-medium text-green-700">
                                        Our Mission{" "}
                                    </h1>
                                    <p className="text-md text-gray-700">
                                        Our mission is to create a cleaner,
                                        greener Singapore by turning food waste
                                        into a valuable resource.
                                    </p>
                                </div>
                                <div className="bg-green-50 border-gray-700 p-6 rounded-lg shadow-lg">
                                    <h1 className="text-xl font-medium text-green-700">
                                        Our Community{" "}
                                    </h1>
                                    <p className="text-md text-gray-700">
                                        Every contribution, big or small, makes
                                        a difference. Together, we can create a
                                        cleaner, greener Singapore.
                                    </p>
                                </div>

                                <p className="text-md text-gray-700">
                                    Thank you for being a part of{" "}
                                    <span className="text-green-500 font-semibold">
                                        ComPost
                                    </span>
                                    !
                                </p>
                            </div>
                            <div className="mt-4 flex justify-center items-center">
                                <Checkbox
                                    id="dont-show-again"
                                    onCheckedChange={() => {
                                        setDontShowAgain(!dontShowAgain);
                                    }}
                                />
                                <label
                                    htmlFor="dont-show-again"
                                    className="ml-2 text-gray-500 text-xs"
                                >
                                    Don't show this again
                                </label>
                            </div>
                            <div className="mt-4 flex justify-center">
                                <Button onClick={handleDialogClose}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            {/* <Link href="/about-us">
                <Button variant="ghost" className="w-fit h-fit rounded-full p-0 hover:bg-gray-200">
                    <Info color="#4d4c4c"/>
                </Button>
            </Link> */}
        </div>
    );
}
