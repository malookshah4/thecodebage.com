"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Btn, CopyButton, Field, Notice, Segmented, Stat } from "./ui";

type Mode = "password" | "passphrase";
type Sep = "-" | "." | "_" | " ";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?/~";
const LOOK_ALIKE = "0O1lI|";

// Short, common, inoffensive English words (3 to 8 letters). Entropy is
// computed from the real list length, so adding or removing words is safe.
const WORDS = Array.from(
  new Set(
    `able acid acorn actor adapt admit adult agent agree ahead aim air alarm album alert alley allow almond
alpha amber amount ample angle animal ankle answer apple apron arch arena argue arm army arrow art artist ask
atlas atom attic audio august aunt autumn avenue award awake axis baby bacon badge bag bake baker balance
ball bamboo banana band bank barn barrel basil basket bath beach bead beam bean bear beard beauty bed bee
beef begin bell belt bench berry bike bird birth biscuit bitter black blade blank blanket blend block bloom
blue blush board boat body bold bolt bone bonus book boost boot border bottle bottom bounce bowl box brain
branch brave bread break breeze brick bride bridge brief bright bring brisk broad bronze brook brother brown
brush bubble bucket buddy budget build bulb bundle burst bus bush butter button buyer cabin cable cactus
cage cake calm camel camera camp canal candle candy canoe canvas canyon cape car carbon card cargo carpet
carrot cart case cash castle cat catch cattle cave cedar celery cell cement cereal chain chair chalk champ
change chapel charm chart chase cheap check cheek cheese chef cherry chess chest chicken chief child chill
chimney chin chip choice chorus circle citrus city civic claim clam class clay clean clear clerk clever
click cliff climb clinic clock close cloth cloud clover clown club coach coast coat cobalt cocoa coconut
code coffee coin cold collar colony color comb comet comic common cook cookie cool copper copy coral core
corn corner cotton couch count county course court cousin cover cozy crab craft crane crash crayon cream
credit creek crew cricket crisp crop cross crowd crown cruise crumb crust cube cup curve cushion cycle daily
dairy daisy dance dark dart data dawn day deal debate decade deck deer degree delta denim dental depth
desert design desk detail device dial diary diet dinner direct dish dock doctor dog doll dolphin domain
donkey door double dove draft dragon drama draw dream dress drift drill drink drive drum duck dune dust duty
eager eagle early earth easel east easy echo edge editor eel effort egg eight elbow elder eleven elk elm
ember empty energy engine enjoy enter entry equal equip era errand escape event exact exam exit expert
extra fabric face fact factor fair falcon fame family fan fancy farm fashion fast father feast feather
fence fern ferry festival fiber field fiesta figure film filter final finger finish fire firm first fish
five flag flame flash flat flavor fleet flight float flock floor flour flower fluid flute focus fog folder
follow food foot forest fork form fort forum fossil four fox frame fresh friend frog front frost fruit fuel
fun funny future gadget galaxy gallon game garage garden garlic gate gather gear gem gentle giant gift
ginger giraffe give glad glass globe glove glow glue goal goat gold golf good goose gown grace grain grand
grape graph grass gravel great green grid grill grin grocery ground group grow guard guess guest guide
guitar gulf gym habit hair half hall hammer hand handle happy harbor hard harvest hat hawk hazel head health
heart heat hedge height hello helmet help herb hero hidden high hill hint hobby hockey hold hollow home
honey hood hook hope horizon horn horse host hotel hour house humble humor hundred hunt hurry husband hut
ice icon idea igloo image impact inch index indoor inner input insect inside invite iron island item ivory
ivy jacket jaguar jam jar jazz jeans jelly jewel job jockey join joke jolly journal joy judge juice jump
jungle junior jury just kangaroo keen keep kettle key kick kid kind king kit kitchen kite kitten kiwi knee
knock know koala label lace ladder lady lake lamb lamp land lane laptop large laser later laugh lava lawn
layer leader leaf learn leather lemon length lens leopard lesson letter level library lift light lilac lily
limb lime limit line linen lion liquid list little live lizard lobby local lock lodge logic long loop lotus
loud lounge love lucky lumber lunar lunch machine magic magnet mail main major maker mango manor maple
marble march market mask master match meadow meal medal media melody melon member memory mentor menu merit
metal meter middle mild milk mill mind mineral minute mirror mist mixer model modern moment money monkey
month moon morning moss mother motion motor mount mouse mouth movie muffin mule museum music mustard nail
name napkin narrow nation native nature navy near neat neck needle nest net never new next nice night nine
noble noodle noon normal north nose note notice novel number nurse nut oak oasis object ocean october odd
offer office olive omega onion open opera option orange orbit orchard order organ origin otter outer oval
oven owl owner oxygen oyster paddle page paint pair palace palm pancake panda panel paper parade parcel
parent park parrot party pasta paste patch path patio pause peach peak peanut pear pebble pencil penguin
pepper permit person pet phone photo piano picnic piece pier pig pigeon pillow pilot pine pink pioneer pipe
pizza place plain planet plant plate play plaza plenty plum pocket poem poet point polar pond pony pool
popcorn porch port post potato pottery powder power prairie press price pride prince print prize proof
proud pulse pump pumpkin puppy purple puzzle quail quart queen quest quick quiet quilt quiz quote rabbit
raccoon race radar radio raft rain rainbow raisin rally ranch range rapid raven razor reach ready recipe
record red reef relax remote rescue rest result reward rhythm ribbon rice rich ride ridge right ring ripple
river road robin robot rock rocket roof room root rope rose round route royal rubber ruby rug ruler rumble
runner rural rustic saddle safe sail salad salmon salt sample sand sandal satin sauce sausage scale scarf
scene school science scooter scout screen sea season seat second secret seed shadow shape share shark sheep
shelf shell shield shine ship shirt shoe shore short shovel shower shrimp side signal silent silk silver
simple singer sister six sketch ski skill sky sleep slice slide slope small smart smile smooth snack snail
snake snow soap soccer sock sofa soft solar solid song sonic soup south space spark speak spice spider spin
spirit sponge spoon sport spot spray spring square squash stable stage stair stamp star start station
statue steam steel stem step stick still stone stool storm story stove straw stream street strong studio
study style sugar suit summer summit sun sunny sunset super supper surf swan sweater sweet swift swim swing
switch symbol syrup table tablet tail talent tank tape target taxi tea teacher team teapot teeth temple ten
tennis tent thank theater thick thin thing thread three throne thumb ticket tidy tiger timber time tiny
toast today toe token tomato tone tool tooth topic torch total tower town toy track trade trail train
travel tray treat tree trend trial tribe trick trip trophy truck trumpet trunk trust truth tulip tuna
tunnel turkey turtle twelve twenty twin type umbrella uncle under unit upper urban useful usual valley
value van vapor vase velvet vendor venue verb vessel video view village vine violet violin visit visual
vivid voice volcano vote voyage wagon waist walk wall walnut walrus wander warm wash watch water wave wax
way wealth weather weekend well west whale wheat wheel whisper white whole wide width wild willow wind
window wing winner winter wire wise wish wizard wolf wonder wood wool word work world worthy write yacht
yard year yellow yogurt young youth zebra zero zone zoom`
      .trim()
      .split(/\s+/),
  ),
);

