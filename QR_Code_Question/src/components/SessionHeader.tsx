import { QrCodeDialog } from "@/components/QrCodeDialog";

interface SessionHeaderProps {
  sessionName: string;
  isConnected: boolean;
  sessionUrl: string;
}

export const SessionHeader = ({
  sessionName,
  isConnected,
  sessionUrl,
}: SessionHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {sessionName}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  isConnected ? "bg-status-connected" : "bg-status-disconnected"
                }`}
              />
              <span>{isConnected ? "실시간 연결 중" : "연결 끊김"}</span>
            </div>
          </div>

          <QrCodeDialog sessionUrl={sessionUrl} />
        </div>
      </div>
    </header>
  );
};
