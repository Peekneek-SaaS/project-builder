"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cloneCardData, type CardData } from "@/lib/card-data";
import {
  clampProfileFields,
  countWords,
  parseSkillsText,
  PROFILE_WORD_LIMITS,
  profileLimitHint,
  skillsToDisplayText,
  truncateToWordLimit,
} from "@/lib/profile-limits";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

function WordCount({
  current,
  limit,
  className,
}: {
  current: number;
  limit: number;
  className?: string;
}) {
  const atLimit = current >= limit;

  return (
    <span
      className={cn(
        "text-xs tabular-nums",
        atLimit
          ? "text-amber-600 dark:text-amber-500"
          : "text-muted-foreground",
        className,
      )}
    >
      {current} / {limit} words
    </span>
  );
}

function ProfileField({
  id,
  label,
  hint,
  value,
  rows,
  placeholder,
  wordLimit,
  onValueChange,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  rows: number;
  placeholder: string;
  wordLimit: number;
  onValueChange: (value: string) => void;
}) {
  const wordCount = countWords(value);

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        <WordCount current={wordCount} limit={wordLimit} />
      </div>
      <Textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(event) => {
          onValueChange(truncateToWordLimit(event.target.value, wordLimit));
        }}
      />
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export function ShareProfileEditor({
  cardId,
  cardData,
}: {
  cardId: string;
  cardData: CardData;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initial = clampProfileFields({
    bio: cardData.bio,
    experience: cardData.experience,
    skills: cardData.skills,
  });

  const [bio, setBio] = useState(initial.bio);
  const [experience, setExperience] = useState(initial.experience);
  const [skillsText, setSkillsText] = useState(
    skillsToDisplayText(initial.skills),
  );

  const skills = parseSkillsText(skillsText);

  const updateCard = useMutation(
    trpc.card.update.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(
          trpc.card.getById.queryFilter({ id: cardId }),
        );
      },
      onError: () => {
        toast.error("Failed to save profile");
      },
    }),
  );

  useEffect(() => {
    const next = clampProfileFields({
      bio: cardData.bio,
      experience: cardData.experience,
      skills: cardData.skills,
    });
    setBio(next.bio);
    setExperience(next.experience);
    setSkillsText(skillsToDisplayText(next.skills));
  }, [cardId, cardData.bio, cardData.experience, cardData.skills]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  function scheduleSave(next: {
    bio: string;
    experience: string;
    skills: string[];
  }) {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const clamped = clampProfileFields(next);
      updateCard.mutate({
        id: cardId,
        cardData: cloneCardData({
          ...cardData,
          bio: clamped.bio,
          experience: clamped.experience,
          skills: clamped.skills,
        }),
      });
    }, 600);
  }

  function handleSkillsChange(raw: string) {
    const lines = raw.split("\n");
    const nextLines: string[] = [];

    for (const line of lines) {
      if (
        nextLines.filter((entry) => entry.trim()).length >=
          PROFILE_WORD_LIMITS.skillsMaxCount &&
        line.trim()
      ) {
        break;
      }

      nextLines.push(
        line.trim()
          ? truncateToWordLimit(line, PROFILE_WORD_LIMITS.skillLabelMaxWords)
          : line,
      );
    }

    const nextText = nextLines.join("\n");
    const nextSkills = parseSkillsText(nextText);

    setSkillsText(nextText);
    scheduleSave({ bio, experience, skills: nextSkills });
  }

  return (
    <section className="mt-8 rounded-xl border border-border bg-card p-5 sm:p-6">
      <div>
        <h2 className="text-base font-semibold tracking-tight">
          Public profile
        </h2>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          About you, experience, and skills appear on your public share page.
          Keep each section concise — changes save automatically.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <ProfileField
          id="profile-about"
          label="About you"
          hint={profileLimitHint("aboutYou")}
          rows={4}
          placeholder="A short professional summary…"
          wordLimit={PROFILE_WORD_LIMITS.aboutYou}
          value={bio}
          onValueChange={(value) => {
            setBio(value);
            scheduleSave({
              bio: value,
              experience,
              skills,
            });
          }}
        />

        <ProfileField
          id="profile-experience"
          label="Experience"
          hint={profileLimitHint("experience")}
          rows={5}
          placeholder="One role per line, e.g. Senior Designer at Acme (2021 – Present)"
          wordLimit={PROFILE_WORD_LIMITS.experience}
          value={experience}
          onValueChange={(value) => {
            setExperience(value);
            scheduleSave({
              bio,
              experience: value,
              skills,
            });
          }}
        />

        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-3">
            <Label htmlFor="profile-skills">Skills</Label>
            <span
              className={cn(
                "text-xs tabular-nums",
                skills.length >= PROFILE_WORD_LIMITS.skillsMaxCount
                  ? "text-amber-600 dark:text-amber-500"
                  : "text-muted-foreground",
              )}
            >
              {skills.length} / {PROFILE_WORD_LIMITS.skillsMaxCount} skills
            </span>
          </div>
          <Textarea
            id="profile-skills"
            rows={4}
            placeholder="One skill per line, e.g. React"
            value={skillsText}
            onChange={(event) => handleSkillsChange(event.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            {profileLimitHint("skills")}. Separate with a new line or comma.
          </p>
        </div>
      </div>

      {updateCard.isPending ? (
        <p className="mt-4 text-xs text-muted-foreground">Saving…</p>
      ) : null}
    </section>
  );
}
