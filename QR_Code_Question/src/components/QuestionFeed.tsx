import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";

interface Question {
  id: string;
  content: string;
  timestamp: Date;
  isNew?: boolean;
}

interface QuestionFeedProps {
  questions: Question[];
}

export const QuestionFeed = ({ questions }: QuestionFeedProps) => {
  const [displayQuestions, setDisplayQuestions] = useState<Question[]>([]);

  useEffect(() => {
    setDisplayQuestions(questions);
  }, [questions]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">실시간 질문 목록</h2>
      </div>

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-3">
          {displayQuestions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              아직 등록된 질문이 없습니다
            </div>
          ) : (
            displayQuestions.map((q, index) => (
              <div
                key={q.id}
                className={`p-4 rounded-xl border ${
                  q.isNew || index === 0
                    ? "question-card-new border-accent-foreground/20"
                    : "question-card border-border"
                } slide-up`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <p className="text-base text-foreground mb-2 whitespace-pre-wrap">
                  {q.content}
                </p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatTime(q.timestamp)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {displayQuestions.length > 0 && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          현재 총 {displayQuestions.length}개의 질문이 등록되었습니다
        </div>
      )}
    </div>
  );
};
