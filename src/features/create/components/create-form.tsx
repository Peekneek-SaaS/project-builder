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
  Delete02Icon,
  File01Icon,
  GoogleDocIcon,
  Loading03Icon,
  PaintBoardIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useMemo } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { cardThemes, type CardTheme } from "@/lib/card-themes";
import { ThemePickerGrid } from "@/features/builder/components/theme-picker";
import { buildThemePreviewData } from "@/lib/card-data";
import { DeleteCardDialog } from "@/features/dashboard/components/delete-card-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

type step = 1 | 2;

type EditableExtractedField =
  | "name"
  | "title"
  | "company"
  | "email"
  | "phone"
  | "location"
  | "website";

type ResumeHistoryItem =
  inferRouterOutputs<AppRouter>["resume"]["list"][number];

const CreateForm = ({ className }: { className: string }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { data: billing } = useQuery(trpc.billing.getPlan.queryOptions());
  const isProPlan = billing?.isPro ?? false;

  const parseResume = useMutation(trpc.resume.parse.mutationOptions());
  const createBlankResume = useMutation(
    trpc.resume.createBlank.mutationOptions(),
  );
  const updateExtracted = useMutation(
    trpc.resume.updateExtracted.mutationOptions(),
  );
  const createCards = useMutation(trpc.card.createBatch.mutationOptions());
  const deleteResume = useMutation(trpc.resume.delete.mutationOptions());
  const {
    data: resumeHistory = [],
    isLoading: historyLoading,
    isError: historyError,
  } = useQuery(trpc.resume.list.queryOptions());
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
  const [deleteHistoryTarget, setDeleteHistoryTarget] =
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

  async function handleSkip() {
    try {
      setFromHistory(false);
      setSelectedHistory(null);
      setParsing(true);
      setParsed(false);
      setExtractedData(null);
      setResumeId(null);

      const result = await createBlankResume.mutateAsync();

      setResumeId(result.id);
      setExtractedData(result.extractedData);
      setParsed(true);
      setStep(2);
      await queryClient.invalidateQueries(trpc.resume.list.queryFilter());
    } catch (error) {
      setFileName(null);
      setParsed(false);
      setExtractedData(null);
      setResumeId(null);

      const message =
        error instanceof TRPCClientError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Failed to start without a resume.";

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

  async function confirmDeleteHistory() {
    if (!deleteHistoryTarget) return;

    try {
      await deleteResume.mutateAsync({ id: deleteHistoryTarget.id });

      if (resumeId === deleteHistoryTarget.id) {
        handleClear();
      }

      setDeleteHistoryTarget(null);
      await queryClient.invalidateQueries(trpc.resume.list.queryFilter());
      toast.success("Resume removed from history.");
    } catch (error) {
      const message =
        error instanceof TRPCClientError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Failed to delete resume.";

      toast.error(message);
    }
  }

  function updateExtractedField(field: EditableExtractedField, value: string) {
    setExtractedData((current) =>
      current ? { ...current, [field]: value } : current,
    );
  }

  async function persistExtractedData() {
    if (!resumeId || !extractedData) return;

    await updateExtracted.mutateAsync({
      id: resumeId,
      extractedData,
    });
  }

  async function handleContinue() {
    if (!parsed || !resumeId || !extractedData) return;

    try {
      await persistExtractedData();
      setStep(2);
    } catch (error) {
      const message =
        error instanceof TRPCClientError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Failed to save your details.";

      toast.error(message);
    }
  }

  function toggleTheme(theme: CardTheme) {
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
      await persistExtractedData();

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
    parsing ||
    isUploading ||
    parseResume.isPending ||
    createBlankResume.isPending ||
    updateExtracted.isPending ||
    createCards.isPending;

  return (
    <div
      className={cn(
        "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
        className,
      )}
    >
      <div className="shrink-0 border-b border-border bg-card/40">
        <Wrapper className="mx-auto flex max-w-2xl min-w-0 items-center justify-center gap-1.5 px-2 py-3 sm:gap-4 sm:px-6 sm:py-4">
          <StepDot
            index={1}
            current={step}
            label="Upload resume"
            icon={GoogleDocIcon}
            compact
          />
          <div className="h-px w-3 bg-border sm:w-4" />
          <StepDot
            index={2}
            current={step}
            label="Choose theme"
            icon={PaintBoardIcon}
            compact
          />
        </Wrapper>
      </div>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          step === 1
            ? "overflow-y-auto px-4 py-6"
            : "overflow-hidden py-3 sm:py-6",
        )}
      >
        <Wrapper
          className={cn(
            "mx-auto flex w-full min-h-0 flex-1 flex-col",
            step === 1 ? "max-w-2xl" : "max-w-none !px-0 sm:!px-2",
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
              historyError={historyError}
              selectedHistory={selectedHistory}
              onSelectHistory={handleSelectHistory}
              onDeleteHistoryRequest={setDeleteHistoryTarget}
              deletingResumeId={
                deleteResume.isPending
                  ? (deleteHistoryTarget?.id ?? null)
                  : null
              }
              onFile={handleFile}
              onClear={handleClear}
              onSkip={() => void handleSkip()}
              onFieldChange={updateExtractedField}
              skipping={createBlankResume.isPending}
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

      <footer className="sticky bottom-0 z-20 shrink-0 overflow-x-hidden border-t border-border bg-background/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
        <div
          className={cn(
            "mx-auto flex min-w-0 items-center justify-between gap-2 px-3 py-3 sm:px-6 sm:py-4",
            step === 1 ? "max-w-md" : "w-full max-w-none",
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
            <Button
              disabled={
                !parsed ||
                !resumeId ||
                !extractedData ||
                updateExtracted.isPending
              }
              onClick={() => void handleContinue()}
            >
              {updateExtracted.isPending ? "Saving…" : "Continue"}
            </Button>
          ) : (
            <Button
              disabled={selected.length === 0 || createCards.isPending}
              className="shrink-0 gap-1.5 text-xs"
              onClick={() => void handleBuild()}
            >
              {createCards.isPending ? (
                <span className="flex items-center gap-1">
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    className="animate-spin"
                  />
                  Building
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  {`Build ${selected.length > 1 ? "cards" : "card"}`}
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                </span>
              )}
            </Button>
          )}
        </div>
      </footer>

      <DeleteCardDialog
        open={deleteHistoryTarget !== null}
        onOpenChange={(open) => {
          if (!open && !deleteResume.isPending) setDeleteHistoryTarget(null);
        }}
        title="Delete saved resume?"
        description={
          deleteHistoryTarget
            ? `"${deleteHistoryTarget.extractedData.name.trim() || deleteHistoryTarget.fileName}" will be removed from your upload history. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        loading={deleteResume.isPending}
        onConfirm={() => void confirmDeleteHistory()}
      />
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
  historyError,
  selectedHistory,
  onSelectHistory,
  onDeleteHistoryRequest,
  deletingResumeId,
  onFile,
  onClear,
  onSkip,
  onFieldChange,
  skipping,
}: {
  fileName: string | null;
  parsing: boolean;
  parsed: boolean;
  extractedData: ExtractedCardData | null;
  fromHistory: boolean;
  resumeHistory: ResumeHistoryItem[];
  historyLoading: boolean;
  historyError: boolean;
  selectedHistory: ResumeHistoryItem | null;
  onSelectHistory: (resume: ResumeHistoryItem | null) => void;
  onDeleteHistoryRequest: (resume: ResumeHistoryItem) => void;
  deletingResumeId: string | null;
  onFile: (file: File) => void;
  onClear: () => void;
  onSkip: () => void;
  onFieldChange: (field: EditableExtractedField, value: string) => void;
  skipping: boolean;
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 min-h-0">
      {/* <div className="shrink-0 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Upload your resume
        </h1>
        <p className="text-sm text-muted-foreground">
          We'll read it with AI and pull out everything we need for your card.
        </p>
      </div> */}

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
              Select from previous or{" "}
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-xs"
                disabled={parsing || skipping}
                onClick={onSkip}
              >
                {skipping ? (
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      className="animate-spin dark:text-muted-foreground"
                    />
                    Skipping
                  </span>
                ) : (
                  "Skip"
                )}
              </Button>
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <ResumeHistoryPanel
            resumeHistory={resumeHistory}
            historyLoading={historyLoading}
            historyError={historyError}
            selectedHistory={selectedHistory}
            disabled={parsing || skipping}
            deletingResumeId={deletingResumeId}
            onSelectHistory={onSelectHistory}
            onDeleteHistoryRequest={onDeleteHistoryRequest}
          />
        </>
      ) : (
        <ResumeExtractedPanel
          fileName={fileName}
          parsing={parsing}
          parsed={parsed}
          extractedData={extractedData}
          fromHistory={fromHistory}
          onClear={onClear}
          onFieldChange={onFieldChange}
        />
      )}
    </div>
  );
}

function ResumeHistoryPanel({
  resumeHistory,
  historyLoading,
  historyError,
  selectedHistory,
  disabled,
  deletingResumeId,
  onSelectHistory,
  onDeleteHistoryRequest,
}: {
  resumeHistory: ResumeHistoryItem[];
  historyLoading: boolean;
  historyError: boolean;
  selectedHistory: ResumeHistoryItem | null;
  disabled: boolean;
  deletingResumeId: string | null;
  onSelectHistory: (resume: ResumeHistoryItem) => void;
  onDeleteHistoryRequest: (resume: ResumeHistoryItem) => void;
}) {
  if (historyLoading) {
    return (
      <div className="space-y-2 rounded-xl border border-border bg-card p-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    );
  }

  if (historyError) {
    return (
      <p className="text-center text-xs text-destructive">
        Saved resumes failed to load. Upload again or refresh the page.
      </p>
    );
  }

  if (resumeHistory.length === 0) {
    return (
      <p className="text-center text-xs text-muted-foreground">
        No saved resumes yet — uploads you parse will appear here.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <p className="border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
        Previous uploads
      </p>
      <ul className="max-h-44 divide-y divide-border overflow-y-auto">
        {resumeHistory.map((item) => {
          const isSelected = selectedHistory?.id === item.id;
          const isDeleting = deletingResumeId === item.id;
          const label =
            item.extractedData.name.trim() ||
            item.extractedData.title.trim() ||
            item.fileName;

          return (
            <li key={item.id} className="flex items-stretch">
              <button
                type="button"
                disabled={disabled || isDeleting}
                onClick={() => onSelectHistory(item)}
                className={cn(
                  "flex min-w-0 flex-1 items-start gap-2 px-3 py-2.5 text-left text-sm transition-colors",
                  isSelected
                    ? "bg-primary/5 text-foreground"
                    : "hover:bg-muted/50",
                  disabled && "pointer-events-none opacity-60",
                )}
              >
                <HugeiconsIcon
                  icon={File01Icon}
                  size={16}
                  className="mt-0.5 shrink-0 text-muted-foreground"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{label}</span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {item.fileName} ·{" "}
                    {formatDistanceToNow(new Date(item.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </span>
                {isSelected ? (
                  <HugeiconsIcon
                    icon={CheckIcon}
                    size={14}
                    className="mt-1 shrink-0 text-primary"
                  />
                ) : null}
              </button>
              <button
                type="button"
                disabled={disabled || isDeleting}
                className={cn(
                  "flex w-[4.5rem] shrink-0 flex-col items-center justify-center gap-0.5 self-stretch border-l border-border px-1 py-2 text-[11px] font-medium leading-none text-muted-foreground transition-colors hover:bg-destructive/5 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                  disabled && "pointer-events-none opacity-60",
                )}
                aria-label={`Delete ${label} from history`}
                onClick={() => onDeleteHistoryRequest(item)}
              >
                {isDeleting ? (
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <>
                    <HugeiconsIcon icon={Delete02Icon} size={14} />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </li>
          );
        })}
      </ul>
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
  onFieldChange,
}: {
  fileName: string;
  parsing: boolean;
  parsed: boolean;
  extractedData: ExtractedCardData | null;
  fromHistory: boolean;
  onClear: () => void;
  onFieldChange: (field: EditableExtractedField, value: string) => void;
}) {
  const fields: {
    key: EditableExtractedField;
    label: string;
    placeholder: string;
    type?: string;
  }[] = [
    { key: "name", label: "Name", placeholder: "Your name" },
    { key: "title", label: "Title", placeholder: "Job title" },
    { key: "company", label: "Company", placeholder: "Company name" },
    {
      key: "email",
      label: "Email",
      placeholder: "you@email.com",
      type: "email",
    },
    { key: "phone", label: "Phone", placeholder: "+1 (555) 000-0000" },
    { key: "location", label: "Location", placeholder: "City, State" },
    {
      key: "website",
      label: "Website",
      placeholder: "yoursite.com",
      type: "url",
    },
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
        <div className="mb-3 flex items-center gap-2">
          <HugeiconsIcon
            icon={parsing ? Loading03Icon : SparklesIcon}
            size={20}
            className={cn("size-4", parsing ? "animate-spin" : "")}
          />
          <p className="text-sm font-medium">
            {parsing
              ? "AI is reading your resume…"
              : "Review extracted details"}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {fields.map(({ key, label, placeholder, type }) => (
            <div
              key={key}
              className={cn(
                "space-y-1.5",
                // key === "name" && "sm:col-span-2",
              )}
            >
              <Label
                htmlFor={`extracted-${key}`}
                className="text-[11px] uppercase tracking-wide text-muted-foreground"
              >
                {label}
              </Label>
              {parsing || !extractedData ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <Input
                  id={`extracted-${key}`}
                  type={type ?? "text"}
                  value={extractedData[key]}
                  placeholder={placeholder}
                  disabled={!parsed}
                  onChange={(event) => onFieldChange(key, event.target.value)}
                  className="h-9 bg-background text-sm"
                />
              )}
            </div>
          ))}
        </div>
        {parsed && !parsing && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Looks off? Fix it now, or adjust later in the builder
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
  const [themeSearch, setThemeSearch] = useState("");
  const previewData = useMemo(
    () => buildThemePreviewData(extractedData),
    [extractedData],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <ThemePickerGrid
        className="min-h-0 flex-1"
        themes={cardThemes}
        previewData={previewData}
        selected={selected}
        onToggle={onToggle}
        searchQuery={themeSearch}
        onSearchQueryChange={setThemeSearch}
        isProPlan={isProPlan}
        // footer={
        //   !isProPlan ? (
        //     <div className="rounded-xl border border-dashed border-border bg-card/50 p-4 text-center text-sm text-muted-foreground">
        //       Want to build multiple cards at once?{" "}
        //       <Link href="/#pricing" className="font-medium text-primary ">
        //         Upgrade to Pro
        //       </Link>{" "}
        //       to select several themes.
        //     </div>
        //   ) : undefined
        // }
      />
    </div>
  );
}

function StepDot({
  index,
  current,
  label,
  icon,
  compact = false,
}: {
  index: number;
  current: number;
  label: string;
  icon: IconSvgElement;
  compact?: boolean;
}) {
  const done = current > index;
  const active = current === index;
  return (
    <div className="flex min-w-0 items-center gap-1.5 sm:gap-2.5">
      <span
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-full border text-xs font-semibold transition-colors sm:size-7",
          done && "border-primary bg-primary text-primary-foreground",
          active && "border-primary text-primary",
          !done && !active && "border-border text-muted-foreground",
        )}
      >
        {done ? <HugeiconsIcon icon={CheckIcon} size={16} /> : index}
      </span>
      <span
        className={cn(
          "min-w-0 items-center gap-1 text-xs font-medium sm:text-sm",
          compact ? "hidden sm:flex" : "flex",
          active ? "text-primary dark:text-white" : "text-muted-foreground",
        )}
      >
        <HugeiconsIcon icon={icon} size={16} className="shrink-0" />
        <span className="truncate">{label}</span>
      </span>
    </div>
  );
}
