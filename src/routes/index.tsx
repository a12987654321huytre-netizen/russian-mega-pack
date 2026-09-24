import { createFileRoute } from "@tanstack/react-router";
import { useState, type CSSProperties } from "react";
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

const MATERIALS = [
  { name: "Cyrillic instruction", detail: "Guided explanations and practice, so the alphabet becomes readable.", mark: "АЯ", kind: "type" },
  { name: "Grammar", detail: "Cases, verb conjugations, and sentence structure, explained in simple terms.", mark: "род", kind: "rule" },
  { name: "Vocabulary", detail: "Words Russians actually use in daily life, not textbook filler.", mark: "мир", kind: "word" },
  { name: "Pronunciation and accent", detail: "Visual and audio guidance for reproducing Russian sounds.", mark: "ж", kind: "sound" },
  { name: "Native speaker audio", detail: "Recordings to train your ear and your pronunciation.", mark: "♪", kind: "audio" },
  { name: "Video lessons", detail: "Clear visual instruction that makes Russian easier to follow and remember.", mark: "▶", kind: "video" },
  { name: "Books and reading", detail: "Russian reading material in the same toolkit as the lessons.", mark: "том", kind: "book" },
  { name: "Real conversations", detail: "Practical phrases, everyday dialogues, and natural expressions.", mark: "ты", kind: "talk" },
  { name: "Cultural context", detail: "How Russian is spoken in homes, streets, and workplaces.", mark: "дом", kind: "place" },
  { name: "Exercises", detail: "Short daily practice, plus conversation-focused activities.", mark: "1–", kind: "drill" },
  { name: "Beginner to advanced", detail: "From first words to confident conversations, in one path.", mark: "→", kind: "path" },
] as const;

function Home() {
  return (
    <>
      <a className="skip" href="#pack">Skip to the pack</a>
      <header className="mast">
        <a className="mast-mark" href="#top" lang="ru" aria-label="Back to the top">Ж</a>
        <nav aria-label="Page">
          <a href="#pack">The pack</a>
          <a href="#buy">Get access</a>
        </nav>
      </header>
      <main id="top">
        <Opening />
        <Pack />
        <Letters />
        <Path />
        <Talk />
        <Buy />
        <Close />
      </main>
    </>
  );
}

function Opening() {
  return (
    <section className="opening" aria-label="Russian Mega Pack">
      <div className="wall" aria-hidden="true">
        {ALPHABET.map((letter, i) => (
          <span key={`${letter}-${i}`} className={`wall-letter n${i % 7}`}>
            {letter}
          </span>
        ))}
      </div>
      <div className="open-copy">
        <p className="kicker">One payment. Instant download. No subscription.</p>
        <h1>Russian<span>Mega Pack</span></h1>
        <p className="lede">
          Audio lessons, videos, books, grammar guides, and cultural insights — one toolkit, so the work
          is understanding the language rather than collecting apps.
        </p>
        <p className="open-actions">
          <a className="go" href="#buy">Get instant access</a>
          <a className="go quiet" href="#pack">What is inside</a>
        </p>
      </div>
    </section>
  );
}

function Pack() {
  return (
    <section className="pack" id="pack" aria-labelledby="pack-title">
      <div className="pack-head">
        <h2 id="pack-title">Everything in one place.</h2>
        <p>
          Russian is one of the world’s most fascinating languages. A new alphabet. A powerful literary
          tradition. A language spoken across eleven time zones. The Russian Mega Pack gives you
          everything you need to start reading, speaking, and understanding Russian from day one.
        </p>
      </div>
      <ol className="materials">
        {MATERIALS.map((item) => (
          <li className={`material kind-${item.kind}`} key={item.name}>
            <span className="material-mark" lang="ru" aria-hidden="true">{item.mark}</span>
            <span className="material-body">
              <strong>{item.name}</strong>
              <span>{item.detail}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="pack-note">
        Stop piecing together apps and incomplete courses. One structured program. One payment. Then the
        language itself: how it is built, how it sounds, and how it is used.
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
      <div className="case">
        {TRAPS.map((trap) => (
          <button
            type="button"
            className={`glyph ${active === trap.letter ? "on" : ""}`}
            key={trap.letter}
            aria-pressed={active === trap.letter}
            onClick={() => hear(trap.letter)}
          >
            <span className="glyph-letter" lang="ru">
              {trap.letter}
              <small>{trap.lower}</small>
            </span>
            <span className="glyph-gloss">
              not {trap.not}. Reads as {trap.reads}.
              <em>Hear</em>
            </span>
          </button>
        ))}
      </div>
      <p className="voice-note">
        Hear uses the voice on this device, only so the letter can be sounded. The Mega Pack includes
        native-speaker audio, visual pronunciation guidance, and practice.
      </p>
      <p className="voice-live" aria-live="polite">{note}</p>
    </section>
  );
}

function Path() {
  return (
    <section className="path" aria-labelledby="path-title">
      <p className="path-kicker" id="path-title">Beginner to advanced</p>
      <p className="path-lines">
        Begin with the alphabet<br />and essential grammar,<br />then progress naturally<br />toward full conversations.
      </p>
      <p className="path-support">
        Build confidence with beginner-friendly resources made for real communication — reading,
        speaking, and understanding from day one.
      </p>
      <p className="path-facts">
        <span>No subscriptions.</span>
        <span>No scattered apps.</span>
        <span>Lifetime access.</span>
        <span>Start immediately, on any device.</span>
      </p>
    </section>
  );
}

function Talk() {
  return (
    <section className="talk" aria-labelledby="talk-title">
      <div className="talk-copy">
        <h2 id="talk-title" lang="ru">A few words, said plainly.</h2>
        <p>Elementary phrases. The pack’s dialogues go further, into the expressions used in daily life.</p>
      </div>
      <ol className="exchanges">
        {EXCHANGES.map((line) => (
          <li className="exchange" key={line.ru}>
            <p className="ru" lang="ru">{line.ru}</p>
            <p className="en">{line.en}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Buy() {
  return (
    <section className="buy" id="buy" aria-labelledby="buy-title">
      <div className="buy-copy">
        <h2 id="buy-title">Start learning Russian today.</h2>
        <p>Download the Russian Mega Pack and begin your journey into one of the world’s richest and most rewarding languages.</p>
        <p className="buy-terms">One payment. Lifetime access. Instant download.</p>
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
      <p className="close-line"><a href="#buy">Get instant access now</a></p>
    </footer>
  );
}
