"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from "@/lib/actions";
import { LoaderCircle, SendHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";
export default function CommentBox({
    listingId,
    parentId,
}: {
    listingId: number;
    parentId: string | null;
}) {
    const [newComment, setNewComment] = useState("");
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();
    return (
        <div className="flex flex-col w-full">
            <form
                onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    if (isPending) return;
                    try {
                        setIsPending(true);
                        await createComment(newComment, listingId, parentId);
                        router.refresh();
                        setNewComment("");
                    } catch (error) {
                        console.error(error);
                    }
                    setIsPending(false);
                }}
                className="flex flex-col w-full mt-2"
            >
                {parentId ? (
                    <div className="flex">
                        <div>
                            <Separator
                                orientation="vertical"
                                className="w-[1.5px] h-8 rounded-t-full"
                            />
                            <Separator
                                orientation="horizontal"
                                className="w-[20px] h-[1.5px] rounded-r-full"
                            />
                        </div>
                        <div className="w-full ml-4">
                            <div className="text-sm text-gray-500 mb-2">
                                Replying to a comment
                            </div>
                            <Textarea
                                disabled={isPending}
                                className="w-full p-4 bg-background border border-foreground rounded-lg h-2 text-md"
                                placeholder={
                                    parentId
                                        ? "Add a reply..."
                                        : "Add a comment..."
                                }
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <div className="flex justify-end mt-2">
                                <Button
                                    type="submit"
                                    disabled={
                                        isPending || newComment.length == 0
                                    }
                                >
                                    {isPending ? (
                                        <div className="animate-spin">
                                            <LoaderCircle />
                                        </div>
                                    ) : (
                                        <>
                                            <SendHorizontal
                                                size={18}
                                                className="mr-2"
                                            />
                                            {parentId ? "Reply" : "Send"}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <Textarea
                            disabled={isPending}
                            className="w-full p-4 bg-background border border-foreground rounded-lg h-2 text-md"
                            placeholder={
                                parentId ? "Add a reply..." : "Add a comment..."
                            }
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <div className="flex justify-end mt-2">
                            <Button
                                type="submit"
                                disabled={isPending || newComment.length == 0}
                            >
                                {isPending ? (
                                    <div className="animate-spin">
                                        <LoaderCircle />
                                    </div>
                                ) : (
                                    <>
                                        <SendHorizontal
                                            size={18}
                                            className="mr-2"
                                        />
                                        {parentId ? "Reply" : "Send"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
