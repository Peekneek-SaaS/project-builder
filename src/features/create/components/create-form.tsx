"use client";

import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import type { ExtractedCardData } from "@/features/create/types";
import { useUploadThing } from "@/lib/uploadthing";
import {
  ResumeValidationError,
  validateResumeFile,
} from "@/lib/resume/validate-file";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  CheckIcon,
  CloudUploadIcon,
  CursorMagicSelection03Icon,
  File01Icon,
  GoogleDocIcon,
  Loading03Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { cardThemes, type CardTheme } from "@/lib/card-themes";
import { canUseTheme } from "@/lib/plan";
import { ThemePickerGrid } from "@/features/builder/components/theme-picker";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Skeleton } from "@/components/ui/skeleton";

type step = 1 | 2;

type ResumeHistoryItem =
  inferRouterOutputs<AppRouter>["resume"]["list"][number];

function formatResumeLabel(resume: ResumeHistoryItem) {
  const name = resume.extractedData.name.trim();
  return name ? `${name} · ${resume.fileName}` : resume.fileName;
}

const CreateForm = ({ className }: { className: string }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { data: billing } = useQuery(trpc.billing.getPlan.queryOptions());
  const isProPlan = billing?.isPro ?? false;

  const parseResume = useMutation(trpc.resume.parse.mutationOptions());
  const createCards = useMutation(trpc.card.createBatch.mutationOptions());
  const { data: resumeHistory = [], isLoading: historyLoading } = useQuery(
    trpc.resume.list.queryOptions(),
  );
  const uploadErrorRef = useRef<string | null>(null);
  const { startUpload, isUploading } = useUploadThing("resumeUploader", {
    onUploadError: (error) => {
      uploadErrorRef.current = error.message;
    },
  });

  const [step, setStep] = useState<step>(1);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedCardData | null>(
    null,
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [fromHistory, setFromHistory] = useState(false);
  const [selectedHistory, setSelectedHistory] =
    useState<ResumeHistoryItem | null>(null);

  async function handleFile(file: File) {
    try {
      uploadErrorRef.current = null;
      const { mimeType } = validateResumeFile(file);
      setFromHistory(false);
      setSelectedHistory(null);
      setFileName(file.name);
      setParsing(true);
      setParsed(false);
      setExtractedData(null);
      setResumeId(null);

      const uploadResult = await startUpload([file]);
      const uploaded = uploadResult?.[0];

      if (!uploaded) {
        throw new Error(
          uploadErrorRef.current ?? "Upload failed. Please try again.",
        );
      }

      const fileUrl = uploaded.ufsUrl ?? uploaded.url;
      if (!fileUrl) {
        throw new Error("Upload succeeded but file URL was missing.");
      }

      const result = await parseResume.mutateAsync({
        fileUrl,
        fileKey: uploaded.key,
        fileName: uploaded.name,
        mimeType: uploaded.type || mimeType,
      });

      setResumeId(result.id);
      setExtractedData(result.extractedData);
      setParsed(true);
      await queryClient.invalidateQueries(trpc.resume.list.queryFilter());
      toast.success("Resume parsed successfully.");
    } catch (error) {
      setFileName(null);
      setParsed(false);
      setExtractedData(null);
      setResumeId(null);
      setFromHistory(false);
      setSelectedHistory(null);

      const message =
        error instanceof ResumeValidationError
          ? error.message
          : error instanceof TRPCClientError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Something went wrong while processing your resume.";

      toast.error(message);
    } finally {
      setParsing(false);
    }
  }

  function handleClear() {
    setFileName(null);
    setParsed(false);
    setParsing(false);
    setExtractedData(null);
    setResumeId(null);
    setFromHistory(false);
    setSelectedHistory(null);
  }

  function handleSelectHistory(resume: ResumeHistoryItem | null) {
    if (!resume) {
      handleClear();
      return;
    }

    setFromHistory(true);
    setSelectedHistory(resume);
    setFileName(resume.fileName);
    setResumeId(resume.id);
    setExtractedData(resume.extractedData);
    setParsed(true);
    setParsing(false);
  }

  function toggleTheme(theme: CardTheme) {
    if (!canUseTheme(isProPlan ? "pro" : "free", theme.id)) {
      toast.error("Upgrade to Pro to use this theme.");
      return;
    }

    setSelected((prev) => {
      if (prev.includes(theme.id)) {
        return prev.filter((id) => id !== theme.id);
      }
      if (isProPlan) {
        return [...prev, theme.id];
      }
      return [theme.id];
    });
  }

  async function handleBuild() {
    if (!resumeId || selected.length === 0) return;

    if (!isProPlan && !billing?.canCreateCard) {
      toast.error("Free plan includes 1 business card. Upgrade to Pro.");
      return;
    }

    try {
      const result = await createCards.mutateAsync({
        resumeId,
        themeIds: selected,
      });

      await queryClient.invalidateQueries(trpc.card.list.queryFilter());

      router.push(
        `/builder/${resumeId}?cards=${result.cards.map((card) => card.id).join(",")}`,
      );
    } catch (error) {
      const message =
        error instanceof TRPCClientError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Failed to create cards.";

      toast.error(message);
    }
  }

  const isProcessing =
    parsing || isUploading || parseResume.isPending || createCards.isPending;

  return (
    <div
      className={cn(
        "flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden",
        className,
      )}
    >
      <div className="shrink-0 border-b border-border bg-card/40">
        <Wrapper className="mx-auto flex max-w-2xl min-w-0 items-center justify-center gap-2 px-4 py-4 sm:gap-4 sm:px-6">
          <StepDot
            index={1}
            current={step}
            label="Upload resume"
            icon={GoogleDocIcon}
          />
          <div className="h-px w-4 bg-border" />
          <StepDot
            index={2}
            current={step}
            label="Choose theme"
            icon={CursorMagicSelection03Icon}
          />
        </Wrapper>
      </div>

      <div className="flex flex-1 flex-col min-h-0 px-4 py-6">
        <Wrapper
          className={cn(
            "mx-auto flex w-full flex-1 flex-col min-h-0",
            step === 1 ? "max-w-2xl" : "max-w-5xl",
          )}
        >
          {step === 1 ? (
            <StepUpload
              fileName={fileName}
              parsing={isProcessing}
              parsed={parsed}
              extractedData={extractedData}
              fromHistory={fromHistory}
              resumeHistory={resumeHistory}
              historyLoading={historyLoading}
              selectedHistory={selectedHistory}
              onSelectHistory={handleSelectHistory}
              onFile={handleFile}
              onClear={handleClear}
            />
          ) : (
            <StepTheme
              extractedData={extractedData}
              selected={selected}
              onToggle={toggleTheme}
              isProPlan={isProPlan}
            />
          )}
        </Wrapper>
      </div>

      <footer className="shrink-0 overflow-x-hidden border-t border-border bg-background/90 backdrop-blur-md">
        <div
          className={cn(
            "mx-auto flex min-w-0 items-center justify-between gap-2 px-4 py-4 sm:px-6",
            step === 1 ? "max-w-md" : "max-w-5xl",
          )}
        >
          {step === 1 ? (
            <Button asChild variant="ghost">
              <Link href="/dashboard">Cancel</Link>
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="gap-1.5"
              onClick={() => setStep(1)}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              Back
            </Button>
          )}
          {step === 1 ? (
            <Button disabled={!parsed || !resumeId} onClick={() => setStep(2)}>
              Continue
            </Button>
          ) : (
            <Button
              disabled={selected.length === 0 || createCards.isPending}
              className="shrink-0 gap-1.5 text-xs"
              onClick={() => void handleBuild()}
            >
              {createCards.isPending
                ? "Creating…"
                : `Build ${selected.length > 1 ? "cards" : "card"}`}
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default CreateForm;

function StepUpload({
  fileName,
  parsing,
  parsed,
  extractedData,
  fromHistory,
  resumeHistory,
  historyLoading,
  selectedHistory,
  onSelectHistory,
  onFile,
  onClear,
}: {
  fileName: string | null;
  parsing: boolean;
  parsed: boolean;
  extractedData: ExtractedCardData | null;
  fromHistory: boolean;
  resumeHistory: ResumeHistoryItem[];
  historyLoading: boolean;
  selectedHistory: ResumeHistoryItem | null;
  onSelectHistory: (resume: ResumeHistoryItem | null) => void;
  onFile: (file: File) => void;
  onClear: () => void;
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 min-h-0">
      <div className="shrink-0 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Upload your resume
        </h1>
        <p className="text-sm text-muted-foreground">
          We'll read it with AI and pull out everything we need for your card.
        </p>
      </div>

      {!fileName ? (
        <>
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) onFile(file);
            }}
            className={cn(
              "flex flex-1 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-md border border-dashed px-6 text-center transition-colors",
              dragging
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary",
            )}
          >
            <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
              <HugeiconsIcon icon={CloudUploadIcon} size={20} />
            </span>
            <div>
              <p className="font-medium">Drag & drop your resume here</p>
              <p className="mt-1 text-sm text-muted-foreground">
                or click to browse · PDF, DOCX up to 8MB
              </p>
            </div>
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFile(file);
              }}
            />
          </label>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">
              or select from previous
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <Combobox
            items={resumeHistory}
            value={selectedHistory}
            onValueChange={onSelectHistory}
            itemToStringLabel={formatResumeLabel}
            isItemEqualToValue={(a, b) => a.id === b.id}
          >
            <ComboboxInput
              className="w-full"
              placeholder={
                historyLoading
                  ? "Loading saved resumes…"
                  : resumeHistory.length === 0
                    ? "No saved resumes yet"
                    : "Select from previous history"
              }
              disabled={historyLoading || resumeHistory.length === 0}
              showClear={Boolean(selectedHistory)}
            />
            <ComboboxContent>
              <ComboboxEmpty>No saved resumes found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item.id} value={item}>
                    <div className="flex min-w-0 flex-col gap-0.5 py-0.5">
                      <span className="truncate font-medium">
                        {item.extractedData.name.trim() || "Untitled"}
                      </span>
                      <span className="truncate text-muted-foreground">
                        {item.fileName}
                      </span>
                    </div>
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </>
      ) : (
        <ResumeExtractedPanel
          fileName={fileName}
          parsing={parsing}
          parsed={parsed}
          extractedData={extractedData}
          fromHistory={fromHistory}
          onClear={onClear}
        />
      )}
    </div>
  );
}

