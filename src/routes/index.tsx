import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Purchase } from "@/components/purchase";

export const Route = createFileRoute("/")({ component: Home });

const TRAPS = [
  { letter: "В", lower: "в", not: "B", reads: "V" },
  { letter: "Н", lower: "н", not: "H", reads: "N" },
  { letter: "Р", lower: "р", not: "P", reads: "R" },
  { letter: "С", lower: "с", not: "C", reads: "S" },
  { letter: "У", lower: "у", not: "Y", reads: "U" },
  { letter: "Х", lower: "х", not: "X", reads: "Kh" },
] as const;

const EXCHANGES = [
  { ru: "Здравствуйте.", en: "Hello." },
  { ru: "Как дела?", en: "How are you?" },
  { ru: "Спасибо.", en: "Thank you." },
  { ru: "Пожалуйста.", en: "Please. You’re welcome." },
  { ru: "До свидания.", en: "Goodbye." },
] as const;

const ALPHABET = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".split("");

const INDEX_A = [
  ["Cyrillic instruction", "Guided explanations and practice, so the alphabet becomes readable."],
  ["Grammar", "Cases, verb conjugations, and sentence structure, explained in simple terms."],
  ["Vocabulary", "Words Russians actually use in daily life, not textbook filler."],
  ["Pronunciation and accent", "Visual and audio guidance for reproducing Russian sounds."],
  ["Native speaker audio", "Recordings to train your ear and your pronunciation."],
] as const;

const INDEX_B = [
  ["Video lessons", "Clear visual instruction that makes Russian easier to follow and remember."],
  ["Books and reading", "Russian reading material in the same toolkit as the lessons."],
  ["Real conversations", "Practical phrases, everyday dialogues, and natural expressions."],
  ["Cultural context", "How Russian is spoken in homes, streets, and workplaces."],
  ["Exercises", "Short daily practice, plus conversation-focused activities."],
  ["Beginner to advanced", "From first words to confident conversations, in one path."],
  ["One payment", "Lifetime access. No subscription. No recurring fees."],
  ["Instant download", "Start immediately, on any device."],
] as const;

function Home() {
  return (
    <>
      <a className="skip" href="#after">
        Skip to the explanation
      </a>
      <header className="mast">
        <a className="mast-mark" href="#top" aria-label="Back to the letter">
          Ж
        </a>
        <nav aria-label="Page">
          <a href="#included">Included</a>
          <a href="#buy">Access</a>
        </nav>
      </header>
      <main id="top">
        <Opening />
        <Statement />
        <Letters />
        <Pause />
        <Use />
        <Included />
        <Return />
        <Buy />
        <Close />
      </main>
    </>
  );
}

function Opening() {
  return (
    <section className="opening" aria-label="A Cyrillic letter, before it is explained">
      <div className="plate">
        <span className="plate-letter" lang="ru" aria-hidden="true">
          Ж
        </span>
      </div>
      <p className="sr">The Cyrillic letter Zhe. What it means comes next.</p>
    </section>
  );
}

function Statement() {
  return (
    <section className="statement" id="after" aria-labelledby="lead">
      <h1 id="lead">Russian is one of the world’s most fascinating languages.</h1>
      <p className="aside">
        A new alphabet. A powerful literary tradition. A language spoken across eleven time zones.
      </p>
    </section>
  );
}

