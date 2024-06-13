"use client";
import { Autocomplete, Libraries, useLoadScript } from "@react-google-maps/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { CalendarIcon } from "lucide-react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ImagePlus, Minus, Package, PackageOpen, Plus } from "lucide-react";
import { useState } from "react";

import React from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { createListing } from "@/lib/actions";
import { listing_item_type_enum, listing_type_enum } from "@prisma/client";
import CreationBreadcrumbs from "./creation-breadcrumbs";

interface UserLocation {
    latitude: number;
    longitude: number;
}

export const CreateListingFormSchema = z.object({
    title: z.string().min(2, {
        message: "Listing title must be at least 2 characters.",
    }),
    location: z.object({
        latitude: z
            .number()
            .min(-90)
            .max(90, "Latitude must be between -90 and 90"),
        longitude: z
            .number()
            .min(-180)
            .max(180, "Longitude must be between -180 and 180"),
    }),
    action: z.enum(["donate", "receive"]),
    type: z.enum(["greens", "browns", "compost"]),
    amount: z.number().positive("Item amount must be greater than 0"),
    image: z.instanceof(File, { message: "Please select an image" }),
    deadline: z.date({
        required_error: "Please select a deadline",
    }),
    description: z.string(),
});

export default function CreateListing() {
    const [selectedAction, setSelectedAction] = useState(""); // State to track the selected action
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | ArrayBuffer | null>("");
    const [goalGreens, setGoalGreens] = useState(0);
    const [goalBrowns, setGoalBrowns] = useState(0);
    const [goalCompost, setGoalCompost] = useState(0);
    const [location, setLocation] =
        useState<google.maps.places.Autocomplete | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const { toast } = useToast();
    const placesLibrary: Libraries = ["places"];
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS!,
        libraries: placesLibrary,
    });

    function onClickGreens(adjustment: number) {
        if (selectedType !== "greens" && form.getValues("amount") !== 0) {
            return;
        }
        setSelectedType("greens");
        form.setValue("type", listing_item_type_enum.greens);
        setGoalGreens(goalGreens + adjustment);
        setGoalBrowns(0);
        setGoalCompost(0);
        form.setValue("amount", goalGreens + adjustment);
        if (goalGreens + adjustment === 0) {
            setSelectedType(null);
        }
    }

    function onClickBrowns(adjustment: number) {
        if (selectedType !== "browns" && form.getValues("amount") !== 0) {
            return;
        }
        setSelectedType("browns");
        form.setValue("type", listing_item_type_enum.browns);
        setGoalBrowns(goalBrowns + adjustment);
        setGoalGreens(0);
        setGoalCompost(0);
        form.setValue("amount", goalBrowns + adjustment);
        if (goalBrowns + adjustment === 0) {
            setSelectedType(null);
        }
    }

    function onClickCompost(adjustment: number) {
        if (selectedType !== "compost" && form.getValues("amount") !== 0) {
            return;
        }
        setSelectedType("compost");
        form.setValue("type", listing_item_type_enum.compost);
        setGoalCompost(goalCompost + adjustment);
        setGoalBrowns(0);
        setGoalGreens(0);
        form.setValue("amount", goalCompost + adjustment);
        if (goalCompost + adjustment === 0) {
            setSelectedType(null);
        }
    }

    function handleTypeClick(type: listing_item_type_enum) {
        if (selectedType !== type && form.getValues("amount") !== 0) {
            return;
        }
        setSelectedType(type); // Toggle the selected action
        if (type === "browns") {
            setGoalGreens(0);
            setGoalCompost(0);
        }
        if (type === "greens") {
            setGoalBrowns(0);
            setGoalCompost(0);
        }
        if (type === "compost") {
            setGoalGreens(0);
            setGoalBrowns(0);
        }

        form.setValue("type", type); // Update the form value for the action field
        console.log(type);
    }

    const form = useForm<z.infer<typeof CreateListingFormSchema>>({
        resolver: zodResolver(CreateListingFormSchema),
        defaultValues: {
            title: "",
            action: undefined, // Add action field to store the selected action
            type: undefined,
            amount: 0,
            image: undefined,
            location: undefined,
            description: "",
        },
    });

    function handleActionClick(action: listing_type_enum) {
        setSelectedAction(action); // Toggle the selected action
        form.setValue("action", action); // Update the form value for the action field
    }

    const onDrop = React.useCallback(
        (acceptedFiles: File[]) => {
            const reader = new FileReader();
            try {
                reader.onload = () => setPreview(reader.result);
                reader.readAsDataURL(acceptedFiles[0]);
                form.setValue("image", acceptedFiles[0]);
                form.clearErrors("image");
            } catch (error) {
                setPreview(null);
                form.resetField("image");
            }
        },
        [form]
    );

    const { getRootProps, getInputProps, isDragActive, fileRejections } =
        useDropzone({
            onDrop,
            maxFiles: 1,
            maxSize: 10000000,
            accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
        });

    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
    };

    async function onSubmit(data: z.infer<typeof CreateListingFormSchema>) {
        const newData = {
            ...data,
            image: "test",
        };
        setIsSubmitting(true);
        const result = await createListing(newData);
        toast({
            className: "bg-green-600 text-white",
            title: "Listing Created",
            description: "Your listing has been successfully created",
        });
        setIsSubmitting(false);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="px-6 space-y-6 w-screen"
            >
                <h1 className="text-xl font-semibold mb-6">Create a Listing</h1>
                <CreationBreadcrumbs step={step} totalSteps={3} />
                {/* FIRST STEP: SELECT DONATE/RECEIVE */}
                {step === 1 && (
                    <div className="h-[70vh]">
                        {error && <p>Error: {error}</p>}
                        <div className="flex flex-col justify-evenly h-full space-y-5">
                            <Button
                                className={`bg-transparent border border-gray-400 rounded-xl text-black flex flex-col h-1/2 break-words whitespace-normal text-left items-start space-y-1 hover:bg-none ${
                                    selectedAction === "donate"
                                        ? "bg-primary"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleActionClick(listing_type_enum.donate)
                                }
                                type="button"
                            >
                                <PackageOpen
                                    size={80}
                                    color={
                                        selectedAction === "donate"
                                            ? "white"
                                            : "black"
                                    }
                                />
                                <p
                                    className={`text-2xl pt-1 ${
                                        selectedAction === "donate"
                                            ? "text-white"
                                            : ""
                                    }`}
                                >
                                    Contribute
                                </p>
                                <p
                                    className={`text-xl font-light ${
                                        selectedAction === "donate"
                                            ? "text-white"
                                            : "text-gray-700"
                                    }`}
                                >
                                    I want to give to the community
                                </p>
                            </Button>
                            <Button
                                className={`bg-transparent border border-gray-400 rounded-xl text-black flex flex-col h-1/2 break-words whitespace-normal text-left items-start space-y-1 ${
                                    selectedAction === "receive"
                                        ? "bg-primary"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleActionClick(listing_type_enum.receive)
                                }
                                type="button"
                            >
                                <Package
                                    size={80}
                                    color={
                                        selectedAction === "receive"
                                            ? "white"
                                            : "black"
                                    }
                                />
                                <p
                                    className={`text-2xl pt-1 ${
                                        selectedAction === "receive"
                                            ? "text-white"
                                            : ""
                                    }`}
                                >
                                    Receive
                                </p>
                                <p
                                    className={`text-xl font-light ${
                                        selectedAction === "receive"
                                            ? "text-white"
                                            : "text-gray-700"
                                    }`}
                                >
                                    I would like to receive from the community
                                </p>
                            </Button>
                        </div>
                        <FormMessage>
                            {form.formState.errors.action && (
                                <p className="text-red-500 text-sm mt-2">
                                    {form.formState.errors.action.message}
                                </p>
                            )}
                        </FormMessage>
                        <Button
                            className="w-full mt-6"
                            disabled={!selectedAction}
                            onClick={() => setStep(2)}
                        >
                            Next
                        </Button>
                    </div>
                )}

                {/* SECOND STEP: SELECT CATEGORY */}
                {step === 2 && (
                    <div>
                        <h1 className="text-xl font-semibold">
                            {selectedAction === "donate"
                                ? "What will you be contributing?"
                                : "What do you want to receive?"}
                        </h1>
                        <p className="mb-4 text-red-500 font-semibold">
                            Pick one only.
                        </p>
                        <div>
                            <div className="flex flex-col space-y-4">
                                <div
                                    className={`p-4 bg-gray-100 rounded-lg text-black h-70 flex flex-col w-full break-words whitespace-normal text-left ${
                                        selectedType !== "greens" &&
                                        selectedType
                                            ? "opacity-25"
                                            : ""
                                    } ${
                                        selectedType === "greens"
                                            ? "shadow-lg"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        handleTypeClick(
                                            listing_item_type_enum.greens
                                        );
                                    }}
                                >
                                    <Image
                                        className="rounded-xs my-2 w-full h-[20vh] rounded-md object-cover"
                                        src="https://images.unsplash.com/photo-1597362925123-77861d3fbac7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        width={500}
                                        height={500}
                                        alt="Picture Uploaded"
                                    />
                                    <p className="text-2xl font-semibold">
                                        Greens
                                    </p>
                                    <p className="text-xl">
                                        Vegetables and/or fruit scraps, grass
                                        clippings
                                    </p>
                                    <div className="flex items-center justify-center space-x-1 text-center px-2 mt-6">
                                        <Button
                                            size="icon"
                                            className={`h-10 w-10 shrink-0 rounded-full bg-black ${
                                                selectedType !== "greens" &&
                                                selectedType
                                                    ? "opacity-50 pointer-events-none"
                                                    : ""
                                            }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onClickGreens(-1);
                                            }}
                                            disabled={goalGreens <= 0}
                                            type="button"
                                        >
                                            <Minus
                                                className="h-4 w-4"
                                                color="white"
                                            />
                                        </Button>
                                        <div className="flex text-center">
                                            <input
                                                type="text"
                                                disabled={
                                                    selectedType !== "greens"
                                                }
                                                value={goalGreens}
                                                onChange={(e) => {
                                                    const value = parseInt(
                                                        e.target.value
                                                    );
                                                    if (!isNaN(value)) {
                                                        setGoalGreens(value);
                                                        form.setValue(
                                                            "amount",
                                                            value
                                                        ); // Update form value
                                                    } else {
                                                        setGoalGreens(0);
                                                        form.setValue(
                                                            "amount",
                                                            0
                                                        );
                                                    }
                                                }}
                                                className="text-xl font-bold w-full text-center bg-gray-100"
                                            />
                                        </div>
                                        <Button
                                            size="icon"
                                            className="h-10 w-10 shrink-0 rounded-full bg-black"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onClickGreens(1);
                                            }}
                                            type="button"
                                            // disabled={goal >= 400}
                                        >
                                            <Plus
                                                className="h-4 w-4"
                                                color="white"
                                            />
                                        </Button>
                                    </div>
                                    <span className="font-normal self-center pb-2">
                                        kg
                                    </span>
                                </div>
                                <div
                                    className={`p-4 bg-gray-100 rounded-lg text-black h-70 flex flex-col w-full break-words whitespace-normal text-left ${
                                        selectedType !== "browns" &&
                                        selectedType
                                            ? "opacity-25"
                                            : ""
                                    } ${
                                        selectedType === "browns"
                                            ? "shadow-lg"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        handleTypeClick(
                                            listing_item_type_enum.browns
                                        );
                                    }}
                                >
                                    <Image
                                        className="rounded-xs my-2 w-full h-[20vh] rounded-md object-cover"
                                        src="https://images.unsplash.com/photo-1517424340038-3c3972e627d5?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        width={500}
                                        height={500}
                                        alt="Picture of the author"
                                    />
                                    <p className="text-2xl font-semibold">
                                        Browns
                                    </p>
                                    <p className="text-xl">
                                        Dry leaves, newspaper, dead plant
                                        clippings
                                    </p>
                                    <div className="flex items-center justify-center space-x-1 text-center px-2 mt-6">
                                        <Button
                                            size="icon"
                                            className={`h-10 w-10 shrink-0 rounded-full bg-black ${
                                                selectedType !== "browns" &&
                                                selectedType
                                                    ? "opacity-50 pointer-events-none"
                                                    : ""
                                            }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onClickBrowns(-1);
                                            }}
                                            disabled={goalBrowns <= 0}
                                            type="button"
                                        >
                                            <Minus
                                                className="h-4 w-4"
                                                color="white"
                                            />
                                        </Button>
                                        <div className="flex text-center">
                                            <input
                                                type="text"
                                                disabled={
                                                    selectedType !== "browns"
                                                }
                                                value={goalBrowns}
                                                onChange={(e) => {
                                                    const value = parseInt(
                                                        e.target.value
                                                    );
                                                    if (!isNaN(value)) {
                                                        setGoalBrowns(value);
                                                        form.setValue(
                                                            "amount",
                                                            value
                                                        ); // Update form value
                                                    } else {
                                                        setGoalBrowns(0);
                                                        form.setValue(
                                                            "amount",
                                                            0
                                                        );
                                                    }
                                                }}
                                                className="text-xl font-bold w-full text-center bg-gray-100"
                                            />
                                        </div>
                                        <Button
                                            size="icon"
                                            className="h-10 w-10 shrink-0 rounded-full bg-black"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onClickBrowns(1);
                                            }}
                                            type="button"
                                        >
                                            <Plus
                                                className="h-4 w-4"
                                                color="white"
                                            />
                                        </Button>
                                    </div>
                                    <span className="font-normal self-center pb-2">
                                        kg
                                    </span>
                                </div>
                                <div
                                    className={`p-4 bg-gray-100 rounded-lg text-black h-70 flex flex-col w-full break-words whitespace-normal text-left ${
                                        selectedType !== "compost" &&
                                        selectedType
                                            ? "opacity-25"
                                            : ""
                                    } ${
                                        selectedType === "compost"
                                            ? "shadow-lg"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        handleTypeClick(
                                            listing_item_type_enum.compost
                                        );
                                    }}
                                >
                                    <Image
                                        className="rounded-xs my-2 w-full h-[20vh] object-cover rounded-md"
                                        src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        width={500}
                                        height={500}
                                        alt="Picture of the author"
                                    />
                                    <p className="text-2xl font-semibold">
                                        Compost
                                    </p>
                                    <p className="text-xl">
                                        Plant fertiliser to improve soil's
                                        properties
                                    </p>
                                    <div className="flex items-center justify-center space-x-1 text-center px-2 mt-6">
                                        <Button
                                            size="icon"
                                            className={`h-10 w-10 shrink-0 rounded-full bg-black ${
                                                selectedType !== "compost" &&
                                                selectedType
                                                    ? "opacity-50 pointer-events-none"
                                                    : ""
                                            }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onClickCompost(-1);
                                            }}
                                            disabled={goalCompost <= 0}
                                            type="button"
                                        >
                                            <Minus
                                                className="h-4 w-4"
                                                color="white"
                                            />
                                        </Button>
                                        <div className="flex text-center">
                                            <input
                                                disabled={
                                                    selectedType !== "compost"
                                                }
                                                type="text"
                                                value={goalCompost}
                                                onChange={(e) => {
                                                    const value = parseInt(
                                                        e.target.value
                                                    );
                                                    if (!isNaN(value)) {
                                                        setGoalCompost(value);
                                                        form.setValue(
                                                            "amount",
                                                            value
                                                        ); // Update form value
                                                    } else {
                                                        setGoalCompost(0);
                                                        form.setValue(
                                                            "amount",
                                                            0
                                                        );
                                                    }
                                                }}
                                                className="text-xl font-bold w-full text-center bg-gray-100"
                                            />
                                        </div>
                                        <Button
                                            size="icon"
                                            className="h-10 w-10 shrink-0 rounded-full bg-black"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onClickCompost(1);
                                            }}
                                            type="button"
                                        >
                                            <Plus
                                                className="h-4 w-4"
                                                color="white"
                                            />
                                        </Button>
                                    </div>
                                    <span className="font-normal self-center pb-2">
                                        kg
                                    </span>
                                </div>
                            </div>
                            <FormMessage>
                                {form.formState.errors.type && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {form.formState.errors.type.message}
                                    </p>
                                )}
                            </FormMessage>
                        </div>
                        <FormMessage>
                            {!form.formState.errors.type &&
                                form.formState.errors.amount && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {form.formState.errors.amount.message}
                                    </p>
                                )}
                        </FormMessage>
                        <div className="flex justify-between space-x-4 pb-4 bottom-0 sticky bg-white pt-4">
                            <Button
                                className="w-full"
                                onClick={() => setStep(1)}
                                type="button"
                            >
                                Back
                            </Button>
                            <Button
                                className="w-full"
                                disabled={
                                    !selectedType ||
                                    form.getValues("amount") === 0
                                }
                                onClick={() => setStep(3)}
                                type="button"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                {/* THIRD STEP: FILL IN DETAILS */}
                {step === 3 && (
                    <>
                        <div className="">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-normal text-md">
                                            Listing Title
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Briefly describe your listing"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="image"
                            render={() => (
                                <FormItem className="mx-auto md:w-1/2">
                                    <FormLabel
                                        className={`${
                                            fileRejections.length !== 0 &&
                                            "text-destructive"
                                        }`}
                                    >
                                        <div className="font-normal text-md">
                                            Upload Image
                                            <span className="text-red-500">
                                                *
                                            </span>
                                            <p
                                                className={
                                                    form.formState.errors
                                                        .image ||
                                                    fileRejections.length !== 0
                                                        ? "text-destructive"
                                                        : "text-muted-foreground"
                                                }
                                            ></p>
                                        </div>
                                        {selectedAction && (
                                            <p className="text-xs text-gray-400 font-normal mt-1">
                                                {selectedAction === "donate"
                                                    ? "Show the community what you are contributing"
                                                    : "Show the community what they will be contributing to"}
                                            </p>
                                        )}
                                    </FormLabel>
                                    <FormControl>
                                        <div
                                            {...getRootProps()}
                                            className={`mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-foreground shadow-foreground ${
                                                !preview && "p-8"
                                            }`}
                                        >
                                            {preview && (
                                                <div className="w-full h-56 relative">
                                                    <Image
                                                        src={preview as string}
                                                        alt="Uploaded image"
                                                        layout="fill"
                                                        objectFit="cover"
                                                        className="rounded-lg"
                                                    />
                                                </div>
                                            )}

                                            <ImagePlus
                                                className={`size-10 ${
                                                    preview ? "hidden" : "block"
                                                }`}
                                            />
                                            <Input
                                                {...getInputProps()}
                                                type="file"
                                            />
                                            {isDragActive ? (
                                                <p>Drop the image!</p>
                                            ) : (
                                                <p
                                                    className={`text-xs text-gray-700 ${
                                                        preview
                                                            ? "hidden"
                                                            : "block"
                                                    }`}
                                                >
                                                    Click here or drag an image
                                                    to upload it
                                                </p>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage>
                                        {fileRejections.length !== 0 && (
                                            <p>
                                                Image must be less than 1MB and
                                                of type png, jpg, or jpeg
                                            </p>
                                        )}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deadline"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="font-normal text-md">
                                        Deadline
                                        <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormDescription className="text-xs">
                                        Select the date for the listing's expiry
                                    </FormDescription>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "items-center justify-start text-left font-normal",
                                                        !field.value &&
                                                            "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-1 h-4 w-4 opacity-50" />
                                                    {field.value ? (
                                                        format(
                                                            field.value,
                                                            "PPP"
                                                        )
                                                    ) : (
                                                        <span className="text-xs text-left">
                                                            Pick a date for the
                                                            listing's expiry
                                                        </span>
                                                    )}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date()
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-normal text-md">
                                        Meet-up Location
                                        <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormDescription className="text-xs">
                                        We will mask your exact location until a
                                        match is made
                                    </FormDescription>
                                    <FormControl>
                                        {/* {location ? (
                                            <div>
                                                Current Location:{" "}
                                                {`${location.latitude}, ${location.longitude}`}
                                                .
                                            </div>
                                        ) : (
                                            <Button
                                                onClick={requestLocation}
                                                className="mb-2"
                                                type="button"
                                            >
                                                Retrieve my current location
                                            </Button>
                                        )} */}

                                        {isLoaded && (
                                            <Autocomplete
                                                restrictions={{ country: "sg" }}
                                                onLoad={(autocomplete) =>
                                                    setLocation(autocomplete)
                                                }
                                                onPlaceChanged={() => {
                                                    const place =
                                                        location?.getPlace();
                                                    if (!place) return;
                                                    const geometry =
                                                        place.geometry;
                                                    if (!geometry) return;
                                                    const lng =
                                                        place!.geometry!.location?.lng();
                                                    const lat =
                                                        place!.geometry!.location?.lat();

                                                    if (lng && lat) {
                                                        form.setValue(
                                                            "location",
                                                            {
                                                                longitude: lng,
                                                                latitude: lat,
                                                            }
                                                        );
                                                    }
                                                }}
                                                fields={[
                                                    "geometry.location",
                                                    "formatted_address",
                                                ]}
                                            >
                                                <Input placeholder="Enter your address" />
                                            </Autocomplete>
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-normal text-md">
                                        Description (optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Include any additional information or custom instructions you may have"
                                            className="resize-none text-md"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-col justify-center items-center space-y-4 pb-4">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? "Creating listing..."
                                    : "Create listing"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setStep(2)}
                                type="button"
                                className="w-full"
                            >
                                Back
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </Form>
    );
}
