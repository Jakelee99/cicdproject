import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SessionHeader } from "@/components/SessionHeader";
import { QuestionInput } from "@/components/QuestionInput";
import { QuestionFeed } from "@/components/QuestionFeed";
import { apiClient } from "@/lib/api";

interface ApiQuestion {
  id: number;
  content: string;
  created_at: string;
  is_resolved: boolean;
}

const QUESTIONS_QUERY_KEY = ["questions"];

const Index = () => {
  const [isConnected, setIsConnected] = useState(true);
  const queryClient = useQueryClient();
  const sessionUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "http://localhost:5173";
    }
    const url = new URL(window.location.href);
    url.hash = "";
    return url.toString();
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: QUESTIONS_QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.get<ApiQuestion[]>("/questions");
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const createQuestionMutation = useMutation({
    mutationFn: async (content: string) => {
      await apiClient.post("/questions", { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUESTIONS_QUERY_KEY });
    },
  });

  const questions = useMemo(
    () =>
      (data ?? []).map((question, index) => {
        const utcDate = new Date(question.created_at);
        const kstTimestamp = new Date(
          utcDate.getTime() + 9 * 60 * 60 * 1000
        );

        return {
          id: question.id.toString(),
          content: question.content,
          timestamp: kstTimestamp,
          isResolved: question.is_resolved,
          isNew: index === 0,
        };
      }),
    [data]
  );

  useEffect(() => {
    // Simulate connection status
    const interval = setInterval(() => {
      setIsConnected(Math.random() > 0.1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmitQuestion = async (content: string) => {
    await createQuestionMutation.mutateAsync(content);
  };

  const updateQuestionStatusMutation = useMutation({
    mutationFn: async ({ id, isResolved }: { id: string; isResolved: boolean }) => {
      await apiClient.patch(`/questions/${id}`, { is_resolved: isResolved });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUESTIONS_QUERY_KEY });
    },
  });

  const handleToggleResolved = async (id: string, currentValue: boolean) => {
    await updateQuestionStatusMutation.mutateAsync({ id, isResolved: !currentValue });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SessionHeader 
        sessionName="클라우드 Q&A" 
        isConnected={isConnected}
        sessionUrl={sessionUrl}
      />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full">
          <div className="bg-card rounded-2xl border border-border p-6 lg:p-8 shadow-sm">
            <QuestionInput
              onSubmit={handleSubmitQuestion}
              isSubmitting={createQuestionMutation.isPending}
            />
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-6 lg:p-8 shadow-sm">
            <QuestionFeed
              questions={questions}
              isLoading={isLoading}
              isError={isError}
              onToggleResolved={handleToggleResolved}
              isUpdating={updateQuestionStatusMutation.isPending}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