function Letters() {
  const [active, setActive] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

  function hear(letter: string) {
    if (!canSpeak) {
      setNote("This device has no speech playback. Native-speaker audio is in the pack.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(letter);
    utterance.lang = "ru-RU";
    utterance.rate = 0.82;
    utterance.onend = () => setActive((current) => (current === letter ? null : current));
    utterance.onerror = () => {
      setActive(null);
      setNote("This device could not speak the letter. Native-speaker audio is in the pack.");
    };
    setActive(letter);
    setNote(`Speaking ${letter} with this device’s voice. The pack’s audio is recorded by native speakers.`);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <section className="letters" id="letters" aria-labelledby="letters-title">
      <h2 id="letters-title">Some of these letters look familiar. They are not.</h2>
      {TRAPS.map((trap) => (
        <div className="pair" key={trap.letter}>
          <div className="pair-letter" lang="ru">
            {trap.letter}
            <small>{trap.lower}</small>
          </div>
          <p className="gloss">
            is <span className="not">not {trap.not}</span>. It reads as {trap.reads}.
          </p>
          <button
            type="button"
            className="hear"
            aria-pressed={active === trap.letter}
            onClick={() => hear(trap.letter)}
          >
            Hear
          </button>
        </div>
      ))}
      <p className="voice-note">
        Hear uses the voice on this device, only so the letter can be sounded. The Mega Pack includes
        native-speaker audio, visual pronunciation guidance, and practice.
      </p>
      <p className="voice-live" aria-live="polite">
        {note}
      </p>
    </section>
  );
}

function Pause() {
  return (
    <section className="pause" aria-label="How the pack is sold">
      <p className="pause-lead">No subscriptions. No scattered apps.</p>
      <p className="pause-sub">Just a clear path from your first words to real conversations.</p>
    </section>
  );
}

function Use() {
  return (
    <section className="use" aria-labelledby="path-title">
      <div className="path-block">
        <h2 id="path-title" className="sr">
          Step by step
        </h2>
        <p className="path-lines">
          Begin with the alphabet
          <br />
          and essential grammar,
          <br />
          then progress naturally
          <br />
          toward full conversations.
        </p>
        <p className="path-support">
          Build confidence with beginner-friendly resources made for real communication — reading,
          speaking, and understanding from day one.
        </p>
      </div>
      <div className="exchanges">
        <h2 lang="ru">A few words, said plainly.</h2>
        <p className="lede">
          Elementary phrases. The pack’s dialogues go further, into the expressions used in daily life.
        </p>
        {EXCHANGES.map((line) => (
          <div className="exchange" key={line.ru}>
            <p className="ru" lang="ru">
              {line.ru}
            </p>
            <p className="en">{line.en}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Included() {
  return (
    <section className="included" id="included" aria-labelledby="included-title">
      <h2 id="included-title">Everything in one place.</h2>
      <div className="index-split">
        <ul className="index-col">
          {INDEX_A.map(([name, detail]) => (
            <li className="index-item" key={name}>
              <span className="index-name">{name}</span>
              <span className="index-detail">{detail}</span>
            </li>
          ))}
        </ul>
        <ul className="index-col late">
          {INDEX_B.map(([name, detail]) => (
            <li className="index-item" key={name}>
              <span className="index-name">{name}</span>
              <span className="index-detail">{detail}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="promise">
        Audio lessons, videos, books, grammar guides, and cultural insights — one toolkit, so the work is
        understanding the language rather than collecting apps.{" "}
        <a href="#buy">Get instant access</a>
      </p>
    </section>
  );
}

function Return() {
  return (
    <section className="return" aria-labelledby="return-title">
      <div className="return-plate" lang="ru" aria-hidden="true">
        Ж
      </div>
      <h2 id="return-title" className="return-copy">
        The Russian Mega Pack gives you everything you need to start reading, speaking, and understanding
        Russian from day one.
      </h2>
      <p className="return-note">
        Stop piecing together apps and incomplete courses. One structured program. One payment. Then the
        language itself: how it is built, how it sounds, and how it is used.{" "}
        <a className="text-link" href="#buy">
          Get instant access
        </a>
      </p>
    </section>
  );
}

function Buy() {
  return (
    <section className="buy" id="buy" aria-labelledby="buy-title">
      <div className="buy-copy">
        <h2 id="buy-title">Start learning Russian today.</h2>
        <p className="buy-lead">
          Download the Russian Mega Pack and begin your journey into one of the world’s richest and most
          rewarding languages.
        </p>
      </div>
      <Purchase />
    </section>
  );
}

function Close() {
  return (
    <footer className="close">
      <ol className="alphabet" lang="ru" aria-label="Cyrillic alphabet">
        {ALPHABET.map((letter) => (
          <li key={letter}>{letter}</li>
        ))}
      </ol>
      <p className="close-line">
        <a href="#buy">Get instant access now</a>
      </p>
    </footer>
  );
}
