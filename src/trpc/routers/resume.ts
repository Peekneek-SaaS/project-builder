import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  extractedCardDataSchema,
  type ExtractedCardData,
} from "@/features/create/types";
import { prisma } from "@/lib/db";
import { extractCardDataWithOpenAI } from "@/lib/resume/extract-with-openai";
import { extractResumeText, ResumeExtractionError } from "@/lib/resume/extract-text";
import { extensionFromFileName } from "@/lib/resume/validate-file";
import { createTRPCRouter, protectedProcedure } from "../init";

const blankExtractedData = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  skills: [] as string[],
  company: "",
  website: "",
} satisfies ExtractedCardData;

const parseResumeInput = z.object({
  fileUrl: z.url(),
  fileKey: z.string().min(1),
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
});

export const resumeRouter = createTRPCRouter({
  parse: protectedProcedure
    .input(parseResumeInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const response = await fetch(input.fileUrl, {
          headers: { Accept: "application/pdf,application/octet-stream,*/*" },
        });

        if (!response.ok) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Could not download the uploaded resume (${response.status}).`,
          });
        }

        const buffer = Buffer.from(await response.arrayBuffer());

        if (buffer.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Downloaded resume file was empty.",
          });
        }
        const extension = extensionFromFileName(input.fileName);
        const rawText = await extractResumeText(buffer, extension);
        const extractedData = await extractCardDataWithOpenAI(rawText);

        const resume = await prisma.resume.create({
          data: {
            userId: ctx.userId,
            fileName: input.fileName,
            fileUrl: input.fileUrl,
            fileKey: input.fileKey,
            mimeType: input.mimeType,
            extractedData,
            rawText,
          },
        });

        return {
          id: resume.id,
          extractedData,
        };
      } catch (error) {
        if (error instanceof ResumeExtractionError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        }

        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Resume parse failed:", error);

        const message =
          error instanceof Error && error.message.includes("OPENAI_API_KEY")
            ? "OpenAI API key is not configured on the server."
            : error instanceof Error &&
                (error.message.includes("401") ||
                  error.message.includes("Incorrect API key"))
              ? "OpenAI API key is invalid. Check OPENAI_API_KEY in .env."
              : error instanceof Error
                ? error.message
                : "Failed to parse resume. Please try again.";

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  createBlank: protectedProcedure.mutation(async ({ ctx }) => {
    const resume = await prisma.resume.create({
      data: {
        userId: ctx.userId,
        fileName: "No resume uploaded",
        fileUrl: "",
        fileKey: "manual",
        mimeType: "application/octet-stream",
        extractedData: blankExtractedData,
        rawText: null,
      },
    });

    return {
      id: resume.id,
      extractedData: blankExtractedData,
    };
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const resume = await prisma.resume.findFirst({
        where: { id: input.id, userId: ctx.userId },
      });

      if (!resume) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Resume not found." });
      }

      return {
        id: resume.id,
        fileName: resume.fileName,
        fileUrl: resume.fileUrl,
        extractedData: extractedCardDataSchema.parse(resume.extractedData),
      };
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const resumes = await prisma.resume.findMany({
      where: { userId: ctx.userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fileName: true,
        fileUrl: true,
        extractedData: true,
        createdAt: true,
      },
    });

    return resumes.map((resume) => ({
      ...resume,
      extractedData: extractedCardDataSchema.parse(
        resume.extractedData,
      ) satisfies ExtractedCardData,
    }));
  }),
});
