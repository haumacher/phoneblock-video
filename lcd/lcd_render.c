// Renders T-Dongle-S3 screens on the host with the firmware's own model,
// fonts and logo; the drawing mirrors main/display.c (compose_call, draw_*).
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "display_model.h"
#include "lcd_font.h"
#include "lcd_logo.h"
#include "stats.h"

typedef struct { unsigned char r, g, b; } rgb;
static rgb fb[DM_HEIGHT][DM_WIDTH];
#define C(r_,g_,b_) ((rgb){r_,g_,b_})
static const rgb C_BACKGROUND = {16,24,40}, C_WHITE={255,255,255}, C_BLACK={0,0,0},
  C_NUMBER={180,190,205}, C_SPAM={220,30,30}, C_SUSPECT={245,160,0}, C_LEGIT={30,150,60},
  C_NEUTRAL={70,80,100}, C_BADGE={230,40,40};
#define BAND_Y 58
#define NAME_Y 10
#define NAME_NUMBER_Y 35
#define NUMBER_LARGE_Y 20
#define NUMBER_SMALL_Y 22
#define BAND_TEXT_Y 62
#define BADGE_TOP 1
#define BADGE_H 17
#define BADGE_RIGHT 158
#define BADGE_TEXT_Y 3

static void draw_glyph(const lcd_font_t *f, int index, int x, int y, rgb fg) {
  const uint8_t *bits = f->bits + (size_t)index * f->bytes_per_glyph;
  for (int gy = 0; gy < f->h; gy++) for (int gx = 0; gx < f->w; gx++) {
    int bit = gy * f->w + gx, sx = x + gx, sy = y + gy;
    if (sx<0||sx>=DM_WIDTH||sy<0||sy>=DM_HEIGHT) continue;
    if (bits[bit >> 3] & (0x80 >> (bit & 7))) fb[sy][sx] = fg;
  }
}
static void draw_text(const lcd_font_t *f, const char *t, int x, int y, rgb fg) {
  uint32_t cp;
  while ((cp = dm_utf8_next(&t)) != 0) {
    int i = cp == DM_UTF8_INVALID ? -1 : dm_glyph_index(cp);
    if (i < 0) i = dm_glyph_index('?');
    draw_glyph(f, i, x, y, fg); x += f->w;
  }
}
static void draw_line(const dm_line_t *l, int y, rgb fg) {
  if (!l->font || !l->text[0]) return;
  draw_text(l->font, l->text, (DM_WIDTH - l->width) / 2, y, fg);
}
static void logo(void) {
  size_t p = 0; rgb *o = &fb[0][0];
  for (size_t i = 0; i + 1 < lcd_logo_rle_len && p < DM_WIDTH*DM_HEIGHT; i += 2) {
    uint16_t c = lcd_logo_rle[i+1]; c = (uint16_t)((c << 8) | (c >> 8));
    rgb v = { (unsigned char)(((c >> 11) & 31) * 255 / 31), (unsigned char)(((c >> 5) & 63) * 255 / 63), (unsigned char)((c & 31) * 255 / 31) };
    for (uint32_t k = 0; k < lcd_logo_rle[i] && p < DM_WIDTH*DM_HEIGHT; k++) o[p++] = v;
  }
}
static void badge(const char *text) {
  const lcd_font_t *f = &lcd_font_small;
  int tw = dm_text_width(f, text), w = tw + 8 > BADGE_H ? tw + 8 : BADGE_H, x0 = BADGE_RIGHT + 1 - w;
  int r2 = BADGE_H, lcx = 2*x0 + r2, rcx = 2*(BADGE_RIGHT+1) - r2, cy = 2*BADGE_TOP + r2;
  for (int y = BADGE_TOP; y < BADGE_TOP + BADGE_H; y++) { int dy = 2*y+1-cy;
    for (int x = x0; x <= BADGE_RIGHT; x++) { int px = 2*x+1;
      int dx = px < lcx ? lcx-px : px > rcx ? px-rcx : 0;
      if (dx*dx + dy*dy <= r2*r2) fb[y][x] = C_BADGE; } }
  draw_text(f, text, x0 + (w - tw)/2, BADGE_TEXT_Y, C_WHITE);
}
static void call_screen_loc(const char *number, const char *display, pb_assessment_t a, int votes, const char *loc) {
  stats_call_t c; memset(&c, 0, sizeof c);
  snprintf(c.number, sizeof c.number, "%s", number);
  snprintf(c.display, sizeof c.display, "%s", display);
  c.assessment = a; c.direct_votes = votes; snprintf(c.location, sizeof c.location, "%s", loc);
  dm_call_screen_t s; dm_call_screen(&c, &s);
  rgb band = s.cls == DM_CLASS_SPAM ? C_SPAM : s.cls == DM_CLASS_SUSPECT ? C_SUSPECT : s.cls == DM_CLASS_LEGIT ? C_LEGIT : C_NEUTRAL;
  for (int y = 0; y < DM_HEIGHT; y++) for (int x = 0; x < DM_WIDTH; x++) fb[y][x] = y < BAND_Y ? C_BACKGROUND : band;
  if (s.named) { draw_line(&s.main, NAME_Y, C_WHITE); draw_line(&s.sub, NAME_NUMBER_Y, C_NUMBER); }
  else draw_line(&s.main, s.main.font == &lcd_font_large ? NUMBER_LARGE_Y : NUMBER_SMALL_Y, C_WHITE);
  draw_line(&s.band, BAND_TEXT_Y, s.cls == DM_CLASS_SUSPECT ? C_BLACK : C_WHITE);
}
static void call_screen(const char *n, const char *d, pb_assessment_t a, int v) { call_screen_loc(n, d, a, v, ""); }
static void save(const char *path) {
  FILE *f = fopen(path, "wb"); fprintf(f, "P6\n%d %d\n255\n", DM_WIDTH, DM_HEIGHT);
  fwrite(fb, sizeof fb, 1, f); fclose(f);
}
int main(void) {
  logo(); save("logo.ppm");
  logo(); badge("3"); save("logo-badge3.ppm");
  logo(); badge("4"); save("logo-badge4.ppm");
  logo(); badge("1"); save("logo-badge1.ppm");
  // Placeholder numbers: replace them with numbers reserved for film/TV before publishing.
  call_screen("030 12345678", "", PB_ASSESS_SPAM, 12); save("call-spam.ppm");
  call_screen_loc("0711 9876543", "", PB_ASSESS_UNKNOWN, 0, "Stuttgart"); save("call-normal.ppm");
  return 0;
}