function ResumeExtractedPanel({
  fileName,
  parsing,
  parsed,
  extractedData,
  fromHistory,
  onClear,
}: {
  fileName: string;
  parsing: boolean;
  parsed: boolean;
  extractedData: ExtractedCardData | null;
  fromHistory: boolean;
  onClear: () => void;
}) {
  const fields = extractedData
    ? [
        ["Name", extractedData.name],
        ["Title", extractedData.title],
        ["Email", extractedData.email || "—"],
        ["Phone", extractedData.phone || "—"],
        ["Location", extractedData.location || "—"],
        [
          "Skills",
          extractedData.skills.length ? extractedData.skills.join(", ") : "—",
        ],
      ]
    : [
        ["Name", ""],
        ["Title", ""],
        ["Email", ""],
        ["Phone", ""],
        ["Location", ""],
        ["Skills", ""],
      ];

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
        <HugeiconsIcon icon={File01Icon} size={20} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{fileName}</p>
          <p className="text-xs text-muted-foreground">
            {parsing
              ? "Uploading and extracting information…"
              : fromHistory
                ? "Loaded from saved history"
                : parsed
                  ? "Ready"
                  : "Uploaded"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
          disabled={parsing}
          aria-label="Remove file"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={20} />
        </Button>
      </div>

      <div
        className={cn(
          "rounded-xl border p-4",
          parsed ? "border-primary/30 bg-primary/5" : "border-border bg-card",
        )}
      >
        <div className="mb-2 flex items-center gap-2">
          <HugeiconsIcon
            icon={parsing ? Loading03Icon : SparklesIcon}
            size={20}
            className={cn(
              "size-4",
              parsing ? "animate-spin text-primary" : "text-primary",
            )}
          />
          <p className="text-sm font-medium">
            {parsing ? "AI is reading your resume…" : "Information extracted"}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {fields.map(([label, value]) => (
            <div
              key={label}
              className={cn(
                "rounded-lg border border-border bg-background px-3 py-2 transition-opacity",
                parsing && "opacity-40",
              )}
            >
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {label}
              </p>
              <p className="truncate text-sm font-medium">
                {parsing ? <Skeleton className="h-4 w-full" /> : value || "—"}
              </p>
            </div>
          ))}
        </div>
        {parsed && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            You can edit any of these details in the next step.
          </p>
        )}
      </div>
    </div>
  );
}

