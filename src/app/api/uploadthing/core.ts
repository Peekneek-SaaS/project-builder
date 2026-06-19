import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
  resumeUploader: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
    blob: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const { userId } = await auth();

      if (!userId) {
        throw new UploadThingError("You must be signed in to upload a resume.");
      }

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        userId: metadata.userId,
        url: file.ufsUrl,
        key: file.key,
        name: file.name,
        type: file.type,
      };
    }),

  logoUploader: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const { userId } = await auth();

      if (!userId) {
        throw new UploadThingError("You must be signed in to upload a logo.");
      }

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        userId: metadata.userId,
        url: file.ufsUrl,
        key: file.key,
        name: file.name,
        type: file.type,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
