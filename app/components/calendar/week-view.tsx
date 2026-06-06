import type { CalendarEvent } from "~/types/calendar";
import {
    clampMinutesToDay,
    formatTime,
    getMinutesSinceStartOfDay,
    getWeekDays,
    isSameDay,
    isToday,
    startOfDay,
} from "~/lib/calendar-utils";
import { EventBadge } from "./event-badge";
import { cn } from "~/lib/utils";

interface WeekViewProps {
    currentDate: Date;
    events: CalendarEvent[];
}

const HOURS = Array.from({ length: 24 }, (_, index) => index);
const HOUR_HEIGHT = 52;
const MIN_SEGMENT_MINUTES = 30;

type DaySegment = {
    event: CalendarEvent;
    startMinutes: number;
    endMinutes: number;
    lane: number;
    laneCount: number;
    timeLabel: string;
};

const buildDaySegments = (date: Date, events: CalendarEvent[]): DaySegment[] => {
    const dayStart = startOfDay(date);
    const nextDay = new Date(dayStart);
    nextDay.setDate(dayStart.getDate() + 1);

    const dayEvents = events.filter(
        (event) => event.startAt < nextDay && event.endAt >= dayStart,
    );

    const segments = dayEvents.map((event) => {
        const segmentStart = event.startAt > dayStart ? event.startAt : dayStart;
        const segmentEnd = event.endAt < nextDay ? event.endAt : nextDay;
        const rawStart = getMinutesSinceStartOfDay(segmentStart);
        const rawEnd = segmentEnd.getTime() === nextDay.getTime()
            ? 24 * 60
            : getMinutesSinceStartOfDay(segmentEnd);
        const startMinutes = clampMinutesToDay(rawStart);
        const endMinutes = clampMinutesToDay(
            Math.max(rawEnd, startMinutes + MIN_SEGMENT_MINUTES),
        );
        const timeLabel = isSameDay(event.startAt, event.endAt)
            ? `${formatTime(event.startAt)} - ${formatTime(event.endAt)}`
            : "Multi-day";

        return { event, startMinutes, endMinutes, timeLabel };
    });

    segments.sort((a, b) => a.startMinutes - b.startMinutes || a.endMinutes - b.endMinutes);

    const lanes: number[] = [];
    const positioned = segments.map((segment) => {
        let laneIndex = lanes.findIndex((laneEnd) => segment.startMinutes >= laneEnd);
        if (laneIndex === -1) {
            laneIndex = lanes.length;
            lanes.push(segment.endMinutes);
        } else {
            lanes[laneIndex] = segment.endMinutes;
        }
        return { ...segment, lane: laneIndex, laneCount: 1 };
    });

    const laneCount = Math.max(1, lanes.length);
    return positioned.map((segment) => ({ ...segment, laneCount }));
};

export const WeekView = ({ currentDate, events }: WeekViewProps) => {
    const days = getWeekDays(currentDate);
    const gridHeight = HOUR_HEIGHT * 24;

    return (
        <div className="animate-fade-in">
            <div className="overflow-hidden rounded-xl border border-muted/40 bg-background/80">
                <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] border-b border-muted/40 bg-muted/10 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    <div className="px-3 py-2">Time</div>
                    {days.map((date) => (
                        <div key={date.toISOString()} className="px-3 py-2 text-center">
                            <div className={cn(isToday(date) && "text-foreground")}>{
                                date.toLocaleDateString("en-US", { weekday: "short" })
                            }</div>
                            <div
                                className={cn(
                                    "text-sm font-semibold",
                                    isToday(date)
                                        ? "rounded-full bg-[#0a84ff] px-2 py-0.5 text-white"
                                        : "text-foreground",
                                )}
                            >
                                {date.getDate()}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="max-h-180 overflow-auto">
                    <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))]">
                        <div
                            className="relative border-r border-muted/30 bg-muted/10"
                            style={{ height: gridHeight }}
                        >
                            {HOURS.map((hour) => (
                                <div
                                    key={hour}
                                    className="absolute left-0 right-0 border-t border-muted/30 px-2 text-xs text-muted-foreground"
                                    style={{ top: hour * HOUR_HEIGHT }}
                                >
                                    {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                                </div>
                            ))}
                        </div>

                        {days.map((date) => {
                            const segments = buildDaySegments(date, events);

                            return (
                                <div
                                    key={date.toISOString()}
                                    className="relative border-r border-muted/30 bg-background/70"
                                    style={{ height: gridHeight }}
                                >
                                    {HOURS.map((hour) => (
                                        <div
                                            key={hour}
                                            className="pointer-events-none absolute left-0 right-0 border-t border-muted/20"
                                            style={{ top: hour * HOUR_HEIGHT }}
                                        />
                                    ))}

                                    {segments.map((segment) => {
                                        const top = (segment.startMinutes / 60) * HOUR_HEIGHT;
                                        const height = ((segment.endMinutes - segment.startMinutes) / 60) * HOUR_HEIGHT;
                                        const width = 100 / segment.laneCount;
                                        const left = segment.lane * width;

                                        return (
                                            <div
                                                key={`${segment.event.id}-${segment.startMinutes}-${segment.endMinutes}`}
                                                className="absolute px-1"
                                                style={{
                                                    top,
                                                    height,
                                                    width: `${width}%`,
                                                    left: `${left}%`,
                                                }}
                                            >
                                                <EventBadge
                                                    event={segment.event}
                                                    timeLabel={segment.timeLabel}
                                                    variant="week"
                                                    compact
                                                    className="h-full"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
