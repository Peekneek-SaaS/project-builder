import type { ReactNode } from "react";

import type { CardData } from "@/lib/card-data";

function ProfileBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold tracking-tight text-neutral-900">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function PublicProfilePanel({ data }: { data: CardData }) {
  const bio = data.bio.trim();
  const experience = data.experience.trim();
  const skills = data.skills.filter((skill) => skill.trim().length > 0);

  const hasContent = bio || experience || skills.length > 0;

  if (!hasContent) {
    return (
      <p className="text-sm leading-relaxed text-neutral-500">
        Profile details will appear here once added from the share settings page.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {bio ? (
        <ProfileBlock title="About you">
          <p className="text-sm leading-relaxed text-neutral-600">{bio}</p>
        </ProfileBlock>
      ) : null}

      {experience ? (
        <ProfileBlock title="Experience">
          <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-600">
            {experience}
          </p>
        </ProfileBlock>
      ) : null}

      {skills.length > 0 ? (
        <ProfileBlock title="Skills">
          <ul className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 text-xs font-medium text-neutral-700"
              >
                {skill}
              </li>
            ))}
          </ul>
        </ProfileBlock>
      ) : null}
    </div>
  );
}
