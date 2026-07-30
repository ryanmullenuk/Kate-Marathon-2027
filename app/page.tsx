"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { marathonRoute } from "./marathon-route";

const DONATION_URL = "#donate";
const FUNDRAISING_TARGET = 3000;
const AMOUNT_RAISED: number = 0;
const TRAINER_COUNT = 10;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  gravity: number;
  drag: number;
  life: number;
  maxLife: number;
  colour: string;
  rotation: number;
  spin: number;
  shape: 0 | 1 | 2;
};

const particleColours = [
  "#f2a1b8",
  "#f06f72",
  "#dff3bd",
  "#8c79ca",
  "#fffdf7",
  "#08b875",
];

function ScrollMotion() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const hero = document.querySelector<HTMLElement>(".hero");
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (reducedMotion) {
      elements.forEach((element) => element.classList.add("is-visible"));
      hero?.style.setProperty("--hero-run-progress", "1");
      hero?.style.setProperty("--hero-run-x", "0vw");
      hero?.style.setProperty("--hero-run-y", "0px");
      hero?.style.setProperty("--hero-run-rotate", "0deg");
      hero?.style.setProperty("--hero-run-opacity", "1");
      hero?.style.setProperty("--hero-copy-opacity", "1");
      hero?.style.setProperty("--hero-copy-shift", "0vw");
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

        if (hero) {
          const heroRect = hero.getBoundingClientRect();
          const travel = Math.max(1, hero.offsetHeight - window.innerHeight);
          const heroProgress = Math.min(
            1,
            Math.max(0, -heroRect.top / travel),
          );
          hero.style.setProperty(
            "--hero-run-progress",
            heroProgress.toFixed(4),
          );
          hero.style.setProperty(
            "--hero-run-x",
            `${(-50 + heroProgress * 50).toFixed(3)}vw`,
          );
          hero.style.setProperty(
            "--hero-run-y",
            `${(
              Math.sin(heroProgress * Math.PI * 8) *
              (1 - heroProgress) *
              9
            ).toFixed(2)}px`,
          );
          hero.style.setProperty(
            "--hero-run-rotate",
            `${(-6 + heroProgress * 6).toFixed(2)}deg`,
          );
          hero.style.setProperty(
            "--hero-run-opacity",
            (0.3 + heroProgress * 0.7).toFixed(3),
          );
          hero.style.setProperty(
            "--hero-copy-opacity",
            (1 - heroProgress * 0.86).toFixed(3),
          );
          hero.style.setProperty(
            "--hero-copy-shift",
            `${(-heroProgress * 5).toFixed(3)}vw`,
          );
        }
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

function InteractiveParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let particles: Particle[] = [];
    let animationId = 0;
    let width = 0;
    let height = 0;
    let lastTrail = { x: -100, y: -100, time: 0 };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const createBurst = (
      x: number,
      y: number,
      count: number,
      strength: number,
    ) => {
      if (reducedMotion) return;

      for (let index = 0; index < count; index += 1) {
        const angle = Math.PI * (1.08 + Math.random() * 0.84);
        const speed = strength * (0.55 + Math.random() * 0.8);
        const life = 42 + Math.random() * 42;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 1.4,
          vy: Math.sin(angle) * speed - Math.random() * strength * 0.65,
          radius: 2.5 + Math.random() * 6.5,
          gravity: 0.11 + Math.random() * 0.08,
          drag: 0.982 + Math.random() * 0.01,
          life,
          maxLife: life,
          colour:
            particleColours[
              Math.floor(Math.random() * particleColours.length)
            ],
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.2,
          shape: Math.floor(Math.random() * 3) as 0 | 1 | 2,
        });
      }

      if (particles.length > 320) particles = particles.slice(-320);
    };

    const drawParticle = (particle: Particle) => {
      const alpha = Math.max(0, particle.life / particle.maxLife);
      context.save();
      context.globalAlpha = Math.min(0.92, alpha * 1.4);
      context.fillStyle = particle.colour;
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);

      if (particle.shape === 0) {
        context.beginPath();
        context.arc(0, 0, particle.radius, 0, Math.PI * 2);
        context.fill();
      } else if (particle.shape === 1) {
        context.fillRect(
          -particle.radius,
          -particle.radius,
          particle.radius * 2,
          particle.radius * 2,
        );
      } else {
        context.beginPath();
        context.moveTo(0, -particle.radius * 1.55);
        context.lineTo(particle.radius * 0.5, -particle.radius * 0.5);
        context.lineTo(particle.radius * 1.55, 0);
        context.lineTo(particle.radius * 0.5, particle.radius * 0.5);
        context.lineTo(0, particle.radius * 1.55);
        context.lineTo(-particle.radius * 0.5, particle.radius * 0.5);
        context.lineTo(-particle.radius * 1.55, 0);
        context.lineTo(-particle.radius * 0.5, -particle.radius * 0.5);
        context.closePath();
        context.fill();
      }

      context.restore();
    };

    const animate = () => {
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.vx *= particle.drag;
        particle.vy = particle.vy * particle.drag + particle.gravity;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.spin;
        particle.life -= 1;
        drawParticle(particle);
      });

      particles = particles.filter(
        (particle) =>
          particle.life > 0 &&
          particle.y < height + 40 &&
          particle.x > -40 &&
          particle.x < width + 40,
      );
      animationId = requestAnimationFrame(animate);
    };

    const onPointerDown = (event: PointerEvent) => {
      createBurst(event.clientX, event.clientY, 28, 7.4);
    };

    const onPointerMove = (event: PointerEvent) => {
      const now = performance.now();
      const distance = Math.hypot(
        event.clientX - lastTrail.x,
        event.clientY - lastTrail.y,
      );

      if (now - lastTrail.time > 38 && distance > 20) {
        createBurst(event.clientX, event.clientY, 2, 2.8);
        lastTrail = { x: event.clientX, y: event.clientY, time: now };
      }
    };

    resize();
    animationId = requestAnimationFrame(animate);
    window.addEventListener("resize", resize);
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return <canvas className="particle-field" ref={canvasRef} aria-hidden="true" />;
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
      aria-label="Fundraising progress"
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

