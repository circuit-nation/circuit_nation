import { cn } from "~/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
    motion,
    useScroll,
    useMotionValueEvent,
} from "motion/react";

import React, { useRef, useState } from "react";
import { Logo } from "../common/logo";
import { Link } from "react-router";
import { Drawer, DrawerContent, DrawerHeader } from "./drawer";


interface NavbarProps {
    children: React.ReactNode;
    className?: string;
}

interface NavBodyProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface NavItemsProps {
    items: {
        name: string;
        link: string;
    }[];
    className?: string;
    onItemClick?: () => void;
}

interface MobileNavProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface MobileNavHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface MobileNavMenuProps {
    children: React.ReactNode;
    className?: string;
    isOpen: boolean;
    onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    const [visible, setVisible] = useState<boolean>(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 100) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    });

    return (
        <motion.div
            ref={ref}
            className={cn("fixed inset-x-0 top-4 z-40 w-full", className)}
        >
            {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? React.cloneElement(
                        child as React.ReactElement<{ visible?: boolean }>,
                        { visible },
                    )
                    : child,
            )}
        </motion.div>
    );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
    return (
        <motion.div
            animate={{
                backdropFilter: visible ? "blur(10px)" : "none",
                boxShadow: visible
                    ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
                    : "none",
                width: visible ? "80%" : "100%",
                y: visible ? 20 : 0,
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 50,
            }}
            style={{
                minWidth: "800px",
            }}
            className={cn(
                "relative z-60 mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-2 lg:flex",
                className,
            )}
        >
            {children}
        </motion.div>
    );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
    // const [hovered, setHovered] = useState<number | null>(null);

    return (
        <motion.div
            // onMouseLeave={() => setHovered(null)}
            className={cn(
                "absolute inset-0 hidden flex-row items-center justify-end space-x-2 px-4 text-sm font-medium text-slate-400 transition duration-200 hover:text-slate-300 lg:flex lg:space-x-2",
                className,
            )}
        >
            {items.map((item, idx) => (
                <Link
                    // onMouseEnter={() => setHovered(idx)}
                    onClick={onItemClick}
                    className={cn(
                        "relative px-4 py-2 text-slate-300 rounded-full hover:bg-cn-red/40 transition duration-200",
                        items.some(item => item.name === "Calendar") && item.name === "Calendar" ? "bg-cn-red text-white transition-color duration-200 hover:bg-cn-red" : "hover:text-slate-300",
                    )}
                    key={`link-${idx}`}
                    to={item.link}
                >
                    {/* {hovered === idx && (
                        <motion.div
                            // layoutId="hovered"
                            // this makes the background appear behind the hovered item and transition smoothly between items
                            className="absolute inset-0 h-full w-full rounded-full bg-cn-red/40"
                        />
                    )} */}
                    <span className="relative z-20">{item.name}</span>
                </Link>
            ))}
        </motion.div>
    );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
    return (
        <motion.div
            animate={{
                backdropFilter: visible ? "blur(10px)" : "none",
                boxShadow: visible
                    ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
                    : "none",
                width: visible ? "90%" : "100%",
                paddingRight: visible ? "12px" : "0px",
                paddingLeft: visible ? "12px" : "0px",
                borderRadius: visible ? "48px" : "2rem",
                y: visible ? 20 : 0,
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 50,
            }}
            className={cn(
                "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden",
                className,
            )}
        >
            {children}
        </motion.div>
    );
};

export const MobileNavHeader = ({
    children,
    className,
}: MobileNavHeaderProps) => {
    return (
        <div
            className={cn(
                "flex w-full flex-row items-center justify-between",
                className,
            )}
        >
            {children}
        </div>
    );
};

export const MobileNavMenu = ({
    children,
    className,
    isOpen,
    onClose,
}: MobileNavMenuProps) => {
    return (
        <Drawer
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
            direction={"right"}
        >
            <DrawerContent
                className={cn(
                    "pt-12 pl-4 border border-border bg-background",
                    className,
                )}
            >
                <DrawerHeader className="border-b">
                    Menu
                </DrawerHeader>
                {children}
            </DrawerContent>
        </Drawer>
    );
};

export const MobileNavToggle = ({
    isOpen,
    onClick,
}: {
    isOpen: boolean;
    onClick: () => void;
}) => {
    return isOpen ? (
        <IconX className="text-foreground" onClick={onClick} />
    ) : (
        <IconMenu2 className="text-foreground" onClick={onClick} />
    );
};

export const NavbarLogo = () => {
    return (
        <Link to="/" className="flex items-center gap-3">
            <div className="size-18">
                <Logo />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold tracking-tight">
                Circuit Nation
            </h2>
        </Link>

    );
};

export const NavbarButton = ({
    href,
    as: Tag = "a",
    children,
    className,
    variant = "primary",
    ...props
}: {
    href?: string;
    as?: React.ElementType;
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
        | React.ComponentPropsWithoutRef<"a">
        | React.ComponentPropsWithoutRef<"button">
    )) => {
    const baseStyles =
        "px-4 py-2 rounded-md bg-foreground button text-background text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";

    const variantStyles = {
        primary:
            "shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
        secondary: "bg-transparent shadow-none text-foreground",
        dark: "bg-slate-950 text-foreground shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
        gradient:
            "bg-linear-to-b from-cn-blue to-cn-blue-dark text-foreground shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]",
    };

    return (
        <Tag
            href={href || undefined}
            className={cn(baseStyles, variantStyles[variant], className)}
            {...props}
        >
            {children}
        </Tag>
    );
};
