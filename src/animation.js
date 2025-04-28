export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.5 }
    }
};

export const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren,
            delayChildren
        }
    }
});

export const scaleOnHover = {
    scale: 1.05,
    transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
    }
};

export const subtleRotate = {
    rotate: 3,
    transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
    }
};

// Loading skeleton animation
export const shimmer = {
    hidden: { backgroundPosition: '-100% 0' },
    visible: {
        backgroundPosition: '200% 0',
        transition: {
            repeat: Infinity,
            duration: 1.5,
            ease: "linear"
        }
    }
};

// Page transition animations
export const pageTransition = {
    hidden: { opacity: 0 },
    enter: {
        opacity: 1,
        transition: { duration: 0.5, ease: "easeInOut" }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.5, ease: "easeInOut" }
    }
};

// Button animation
export const buttonHover = {
    rest: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10
        }
    },
    tap: {
        scale: 0.98,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 17
        }
    }
};

// Card hover animation
export const cardHover = {
    rest: { y: 0, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)" },
    hover: {
        y: -8,
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10
        }
    }
};

// Border animation
export const borderAnimation = {
    hidden: { width: 0 },
    visible: {
        width: "100%",
        transition: { duration: 0.5 }
    }
};

// Use this for skeleton loading components
export const SkeletonPulse = () => {
    return (
        <motion.div
            variants={shimmer}
            initial="hidden"
            animate="visible"
            className="h-full w-full bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent bg-[length:200%_100%]"
        />
    );
};