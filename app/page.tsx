"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";

const DONATION_URL = "#donate";
const FUNDRAISING_TARGET: number = 3000;
const AMOUNT_RAISED: number = 0;
const TRAINER_COUNT = 10;

type Particle = {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  drift: number;
  colour: string;
  alpha: number;
};

const particleColours = [
  "#f2a1b8",
  "#f06f72",
  "#dff3bd",
  "#8c79ca",
  "#fffdf7",
  "#08b875",
];

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const pointer = { x: -1000, y: -1000 };
    let particles: Particle[] = [];
    let animationId = 0;
    let width = 0;
    let height = 0;

    const createParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 2 + Math.random() * 10,
      speedX: (Math.random() - 0.5) * 0.22,
      speedY: -0.08 - Math.random() * 0.26,
      drift: Math.random() * Math.PI * 2,
      colour:
        particleColours[
          Math.floor(Math.random() * particleColours.length)
        ],
      alpha: 0.12 + Math.random() * 0.22,
    });

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const desiredCount = Math.max(18, Math.min(42, Math.round(width / 38)));
      particles = Array.from({ length: desiredCount }, createParticle);
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        if (!reduceMotion) {
          particle.drift += 0.004;
          particle.x += particle.speedX + Math.sin(particle.drift) * 0.08;
          particle.y += particle.speedY;

          const distanceX = particle.x - pointer.x;
          const distanceY = particle.y - pointer.y;
          const distance = Math.hypot(distanceX, distanceY);
          if (distance < 100 && distance > 0) {
            particle.x += (distanceX / distance) * 0.45;
            particle.y += (distanceY / distance) * 0.45;
          }

          if (particle.y < -particle.radius * 2) {
            particle.y = height + particle.radius * 2;
            particle.x = Math.random() * width;
          }
          if (particle.x < -30) particle.x = width + 30;
          if (particle.x > width + 30) particle.x = -30;
        }

        const pulse = reduceMotion
          ? 1
          : 0.88 + Math.sin(time * 0.0006 + particle.drift) * 0.12;
        context.beginPath();
        context.fillStyle = particle.colour;
        context.globalAlpha = particle.alpha * pulse;
        context.arc(
          particle.x,
          particle.y,
          particle.radius * pulse,
          0,
          Math.PI * 2,
        );
        context.fill();
      });

      context.globalAlpha = 1;
      if (!reduceMotion) animationId = requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const onPointerLeave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
    };
  }, []);

  return <canvas className="particle-field" ref={canvasRef} aria-hidden="true" />;
}

const startRoutes: [number, number][][] = [
  [
    [51.4764, -0.003],
    [51.4746, 0.007],
    [51.4714, 0.018],
    [51.479, 0.039],
    [51.4896, 0.066],
  ],
  [
    [51.472, -0.008],
    [51.4712, 0.004],
    [51.4714, 0.018],
    [51.479, 0.039],
    [51.4896, 0.066],
  ],
  [
    [51.4689, -0.014],
    [51.4699, 0.002],
    [51.4714, 0.018],
    [51.479, 0.039],
    [51.4896, 0.066],
  ],
];

