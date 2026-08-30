"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { marathonRoute } from "./marathon-route";

const DONATION_URL =
  "https://www.justgiving.com/page/kateruns27";
const FUNDRAISING_TARGET = 3000;
const AMOUNT_RAISED: number = 680;
const TRAINER_COUNT = 10;

const SUPPORTER_MESSAGES = [
  {
    name: "Stewart and Trish",
    amount: "£200",
    message: "Thank you Kate for this wonderful gesture",
  },
  {
    name: "Will Szumski",
    amount: "£25",
    message: "Good luck, it's a great cause.",
  },
  {
    name: "Isobel Hawkins",
    amount: "£10",
    message: "No message left",
  },
  {
    name: "Chris Cowan",
    amount: "Private",
    message:
      "Great cause and way to celebrate Lauren! Good luck with the winter training and hope there’s a bottle of champagne at the finish line!",
  },
  {
    name: "Sammy W",
    amount: "£20",
    message: "Just keep running!! You will smash it Kate xx",
  },
  {
    name: "Zoe C",
    amount: "Private",
    message: "💪",
  },
  {
    name: "From Emma Harvey and family",
    amount: "Private",
    message: "Good luck Kate xx",
  },
  {
    name: "Jess A-S",
    amount: "£20",
    message: "Good luck Kate!",
  },
  {
    name: "Mum and Dad",
    amount: "£200",
    message: "So proud of you Kate xxx",
  },
  {
    name: "Gary Flockton",
    amount: "£10",
    message: "Hope your faster than Ryan is getting a round in!",
  },
  {
    name: "Rachel & Kev",
    amount: "£10",
    message:
      "Such an amazing cause in memory of your beautiful Lauren ❤️ Best of luck xxx",
  },
  {
    name: "Jenna Underwood",
    amount: "£10",
    message: "Your smash it! Lauren would be proud of you! Love ya ❤️",
  },
  {
    name: "JustGiving",
    amount: "£5",
    message:
      "You are doing something amazing. This donation is our way of helping you take that first step. Keep going - you are making a real difference and we'll be cheering you on all the way! From all of us at JustGiving.",
  },
] as const;

function ScrollMotion() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (reducedMotion) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));

    let frame = 0;
    const updateScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const maximum =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = maximum > 0 ? window.scrollY / maximum : 0;
        document.documentElement.style.setProperty(
          "--scroll-progress",
          progress.toFixed(4),
        );
        document.documentElement.style.setProperty(
          "--scroll-offset",
          `${window.scrollY}px`,
        );
      });
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  return null;
}

function AmbientParticles() {
  return (
    <div className="ambient-particles" aria-hidden="true">
      {Array.from({ length: 16 }, (_, index) => (
        <span key={index} />
      ))}
    </div>
  );
}

const routeLandmarks: {
  label: string;
  position: [number, number];
  direction?: "top" | "bottom" | "left" | "right";
}[] = [
  { label: "Woolwich", position: [51.488478, 0.06272], direction: "right" },
  { label: "Cutty Sark", position: [51.481434, -0.010297], direction: "bottom" },
  { label: "Tower Bridge", position: [51.502376, -0.077556], direction: "left" },
  { label: "Canary Wharf", position: [51.5043, -0.012818], direction: "right" },
  { label: "Tower Hill", position: [51.509922, -0.074402], direction: "top" },
  { label: "The Mall", position: [51.503004, -0.137799], direction: "left" },
];

const startAreaPosition: [number, number] = [51.4713, 0.0085];

function RouteMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mapRef.current;
    if (!container) return;

    let removeMap: (() => void) | undefined;
    let cancelled = false;

    const setup = async () => {
      const L = await import("leaflet");
      if (cancelled) return;

      const map = L.map(container, {
        attributionControl: true,
        scrollWheelZoom: false,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      const routeOutline = L.polyline(marathonRoute, {
        color: "#fffdf7",
        opacity: 0.96,
        weight: 12,
        lineCap: "round",
        lineJoin: "round",
        interactive: false,
      }).addTo(map);

      L.polyline(marathonRoute, {
        color: "#f06f72",
        opacity: 1,
        weight: 6,
        lineCap: "round",
        lineJoin: "round",
        interactive: false,
      }).addTo(map);

      L.polyline(marathonRoute, {
        className: "marathon-route-flow",
        color: "#fffdf7",
        dashArray: "1 13",
        opacity: 0.95,
        weight: 2.5,
        lineCap: "round",
        interactive: false,
      }).addTo(map);

      const startArea = L.circleMarker(startAreaPosition, {
        className: "route-point route-point--context",
        color: "#fffdf7",
        fillColor: "#08b875",
        fillOpacity: 1,
        radius: 7,
        weight: 3,
      })
        .addTo(map)
        .bindTooltip("Start areas", {
          className: "route-label route-label--start",
          direction: "bottom",
          offset: [0, 8],
          opacity: 1,
          permanent: true,
        });

      routeLandmarks.forEach((landmark, index) => {
        const isFinish = index === routeLandmarks.length - 1;
        L.circleMarker(landmark.position, {
          className: "route-point",
          color: "#fffdf7",
          fillColor: isFinish ? "#3b278c" : "#205b44",
          fillOpacity: 1,
          radius: index === 0 || isFinish ? 7 : 5,
          weight: 3,
        })
          .addTo(map)
          .bindTooltip(landmark.label, {
            className: `route-label route-label--${index}`,
            direction: landmark.direction ?? "top",
            offset: [0, -8],
            opacity: 1,
            permanent: true,
          });
      });

      const mapBounds = routeOutline.getBounds().extend(startArea.getLatLng());
      map.fitBounds(mapBounds, {
        paddingBottomRight: [34, 34],
        paddingTopLeft: [34, 34],
      });

      requestAnimationFrame(() => map.invalidateSize());
      removeMap = () => map.remove();
    };

    void setup();

    return () => {
      cancelled = true;
      removeMap?.();
    };
  }, []);

  return (
    <div className="route-map" data-reveal="scale">
      <div className="route-map__badge">Detailed course overview</div>
      <div
        className="route-map__canvas"
        ref={mapRef}
        aria-label="Detailed London map showing the London Marathon course from Woolwich, through Greenwich, Tower Bridge and Canary Wharf, to the finish on The Mall"
        role="img"
      />
      <div className="route-map__caption" aria-hidden="true">
        <span>Start areas shown for context · route mapped from Woolwich</span>
        <span>Finish · The Mall</span>
      </div>
    </div>
  );
}

