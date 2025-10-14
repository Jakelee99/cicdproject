import { useState, useEffect } from "react";
import { SessionHeader } from "@/components/SessionHeader";
import { QuestionInput } from "@/components/QuestionInput";
import { QuestionFeed } from "@/components/QuestionFeed";

interface Question {
  id: string;
  content: string;
  timestamp: Date;
  isNew?: boolean;
}

const Index = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      content: "이 코드의 의미가 뭔가요?",
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
    },
    {
      id: "2",
      content: "구현 방법을 좀 더 설명해주실 수 있나요?",
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
    },
    {
      id: "3",
      content: "라이브러리 설치가 왜 필요한가요?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "4",
      content: "이번 개발 도구를 사용하나요?",
      timestamp: new Date(Date.now() - 1000 * 60 * 6),
    },
  ]);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Simulate connection status
    const interval = setInterval(() => {
      setIsConnected(Math.random() > 0.1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmitQuestion = async (content: string) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      isNew: true,
    };

    setQuestions((prev) => [newQuestion, ...prev]);

    // Remove "new" status after animation
    setTimeout(() => {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === newQuestion.id ? { ...q, isNew: false } : q
        )
      );
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SessionHeader 
        sessionName="소프트웨어 공학 Q&A" 
        isConnected={isConnected}
      />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full">
          <div className="bg-card rounded-2xl border border-border p-6 lg:p-8 shadow-sm">
            <QuestionInput onSubmit={handleSubmitQuestion} />
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-6 lg:p-8 shadow-sm">
            <QuestionFeed questions={questions} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