export default function Home() {
  return (
    <>
      <ScrollMotion />
      <InteractiveParticles />

      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="announcement">
        <span>London Marathon 2027 · In memory of Lauren Szumski</span>
        <a href={DONATION_URL}>JustGiving link coming soon</a>
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
        <a className="button button--small" href={DONATION_URL}>
          Donate now
        </a>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero__stage">
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
              <p className="hero__intro">
                Kate is taking on 26.2 miles for Young Epilepsy, raising
                £3,000 in memory of her friend, Lauren Szumski.
              </p>
              <div className="hero__actions">
                <a className="button" href={DONATION_URL}>
                  Donate now
                </a>
                <a className="text-link" href="#why">
                  Read Kate&apos;s reason <span aria-hidden="true">↓</span>
                </a>
              </div>
              <span className="particle-hint" aria-hidden="true">
                Scroll to send Kate on her way
              </span>
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
                Young Epilepsy says around 100,000 children and young people in
                the UK have epilepsy. Every donation can help the charity
                support more young people and their families.
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
        </section>

        <section className="lauren" id="lauren">
          <div className="lauren__orb lauren__orb--one" aria-hidden="true" />
          <div className="lauren__orb lauren__orb--two" aria-hidden="true" />
          <div className="lauren__topline">
            <span className="section-number">02 / Lauren</span>
            <span>More memories coming soon</span>
          </div>
          <h2 className="lauren__title" data-reveal="title">
            <span>Lauren&apos;s</span>
            <span className="outline outline--pink">story</span>
          </h2>
          <div
            className="polaroid-gallery"
            data-reveal="polaroids"
            aria-label="Photographs of Lauren and Kate"
          >
            <figure className="polaroid polaroid--portrait">
              <div className="polaroid__photo polaroid__photo--portrait">
                <Image
                  src="/lauren-portrait.jpeg"
                  alt="Lauren smiling by a window"
                  fill
                  sizes="(max-width: 760px) 70vw, 19vw"
                />
              </div>
              <figcaption>Lauren</figcaption>
            </figure>
            <figure className="polaroid polaroid--together-one">
              <div className="polaroid__photo">
                <Image
                  src="/kate-lauren-1.jpg"
                  alt="Kate and Lauren smiling together"
                  fill
                  sizes="(max-width: 760px) 82vw, 29vw"
                />
              </div>
              <figcaption>Kate &amp; Lauren</figcaption>
            </figure>
            <figure className="polaroid polaroid--summer">
              <div className="polaroid__photo polaroid__photo--portrait">
                <Image
                  src="/lauren-summer.jpeg"
                  alt="Lauren smiling with flowers by the water"
                  fill
                  sizes="(max-width: 760px) 55vw, 15vw"
                />
              </div>
              <figcaption>Sunshine</figcaption>
            </figure>
            <figure className="polaroid polaroid--together-two">
              <div className="polaroid__photo">
                <Image
                  src="/kate-lauren-2.jpg"
                  alt="Kate and Lauren laughing together"
                  fill
                  sizes="(max-width: 760px) 82vw, 30vw"
                />
              </div>
              <figcaption>Always laughing</figcaption>
            </figure>
            <figure className="polaroid polaroid--view">
              <div className="polaroid__photo polaroid__photo--landscape">
                <Image
                  src="/lauren-view.jpeg"
                  alt="Lauren sitting on a rock looking over the landscape"
                  fill
                  sizes="(max-width: 760px) 64vw, 22vw"
                />
              </div>
              <figcaption>Adventures</figcaption>
            </figure>
          </div>
          <div className="lauren__bottom">
            <p className="lead" data-reveal="up">
              A life remembered with love.
            </p>
            <p data-reveal="up">
              This space will continue to grow with memories and the story of
              Lauren&apos;s life, shared by the people who knew and loved her.
            </p>
          </div>
        </section>

        <section className="goal" id="goal">
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
          <div className="goal__note" data-reveal="up">
            <p>
              The tracker will be updated as donations arrive. Ten trainers,
              £300 each, all the way to the finish line.
            </p>
            <a className="button button--cream" href={DONATION_URL}>
              Donate now
            </a>
          </div>
        </section>

        <section className="course" id="route">
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
          <p className="eyebrow" data-reveal="up">
            Be part of Kate&apos;s 26.2 miles
          </p>
          <h2 data-reveal="title">
            Run with her.
            <span className="outline">Remember Lauren.</span>
          </h2>
          <p data-reveal="up">
            The JustGiving page will be linked here as soon as fundraising
            opens.
          </p>
          <span
            className="button button--disabled"
            aria-disabled="true"
            data-reveal="up"
          >
            Donation link coming soon
          </span>
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
