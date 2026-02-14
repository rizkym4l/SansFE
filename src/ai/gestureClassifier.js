/* ───────────────────────────────────────────────────────────
 *  gestureClassifier.js  –  Rule-based ASL A-Z classifier
 *  Uses MediaPipe Hand Landmarker 21-point landmarks.
 *
 *  Landmark map (MediaPipe):
 *    0  WRIST
 *    1-4   THUMB   (CMC → MCP → IP → TIP)
 *    5-8   INDEX   (MCP → PIP → DIP → TIP)
 *    9-12  MIDDLE  (MCP → PIP → DIP → TIP)
 *   13-16  RING    (MCP → PIP → DIP → TIP)
 *   17-20  PINKY   (MCP → PIP → DIP → TIP)
 *
 *  Notes:
 *  - J & Z involve motion; statically they look like I & D
 *    respectively. Motion-based detection needs frame history.
 *  - Fist variants (A/E/M/N/S/T) are hard to distinguish
 *    with landmarks alone; confidence is lower for those.
 * ─────────────────────────────────────────────────────────── */

// ─── Landmark indices ────────────────────────────────────

const THUMB  = { CMC: 1, MCP: 2, IP: 3, TIP: 4 };
const INDEX  = { MCP: 5, PIP: 6, DIP: 7, TIP: 8 };
const MIDDLE = { MCP: 9, PIP: 10, DIP: 11, TIP: 12 };
const RING   = { MCP: 13, PIP: 14, DIP: 15, TIP: 16 };
const PINKY  = { MCP: 17, PIP: 18, DIP: 19, TIP: 20 };
const WRIST  = 0;

// ─── Geometry helpers ────────────────────────────────────

function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

/** Reference length: wrist → middle-MCP */
function palmSize(lm) {
  return dist(lm[WRIST], lm[MIDDLE.MCP]) || 0.001;
}

/**
 * Curl ratio for a four-joint finger.
 *   1 = perfectly straight, 0 = fully curled.
 * Ratio of direct MCP→TIP distance over sum of bone lengths.
 */
function curl(lm, f) {
  const seg =
    dist(lm[f.MCP], lm[f.PIP]) +
    dist(lm[f.PIP], lm[f.DIP]) +
    dist(lm[f.DIP], lm[f.TIP]);
  return seg === 0 ? 0 : dist(lm[f.MCP], lm[f.TIP]) / seg;
}

/** Thumb curl (CMC→MCP→IP→TIP) */
function thumbCurl(lm) {
  const seg =
    dist(lm[THUMB.CMC], lm[THUMB.MCP]) +
    dist(lm[THUMB.MCP], lm[THUMB.IP]) +
    dist(lm[THUMB.IP], lm[THUMB.TIP]);
  return seg === 0 ? 0 : dist(lm[THUMB.CMC], lm[THUMB.TIP]) / seg;
}

/** Normalised distance between two landmark indices */
function nd(lm, i, j) {
  return dist(lm[i], lm[j]) / palmSize(lm);
}

/** Angle of MCP→TIP in degrees (-90 = up, 90 = down, 0 = right) */
function tipAngle(lm, f) {
  const dx = lm[f.TIP].x - lm[f.MCP].x;
  const dy = lm[f.TIP].y - lm[f.MCP].y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
}

/** Is finger direction mostly horizontal? */
function isSideways(lm) {
  const a = Math.abs(tipAngle(lm, INDEX));
  return a < 50 || a > 130;
}

/** Is index pointing downward? */
function isPointingDown(lm) {
  return tipAngle(lm, INDEX) > 50;
}

// ─── Main classifier ────────────────────────────────────

