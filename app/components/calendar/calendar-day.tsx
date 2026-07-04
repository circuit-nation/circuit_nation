import type { ReactNode } from "react";
import { isToday, isCurrentMonth } from "~/lib/calendar-utils";
import { cn } from "~/lib/utils";

interface CalendarDayProps {
    date: Date;
    currentDate: Date;
    className?: string;
    children?: ReactNode;
}

export const CalendarDay = ({ date, currentDate, className, children }: CalendarDayProps) => {
    const isCurrentDay = isToday(date);
    const isInCurrentMonth = isCurrentMonth(date, currentDate);
    const showMonthLabel = date.getDate() === 1;

    return (
        <div
            className={cn(
                "relative h-full bg-transparent p-2 transition-colors",
                "hover:bg-muted/10",
                !isInCurrentMonth && "text-muted-foreground/60",
                className,
            )}
        >
            <div className="flex items-center justify-between border-b border-muted/20 pb-1">
                <span
                    className={cn(
                        "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                        isCurrentDay && "bg-cn-blue-dark text-white",
                        !isCurrentDay && isInCurrentMonth && "text-foreground/90",
                        !isCurrentDay && !isInCurrentMonth && "text-muted-foreground",
                    )}
                >
                    {date.getDate()}
                </span>
                {showMonthLabel && (
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {date.toLocaleDateString("en-US", { month: "short" })}
                    </span>
                )}
            </div>
            {children && <div className="mt-2 space-y-1">{children}</div>}
        </div>
    );
};