/** Uniform random integer in [0, n) using rejection sampling (no modulo bias). */
function randomInt(n: number): number {
  if (n <= 0 || n > 2 ** 32) throw new Error("Bad range");
  const limit = Math.floor(2 ** 32 / n) * n;
  const buf = new Uint32Array(1);
  for (;;) {
    crypto.getRandomValues(buf);
    if (buf[0] < limit) return buf[0] % n;
  }
}

function pick<T>(arr: ArrayLike<T>): T {
  return arr[randomInt(arr.length)];
}

interface PwOpts {
  length: number;
  upper: boolean;
  lower: boolean;
  digits: boolean;
  symbols: boolean;
  noLookAlike: boolean;
}

function charSets(o: PwOpts): string[] {
  const strip = (s: string) =>
    o.noLookAlike ? [...s].filter((c) => !LOOK_ALIKE.includes(c)).join("") : s;
  const sets: string[] = [];
  if (o.upper) sets.push(strip(UPPER));
  if (o.lower) sets.push(strip(LOWER));
  if (o.digits) sets.push(strip(DIGITS));
  if (o.symbols) sets.push(strip(SYMBOLS));
  return sets.filter((s) => s.length > 0);
}

/**
 * Draw every character uniformly from the full pool and retry until each
 * selected set appears at least once. Retrying keeps the result uniform over
 * all valid passwords, so the entropy below is exact.
 */
function makePassword(o: PwOpts): string {
  const sets = charSets(o);
  const pool = sets.join("");
  for (;;) {
    let s = "";
    for (let i = 0; i < o.length; i++) s += pick(pool);
    if (sets.every((set) => [...s].some((c) => set.includes(c)))) return s;
  }
}

