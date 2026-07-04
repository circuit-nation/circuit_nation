import type { CalendarEvent } from "~/types/calendar";
import {
    getDaysInMonth,
    isCurrentMonth,
    isSameDay,
    startOfDay,
} from "~/lib/calendar-utils";
import { CalendarDay } from "./calendar-day";
import { EventBadge } from "./event-badge";

interface MonthViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    spanMultiDay?: boolean;
}

const WEEKDAYS = ["MON", "TUES", "WED", "THUR", "FRI", "SAT", "SUN"];
const BASE_WEEK_HEIGHT = 140;

const chunkWeeks = (days: Date[]): Date[][] => {
    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }
    return weeks;
};

const trimWeeksToFive = (weeks: Date[][], currentDate: Date): Date[][] => {
    if (weeks.length <= 5) {
        return weeks;
    }

    const scores = weeks.map((week, index) => {
        const inMonthCount = week.filter((date) => isCurrentMonth(date, currentDate))
            .length;
        return { index, inMonthCount };
    });

    scores.sort((a, b) => a.inMonthCount - b.inMonthCount || a.index - b.index);
    const dropIndex = scores[0].index;
    return weeks.filter((_, index) => index !== dropIndex).slice(0, 5);
};

const getEventsForDay = (date: Date, events: CalendarEvent[]): CalendarEvent[] => {
    const dayStart = startOfDay(date);
    return events.filter((event) => {
        const eventStart = startOfDay(event.startAt);
        const eventEnd = startOfDay(event.endAt);
        return dayStart >= eventStart && dayStart <= eventEnd;
    });
};

type WeekSpan = {
    event: CalendarEvent;
    startIndex: number;
    endIndex: number;
    lane: number;
    laneCount: number;
};

const getWeekRange = (week: Date[]): { start: Date; end: Date } => {
    const start = startOfDay(week[0]);
    const end = new Date(startOfDay(week[6]));
    end.setHours(23, 59, 59, 999);
    return { start, end };
};

const buildWeekSpans = (week: Date[], events: CalendarEvent[]): WeekSpan[] => {
    const { start, end } = getWeekRange(week);
    const dayMs = 24 * 60 * 60 * 1000;
    const weekEvents = events.filter(
        (event) => event.startAt <= end && event.endAt >= start,
    );

    const spans = weekEvents.map((event) => {
        const eventStart = startOfDay(event.startAt) < start ? start : startOfDay(event.startAt);
        const eventEnd = startOfDay(event.endAt) > end ? end : startOfDay(event.endAt);
        const startIndex = Math.max(
            0,
            Math.floor((eventStart.getTime() - start.getTime()) / dayMs),
        );
        const endIndex = Math.min(
            6,
            Math.floor((eventEnd.getTime() - start.getTime()) / dayMs),
        );
        return { event, startIndex, endIndex };
    });

    spans.sort((a, b) => a.startIndex - b.startIndex || a.endIndex - b.endIndex);

    const lanes: number[] = [];
    const positioned = spans.map((span) => {
        let laneIndex = lanes.findIndex((laneEnd) => span.startIndex > laneEnd);
        if (laneIndex === -1) {
            laneIndex = lanes.length;
            lanes.push(span.endIndex);
        } else {
            lanes[laneIndex] = span.endIndex;
        }
        return { ...span, lane: laneIndex, laneCount: 1 };
    });

    const laneCount = Math.max(1, lanes.length);
    return positioned.map((span) => ({ ...span, laneCount }));
};

export const MonthView = ({ currentDate, events, spanMultiDay = false }: MonthViewProps) => {
    const days = getDaysInMonth(currentDate);
    const weeks = trimWeeksToFive(chunkWeeks(days), currentDate);

    return (
        <div className="animate-fade-in space-y-3">
            <div className="grid grid-cols-7 bg-muted/10 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {WEEKDAYS.map((day) => (
                    <div key={day} className="px-3 py-2 text-center">
                        {day}
                    </div>
                ))}
            </div>

            {weeks.map((week, index) => {
                const spans = spanMultiDay ? buildWeekSpans(week, events) : [];
                const weekHeight = BASE_WEEK_HEIGHT;

                return (
                    <div
                        key={`${week[0].toISOString()}-${index}`}
                        className="relative overflow-hidden rounded-xl border border-muted/40 bg-background/80"
                        style={{ minHeight: weekHeight }}
                    >
                        <div className="grid h-full grid-cols-7">
                            {week.map((date) => {
                                const dayEvents = spanMultiDay
                                    ? []
                                    : getEventsForDay(date, events);
                                const visibleEvents = dayEvents.slice(0, 3);
                                const remaining = dayEvents.length - visibleEvents.length;

                                return (
                                    <CalendarDay
                                        key={date.toISOString()}
                                        date={date}
                                        currentDate={currentDate}
                                        className="h-full"
                                    >
                                        {visibleEvents.map((event) => (
                                            <EventBadge
                                                key={`${event.id}-${date.toISOString()}`}
                                                event={event}
                                                compact
                                                variant="month"
                                                className={isSameDay(event.startAt, event.endAt)
                                                    ? "h-auto"
                                                    : "h-auto rounded-sm"}
                                            />
                                        ))}
                                        {remaining > 0 && (
                                            <div className="text-xs font-medium text-muted-foreground">
                                                +{remaining} more
                                            </div>
                                        )}
                                    </CalendarDay>
                                );
                            })}
                        </div>

                        {spanMultiDay && (
                            <div
                                className="grid grid-cols-7 gap-1 px-2"
                                style={{ gridAutoRows: "minmax(20px, auto)" }}
                            >
                                {spans.map((span) => (
                                    <div
                                        key={`${span.event.id}-${span.startIndex}-${span.endIndex}`}
                                        className="min-w-0"
                                        style={{
                                            gridColumn: `${span.startIndex + 1} / ${span.endIndex + 2}`,
                                            gridRow: `${span.lane + 1}`,
                                        }}
                                    >
                                        <EventBadge
                                            event={span.event}
                                            compact
                                            variant="month"
                                            className="h-full"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
