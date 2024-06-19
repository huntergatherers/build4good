import { getCurrentUser, getCurrentUserId } from "@/lib/auth";
import prisma from "@/lib/db";
import ChatMessages from "./chatMessages";
export default async function ChatId({ params }: { params: { id: string } }) {
    const user = await getCurrentUser();
    if (!user) {
        return <div>Unauthorized</div>;
    }
    const conversation = await prisma.conversation.findUnique({
        where: {
            id: params.id,
        },
        include: {
            transaction: {
                include: {
                    Listing: {
                        include: {
                            Transaction: true,
                            profiles: true,
                        },
                    },
                },
            },
            message: true,
        },
    });

    console.log(conversation);
    return <ChatMessages conversation={conversation} user={user} />;
}
