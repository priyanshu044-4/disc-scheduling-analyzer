#ifndef COLORS_H
#define COLORS_H

#ifdef _WIN32
#include <windows.h>
#endif
#include <stdio.h>

/* ANSI Escape Codes for Terminal Formatting */
#define ANSI_RESET        "\033[0m"
#define ANSI_BOLD         "\033[1m"
#define ANSI_DIM          "\033[2m"
#define ANSI_UNDERLINE    "\033[4m"

/* Standard 16-color Foreground */
#define ANSI_BLACK        "\033[30m"
#define ANSI_RED          "\033[31m"
#define ANSI_GREEN        "\033[32m"
#define ANSI_YELLOW       "\033[33m"
#define ANSI_BLUE         "\033[34m"
#define ANSI_MAGENTA      "\033[35m"
#define ANSI_CYAN         "\033[36m"
#define ANSI_WHITE        "\033[37m"

/* Bright Foreground Colors */
#define ANSI_BRIGHT_RED     "\033[91m"
#define ANSI_BRIGHT_GREEN   "\033[92m"
#define ANSI_BRIGHT_YELLOW  "\033[93m"
#define ANSI_BRIGHT_BLUE    "\033[94m"
#define ANSI_BRIGHT_MAGENTA "\033[95m"
#define ANSI_BRIGHT_CYAN    "\033[96m"
#define ANSI_BRIGHT_WHITE   "\033[97m"

/* Dracula Pro Palette (RGB 24-bit TrueColor) */
#define ANSI_DRACULA_PURPLE     "\033[38;2;189;147;249m"  /* #bd93f9: Soft Purple */
#define ANSI_DRACULA_GREEN      "\033[38;2;80;250;123m"   /* #50fa7b: Pastel Emerald */
#define ANSI_DRACULA_CYAN       "\033[38;2;139;233;253m"  /* #8be9fd: Laser Cyan */
#define ANSI_DRACULA_PINK       "\033[38;2;255;121;198m"  /* #ff79c6: Hot Pink */
#define ANSI_DRACULA_YELLOW     "\033[38;2;241;250;140m"  /* #f1fa8c: Pastel Yellow */
#define ANSI_DRACULA_ORANGE     "\033[38;2;255;184;108m"  /* #ffb86c: Sunset Orange */
#define ANSI_DRACULA_ALABASTER  "\033[38;2;248;248;242m"  /* #f8f8f2: Text */
#define ANSI_DRACULA_SLATE      "\033[38;2;98;114;164m"   /* #6272a4: Comment Slate */

/* Forest Terminal Palette (RGB 24-bit TrueColor) */
#define ANSI_FOREST_GREEN       "\033[38;2;76;175;80m"    /* #4caf50: Pine Green (primary) */
#define ANSI_FOREST_MINT        "\033[38;2;129;199;132m"  /* #81c784: Soft Leaf Mint */
#define ANSI_FOREST_BARK        "\033[38;2;141;110;99m"   /* #8d6e63: Warm Bark Brown */
#define ANSI_FOREST_SAGE        "\033[38;2;220;237;200m"  /* #dcedc8: Sage Linen White */
#define ANSI_FOREST_MUTED       "\033[38;2;122;158;126m"  /* #7a9e7e: Muted Forest Green */
#define ANSI_FOREST_DEEP        "\033[38;2;46;79;46m"     /* #2e4f2e: Deep Canopy Border */

/* Active Theme Aliases → Forest Terminal */
#define ANSI_THEME_PRIMARY      ANSI_FOREST_GREEN
#define ANSI_THEME_SECONDARY    ANSI_FOREST_MINT
#define ANSI_THEME_ACCENT       ANSI_FOREST_BARK
#define ANSI_THEME_TEXT         ANSI_FOREST_SAGE
#define ANSI_THEME_MUTED        ANSI_FOREST_MUTED

/* Enable Virtual Terminal Processing for Windows console */
static inline void init_terminal_colors(void) {
#ifdef _WIN32
    HANDLE hOut = GetStdHandle(STD_OUTPUT_HANDLE);
    if (hOut != INVALID_HANDLE_VALUE) {
        DWORD dwMode = 0;
        if (GetConsoleMode(hOut, &dwMode)) {
            dwMode |= ENABLE_VIRTUAL_TERMINAL_PROCESSING;
            SetConsoleMode(hOut, dwMode);
        }
    }
#endif
}

#endif /* COLORS_H */
