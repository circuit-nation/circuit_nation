import { cn } from "~/lib/utils";

export function Logo({ className }: { className?: string }) {
    return (
        <img
            src={"/images/logo.svg"}
            alt="Circuit Nation Logo"
            className={cn(`block w-full h-full p-0 object-contain bg-transparent`, className)}
        />

    );
}