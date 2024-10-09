import apiClient from "@/api/api";

const handleCreateMessage = (senderId, receiverId, content, mediaUrl) => {
    try {
        return apiClient.post(`/create`, {
            senderId: senderId,
            receiverId: receiverId,
            content: content,
            mediaUrl: mediaUrl
        })
    } catch (error) {
        console.error(error);
    }
};

const handleGetMessageDetails = (messageId) => {
    try {
        return apiClient.get(`/:messageId`, {
            messageId: messageId,
        })
    } catch (error) {
        console.error(error);
    }
}

const handleGetMessageByUser = (userId) => {
    try {
        return apiClient.get(`/messages-user/:userId`, {
            userId: userId,
        })
    } catch (error) {
        console.error(error);
    }
}

export default{
    handleCreateMessage,
    handleGetMessageDetails,
    handleGetMessageByUser
}