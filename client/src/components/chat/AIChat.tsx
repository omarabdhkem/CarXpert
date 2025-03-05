
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function AIChat() {
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const newMessage = { text: inputMessage, isUser: true };
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage })
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>CarXpert AI Chat</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-4 ${msg.isUser ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-3 rounded-lg ${
              msg.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="اكتب رسالتك هنا..."
          className="flex-1"
        />
        <Button onClick={sendMessage}>إرسال</Button>
      </CardFooter>
    </Card>
  );
}