function TrainerTracker() {
  const progress = Math.min(
    1,
    Math.max(0, AMOUNT_RAISED / FUNDRAISING_TARGET),
  );
  const displayedPercent = Math.floor(progress * 100);
  const trainerProgress = progress * TRAINER_COUNT;
  const trainers = useMemo(
    () =>
      Array.from({ length: TRAINER_COUNT }, (_, index) =>
        Math.min(1, Math.max(0, trainerProgress - index)),
      ),
    [trainerProgress],
  );

  return (
    <div
      className="tracker"
      aria-label={`Fundraising progress: £${AMOUNT_RAISED} raised, ${displayedPercent}% of the £${FUNDRAISING_TARGET} goal`}
      data-reveal="up"
    >
      <div className="tracker__numbers">
        <div>
          <span>Raised so far</span>
          <strong>
            {AMOUNT_RAISED === 0
              ? "Launching soon"
              : `£${AMOUNT_RAISED.toLocaleString("en-GB")}`}
          </strong>
          <span className="tracker__percentage">
            {displayedPercent}% raised
          </span>
        </div>
        <div className="tracker__target">
          <span>Kate&apos;s goal</span>
          <strong>£{FUNDRAISING_TARGET.toLocaleString("en-GB")}</strong>
        </div>
      </div>
      <div className="trainers" aria-hidden="true">
        {trainers.map((fill, index) => (
          <span
            className="trainer"
            key={index}
            style={
              {
                "--fill-right": `${100 - fill * 100}%`,
                "--trainer-delay": `${index * 55}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div className="tracker__scale">
        <span>Start line</span>
        <span>Every trainer = £300</span>
        <span>£3,000</span>
      </div>
    </div>
  );
}

function SupporterTicker() {
  const messageCards = (copy: "primary" | "duplicate") =>
    SUPPORTER_MESSAGES.map((supporter, index) => (
      <article
        className="supporter-ticker__card"
        key={`${copy}-${supporter.name}-${index}`}
      >
        <div className="supporter-ticker__meta">
          <strong>{supporter.name}</strong>
          <span>{supporter.amount}</span>
        </div>
        <p>{supporter.message}</p>
      </article>
    ));

  return (
    <section
      className="supporter-ticker"
      aria-label="Messages from supporters on JustGiving"
      data-reveal="up"
    >
      <div className="supporter-ticker__heading">
        <span>Recent JustGiving support</span>
        <span>
          {SUPPORTER_MESSAGES.length} donations · £
          {AMOUNT_RAISED.toLocaleString("en-GB")} raised
        </span>
      </div>
      <div className="supporter-ticker__viewport">
        <div className="supporter-ticker__track">
          <div className="supporter-ticker__set">
            {messageCards("primary")}
          </div>
          <div className="supporter-ticker__set" aria-hidden="true">
            {messageCards("duplicate")}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <ScrollMotion />

      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="announcement">
        <span>London Marathon 2027 · In memory of Lauren Szumski</span>
        <a href={DONATION_URL} target="_blank" rel="noreferrer">
          Donate through JustGiving
        </a>
      </div>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Kate Runs home">
          KR<span>27</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#why">Why</a>
          <a href="#lauren">Lauren</a>
          <a href="#goal">The goal</a>
          <a href="#route">The route</a>
        </nav>
        <a
          className="button button--small"
          href={DONATION_URL}
          target="_blank"
          rel="noreferrer"
        >
          Donate now
        </a>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero__stage">
            <AmbientParticles />
            <div
              className="hero__pattern hero__pattern--top"
              aria-hidden="true"
            />
            <div
              className="hero__pattern hero__pattern--bottom"
              aria-hidden="true"
            />

            <figure className="hero__runner">
              <Image
                src="/kate-run-transparent.png"
                alt="Illustration of Kate running with an outstretched arm and a joyful smile"
                fill
                priority
                sizes="(max-width: 760px) 88vw, 42vw"
              />
            </figure>

            <div className="hero__copy">
              <p className="eyebrow hero__eyebrow">
                One runner · One lovely friend · One big goal
              </p>
              <h1>
                <span>Kate runs</span>
                <span className="outline">London</span>
                <span>2027.</span>
              </h1>
              <p className="hero__intro hero__intro--highlight">
                Kate is taking on 26.2 miles for Young Epilepsy, raising
                £3,000 in memory of her friend, Lauren Szumski.
              </p>
              <div className="hero__actions">
                <a
                  className="button"
                  href={DONATION_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Donate now
                </a>
                <a className="text-link" href="#why">
                  Read Kate&apos;s reason <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            <div className="hero__marquee" aria-hidden="true">
              <span>
                26.2 MILES · FOR LAUREN · FOR YOUNG EPILEPSY · 26.2 MILES ·
                FOR LAUREN · FOR YOUNG EPILEPSY ·
              </span>
            </div>
          </div>
        </section>

        <section className="why" id="why">
          <AmbientParticles />
          <div className="why__inner">
            <div className="section-number" data-reveal="left">
              01 / Why
            </div>
            <div className="why__headline" data-reveal="up">
              <p className="eyebrow">The reason behind every mile</p>
              <h2>
                Running with
                <span className="outline outline--green">purpose.</span>
              </h2>
              <a
                className="why__logo-link"
                href="https://www.youngepilepsy.org.uk/"
                rel="noreferrer"
                target="_blank"
                aria-label="Visit the Young Epilepsy website"
              >
                <Image
                  src="/young-epilepsy-green.png"
                  alt="Young Epilepsy"
                  width="1200"
                  height="454"
                />
              </a>
            </div>
            <div className="why__copy" data-reveal="right">
              <p className="lead">
                This is more than a marathon. Kate is running to remember
                Lauren, to celebrate the warmth she brought to the people
                around her, and to help young people living with epilepsy.
              </p>
              <p>
                Every donation can help Young Epilepsy support more young
                people and their families with practical help, specialist
                services and a stronger voice.
              </p>
              <a
                className="text-link"
                href="https://www.youngepilepsy.org.uk/"
                rel="noreferrer"
                target="_blank"
              >
                Learn about Young Epilepsy <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <div
            className="why__stats"
            aria-label="Young Epilepsy statistics"
          >
            <div className="why__stats-topline">
              <span>Why the support matters</span>
              <span>Figures from Young Epilepsy</span>
            </div>
            <article
              className="why__stat why__stat--purple"
              data-reveal="up"
            >
              <strong>100K</strong>
              <p>
                Around 100,000 children and young people in the UK have
                epilepsy, with 23 new cases diagnosed every day.
              </p>
            </article>
            <article
              className="why__stat why__stat--green"
              data-reveal="up"
            >
              <strong>1 in 3</strong>
              <p>
                Children and young people with epilepsy have seizures that
                cannot be controlled with medication.
              </p>
            </article>
            <article
              className="why__stat why__stat--coral"
              data-reveal="up"
            >
              <strong>3 in 4</strong>
              <p>
                Children and young people say living with epilepsy greatly
                affects their mental health.
              </p>
            </article>
            <article
              className="why__stat why__stat--pink"
              data-reveal="up"
            >
              <strong>1 in 3</strong>
              <p>
                Children and young people with epilepsy do not get the support
                they need to take part fully at school.
              </p>
            </article>
          </div>
        </section>

        <section className="lauren" id="lauren">
          <div className="lauren__orb lauren__orb--one" aria-hidden="true" />
          <div className="lauren__orb lauren__orb--two" aria-hidden="true" />
          <AmbientParticles />
          <div className="lauren__topline">
            <span className="section-number">02 / Lauren</span>
            <span>A life full of memories</span>
          </div>
          <h2 className="lauren__title" data-reveal="title">
            <span>Lauren&apos;s</span>
            <span className="outline outline--pink">story</span>
          </h2>
          <div
            className="polaroid-gallery"
            aria-label="Photographs of Lauren, Kate and friends"
          >
            <figure
              className="polaroid polaroid--portrait"
              data-reveal="polaroid"
            >
              <div className="polaroid__photo polaroid__photo--portrait">
                <Image
                  src="/lauren-floral-wall.jpg"
                  alt="Lauren smiling in a pink dress in front of a flower mural"
                  fill
                  sizes="(max-width: 760px) 70vw, 19vw"
                />
              </div>
            </figure>
            <blockquote
              className="memory-note memory-note--four"
              data-reveal="left"
            >
              <p>“She made amazing friends wherever she went.”</p>
            </blockquote>
            <figure
              className="polaroid polaroid--together-one"
              data-reveal="polaroid"
            >
              <div className="polaroid__photo">
                <Image
                  src="/kate-lauren-1.jpg"
                  alt="Kate and Lauren smiling together"
                  fill
                  sizes="(max-width: 760px) 82vw, 29vw"
                />
              </div>
            </figure>
            <blockquote
              className="memory-note memory-note--five"
              data-reveal="right"
            >
              <p>“An absolute pleasure to know. Truly missed.”</p>
            </blockquote>
            <figure
              className="polaroid polaroid--summer"
              data-reveal="polaroid"
            >
              <div className="polaroid__photo polaroid__photo--portrait">
                <Image
                  src="/lauren-rio-view.jpg"
                  alt="Lauren smiling above Rio de Janeiro at sunset"
                  fill
                  sizes="(max-width: 760px) 55vw, 15vw"
                />
              </div>
            </figure>
            <article className="lauren__portrait-copy" data-reveal="up">
              <p className="eyebrow">A little about Lauren</p>
              <h3>Full of life. Full of joy.</h3>
              <p>
                Lauren was clever, independent, kind and full of joy. Her
                beautiful smile and adventurous spirit stayed with everyone
                she met.
              </p>
              <p>
                Lauren passed away suddenly on 2nd May 2023. The shock reached
                far beyond one place, leaving family and friends around the
                world trying to understand life without her. The impact was
                profound because the love for her was so great.
              </p>
              <p>
                What remains is the way Lauren lived: travelling, seeking out
                new places and making memories. She turned new faces into
                friends, and people quickly fell in love with her warmth,
                humour and generous spirit.
              </p>
            </article>
            <blockquote
              className="memory-note memory-note--one"
              data-reveal="left"
            >
              <p>“Forever in our hearts. Shine brightly.”</p>
            </blockquote>
            <blockquote
              className="memory-note memory-note--two"
              data-reveal="right"
            >
              <p>“Clever, independent, kind and full of joy.”</p>
            </blockquote>
            <figure
              className="polaroid polaroid--together-two"
              data-reveal="polaroid"
            >
              <div className="polaroid__photo">
                <Image
                  src="/kate-lauren-2.jpg"
                  alt="Kate and Lauren laughing together"
                  fill
                  sizes="(max-width: 760px) 82vw, 30vw"
                />
              </div>
            </figure>
            <blockquote
              className="memory-note memory-note--three"
              data-reveal="up"
            >
              <p>“Her adventurous, fun nature lives on in every story.”</p>
            </blockquote>
            <figure
              className="polaroid polaroid--view"
              data-reveal="polaroid"
            >
              <div className="polaroid__photo polaroid__photo--landscape">
                <Image
                  src="/lauren-view.jpeg"
                  alt="Lauren sitting on a rock looking across the mountains at sunset"
                  fill
                  sizes="(max-width: 760px) 64vw, 22vw"
                />
              </div>
            </figure>
            <figure
              className="polaroid polaroid--friends-black-white"
              data-reveal="polaroid"
            >
              <div className="polaroid__photo polaroid__photo--landscape">
                <Image
                  src="/lauren-friends-black-white.jpeg"
                  alt="Lauren smiling with a friend in a black-and-white photograph"
                  fill
                  sizes="(max-width: 760px) 82vw, 26vw"
                />
              </div>
            </figure>
            <figure
              className="polaroid polaroid--seaside-selfie"
              data-reveal="polaroid"
            >
              <div className="polaroid__photo polaroid__photo--square">
                <Image
                  src="/lauren-friends-group-selfie.jpg"
                  alt="Lauren smiling with friends in a group selfie"
                  fill
                  sizes="(max-width: 760px) 72vw, 25vw"
                />
              </div>
            </figure>
            <figure
              className="polaroid polaroid--friends-evening"
              data-reveal="polaroid"
            >
              <div className="polaroid__photo polaroid__photo--landscape">
                <Image
                  src="/lauren-friends-evening.jpeg"
                  alt="Lauren and friends together on an evening out"
                  fill
                  sizes="(max-width: 760px) 82vw, 26vw"
                />
              </div>
            </figure>
            <figure
              className="polaroid polaroid--travel-bench"
              data-reveal="polaroid"
            >
              <div className="polaroid__photo polaroid__photo--landscape">
                <Image
                  src="/lauren-travel-bench.jpeg"
                  alt="Lauren sitting with a friend in a tropical garden"
                  fill
                  sizes="(max-width: 760px) 88vw, 31vw"
                />
              </div>
            </figure>
            <figure
              className="polaroid polaroid--friends-dinner"
              data-reveal="polaroid"
            >
              <div className="polaroid__photo polaroid__photo--landscape">
                <Image
                  src="/lauren-friends-dinner.jpeg"
                  alt="Lauren and friends gathered together around a table"
                  fill
                  sizes="(max-width: 760px) 84vw, 31vw"
                />
              </div>
            </figure>
          </div>
        </section>

        <section className="goal" id="goal">
          <AmbientParticles />
          <div className="goal__topline">
            <span className="section-number">03 / The goal</span>
            <span>Help turn every trainer pink</span>
          </div>
          <div className="goal__heading" data-reveal="title">
            <h2>
              £3,000
              <span className="outline outline--cream">together.</span>
            </h2>
          </div>
          <TrainerTracker />
          <SupporterTicker />
          <div className="goal__note" data-reveal="up">
            <p>
              The tracker is updated as donations arrive. Ten trainers,
              £300 each, all the way to the finish line.
            </p>
            <a
              className="button button--cream"
              href={DONATION_URL}
              target="_blank"
              rel="noreferrer"
            >
              Donate now
            </a>
          </div>
        </section>

        <section className="course" id="route">
          <AmbientParticles />
          <div className="course__intro">
            <div className="section-number" data-reveal="left">
              04 / The course
            </div>
            <div data-reveal="up">
              <p className="eyebrow">Greenwich to The Mall</p>
              <h2>
                A city in
                <span className="outline outline--green">motion.</span>
              </h2>
            </div>
            <p className="lead" data-reveal="right">
              The famous 26.2-mile route brings the sights, sound and colour
              of London together, with huge crowd support from south-east
              London to the finish on The Mall.
            </p>
          </div>

          <div className="course__stages">
            <article data-reveal="up">
              <span>Start → Mile 7</span>
              <h3>Greenwich & Cutty Sark</h3>
              <p>
                Three start lines join before Mile Three in Woolwich, before
                the route passes Charlton, Greenwich, Deptford and the Cutty
                Sark.
              </p>
            </article>
            <article data-reveal="up">
              <span>Miles 7 → 13.1</span>
              <h3>Tower Bridge</h3>
              <p>
                Through Rotherhithe and Bermondsey, then across the Thames on
                one of the loudest and most memorable parts of the course.
              </p>
            </article>
            <article data-reveal="up">
              <span>Miles 13 → 21</span>
              <h3>Docklands & Canary Wharf</h3>
              <p>
                The route heads east along The Highway before looping through
                Westferry, Mudchute, Docklands and Canary Wharf.
              </p>
            </article>
            <article data-reveal="up">
              <span>Final five miles</span>
              <h3>Westminster & The Mall</h3>
              <p>
                Tower Hill, Victoria Embankment, Parliament Square, Birdcage
                Walk and a final turn at Buckingham Palace.
              </p>
            </article>
          </div>

          <div className="map-wrap">
            <RouteMap />
            <div className="map-copy" data-reveal="right">
              <span className="map-copy__distance">26.2</span>
              <span>miles through London</span>
              <p>
                The pink line now follows the detailed mapped course from
                Woolwich to The Mall. The three Blackheath and Greenwich start
                areas are shown for context without adding an unverified route
                spur.
              </p>
              <a
                className="text-link"
                href="https://www.londonmarathonevents.co.uk/london-marathon/course"
                target="_blank"
                rel="noreferrer"
              >
                View the official course information{" "}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className="donate" id="donate">
          <AmbientParticles />
          <p className="eyebrow" data-reveal="up">
            Be part of Kate&apos;s 26.2 miles
          </p>
          <h2 data-reveal="title">
            Run with her.
            <span className="outline">Remember Lauren.</span>
          </h2>
          <p data-reveal="up">
            Every donation helps Kate towards her £3,000 goal for Young
            Epilepsy, in memory of Lauren.
          </p>
          <a
            className="button button--cream"
            href={DONATION_URL}
            target="_blank"
            rel="noreferrer"
            data-reveal="up"
          >
            Donate through JustGiving
          </a>
        </section>
      </main>

      <footer>
        <div>
          <a className="wordmark wordmark--footer" href="#top">
            KR<span>27</span>
          </a>
          <p>Kate runs London 2027, in memory of Lauren Szumski.</p>
        </div>
        <Image
          src="/young-epilepsy-logo.png"
          alt="Young Epilepsy"
          width="359"
          height="139"
        />
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  );
}
