import type { CSSProperties } from "react";
import type { CalendarEvent } from "~/types/calendar";
import { formatTimeRange } from "~/lib/calendar-utils";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import Flag from "../common/flag-component";
import { Calendar, FlagIcon, MapPin, Timer } from "lucide-react";
import { cn } from "~/lib/utils";

interface EventBadgeProps {
    event: CalendarEvent;
    timeLabel?: string;
    variant?: "month" | "week";
    compact?: boolean;
    className?: string;
    style?: CSSProperties;
}

const SPORT_COLORS: Record<NonNullable<CalendarEvent["sportType"]>, string> = {
    formula: "var(--cn-red)",
    motogp: "var(--cn-blue)",
    endurance: "var(--cn-amber)",
    indycar: "var(--cn-orange)",
    nascar: "var(--cn-teal)",
    feeder: "var(--cn-green)",
    superbike: "var(--cn-purple)",
    "off-road": "var(--cn-rose)",
};

const getFallbackColor = (sportType: CalendarEvent["sportType"]): string =>
    (sportType && SPORT_COLORS[sportType]) ?? "var(--cn-green)";

const formatDate = (date: Date, includeYear = false) =>
    date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        ...(includeYear && { year: "numeric" }),
    });

const formatEventType = (type: string) => type.replace("-", " ");

const isShortDuration = (start: Date, end: Date) =>
    end.getTime() - start.getTime() < 60 * 60 * 1000;

interface PopoverDetailRowProps {
    icon: React.ReactNode;
    children: React.ReactNode;
}

const PopoverDetailRow = ({ icon, children }: PopoverDetailRowProps) => (
    <div className="flex items-start gap-2.5">
        <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
        <div className="min-w-0 flex-1">{children}</div>
    </div>
);

export const EventBadge = ({
    event,
    timeLabel,
    variant = "month",
    compact = false,
    className,
    style,
}: EventBadgeProps) => {
    const accent = event.sportColor ?? getFallbackColor(event.sportType);
    const isWeek = variant === "week";
    const isShort = isShortDuration(event.startAt, event.endAt);
    const eventTypeLabel = formatEventType(event.type);
    const dateRangeLabel = `${formatDate(event.startAt)} – ${formatDate(event.endAt, true)}`;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    style={{ borderLeftColor: accent, ...style }}
                    className={cn(
                        "group relative flex w-full min-w-0 items-center gap-2 overflow-hidden",
                        "rounded-md border border-l-2 border-muted/40 bg-muted/20 px-2 text-left",
                        "transition-colors duration-150 hover:bg-muted/30",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                        isWeek ? "h-full items-start px-2.5 py-1.5" : "py-1",
                        compact ? "text-xs" : "text-xs",
                        className,
                    )}
                >
                    {isWeek ? (
                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span className="truncate text-xs font-semibold leading-snug text-foreground">
                                {event.title}
                            </span>
                            {/* Only show type label if the event is tall enough to have vertical space */}
                            {!isShort && (
                                <span className="truncate text-xs uppercase tracking-wide text-muted-foreground">
                                    {eventTypeLabel}
                                </span>
                            )}
                        </span>
                    ) : (
                        <>
                            <span className="flex min-w-0 flex-1 flex-col">
                                <span className="truncate font-semibold leading-snug text-foreground">
                                    {event.title}
                                </span>
                                <span className="truncate text-xs uppercase tracking-wide text-muted-foreground">
                                    {eventTypeLabel}
                                </span>
                            </span>
                            {timeLabel && (
                                <span className="ml-1 shrink-0 rounded-full border border-muted/40 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                    {timeLabel}
                                </span>
                            )}
                        </>
                    )}
                </button>
            </PopoverTrigger>

            <PopoverContent
                className="w-72 overflow-hidden rounded-xl border border-muted/50 bg-background p-0 shadow-md"
                align="start"
                sideOffset={8}
            >
                <div className="h-1 w-full" style={{ backgroundColor: accent }} />

                <div className="space-y-3 px-4 py-4">
                    <div className="flex items-center gap-2">
                        <span
                            className="shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide"
                            style={{ borderColor: accent, color: accent }}
                        >
                            {eventTypeLabel}
                        </span>
                        <span className="truncate text-xs uppercase tracking-wide text-muted-foreground">
                            {event.sportName}
                        </span>
                    </div>

                    <h3 className="text-base font-semibold leading-snug text-foreground">
                        {event.title}
                    </h3>

                    <div className="space-y-2 text-sm">
                        {event.location && (
                            <PopoverDetailRow icon={event.countryCode
                                ?
                                (<Flag countryCode={event.countryCode} size="sm" />)
                                :
                                (<MapPin className="h-3.5 w-3.5" />)}
                            >
                                <div className="flex items-center gap-1.5">

                                    <p className="font-medium text-foreground">{event.location}</p>
                                </div>
                                {event.circuitName && (
                                    <p className="text-xs text-muted-foreground">
                                        {event.circuitName}
                                    </p>
                                )}
                            </PopoverDetailRow>
                        )}

                        <PopoverDetailRow icon={<Calendar className="h-3.5 w-3.5" />}>
                            <span className="text-muted-foreground">{dateRangeLabel}</span>
                        </PopoverDetailRow>

                        <PopoverDetailRow icon={<Timer className="h-3.5 w-3.5" />}>
                            <span className="text-muted-foreground">
                                {formatTimeRange(event.startAt, event.endAt)}
                            </span>
                        </PopoverDetailRow>

                        <PopoverDetailRow icon={<FlagIcon className="h-3.5 w-3.5" />}>
                            <span className="capitalize text-muted-foreground">{eventTypeLabel}</span>
                        </PopoverDetailRow>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};