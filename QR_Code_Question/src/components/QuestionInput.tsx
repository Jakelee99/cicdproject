import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Check } from "lucide-react";

interface QuestionInputProps {
  onSubmit: (question: string) => Promise<void>;
  isSubmitting?: boolean;
}

export const QuestionInput = ({ onSubmit, isSubmitting = false }: QuestionInputProps) => {
  const [question, setQuestion] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error("질문을 입력해주세요");
      return;
    }

    try {
      await onSubmit(question.trim());
      toast.success("질문이 등록되었습니다", {
        icon: <Check className="h-4 w-4" />,
      });
      setQuestion("");
    } catch (error) {
      toast.error("질문 등록에 실패했습니다");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">무엇이 궁금해요?</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ex) 클라우드 컴퓨팅이 무엇인가요?"
          className="flex-1 resize-none text-base p-4 min-h-[200px] rounded-xl border-2 border-input focus:border-primary transition-colors"
          disabled={isSubmitting}
        />
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all"
        >
          질문 등록하기
        </Button>
      </form>
    </div>
  );
};