function bigPow(base: number, exp: number): bigint {
  let r = BigInt(1);
  const b = BigInt(base);
  for (let i = 0; i < exp; i++) r *= b;
  return r;
}

function log2Big(x: bigint): number {
  const s = x.toString();
  if (s.length <= 15) return Math.log2(Number(s));
  return Math.log2(Number(s.slice(0, 15))) + (s.length - 15) * Math.log2(10);
}

/** log2 of the number of length-L strings that contain every selected set (inclusion-exclusion). */
function passwordEntropy(o: PwOpts): number {
  const sets = charSets(o);
  const n = sets.reduce((s, x) => s + x.length, 0);
  if (!n) return 0;
  let total = BigInt(0);
  for (let mask = 0; mask < 1 << sets.length; mask++) {
    let removed = 0;
    let bits = 0;
    sets.forEach((set, i) => {
      if (mask & (1 << i)) {
        removed += set.length;
        bits++;
      }
    });
    const term = bigPow(n - removed, o.length);
    total += bits % 2 ? -term : term;
  }
  return total > BigInt(0) ? log2Big(total) : 0;
}

interface PhraseOpts {
  words: number;
  sep: Sep;
  capitalize: boolean;
  addNumber: boolean;
}

function makePassphrase(o: PhraseOpts): string {
  const list = Array.from({ length: o.words }, () => {
    const w = pick(WORDS);
    return o.capitalize ? w[0].toUpperCase() + w.slice(1) : w;
  });
  if (o.addNumber) {
    const i = randomInt(list.length);
    list[i] = list[i] + String(randomInt(10));
  }
  return list.join(o.sep);
}

function phraseEntropy(o: PhraseOpts): number {
  // Capitalizing and the separator are fixed choices, so they add nothing.
  let bits = o.words * Math.log2(WORDS.length);
  if (o.addNumber) bits += Math.log2(10) + Math.log2(o.words);
  return bits;
}

function strength(bits: number): { label: string; color: string } {
  if (bits < 45) return { label: "Weak", color: "#d93025" };
  if (bits < 60) return { label: "Fair", color: "#e8a200" };
  if (bits < 80) return { label: "Strong", color: "#1e8e3e" };
  return { label: "Very strong", color: "#137333" };
}

/** Average time to find it by brute force at 10^10 guesses per second. */
function crackTime(bits: number): string {
  const seconds = Math.pow(2, bits - 1) / 1e10;
  const year = 365.25 * 24 * 3600;
  if (seconds < 1) return "under a second";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < year) return `${Math.round(seconds / 86400)} days`;
  const years = seconds / year;
  if (years < 1000) return `${Math.round(years)} years`;
  if (years < 1e6) return `${Math.round(years / 1000)} thousand years`;
  if (years < 1e9) return `${Math.round(years / 1e6)} million years`;
  if (years < 1.4e10) return `${Math.round(years / 1e9)} billion years`;
  return "longer than the age of the universe";
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="tool-checkbox">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

const resultStyle: React.CSSProperties = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  fontSize: 19,
  lineHeight: 1.45,
  color: "var(--ink)",
  wordBreak: "break-all",
  padding: "14px 16px",
  borderRadius: 12,
  border: "1px solid var(--line-strong)",
  background: "var(--paper)",
  minHeight: 56,
};

