import { getCurrentUserId } from "@/lib/auth";
import prisma from "@/lib/db";
import ChatMessages from "./chatMessages";
export default async function ChatId({ params }: { params: { id: string } }) {
    const userId = await getCurrentUserId();
    if (!userId) {
        return <div>Unauthorized</div>;
    }
    const conversation = await prisma.conversation.findUnique({
        where: {
            id: params.id,
        },
        include: {
            transaction: true,
            message: true,
        },
    });
    console.log(conversation);
    return <ChatMessages conversation={conversation} userId={userId} />;
}
