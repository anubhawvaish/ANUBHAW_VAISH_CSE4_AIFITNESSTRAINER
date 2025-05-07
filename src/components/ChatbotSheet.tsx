
import React, { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Bot } from 'lucide-react';

// Define the message type
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Define fitness knowledge base
const fitnessKnowledgeBase = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'start'],
    response: "Hello! I'm your AI fitness assistant. How can I help with your fitness journey today?"
  },
  {
    keywords: ['workout', 'exercise', 'routine', 'training', 'plan'],
    response: "For an effective workout routine, try to balance cardio, strength training, flexibility, and rest days. As a general guideline, aim for 150 minutes of moderate cardio and 2-3 strength training sessions per week."
  },
  {
    keywords: ['weight', 'lose', 'loss', 'fat', 'burning'],
    response: "Weight loss comes down to a caloric deficit - burning more calories than you consume. Combine regular exercise with a balanced diet rich in protein, fiber, and whole foods. Aim for a sustainable 1-2 pounds per week loss rate."
  },
  {
    keywords: ['muscle', 'gain', 'build', 'strength', 'mass'],
    response: "Building muscle requires progressive overload (gradually increasing weights), adequate protein intake (about 1.6-2.2g per kg of bodyweight), and sufficient recovery time. Focus on compound exercises like squats, deadlifts, and bench press."
  },
  {
    keywords: ['nutrition', 'diet', 'eating', 'food', 'meal'],
    response: "A balanced nutrition plan should include lean proteins, complex carbohydrates, healthy fats, and plenty of fruits and vegetables. Portion control and meal timing around workouts can also be important factors in your fitness success."
  },
  {
    keywords: ['cardio', 'aerobic', 'running', 'jogging', 'hiit'],
    response: "Cardio exercise strengthens your heart and burns calories. Options include running, swimming, cycling, and HIIT. For fat loss, mix moderate intensity sessions (30-45 min) with shorter high-intensity intervals for optimal results."
  },
  {
    keywords: ['injury', 'pain', 'hurt', 'sore', 'recovery'],
    response: "If you're experiencing pain, it's important to rest the affected area. Use the RICE method (Rest, Ice, Compression, Elevation) for acute injuries. Persistent pain should be evaluated by a healthcare professional."
  },
  {
    keywords: ['supplements', 'protein', 'creatine', 'vitamins'],
    response: "While whole foods should be your primary nutrition source, some supplements can help. Protein powder can support muscle recovery, creatine may enhance strength performance, and a multivitamin can fill nutritional gaps. Always consult a healthcare provider before starting any supplement."
  },
  {
    keywords: ['motivation', 'habit', 'consistent', 'discipline', 'routine'],
    response: "Building fitness habits takes time. Start with small, achievable goals, track your progress, find workout styles you enjoy, and consider working out with a friend or group for accountability. Remember that consistency matters more than perfection."
  },
  {
    keywords: ['stretching', 'flexibility', 'mobility', 'warm up'],
    response: "Dynamic stretching is ideal before workouts to prepare your muscles. Static stretching works best after exercise when muscles are warm. Incorporate mobility work 2-3 times weekly to improve range of motion and reduce injury risk."
  },
  {
    keywords: ['sleep', 'rest', 'recovery', 'overtraining'],
    response: "Quality sleep is crucial for fitness progress. Aim for 7-9 hours per night. Rest days are equally important—they allow your muscles to repair and grow stronger. Signs of overtraining include persistent fatigue, decreased performance, and mood changes."
  },
  {
    keywords: ['beginner', 'start', 'new', 'first time'],
    response: "As a beginner, focus on learning proper form before increasing intensity. Start with full-body workouts 2-3 times per week, incorporating basic movements like squats, lunges, push-ups, and rows. Consider working with a trainer initially to learn correct techniques."
  }
];

const ChatbotSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I\'m your AI fitness assistant. How can I help you with your fitness journey today?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Find the best response based on keywords in the user's message
  const findBestResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Find the entry with the most keyword matches
    let bestMatch = {
      entry: fitnessKnowledgeBase[0],
      matchCount: 0
    };
    
    fitnessKnowledgeBase.forEach(entry => {
      const matchCount = entry.keywords.filter(keyword => 
        message.includes(keyword.toLowerCase())
      ).length;
      
      if (matchCount > bestMatch.matchCount) {
        bestMatch = { entry, matchCount };
      }
    });
    
    // If no good match, provide a default response
    if (bestMatch.matchCount === 0) {
      return "I'm not sure I understand your fitness question. Could you rephrase it? You can ask me about workouts, nutrition, recovery, cardio, strength training, or beginner tips.";
    }
    
    return bestMatch.entry.response;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Give a slight delay to simulate processing
      setTimeout(() => {
        const responseContent = findBestResponse(userMessage.content);
        
        const aiResponse: ChatMessage = {
          role: 'assistant',
          content: responseContent,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 800);
      
    } catch (error) {
      console.error('Error getting response:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          className="rounded-full h-12 w-12 shadow-md fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50"
          size="icon"
        >
          <MessageCircle />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[400px] p-0 flex flex-col">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center">
            <Bot className="mr-2" size={20} />
            Fitness Assistant
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center mb-1">
                    <Avatar className="h-6 w-6 mr-2">
                      <Bot size={16} />
                    </Avatar>
                    <span className="text-xs font-semibold">Fitness Assistant</span>
                  </div>
                )}
                <p>{message.content}</p>
                <p className="text-xs opacity-70 text-right mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <form 
          onSubmit={handleSendMessage} 
          className="p-4 border-t flex gap-2"
        >
          <Input
            placeholder="Ask me about fitness..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            Send
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default ChatbotSheet;