export default function PasswordGenerator() {
  const [mode, setMode] = useState<Mode>("password");
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [noLookAlike, setNoLookAlike] = useState(false);
  const [words, setWords] = useState(5);
  const [sep, setSep] = useState<Sep>("-");
  const [capitalize, setCapitalize] = useState(true);
  const [addNumber, setAddNumber] = useState(true);
  const [five, setFive] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const pwOpts: PwOpts = { length, upper, lower, digits, symbols, noLookAlike };
  const phraseOpts: PhraseOpts = { words, sep, capitalize, addNumber };
  const noSets = mode === "password" && !upper && !lower && !digits && !symbols;

  const generate = useCallback(() => {
    if (mode === "password" && !upper && !lower && !digits && !symbols) {
      setResults([]);
      return;
    }
    const make = () =>
      mode === "password"
        ? makePassword({ length, upper, lower, digits, symbols, noLookAlike })
        : makePassphrase({ words, sep, capitalize, addNumber });
    setResults(Array.from({ length: five ? 5 : 1 }, make));
  }, [mode, length, upper, lower, digits, symbols, noLookAlike, words, sep, capitalize, addNumber, five]);

  // Make a fresh result on first load and whenever an option changes. This
  // runs only in the browser (crypto is not used during prerender).
  useEffect(() => {
    const id = requestAnimationFrame(generate);
    return () => cancelAnimationFrame(id);
  }, [generate]);

  const bits = noSets ? 0 : mode === "password" ? passwordEntropy(pwOpts) : phraseEntropy(phraseOpts);
  const s = strength(bits);

  return (
    <div className="tool-stack">
      <Segmented
        value={mode}
        onChange={setMode}
        ariaLabel="Type"
        options={[
          { value: "password", label: "Password" },
          { value: "passphrase", label: "Passphrase" },
        ]}
      />

      {mode === "password" ? (
        <>
          <Field label={`Length: ${length} characters`}>
            <input
              type="range"
              className="tool-range"
              min={8}
              max={64}
              step={1}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              aria-label="Password length"
            />
          </Field>
          <div className="tool-grid cols-2">
            <Check label="Uppercase (A to Z)" checked={upper} onChange={setUpper} />
            <Check label="Lowercase (a to z)" checked={lower} onChange={setLower} />
            <Check label="Digits (0 to 9)" checked={digits} onChange={setDigits} />
            <Check label="Symbols (!@#$...)" checked={symbols} onChange={setSymbols} />
            <Check
              label="Avoid look-alike characters (0 O 1 l I)"
              checked={noLookAlike}
              onChange={setNoLookAlike}
            />
          </div>
        </>
      ) : (
        <>
          <Field label={`Words: ${words}`}>
            <input
              type="range"
              className="tool-range"
              min={3}
              max={10}
              step={1}
              value={words}
              onChange={(e) => setWords(Number(e.target.value))}
              aria-label="Number of words"
            />
          </Field>
          <Field label="Separator">
            <Segmented
              value={sep}
              onChange={setSep}
              ariaLabel="Separator"
              options={[
                { value: "-", label: "Dash -" },
                { value: ".", label: "Dot ." },
                { value: "_", label: "Underscore _" },
                { value: " ", label: "Space" },
              ]}
            />
          </Field>
          <div className="tool-grid cols-2">
            <Check label="Capitalize each word" checked={capitalize} onChange={setCapitalize} />
            <Check label="Add a number" checked={addNumber} onChange={setAddNumber} />
          </div>
        </>
      )}

      <Check label="Show 5 at once" checked={five} onChange={setFive} />

      {noSets ? (
        <Notice tone="error">Pick at least one character type.</Notice>
      ) : five ? (
        <div className="tool-list">
          {results.map((r, i) => (
            <div key={i} className="tool-list-item">
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontFamily: resultStyle.fontFamily,
                  fontSize: 15.5,
                  color: "var(--ink)",
                  wordBreak: "break-all",
                }}
              >
                {r}
              </div>
              <CopyButton text={r} />
            </div>
          ))}
        </div>
      ) : (
        <div style={resultStyle} aria-live="polite">
          {results[0] ?? ""}
        </div>
      )}

      <div className="tool-actions">
        <Btn onClick={generate} disabled={noSets}>
          <RefreshCw size={16} aria-hidden /> Generate
        </Btn>
        {!five && <CopyButton text={results[0] ?? ""} />}
      </div>

      {!noSets && (
        <>
          <div>
            <div
              style={{ height: 8, borderRadius: 999, background: "var(--chip-bg)", overflow: "hidden" }}
              aria-hidden
            >
              <div
                style={{
                  width: `${Math.min(100, (bits / 128) * 100)}%`,
                  height: "100%",
                  background: s.color,
                  transition: "width 0.2s",
                }}
              />
            </div>
          </div>
          <div className="tool-grid cols-3">
            <Stat label="Strength" value={<span style={{ color: s.color }}>{s.label}</span>} />
            <Stat
              label="Entropy"
              value={`${Math.round(bits)} bits`}
              sub={
                mode === "password"
                  ? `${charSets(pwOpts).join("").length} possible characters`
                  : `${WORDS.length} words in the list`
              }
            />
            <Stat
              label="Time to crack"
              value={<span style={{ fontSize: "0.8em" }}>{crackTime(bits)}</span>}
              sub="Average, at 10 billion guesses per second (offline attack)"
            />
          </div>
          <p className="tool-hint">
            Made with your browser&apos;s secure random generator. Nothing is sent or saved. The
            estimate assumes the attacker knows exactly how this was generated, which is the honest
            worst case.
          </p>
        </>
      )}
    </div>
  );
}
