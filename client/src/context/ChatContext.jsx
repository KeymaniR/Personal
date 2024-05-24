import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";


export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null); //Initial value is set to null
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    console.log("notifications", notifications);

    //initialize socket. Connect client to server and vice versa

    useEffect(() => {
        const newSocket = io("http://localhost:3000"); //socket port should be different from client and server ports
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, [user]); // A dependency means that whenever you have a new one, run the effect


    //Add online Users
    useEffect(() => {

        if (socket === null) return;
        socket.emit("addNewUser", user?._id);//Use emit to trigger event we made in index

        socket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res);
        });

        return () => {
            socket.off("getOnlineUsers");
        };

    }, [socket]); //Whenever socket changes run it again


    //Send Message to the server in real time

    useEffect(() => {

        if (socket === null) return;

        const recipientId = currentChat?.members?.find((id) => id !== user?._id);

        socket.emit("sendMessage", { ...newMessage, recipientId });

    }, [newMessage]);

    //Recieve message and notif

    useEffect(() => {

        if (socket === null) return;

        socket.on("getMessage", (res) => {
            if (currentChat?._id !== res.chatId) return;

            setMessages((prev) => [...prev, res]);

        });

        socket.on("getNotification", (res) => {
            const isChatOpen = currentChat?.members.some(id => id === res.senderId) //if true this means we currently have this chat open with person who is sending the message

            if (isChatOpen) {
                setNotifications(prev => [{ ...res, isRead: true }, ...prev]) //Combining the previous notifications with the current one
            } else {
                setNotifications(prev => [res, ...prev])
            }
        }) //Listening to get notif event

        return () => { //Clean up function
            socket.off("getMessage");
            socket.off("getNotification");
        }

    }, [socket, currentChat]);


    useEffect(() => {
        const getUsers = async () => {
            const response = await getRequest(`${baseUrl}/users`);
            if (response.error) {
                return console.log("Error fetching users", response);
            }

            const pChats = response.filter((u) => { //This is to get each user one at a time
                let isChatCreated = false;
                if (user?._id === u._id) return false; //Check to make sure the user youre trying to connect to is not yourself

                if (userChats) {
                    isChatCreated = userChats?.some((chat) => {
                        return chat.members[0] === u._id || chat.members[1] === u._id;   //Checking if the current id already has a chat with the current user
                    })
                }
                return !isChatCreated;

            });
            setPotentialChats(pChats);
            setAllUsers(response);
        }
        getUsers();
    }, [userChats])

    useEffect(() => {
        const getUserChats = async () => {
            if (user?._id) {

                setIsUserChatsLoading(true);
                setUserChatsError(null);
                const response = await getRequest(`${baseUrl}/chats/${user?._id}`); //This is how we would get our chats

                setIsUserChatsLoading(false);

                if (response.error) {
                    return setUserChatsError(response);
                }

                setUserChats(response)

            }
        }
        getUserChats();
    }, [user, notifications]);


    useEffect(() => {
        const getMessages = async () => {

            setIsMessagesLoading(true);
            setMessagesError(null)

            const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`); //This is how we would get our chats

            setIsMessagesLoading(false);

            if (response.error) {
                return setMessagesError(response);
            }

            setMessages(response);

        }
        getMessages();
    }, [currentChat]);


    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {

        if (!textMessage) return console.log("You must type something...");

        const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({
            chatId: currentChatId,
            senderId: sender._id,
            text: textMessage
        })
        );

        if (response.error) {
            return setSendTextMessageError(response);
        }

        setNewMessage(response);
        setMessages((prev) => [...prev, response])
        setTextMessage("");

    },

        []);

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat);


    }, []);


    const createChat = useCallback(async (firstId, secondId) => {

        const response = await postRequest(`${baseUrl}/chats`,
            JSON.stringify({
                firstId,
                secondId
            })
        );

        if (response.error) {
            return console.log("Error creating chat", repsonse);
        }

        setUserChats((prev) => [...prev, response]);
    }, []);


    const markAllNotificationsAsRead = useCallback(() => {

        const mNotifications = notifications.map(n => {
            return { ...n, isRead: true };
        });

        setNotifications(mNotifications);

    }, []);

    const markNotificationAsRead = useCallback((n, userChats, user, notifications) => {
        //Find chats to open

        const desiredChat = userChats.find(chat => {
            const chatMembers = [user._id, n.senderId]
            const isDesiredChat = chat?.members.every((member) => {
                return chatMembers.includes(member);
            });
            return isDesiredChat
        });

        //Mark notification as read
        const mNotifications = notifications.map(el => {
            if (n.senderId === el.senderId) {
                return { ...n, isRead: true }
            } else {
                return el;
            }

        })

        updateCurrentChat(desiredChat);
        setNotifications(mNotifications);
    }, []);

    const markThisUserNotificationsAsRead = useCallback((thisUserNotifications, notifications) => {
        //Mark notifications as read

        const mNotifications = notifications.map(el => {
            let notification;

            thisUserNotifications.forEach(n => {
                if (n.senderId === el.senderId) {
                    notification = { ...n, isRead: true }
                } else {
                    notification = el;
                }
            })

            return notification
        })
        setNotifications(mNotifications);
    }, [])

    return <ChatContext.Provider value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        currentChat,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        markThisUserNotificationsAsRead
    }}
    >
        {children}
    </ChatContext.Provider>
};

