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

/* Rustic Earthy Palette (RGB 24-bit TrueColor from Swatches) */
#define ANSI_RUSTIC_CREAM       "\033[38;2;236;230;218m"  /* #ece6da: Warm Linen */
#define ANSI_RUSTIC_GOLD        "\033[38;2;206;200;138m"  /* #cec88a: Moss Gold */
#define ANSI_RUSTIC_SAGE        "\033[38;2;122;124;100m"  /* #7a7c64: Sage Green */
#define ANSI_RUSTIC_SPRUCE      "\033[38;2;70;82;72m"     /* #465248: Forest Spruce */
#define ANSI_RUSTIC_BARK        "\033[38;2;64;57;47m"     /* #40392f: Charcoal Bark */
#define ANSI_RUSTIC_TAUPE       "\033[38;2;188;176;150m"  /* #bcb096: Warm Taupe */
#define ANSI_RUSTIC_TERRACOTTA  "\033[38;2;168;91;77m"    /* #a85b4d: Weathered Brick */

/* Background Colors */
#define ANSI_BG_BLACK     "\033[40m"
#define ANSI_BG_RED       "\033[41m"
#define ANSI_BG_GREEN     "\033[42m"
#define ANSI_BG_YELLOW    "\033[43m"
#define ANSI_BG_BLUE      "\033[44m"
#define ANSI_BG_MAGENTA   "\033[45m"
#define ANSI_BG_CYAN      "\033[46m"
#define ANSI_BG_WHITE     "\033[47m"

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
