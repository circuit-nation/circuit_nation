import { useEffect, useMemo, useState } from "react";
import type { CalendarView, CalendarEvent } from "~/types/calendar";
import type { EventParsed } from "~/schema";
import { CalendarHeader } from "./calendar-header";
import { ViewSwitcher } from "./view-switcher";
import { MonthView } from "./month-view";
import { WeekView } from "./week-view";
import { formatMonthYear, formatWeekRange } from "~/lib/calendar-utils";
import { cn } from "~/lib/utils";
import { Checkbox } from "~/components/ui/checkbox";

interface MotorsportCalendarProps {
    className?: string;
    events: EventParsed[];
}

const getMonthRange = (date: Date): { start: Date; end: Date } => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end };
};

const isOverlappingRange = (event: CalendarEvent, start: Date, end: Date): boolean =>
    event.startAt <= end && event.endAt >= start;

const buildRoundEvents = (events: CalendarEvent[]): CalendarEvent[] => {
    const grouped = new Map<string, CalendarEvent[]>();

    events.forEach((event) => {
        const round = event.round ?? 0;
        if (round === 0) {
            return;
        }
        const key = `${event.sportType}-${round}`;
        if (!grouped.has(key)) {
            grouped.set(key, []);
        }
        grouped.get(key)?.push(event);
    });

    const aggregated = Array.from(grouped.values()).map((group) => {
        group.sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
        const startAt = group[0].startAt;
        const endAt = group.reduce(
            (max, event) => (event.endAt > max ? event.endAt : max),
            group[0].endAt,
        );
        const raceEvent = group.find((event) => event.type === "race") ?? group[0];

        return {
            ...raceEvent,
            id: `round-${raceEvent.sportType}-${raceEvent.round ?? 0}`,
            title: `${raceEvent.sportName} ${raceEvent.title.split(" - ")[0]}`,
            startAt,
            endAt,
        };
    });

    aggregated.sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
    return aggregated;
};

export const MotorsportCalendar = ({ className, events }: MotorsportCalendarProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<CalendarView>('month');
    const [filters, setFilters] = useState<Record<string, boolean>>({});

    const calendarEvents = useMemo<CalendarEvent[]>(() => {
        const mapped = events
            .filter((event) => Boolean(event.sportData))
            .map((event) => ({
                id: event._id,
                title: event.title,
                type: event.type,
                sportType: event.sportData?.type ?? "formula",
                sportName: event.sportData?.name ?? "Motorsport",
                round: event.round,
                sportColor: event.sportData?.color,
                startAt: new Date(event.event_start_at),
                endAt: new Date(event.event_end_at || event.event_start_at),
                circuitName: event.circuitData?.name,
                countryCode: event.circuitData?.country_code ?? "",
                location: event.circuitData?.location_str,
                locationCode: event.circuitData?.country_code,
                images: event.images,
            }));

        mapped.sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
        return mapped;
    }, [events]);

    const sportOptions = useMemo(() => {
        const options = new Map<
            string,
            { type: string; name: string; color?: string }
        >();
        calendarEvents.forEach((event) => {
            if (!options.has(event.sportType)) {
                options.set(event.sportType, {
                    type: event.sportType,
                    name: event.sportName,
                    color: event.sportColor,
                });
            }
        });
        return Array.from(options.values());
    }, [calendarEvents]);

    useEffect(() => {
        setFilters((prev) => {
            const next = { ...prev };
            sportOptions.forEach((sport) => {
                if (next[sport.type] === undefined) {
                    next[sport.type] = true;
                }
            });
            return next;
        });
    }, [sportOptions]);

    const filteredEvents = useMemo(
        () => calendarEvents.filter((event) => filters[event.sportType] ?? true),
        [calendarEvents, filters],
    );

    const navigateDate = (direction: "prev" | "next") => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev);

            if (view === "week") {
                newDate.setDate(prev.getDate() + (direction === "next" ? 7 : -7));
            } else {
                newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
            }

            return newDate;
        });
    };

    const goToToday = () => setCurrentDate(new Date());

    const headerLabel = view === "week"
        ? formatWeekRange(currentDate)
        : formatMonthYear(currentDate);

    const roundEvents = useMemo(
        () => buildRoundEvents(filteredEvents),
        [filteredEvents],
    );

    const raceEvents = useMemo(
        () => filteredEvents.filter((event) => event.type === "race" || event.type === "sprint"),
        [filteredEvents],
    );

    const monthRange = useMemo(() => getMonthRange(currentDate), [currentDate]);

    const eventsForView = useMemo(() => {
        if (view === "rounds") {
            return roundEvents.filter((event) =>
                isOverlappingRange(event, monthRange.start, monthRange.end),
            );
        }
        if (view === "races") {
            return raceEvents.filter((event) =>
                isOverlappingRange(event, monthRange.start, monthRange.end),
            );
        }
        return filteredEvents;
    }, [filteredEvents, monthRange, raceEvents, roundEvents, view]);

    const emptyMessage = view === "rounds"
        ? "No rounds in this month."
        : view === "races"
            ? "No races in this month."
            : "No events match the current filters.";

    return (
        <div
            className={cn(
                "rounded-2xl border border-foreground/20 bg-background/95",
                "shadow-none",
                className,
            )}
        >
            <div className="flex flex-col gap-4 border-b border-muted/40 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                <CalendarHeader
                    currentDate={currentDate}
                    onPrevious={() => navigateDate("prev")}
                    onNext={() => navigateDate("next")}
                    onToday={goToToday}
                    label={headerLabel}
                />
                <ViewSwitcher currentView={view} onViewChange={setView} />
            </div>

            <div className="flex flex-wrap items-center gap-3 border-b border-muted/40 px-5 py-3">
                {sportOptions.map((sport) => (
                    <div key={sport.type} className="flex items-center gap-2">
                        <Checkbox
                            id={`filter-${sport.type}`}
                            checked={filters[sport.type] ?? true}
                            onCheckedChange={() =>
                                setFilters((prev) => ({
                                    ...prev,
                                    [sport.type]: !prev[sport.type],
                                }))
                            }
                            className="data-[state=checked]:border-foreground/70 data-[state=checked]:bg-foreground/70"
                        />
                        <label
                            htmlFor={`filter-${sport.type}`}
                            className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground"
                        >
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: sport.color || "var(--cn-red)" }}
                            />
                            {sport.name}
                        </label>
                    </div>
                ))}
            </div>

            <div className="overflow-x-auto px-5 py-5">
                {view !== "week" && (
                    <MonthView
                        currentDate={currentDate}
                        events={eventsForView}
                        spanMultiDay={view === "rounds"}
                    />
                )}
                {view === "week" && (
                    <WeekView currentDate={currentDate} events={eventsForView} />
                )}
                {eventsForView.length === 0 && (
                    <div className="mt-4 rounded-xl border border-dashed border-muted/40 p-6 text-center text-sm text-muted-foreground">
                        {emptyMessage}
                    </div>
                )}
            </div>
        </div>
    );
};
