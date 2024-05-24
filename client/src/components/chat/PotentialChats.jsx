import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
    const { user } = useContext(AuthContext);
    const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);
    return (
        <>
            <div className="all-users">
                {potentialChats && potentialChats.map((u, index) => {

                    return (
                        <div className="single-user" key={index} onClick={() => createChat(user._id, u._id)}>
                            {u.name}
                            <span className={
                                onlineUsers?.some((user) => user?.userId === u?._id) ? "user-online" : ""}></span> {/*Curly brackets are for javascriptquestion mark is basically saying "does it exist? or is it true?*/}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default PotentialChats;