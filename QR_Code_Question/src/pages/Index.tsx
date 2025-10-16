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
}

const QUESTIONS_QUERY_KEY = ["questions"];

const Index = () => {
  const [isConnected, setIsConnected] = useState(true);
  const queryClient = useQueryClient();

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
      (data ?? []).map((question, index) => ({
        id: question.id.toString(),
        content: question.content,
        timestamp: new Date(question.created_at),
        isNew: index === 0,
      })),
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SessionHeader 
        sessionName="클라우드 Q&A" 
        isConnected={isConnected}
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
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
