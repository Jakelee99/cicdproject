import { useCallback } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Copy } from "lucide-react";

interface QrCodeDialogProps {
  sessionUrl: string;
}

export const QrCodeDialog = ({ sessionUrl }: QrCodeDialogProps) => {
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(sessionUrl);
      toast.success("세션 링크가 복사되었습니다");
    } catch (error) {
      toast.error("링크 복사에 실패했습니다");
    }
  }, [sessionUrl]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">QR 코드 표시</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>세션 접속 QR 코드</DialogTitle>
          <DialogDescription>
            학생들이 아래 QR 코드를 스캔하면 즉시 질문 페이지로 접속할 수 있어요.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <QRCode value={sessionUrl} size={200} />
          </div>

          <div className="w-full text-sm text-center text-muted-foreground break-words">
            {sessionUrl}
          </div>

          <Button variant="secondary" className="w-full" onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            세션 링크 복사
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