export function classifyGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return null;
  const lm = landmarks;

  // ── Pre-compute curl ratios ──
  const iC = curl(lm, INDEX);
  const mC = curl(lm, MIDDLE);
  const rC = curl(lm, RING);
  const pC = curl(lm, PINKY);
  const tC = thumbCurl(lm);

  // ── Binary states ──
  const iE  = iC > 0.72;        // index extended
  const mE  = mC > 0.72;        // middle extended
  const rE  = rC > 0.72;        // ring extended
  const pE  = pC > 0.72;        // pinky extended
  const iCl = iC < 0.58;        // index curled
  const mCl = mC < 0.58;        // middle curled
  const rCl = rC < 0.58;        // ring curled
  const pCl = pC < 0.58;        // pinky curled
  const tE  = tC > 0.78;        // thumb extended

  // ── Orientation ──
  const side = isSideways(lm);
  const down = isPointingDown(lm);

  // ── Tip distances (normalised) ──
  const thumbIndexDist  = nd(lm, THUMB.TIP, INDEX.TIP);
  const thumbMiddleDist = nd(lm, THUMB.TIP, MIDDLE.TIP);
  const indexMiddleDist = nd(lm, INDEX.TIP, MIDDLE.TIP);

  // ═══════════════════════════════════════════════════════
  //  1 · UNIQUE SILHOUETTES (most distinctive shapes)
  // ═══════════════════════════════════════════════════════

  // Y — thumb + pinky out, middle three curled (shaka)
  if (tE && pE && iCl && mCl && rCl) {
    return { letter: "Y", confidence: 0.85 };
  }

  // I — only pinky extended (fist + pinky)
  if (pE && iCl && mCl && rCl && !tE) {
    return { letter: "I", confidence: 0.82 };
  }

  // L — thumb + index extended at ~90° angle, rest curled
  if (tE && iE && mCl && rCl && pCl && !side && !down) {
    return { letter: "L", confidence: 0.85 };
  }

  // F — thumb & index touch (circle), middle+ring+pinky extended
  if (thumbIndexDist < 0.14 && mE && rE && pE) {
    return { letter: "F", confidence: 0.82 };
  }

  // ═══════════════════════════════════════════════════════
  //  2 · THREE FINGERS EXTENDED
  // ═══════════════════════════════════════════════════════

  // W — index + middle + ring extended, pinky curled
  if (iE && mE && rE && pCl) {
    return { letter: "W", confidence: 0.82 };
  }

  // ═══════════════════════════════════════════════════════
  //  3 · FOUR / FIVE FINGERS EXTENDED
  // ═══════════════════════════════════════════════════════

  // B — 4 fingers up, thumb across palm
  if (iE && mE && rE && pE && !tE) {
    return { letter: "B", confidence: 0.82 };
  }

  // Open hand (all five) — not a letter, but useful feedback
  if (iE && mE && rE && pE && tE) {
    return { letter: "5", confidence: 0.75 };
  }

  // ═══════════════════════════════════════════════════════
  //  4 · TWO FINGERS EXTENDED (index + middle)
  //      Orientation-sensitive sub-classification
  // ═══════════════════════════════════════════════════════

  if (iE && mE && rCl && pCl) {
    // H — hand sideways, two fingers pointing horizontally
    if (side) {
      return { letter: "H", confidence: 0.75 };
    }

    // P — hand pointing downward (like K but inverted)
    if (down) {
      return { letter: "P", confidence: 0.75 };
    }

    // K — thumb touching middle PIP & fingers spread apart
    if (nd(lm, THUMB.TIP, MIDDLE.PIP) < 0.18 && indexMiddleDist > 0.10) {
      return { letter: "K", confidence: 0.75 };
    }

    // R — index & middle crossed (tips very close / overlapping)
    if (indexMiddleDist < 0.06) {
      return { letter: "R", confidence: 0.75 };
    }

    // U — index & middle together (tips close but not crossed)
    if (indexMiddleDist < 0.09) {
      return { letter: "U", confidence: 0.80 };
    }

    // V — index & middle spread (peace sign) — default two-finger
    return { letter: "V", confidence: 0.78 };
  }

  // ═══════════════════════════════════════════════════════
  //  5 · SINGLE FINGER EXTENDED (index only)
  // ═══════════════════════════════════════════════════════

  if (iE && mCl && rCl && pCl) {
    // G — sideways, thumb also extended
    if (side && tE) {
      return { letter: "G", confidence: 0.75 };
    }

    // Q — pointing down, thumb extended alongside
    if (down && tE) {
      return { letter: "Q", confidence: 0.75 };
    }

    // D — index up, thumb touching middle tip area
    if (thumbMiddleDist < 0.18) {
      return { letter: "D", confidence: 0.78 };
    }

    // Z — same static shape as D (requires motion tracking for Z path)
    return { letter: "D", confidence: 0.75 };
  }

  // ═══════════════════════════════════════════════════════
  //  6 · CIRCLE / TOUCHING SHAPES
  // ═══════════════════════════════════════════════════════

  // O — fingertips curved toward thumb forming a circle
  if (
    thumbIndexDist < 0.16 &&
    iC > 0.40 && iC < 0.80 &&
    !mE && !rE && !pE
  ) {
    return { letter: "O", confidence: 0.75 };
  }

  // ═══════════════════════════════════════════════════════
  //  7 · PARTIAL CURL (hooked / curved)
  // ═══════════════════════════════════════════════════════

  // X — index hooked (partially curled), rest fully curled.
  //     Key: index must be notably MORE extended than other fingers (hook shape).
  //     This prevents catching E (where all fingers have similar curl).
  if (
    iC > 0.38 && iC < 0.72 && mCl && rCl && pCl &&
    (iC - mC) > 0.12 && (iC - rC) > 0.12
  ) {
    return { letter: "X", confidence: 0.75 };
  }

  // C — all fingers moderately curved (open C shape).
  //     Thumb must be away from fingertips (not touching like E).
  if (
    iC > 0.45 && iC < 0.78 &&
    mC > 0.45 && mC < 0.78 &&
    rC > 0.45 && rC < 0.78 &&
    pC > 0.45 && pC < 0.78 &&
    nd(lm, THUMB.TIP, INDEX.TIP) > 0.12
  ) {
    return { letter: "C", confidence: 0.8 };
  }

  // ═══════════════════════════════════════════════════════
  //  8 · FIST VARIANTS (all four fingers curled)
  // ═══════════════════════════════════════════════════════

  // A — fist with thumb extended alongside
  if (tE && iCl && mCl && rCl && pCl) {
    return { letter: "A", confidence: 0.78 };
  }

  // All four curled, thumb NOT extended → E / S / T / N / M
  if (iCl && mCl && rCl && pCl && !tE) {
    // E — fingertips visible, thumb across touching the fingertips.
    //     Thumb tip is close to index & middle TIPS (not PIPs).
    //     All fingers have similar curl (unlike X where index stands out).
    const thumbToIndexTip  = nd(lm, THUMB.TIP, INDEX.TIP);
    const thumbToMiddleTip = nd(lm, THUMB.TIP, MIDDLE.TIP);
    const curlSpread = Math.max(iC, mC, rC, pC) - Math.min(iC, mC, rC, pC);
    if (
      (thumbToIndexTip < 0.22 && thumbToMiddleTip < 0.26) ||
      curlSpread < 0.15
    ) {
      return { letter: "E", confidence: 0.78 };
    }

    // T — thumb tucked between index & middle (thumb near index PIP)
    if (nd(lm, THUMB.TIP, INDEX.PIP) < 0.15) {
      return { letter: "T", confidence: 0.75 };
    }

    // N — thumb peeking between middle & ring
    if (nd(lm, THUMB.TIP, MIDDLE.PIP) < 0.15) {
      return { letter: "N", confidence: 0.75 };
    }

    // M — thumb under ring finger area
    if (nd(lm, THUMB.TIP, RING.PIP) < 0.18) {
      return { letter: "M", confidence: 0.75 };
    }

    // S — tight fist, thumb wraps over (default for remaining fist shapes)
    return { letter: "S", confidence: 0.75 };
  }

  // ═══════════════════════════════════════════════════════
  //  Fallback — no pattern matched
  // ═══════════════════════════════════════════════════════

  return { letter: "?", confidence: 0 };
}
