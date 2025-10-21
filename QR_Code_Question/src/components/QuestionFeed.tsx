import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Undo2 } from "lucide-react";

interface Question {
  id: string;
  content: string;
  timestamp: Date;
  isResolved: boolean;
  isNew?: boolean;
}

interface QuestionFeedProps {
  questions: Question[];
  isLoading?: boolean;
  isError?: boolean;
  onToggleResolved: (id: string, currentValue: boolean) => Promise<void>;
  isUpdating?: boolean;
}

export const QuestionFeed = ({
  questions,
  isLoading = false,
  isError = false,
  onToggleResolved,
  isUpdating = false,
}: QuestionFeedProps) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">실시간 질문 목록</h2>
      </div>

      {isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          질문을 불러오는 중입니다...
        </div>
      )}

      {isError && !isLoading && (
        <div className="text-center py-12 text-destructive">
          질문 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </div>
      )}

      {!isLoading && !isError && (
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3">
            {questions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                아직 등록된 질문이 없습니다
              </div>
            ) : (
              questions.map((q, index) => (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border ${
                    q.isResolved
                      ? "border-success text-muted-foreground bg-success/10"
                      : q.isNew || index === 0
                        ? "question-card-new border-accent-foreground/20"
                        : "question-card border-border"
                  } slide-up`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <p
                    className={`text-base mb-2 whitespace-pre-wrap ${
                      q.isResolved ? "line-through text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {q.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatTime(q.timestamp)}</span>
                    </div>

                    <Button
                      variant={q.isResolved ? "outline" : "default"}
                      size="sm"
                      disabled={isUpdating}
                      onClick={() => onToggleResolved(q.id, q.isResolved)}
                      className="flex items-center gap-1.5"
                    >
                      {q.isResolved ? (
                        <>
                          <Undo2 className="h-4 w-4" />
                          되돌리기
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          해결 완료
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      )}

      {!isLoading && !isError && questions.length > 0 && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          현재 총 {questions.length}개의 질문이 등록되었습니다
        </div>
      )}
    </div>
  );
};
