import { BusinessCardData } from "./types";

function FrontFace({ card }: { card: BusinessCardData }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-2xl [backface-visibility:hidden]"
      style={{ background: card.colors.front }}
    >
      <span
        className="absolute -left-8 -top-8 h-28 w-28 rounded-full border-[10px]"
        style={{ borderColor: card.colors.accent, opacity: 0.9 }}
      />
      <span
        className="absolute -bottom-10 -right-10 h-24 w-24 rounded-full border-[10px]"
        style={{ borderColor: card.colors.accent, opacity: 0.55 }}
      />

      <div
        className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-medium"
        style={{
          background: card.colors.accent,
          color: card.colors.accentText,
        }}
      >
        {card.initials}
      </div>
      <p
        className="mt-3 text-lg font-medium tracking-wide"
        style={{ color: card.colors.onFront }}
      >
        {card.company}
      </p>
      {card.tagline && (
        <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-neutral-400">
          {card.tagline}
        </p>
      )}
      <p
        className="absolute bottom-4 text-[10px] tracking-wide"
        style={{ color: card.colors.onFront, opacity: 0.7 }}
      >
        {card.email}
      </p>
    </div>
  );
}

function BackFace({ card }: { card: BusinessCardData }) {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]"
      style={{ background: card.colors.back }}
    >
      <div>
        <p
          className="text-base font-medium"
          style={{ color: card.colors.onBack }}
        >
          {card.name}
        </p>
        <p
          className="text-[11px] uppercase tracking-[0.12em]"
          style={{ color: card.colors.onBackMuted }}
        >
          {card.title}
        </p>
      </div>

      <div
        className="flex flex-col gap-1.5 font-mono text-[11px]"
        style={{ color: card.colors.onBack }}
      >
        <Row
          icon={<PhoneIcon color={card.colors.accent} />}
          text={card.phone}
        />
        {/* {card.phone2 && (
          <Row
            icon={<PhoneIcon color={card.colors.accent} />}
            text={card.phone2}
          />
        )} */}
        {card.website && (
          <Row
            icon={<GlobeIcon color={card.colors.accent} />}
            text={card.website}
          />
        )}
        {card.address && (
          <Row
            icon={<PinIcon color={card.colors.accent} />}
            text={card.address}
          />
        )}
      </div>

      <div className="flex items-end justify-between">
        <p
          className="text-[13px] font-medium tracking-wide"
          style={{ color: card.colors.onBack }}
        >
          {card.company}
        </p>
        <div
          className="grid h-8 w-8 grid-cols-3 grid-rows-3 gap-[2px] rounded-sm p-1"
          style={{ background: card.colors.onBack }}
          aria-hidden="true"
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className="rounded-[1px]"
              style={{
                background: [0, 1, 3, 5, 7, 8].includes(i)
                  ? card.colors.back
                  : "transparent",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-3.5 w-3.5 items-center justify-center">
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}

function PhoneIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
      <path
        d="M6.6 10.8c1.6 3.2 4.2 5.8 7.4 7.4l2.5-2.5c.3-.3.8-.4 1.2-.3 1.3.4 2.7.6 4.1.6.6 0 1.2.5 1.2 1.2v3.6c0 .7-.6 1.2-1.2 1.2C10.5 22 2 13.5 2 2.8 2 2.2 2.6 1.6 3.2 1.6h3.6c.7 0 1.2.6 1.2 1.2 0 1.4.2 2.8.6 4.1.1.4 0 .9-.3 1.2L6.6 10.8z"
        fill={color}
      />
    </svg>
  );
}

function GlobeIcon({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      className="h-3 w-3"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a13 13 0 0 1 0 18 13 13 0 0 1 0-18z" />
    </svg>
  );
}

function PinIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
      <path
        d="M12 22s7-7.4 7-12.6A7 7 0 0 0 5 9.4C5 14.6 12 22 12 22z"
        fill={color}
      />
      <circle cx="12" cy="9.5" r="2.4" fill="white" />
    </svg>
  );
}

export function CardFaces({ card }: { card: BusinessCardData }) {
  return (
    <>
      <FrontFace card={card} />
      <BackFace card={card} />
    </>
  );
}
