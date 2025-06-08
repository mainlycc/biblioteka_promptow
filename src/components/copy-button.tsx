"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button onClick={handleCopy} className={className}>
        {copied ? (
          "Skopiowano!"
        ) : (
          <>
            <Copy className="mr-2 h-4 w-4" />
            Kopiuj prompt
          </>
        )}
      </Button>
      {copied && (
        <Alert className="mt-2">
          <AlertDescription>Prompt został skopiowany do schowka!</AlertDescription>
        </Alert>
      )}
    </>
  );
} 