const marathonRoute: [number, number][] = [
  [51.4896, 0.066],
  [51.4892, 0.055],
  [51.4868, 0.042],
  [51.4842, 0.029],
  [51.4824, 0.015],
  [51.4828, 0.001],
  [51.4834, -0.008],
  [51.4814, -0.011],
  [51.4798, -0.008],
  [51.4825, -0.004],
  [51.4812, -0.019],
  [51.4817, -0.032],
  [51.4864, -0.045],
  [51.4931, -0.052],
  [51.5009, -0.055],
  [51.5067, -0.049],
  [51.5087, -0.038],
  [51.5055, -0.029],
  [51.4997, -0.033],
  [51.4952, -0.043],
  [51.492, -0.052],
  [51.4968, -0.057],
  [51.4991, -0.064],
  [51.5012, -0.07],
  [51.5034, -0.074],
  [51.5055, -0.0754],
  [51.5102, -0.075],
  [51.5106, -0.064],
  [51.5101, -0.052],
  [51.5104, -0.04],
  [51.5108, -0.028],
  [51.5076, -0.022],
  [51.5026, -0.021],
  [51.4962, -0.016],
  [51.4898, -0.011],
  [51.4867, -0.007],
  [51.491, -0.002],
  [51.4983, -0.003],
  [51.5034, -0.011],
  [51.5053, -0.018],
  [51.5031, -0.021],
  [51.5009, -0.017],
  [51.5035, -0.012],
  [51.5076, -0.022],
  [51.5104, -0.04],
  [51.5105, -0.055],
  [51.5102, -0.075],
  [51.5092, -0.091],
  [51.509, -0.106],
  [51.5077, -0.118],
  [51.5027, -0.123],
  [51.5008, -0.126],
  [51.5009, -0.132],
  [51.5014, -0.137],
  [51.5019, -0.141],
  [51.5031, -0.139],
  [51.5038, -0.134],
];