function StepTheme({
  extractedData,
  selected,
  onToggle,
  isProPlan,
}: {
  extractedData: ExtractedCardData | null;
  selected: string[];
  onToggle: (theme: CardTheme) => void;
  isProPlan: boolean;
}) {
  const previewName = extractedData?.name ?? "Jordan Avery";
  const previewInitials = previewName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Choose a theme
        </h1>
        <p className="text-sm text-muted-foreground">
          {isProPlan ? (
            <>
              Select one or more themes.{" "}
              <span className="font-medium text-foreground">
                {selected.length} selected
              </span>
            </>
          ) : (
            <>
              Pick a look for your card.{" "}
              <span className="font-medium text-foreground">
                {selected.length} selected
              </span>
              . Select multiple themes with{" "}
              <span className="font-medium text-foreground">Pro</span>.
            </>
          )}
        </p>
      </div>

      <ThemePickerGrid
        themes={cardThemes}
        previewName={previewName}
        previewInitials={previewInitials}
        selected={selected}
        onToggle={onToggle}
      />

      {!isProPlan ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-4 text-center text-sm text-muted-foreground">
          Want to build multiple cards at once?{" "}
          <Link href="/#pricing" className="font-medium text-primary">
            Upgrade to Pro
          </Link>{" "}
          to select several themes.
        </div>
      ) : null}
    </div>
  );
}

function StepDot({
  index,
  current,
  label,
  icon,
}: {
  index: number;
  current: number;
  label: string;
  icon: IconSvgElement;
}) {
  const done = current > index;
  const active = current === index;
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={cn(
          "grid size-5 md:size-7 place-items-center rounded-full border text-xs font-semibold transition-colors",
          done && "border-primary bg-primary text-primary-foreground",
          active && "border-primary text-primary",
          !done && !active && "border-border text-muted-foreground",
        )}
      >
        {done ? <HugeiconsIcon icon={CheckIcon} size={16} /> : index}
      </span>
      <span
        className={cn(
          "flex items-center gap-1 text-xs md:text-sm font-medium",
          active || done ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <HugeiconsIcon icon={icon} size={16} />
        {label}
      </span>
    </div>
  );
}
