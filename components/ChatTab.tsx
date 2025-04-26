"use client"

import { useState, useEffect } from "react"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type User = {
  _id: string
  name: string
  image?: string
}

type Message = {
  _id: string
  project: string
  sender: User
  text: string
  createdAt: string
}

type ChatTabProps = {
  projectId: string
  currentUser: User
}

const ChatTab = ({ projectId, currentUser }: ChatTabProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/messages/${projectId}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })

        if (!res.ok) throw new Error("Failed to fetch messages")
        const data = await res.json()
        setMessages(data)
      } catch (err) {
        console.error("Error fetching messages:", err)
      }
    }

    fetchMessages()
  }, [projectId])

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      const res = await fetch("http://localhost:5000/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: projectId,
          sender: currentUser._id,
          text: newMessage,
        }),
      })

      if (!res.ok) throw new Error("Failed to send message")

      const data = await res.json()
      setMessages((prev) => [...prev, data])
      setNewMessage("")
    } catch (err) {
      console.error("Error sending message:", err)
    }
  }

  return (
    <TabsContent value="chat" className="space-y-4">
      <Card className="border-[#2a2a2a] bg-[#1a1a1a] h-[300px] flex flex-col">
        <CardContent className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex items-start gap-3 ${
                  msg.sender._id === currentUser._id ? "justify-end" : ""
                }`}
              >
                {msg.sender._id !== currentUser._id && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.sender.image || "/placeholder.svg"} alt={msg.sender.name} />
                    <AvatarFallback className="bg-[#121212] text-primary text-xs">
                      {msg.sender.name[0]}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`p-3 max-w-[80%] ${
                    msg.sender._id === currentUser._id
                      ? "bg-primary/20 rounded-lg rounded-tr-none"
                      : "bg-[#121212] rounded-lg rounded-tl-none"
                  }`}
                >
                  <p className="text-xs text-gray-400 mb-1">
                    {msg.sender._id === currentUser._id ? "You" : msg.sender.name}
                  </p>
                  <p className="text-sm text-gray-200">{msg.text}</p>
                </div>

                {msg.sender._id === currentUser._id && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.sender.image || "/placeholder.svg"} alt={msg.sender.name} />
                    <AvatarFallback className="bg-[#121212] text-primary text-xs">
                      {msg.sender.name[0]}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="border-t border-[#2a2a2a] p-4">
          <div className="flex w-full gap-2">
            <Input
              placeholder="Type your message..."
              className="flex-1 bg-[#121212] border-[#2a2a2a]"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage()
              }}
            />
            <Button className="bg-primary hover:bg-primary/80" onClick={sendMessage}>
              Send
            </Button>
          </div>
        </CardFooter>
      </Card>
    </TabsContent>
  )
}

export default ChatTab