const routeLandmarks: {
  label: string;
  position: [number, number];
  direction?: "top" | "bottom" | "left" | "right";
}[] = [
  { label: "Three starts", position: [51.473, 0.002], direction: "left" },
  { label: "Woolwich", position: [51.4896, 0.066], direction: "right" },
  { label: "Cutty Sark", position: [51.4814, -0.011], direction: "bottom" },
  { label: "Tower Bridge", position: [51.5076, -0.0752], direction: "left" },
  { label: "Canary Wharf", position: [51.5035, -0.016], direction: "right" },
  { label: "Tower Hill", position: [51.5102, -0.075], direction: "top" },
  { label: "The Mall", position: [51.5038, -0.134], direction: "left" },
];

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
        opacity: 0.94,
        weight: 12,
        lineCap: "round",
        lineJoin: "round",
        interactive: false,
      }).addTo(map);

      startRoutes.forEach((route) => {
        L.polyline(route, {
          color: "#fffdf7",
          opacity: 0.9,
          weight: 9,
          lineCap: "round",
          lineJoin: "round",
          interactive: false,
        }).addTo(map);
        L.polyline(route, {
          color: "#f06f72",
          opacity: 0.96,
          weight: 4,
          lineCap: "round",
          lineJoin: "round",
          interactive: false,
        }).addTo(map);
      });

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

      routeLandmarks.forEach((landmark, index) => {
        L.circleMarker(landmark.position, {
          className: index === 0 ? "route-point route-point--start" : "route-point",
          color: "#fffdf7",
          fillColor: index === routeLandmarks.length - 1 ? "#3b278c" : "#205b44",
          fillOpacity: 1,
          radius: index === 0 || index === routeLandmarks.length - 1 ? 7 : 5,
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

      map.fitBounds(routeOutline.getBounds(), {
        paddingBottomRight: [28, 28],
        paddingTopLeft: [28, 28],
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
    <div className="route-map">
      <div className="route-map__badge">Detailed course overview</div>
      <div
        className="route-map__canvas"
        ref={mapRef}
        aria-label="Detailed London map showing the London Marathon course from its three start areas, through Woolwich, Greenwich, Tower Bridge and Canary Wharf, to the finish on The Mall"
        role="img"
      />
      <div className="route-map__caption" aria-hidden="true">
        <span>Start · Blackheath</span>
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
    <div className="tracker" aria-label="Fundraising progress">
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
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ParticleField />

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
          <a href="#route">The route</a>
          <a href="#goal">The goal</a>
        </nav>
        <a className="button button--small" href={DONATION_URL}>
          Donate now
        </a>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero__copy">
            <p className="eyebrow">One runner · One lovely friend · One big goal</p>
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
          </div>

          <figure className="hero__art">
            <div className="hero__image-frame">
              <Image
                src="/kate-hero.png"
                alt="Illustration of Kate running with an outstretched arm and a joyful smile"
                width="1003"
                height="1568"
              />
            </div>
            <figcaption>Training now · London bound</figcaption>
          </figure>

          <div className="hero__marquee" aria-hidden="true">
            <span>
              26.2 MILES · FOR LAUREN · FOR YOUNG EPILEPSY · 26.2 MILES ·
              FOR LAUREN · FOR YOUNG EPILEPSY ·
            </span>
          </div>
        </section>

        <section className="why section-grid" id="why">
          <div className="section-number">01 / Why</div>
          <div className="why__headline">
            <p className="eyebrow">The reason behind every mile</p>
            <h2>
              Running with
              <span className="outline outline--green">purpose.</span>
            </h2>
          </div>
          <div className="why__copy">
            <p className="lead">
              This is more than a marathon. Kate is running to remember
              Lauren, to celebrate the warmth she brought to the people around
              her, and to help young people living with epilepsy.
            </p>
            <p>
              Young Epilepsy says around 100,000 children and young people in
              the UK have epilepsy. Every donation can help the charity support
              more young people and their families.
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
        </section>

        <section className="lauren section-grid" id="lauren">
          <div className="section-number">02 / Lauren</div>
          <div className="lauren__card">
            <div className="lauren__copy">
              <p className="eyebrow">A life remembered with love</p>
              <h2>Lauren&apos;s story</h2>
              <div className="coming-soon">Coming soon</div>
              <p>
                This space will grow with photographs, memories and the story of
                Lauren&apos;s life, shared by the people who knew and loved her.
              </p>
            </div>
            <div className="lauren__garden" aria-hidden="true">
              <span>Memories, photographs and Lauren&apos;s story</span>
            </div>
          </div>
        </section>

        <section className="goal section-grid" id="goal">
          <div className="section-number">03 / The goal</div>
          <div className="goal__heading">
            <p className="eyebrow">Help turn every trainer pink</p>
            <h2>
              £3,000.
              <span className="outline outline--cream">Together.</span>
            </h2>
          </div>
          <TrainerTracker />
          <div className="goal__note">
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
          <div className="course__intro section-grid">
            <div className="section-number">04 / The course</div>
            <div>
              <p className="eyebrow">Greenwich to The Mall</p>
              <h2>
                A city in
                <span className="outline outline--green">motion.</span>
              </h2>
            </div>
            <p className="lead">
              The famous 26.2-mile route brings the sights, sound and colour of
              London together, with huge crowd support from south-east London
              to the finish on The Mall.
            </p>
          </div>

          <div className="course__stages">
            <article>
              <span>Start → Mile 7</span>
              <h3>Greenwich & Cutty Sark</h3>
              <p>
                Three start lines join before Mile Three in Woolwich, before the
                route passes Charlton, Greenwich, Deptford and the Cutty Sark.
              </p>
            </article>
            <article>
              <span>Miles 7 → 13.1</span>
              <h3>Tower Bridge</h3>
              <p>
                Through Rotherhithe and Bermondsey, then across the Thames on
                one of the loudest and most memorable parts of the course.
              </p>
            </article>
            <article>
              <span>Miles 13 → 21</span>
              <h3>Docklands & Canary Wharf</h3>
              <p>
                The route heads east along The Highway before looping through
                Westferry, Mudchute, Docklands and Canary Wharf.
              </p>
            </article>
            <article>
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
            <div className="map-copy">
              <span className="map-copy__distance">26.2</span>
              <span>miles through London</span>
              <p>
                A detailed street-map overview of the established London
                Marathon course. Final 2027 arrangements will be checked
                against the organiser&apos;s latest guidance.
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
          <p className="eyebrow">Be part of Kate&apos;s 26.2 miles</p>
          <h2>
            Run with her.
            <span className="outline">Remember Lauren.</span>
          </h2>
          <p>
            The JustGiving page will be linked here as soon as fundraising
            opens.
          </p>
          <span className="button button--disabled" aria-disabled="true">
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
