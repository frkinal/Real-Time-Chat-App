import React, { useEffect, useState } from "react";

import { Avatar, Phone, Plus, Send } from "../../assets";
import Input from "../../components/input";
import { io } from "socket.io-client";

const Dashboard = () => {
  const [user] = useState<{
    id: string;
    fullName: string;
    email: string;
  }>(JSON.parse(localStorage.getItem("user:detail") || "{}"));
  const [conversations, setConversations] = useState<Array<any>>([]);
  const [messages, setMessages] = useState<{
    messages: Array<any>;
    receiver: {
      id: string;
      fullName: string;
      email: string;
    };
    conversationId?: string;
  }>({
    messages: [],
    receiver: { id: "", fullName: "", email: "" },
    conversationId: "",
  });
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<Array<any>>([]);
  const [socket, setSocket] = useState<any>(null);

  const messageRef = React.useRef<any>(null);

  useEffect(() => {
    setSocket(io("http://localhost:8080"));
  }, []);

  useEffect(() => {
    socket?.emit("addUser", user?.id);
    socket?.on("getUsers", (users: any) => {
      console.log("Active User -> ", users);
    });
    socket?.on("getMessage", (data: any) => {
      setMessages((prev: any) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { user: data.user, message: data.message },
        ],
      }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    const loggedInUser = JSON.parse(
      localStorage.getItem("user:detail") || "{}"
    );
    const fetchConversations = async () => {
      const res = await fetch(
        `http://localhost:8000/api/conversations/${loggedInUser?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("asdasd");
      const resData = await res.json();
      setConversations(resData);
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`http://localhost:8000/api/users/${user?.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resData = await res.json();
      setUsers(resData);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    messageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.messages]);

  const fetchMessages = async ({
    conversationId,
    receiver,
  }: {
    conversationId: string;
    receiver: {
      id: string;
      email: string;
      fullName: string;
    };
  }) => {
    const res = await fetch(
      `http://localhost:8000/api/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const resData = await res.json();
    setMessages({ messages: resData, receiver, conversationId });
  };

  const sendMessage = async () => {
    socket?.emit("sendMessage", {
      senderId: user?.id,
      receiverId: messages?.receiver?.id,
      message,
      conversationId: messages?.conversationId,
    });
    await fetch(`http://localhost:8000/api/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId: messages?.conversationId,
        senderId: user?.id,
        message,
        receiverId: messages?.receiver?.id,
      }),
    });
    setMessage("");
  };

  return (
    <div className="w-screen flex">
      <div className="lg:w-[25%] sm:block sm:w-[35%] hidden w-0 h-screen bg-secondary overflow-scroll">
        <div className="flex items-center my-8 mx-6">
          <img
            src={Avatar}
            className="w-[60px] h-[60px] sm:w-[45px] sm:h-[45px] rounded-full"
          />
          <div className="ml-1">
            <h3 className="text-2xl sm:text-sm">{user?.fullName}</h3>
            <p className="text-lg font-light sm:text-xs">My Account</p>
          </div>
        </div>
        <hr />
        <div className="m-6">
          <div className="text-primary text-lg">Messages</div>
          <div>
            {conversations?.length > 0 ? (
              conversations.map(({ conversationId, user: receiver }, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center py-4 border-b border-b-gray-300 cursor-pointer"
                    onClick={() => fetchMessages({ conversationId, receiver })}
                  >
                    <div className="flex items-center">
                      <img
                        src={Avatar}
                        className="w-[50px] h-[50px] sm:w-[40px] sm:h-[40px] rounded-full"
                      />
                      <div className="ml-1">
                        <h3 className="text-lg font-semibold">
                          {receiver?.fullName}
                        </h3>
                        <p className="text-sm font-light text-gray-600">
                          {receiver?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center my-16 text-lg sm:text-sm font-semibold">
                No conversations
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="md:w-[65%] lg:w-[50%] w-[100%] h-screen bg-white flex flex-col items-center">
        {messages?.receiver?.fullName && (
          <div className="w-[75%] bg-secondary h-[80px] my-6 rounded-full flex items-center px-6 py-2">
            <img
              src={Avatar}
              className="w-[45px] h-[45px] sm:w-[30px] sm:h-[30px]"
            />
            <div className="ml-6 mr-auto">
              <h3 className="text-lg sm:text-sm">
                {messages?.receiver?.fullName}
              </h3>
              <p className="text-sm font-light text-gray-600 sm:text-xs">
                {messages?.receiver?.email}
              </p>
            </div>
            <div className="cursor-pointer">
              <img
                src={Phone}
                className="w-[45px] h-[45px] sm:w-[30px] sm:h-[30spx]"
              />
            </div>
          </div>
        )}
        <div className="h-[75%] w-full overflow-scroll shadow-sm">
          <div className="p-14">
            {messages?.messages?.length > 0 ? (
              messages?.messages?.map(({ message, user: { id } }, index) => {
                return (
                  <>
                    <div
                      key={index}
                      className={`max-w-[40%] rounded-b-xl p-4 mb-6${
                        id === user?.id
                          ? " bg-primary rounded-tl-xl ml-auto"
                          : " bg-secondary rounded-tr-xl"
                      }`}
                    >
                      {message}
                    </div>
                    <div ref={messageRef}></div>
                  </>
                );
              })
            ) : (
              <div className="text-center text-lg font-semibold mt-24">
                No Messages or No Conversation Selected
              </div>
            )}
          </div>
        </div>
        {messages?.receiver?.fullName && (
          <div className="p-14 w-full flex items-center">
            <Input
              placeholder="Type a message"
              className="w-[75%]"
              inputClassName="w-full p-2 px-4 shadow-md rounded-full bg-light focus:ring-0 focus:border-0 outline-none"
              value={message}
              onChange={(e: any) => setMessage(e.target.value)}
            />
            <div
              className={`ml-4 p-2 cursor-pointer bg-light rounded-full ${
                !message && "pointer-events-none"
              }`}
            >
              <img src={Plus} width={24} height={24} />
            </div>
            <div
              className={`ml-4 p-2 cursor-pointer bg-light rounded-full ${
                !message && "pointer-events-none"
              }`}
              onClick={() => sendMessage()}
            >
              <img src={Send} width={24} height={24} />
            </div>
          </div>
        )}
      </div>
      <div className="lg:w-[25%] lg:block hidden w-0 h-screen bg-light py-8  px-4 overflow-scroll">
        <div className="text-primary text-lg my-2">People</div>
        <div>
          {users?.length > 0 ? (
            users.map(({ userId, user }, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center py-4 border-b border-b-gray-300"
                >
                  <div
                    className="cursor-pointer flex items-center"
                    onClick={() =>
                      fetchMessages({ conversationId: "new", receiver: user })
                    }
                  >
                    <img
                      src={Avatar}
                      className="w-[50px] h-[50px] sm:w-[40px] sm:h-[40px] rounded-full"
                    />
                    <div className="ml-1">
                      <h3 className="text-lg sm:text-sm font-semibold">
                        {user?.fullName}
                      </h3>
                      <p className="text-sm sm:text-xs font-light text-gray-600">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-lg font-semibold">
              No conversations
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
