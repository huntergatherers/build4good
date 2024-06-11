"use client";

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
import { toast } from "@/components/ui/use-toast";
import { ImagePlus, Minus, Package, PackageOpen, Plus } from "lucide-react";
import { useState } from "react";
import GreensImage from './assets/greens.png';
import BrownsImage from './assets/browns.png';
import CompostImage from './assets/compost.png';
import React from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Listing title must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Meet up location must be at least 2 characters.",
  }),
  action: z.string().refine((value) => value === "donate" || value === "receive", {
    message: "Please select at least one action (Donate or Receive).",
  }),
  type: z.string().refine((value) => value === "greens" || value === "browns" || value === "compost", {
    message: "Please select your item type.",
  }),
  amount: z.number().positive("Item amount must be greater than 0"),
  image: z.instanceof(File),
  deadline: z.date({
    required_error: "Please select a deadline",
  }),
  description: z.string(),
});

export default function CreateListing() {
  const [selectedAction, setSelectedAction] = useState(""); // State to track the selected action
  const [selectedType, setSelectedType] = useState("default");
  const [preview, setPreview] = useState<string | ArrayBuffer | null>("");
  const [goalGreens, setGoalGreens] = useState(0);
  const [goalBrowns, setGoalBrowns] = useState(0);
  const [goalCompost, setGoalCompost] = useState(0);

  function onClickGreens(adjustment: number) {
    setGoalGreens(goalGreens + adjustment);
    setGoalBrowns(0);
    setGoalCompost(0);
    form.setValue("amount", goalGreens + 1);
  }

  function onClickBrowns(adjustment: number) {
    setGoalBrowns(goalBrowns + adjustment);
    setGoalGreens(0);
    setGoalCompost(0);
    form.setValue("amount", goalBrowns + 1);
  }

  function onClickCompost(adjustment: number) {
    setGoalCompost(goalCompost + adjustment);
    setGoalBrowns(0);
    setGoalGreens(0);
    form.setValue("amount", goalCompost + 1);
  }

  function handleTypeClick(type: string) {
    setSelectedType(type); // Toggle the selected action
    if (type === "browns") {
      setGoalGreens(0);
      setGoalCompost(0);
    }
    if (type === "greens") {
      setGoalBrowns(0);
      setGoalCompost(0);
    }
    if (type === "browns") {
      setGoalGreens(0);
      setGoalCompost(0);
    }

    form.setValue("type", type); // Update the form value for the action field
    console.log(type);
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      action: "", // Add action field to store the selected action
      type: "",
      amount: 0,
      image: new File([""], "filename"),
      location: "",
      description: "",
    },
  });

  function handleActionClick(action: string) {
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
    [form],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 1000000,
      accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data.amount)} {JSON.stringify(data.type)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 space-y-6 w-screen">
        <div className="">
          <h1 className="text-xl font-semibold mb-2">Create a Listing</h1>
          <div className="flex space-x-4">
            <Button
              className={`bg-transparent border border-gray-500 rounded-xl text-black h-fit flex flex-col w-1/2 break-words whitespace-normal text-left items-start space-y-1 hover:bg-gray-300 ${
                selectedAction === "donate" ? "bg-gray-300" : ""
              }`}
              onClick={() => handleActionClick("donate")}
              type="button"
            >
              <PackageOpen />
              <p className="text-xs pt-1">Donate</p>
              <p className="text-xs text-gray-700 font-light">
                I want to give to the community
              </p>
            </Button>

            <Button
              className={`bg-transparent border border-gray-500 rounded-xl text-black h-fit flex flex-col w-1/2 break-words whitespace-normal text-left items-start space-y-1 hover:bg-gray-300 ${
                selectedAction === "receive" ? "bg-gray-300" : ""
              }`}
              onClick={() => handleActionClick("receive")}
              type="button"
            >
              <Package />
              <p className="text-xs pt-1">Receive</p>
              <p className="text-xs text-gray-700 font-light">
                I would like to receive from the community
              </p>
            </Button>
          </div>
          <FormMessage>
            {form.formState.errors.action && (
              <p className="text-red-500 text-sm mt-2">{form.formState.errors.action.message}</p>
            )}
          </FormMessage>
        </div>


          <div className="">
          <h1 className="text-xl font-semibold mb-2">
                I want to {selectedAction === 'donate' ? 'donate' : selectedAction === 'receive' ? 'receive' : "donate/receive"}...
            </h1>
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="font-normal text-[0.9rem]">Listing Title <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                        <Input className="text-xs" placeholder="Briefly describe what you are offering" {...field} />
                    </FormControl>
                    <FormMessage/>
                    </FormItem>
                   
                )}
                />
          </div>

          <div className="flex space-x-1">
          <div 
          className={`px-2 bg-gray-100 rounded-lg text-black h-70 flex flex-col w-1/3 break-words whitespace-normal text-left space-y-1 hover:shadow-lg ${selectedType !== "greens" && selectedType !== "default" ? "opacity-25" : ""} ${selectedType === "greens" ? "shadow-lg" : ""}`}
       
            onClick={() => {
                    handleTypeClick("greens");
            }}
          >
            <Image
                 className="rounded-xs my-2 w-fit h-[8vh]"
                src={GreensImage}
                width={500}
                height={500}
                alt="Picture Uploaded"
            />
            <p className="text-sm font-normal">Greens</p>
            <p className="text-[0.65rem] font-light">Vegetables and/or fruit scraps, grass clippings</p>
            <div className="flex items-center justify-center space-x-1 text-center px-2">
              <Button
                variant="outline"
                size="icon"
                className={`h-4 w-4 shrink-0 rounded-full bg-black hover:bg-gray-400 ${selectedType !== "greens" && selectedType !== "default" ? "opacity-50 pointer-events-none" : ""}`}
                onClick={() => onClickGreens(-1)}
                disabled={goalGreens <= 0}
                type="button"
              >
                <Minus className="h-2 w-2" color="white"/>
              </Button>
              <div className="flex text-center">
              <input
                type="number"
                value={goalGreens}
                onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                        setGoalGreens(value);
                        form.setValue("amount", value); // Update form value
                    }
                }}
                onClick={(e) => {
                    (e.target as HTMLInputElement).value = ""; 
                }}
                className="text-md font-bold w-full text-center bg-gray-100 hover:bg-gray-400"
            />
             <span className="font-normal mr-1">kg</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-4 w-4 shrink-0 rounded-full bg-black hover:bg-gray-400"
                onClick={() => onClickGreens(1)}
                type="button"
                // disabled={goal >= 400}
              >
                <Plus className="h-2 w-2" color="white"/>
              </Button>
            </div>
            </div>
            <div 
          className={`px-2 bg-gray-100 rounded-lg text-black h-70 flex flex-col w-1/3 break-words whitespace-normal text-left space-y-1 hover:shadow-lg ${selectedType !== "browns" && selectedType !== "default" ? "opacity-25" : ""} ${selectedType === "browns" ? "shadow-lg" : ""}`}
            onClick={() => {
                    handleTypeClick("browns");
            }}
          >
            <Image
                 className="rounded-xs my-2 w-fit h-[8vh]"
                src={BrownsImage}
                width={500}
                height={500}
                alt="Picture of the author"
            />
            <p className="text-sm font-normal">Browns</p>
            <p className="text-[0.65rem] font-light">Dry leaves, newspaper, dead plant clippings</p>
            <div className="flex items-center justify-center space-x-1 text-center px-2 pb-2">
              <Button
                variant="outline"
                size="icon"
                className={`h-4 w-4 shrink-0 rounded-full bg-black hover:bg-gray-400 ${selectedType !== "browns" && selectedType !== "default" ? "opacity-50 pointer-events-none" : ""}`}
                onClick={() => onClickBrowns(-1)}
                disabled={goalBrowns <= 0}
                type="button"
              >
                <Minus className="h-2 w-2" color="white"/>
              </Button>
              <div className="flex text-center">
              <input
                type="number"
                value={goalBrowns}
                onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                        setGoalBrowns(value);
                        form.setValue("amount", value); // Update form value
                    }
                }}
                onClick={(e) => {
                    (e.target as HTMLInputElement).value = ""; // Clear the input value when clicked
                }}
                className="text-md font-bold w-full text-center bg-gray-100"
            />
             <span className="font-normal mr-1">kg</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-4 w-4 shrink-0 rounded-full bg-black hover:bg-gray-400"
                onClick={() => onClickBrowns(1)}
                type="button"
              >
                <Plus className="h-2 w-2" color="white"/>
              </Button>
            </div>
            </div>
            <div 
          className={`px-2 bg-gray-100 rounded-lg text-black h-70 flex flex-col w-1/3 break-words whitespace-normal text-left space-y-1 hover:shadow-lg ${selectedType !== "compost" && selectedType !== "default" ? "opacity-25" : ""} ${selectedType === "compost" ? "shadow-lg" : ""}`}
            onClick={() => {
                    handleTypeClick("compost");
            }}
          >
            <Image
                className="rounded-xs my-2 w-fit h-[8vh]"
                src={CompostImage}
                width={500}
                height={500}
                alt="Picture of the author"
            />
            <p className="text-sm font-normal">Compost</p>
            <p className="text-[0.65rem] font-light">Plant fertiliser to improve soil's properties</p>
            <div className="flex items-center justify-center space-x-1 text-center px-2 pb-2">
              <Button
                variant="outline"
                size="icon"
                className={`h-4 w-4 shrink-0 rounded-full bg-black hover:bg-gray-400 ${selectedType !== "compost" && selectedType !== "default" ? "opacity-50 pointer-events-none" : ""}`}
                onClick={() => onClickCompost(-1)}
                disabled={goalCompost <= 0}
                type="button"
              >
                <Minus className="h-2 w-2" color="white"/>
              </Button>
              <div className="flex text-center">
              <input
                type="number"
                value={goalCompost}
                onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                        setGoalCompost(value);
                        form.setValue("amount", value); // Update form value
                    }
                }}
                onClick={(e) => {
                    (e.target as HTMLInputElement).value = ""; // Clear the input value when clicked
                }}
                className="text-md font-bold w-full text-center bg-gray-100 hover:bg-gray-400"
            />
             <span className="font-normal mr-1">kg</span>

            </div>
              <Button
                variant="outline"
                size="icon"
                className="h-4 w-4 shrink-0 rounded-full bg-black"
                onClick={() => onClickCompost(1)}
                type="button"
              >
                <Plus className="h-2 w-2" color="white"/>
              </Button>
            </div>
            </div>
           
          </div>
          <FormMessage>
            {form.formState.errors.type &&(
              <p className="text-red-500 text-sm mt-2">{form.formState.errors.type.message}</p>
            )}
          </FormMessage>
          <FormMessage>
            {!form.formState.errors.type && form.formState.errors.amount && (
              <p className="text-red-500 text-sm mt-2">{form.formState.errors.amount.message}</p>
            )}
          </FormMessage>
          <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem className="mx-auto md:w-1/2">
              <FormLabel
                className={`${
                  fileRejections.length !== 0 && "text-destructive"
                }`}
              >
                <h2 className="font-normal text-[0.9rem]">
                  Upload your image
                  <span
                    className={
                      form.formState.errors.image || fileRejections.length !== 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }
                  ></span>
                </h2>
              </FormLabel>
              <FormControl>
                <div
                  {...getRootProps()}
                  className="mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-foreground p-8 shadow-foreground"
                >
                  {preview && (
                    <img
                      src={preview as string}
                      alt="Uploaded image"
                      className="h-full rounded-lg"
                    />
                  )}
                  <ImagePlus
                    className={`size-10 ${preview ? "hidden" : "block"}`}
                  />
                  <Input {...getInputProps()} type="file" />
                  {isDragActive ? (
                    <p>Drop the image!</p>
                  ) : (
                    <p className= {`text-xs text-gray-700 ${preview ? "hidden" : "block"}`}>
                        Click here or drag an image to upload it</p>
                  )}
                </div>
              </FormControl>
              <FormMessage>
                {fileRejections.length !== 0 && (
                  <p>
                    Image must be less than 1MB and of type png, jpg, or jpeg
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
              <FormLabel className="font-normal text-[0.9rem]">Date <span className="text-red-500">*</span></FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "items-start justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                    <CalendarIcon className="mr-1 h-4 w-4 opacity-50" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span className="text-xs text-left">Pick a date for the listing's expiry</span>
                      )}
                    
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
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
                    <FormLabel className="font-normal text-[0.9rem]">Meet-up Location <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                        <Input className="text-xs" placeholder="Location for pick ups" {...field} />
                    </FormControl>
                    <FormMessage/>
                    </FormItem>
                   
                )}
                />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal text-[0.9rem]">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type any custom instructions you may have here"
                  className="resize-none text-xs"
                  {...field}
                />
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center" >
        <Button type="submit" className="mb-4">Submit</Button>
        </div>
        </form>
      </Form>
    );
  }
