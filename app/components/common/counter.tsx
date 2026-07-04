import NumberFlow from "@number-flow/react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

type TimeLeft = {
	days: number;
	hours: number;
	minutes: number;
};

const calculateTimeLeft = (targetDate: Date): TimeLeft => {
	const difference = +targetDate - +new Date();

	if (difference <= 0) {
		return { days: 0, hours: 0, minutes: 0 };
	}

	return {
		days: Math.floor(difference / (1000 * 60 * 60 * 24)),
		hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
		minutes: Math.floor((difference / 1000 / 60) % 60),
	};
};

const CountdownUnit = ({ value, label, accentClass }: { value: number; label: string; accentClass: string }) => (
	<motion.div
		className="flex flex-col items-center rounded-lg bg-muted/40 backdrop-blur-lg px-3 py-2"
		initial={{ opacity: 0, y: 6 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
	>
		<NumberFlow value={value} className={`text-2xl font-semibold ${accentClass}`} />
		<span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
	</motion.div>
);

interface RaceCountdownCounterProps {
	title: string;
	targetDate: Date;
	accentClass: string;
	subtitle?: string;
	backgroundImage?: string;
}

const RaceCountdownCounter = ({ title, subtitle, targetDate, accentClass, backgroundImage }: RaceCountdownCounterProps) => {
	const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(calculateTimeLeft(targetDate));
		}, 1000);

		return () => clearInterval(timer);
	}, [targetDate]);

	const units = useMemo(
		() => [
			{ label: "Days", value: timeLeft.days },
			{ label: "Hours", value: timeLeft.hours },
			{ label: "Min", value: timeLeft.minutes },
		],
		[timeLeft]
	);

	return (
		<Card className="relative border-muted/40 bg-background/80 shadow-sm overflow-hidden">
			{backgroundImage ? (
				<img
					src={backgroundImage}
					alt={`${title} background`}
					className="absolute right-0 top-1/2 h-[70%] w-[60%] -translate-y-2/3 translate-x-1/3 object-contain opacity-90 pointer-events-none"
				/>
			) : null}
			<div className="relative space-y-3">
				<CardHeader className="gap-1">
					<span className={`text-sm font-semibold uppercase tracking-wide ${accentClass}`}>{title}</span>
					{subtitle ? <span className="text-xs text-muted-foreground line-clamp-1">{subtitle}</span> : null}
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-3 gap-2">
						{units.map((unit) => (
							<CountdownUnit
								key={unit.label}
								value={unit.value}
								label={unit.label}
								accentClass={accentClass}
							/>
						))}
					</div>
				</CardContent>
			</div>
		</Card>
	);
};

export { RaceCountdownCounter };
