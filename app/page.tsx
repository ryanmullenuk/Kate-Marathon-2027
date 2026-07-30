"use client";

import { useEffect, useMemo, useRef } from "react";

const DONATION_URL = "#donate";
const FUNDRAISING_TARGET = 3000;
const AMOUNT_RAISED = 0;
const TRAINER_COUNT = 10;

const courseStops = [
  { label: "Greenwich", x: 842, y: 462 },
  { label: "Cutty Sark", x: 688, y: 392 },
  { label: "Tower Bridge", x: 430, y: 256 },
  { label: "Canary Wharf", x: 622, y: 300 },
  { label: "Tower Hill", x: 390, y: 226 },
  { label: "The Mall", x: 132, y: 178 },
];

function Flower({
  className = "",
  tone = "coral",
}: {
  className?: string;
  tone?: "coral" | "purple" | "cream";
}) {
  return (
    <div className={`flower flower--${tone} ${className}`} aria-hidden="true">
      <div className="flower__spin">
        {Array.from({ length: 8 }, (_, index) => (
          <span
            className="flower__petal"
            key={index}
            style={{ "--petal": index } as React.CSSProperties}
          />
        ))}
        <span className="flower__centre" />
      </div>
    </div>
  );
}

function RouteMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let animationId = 0;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const draw = () => {
      const box = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(box.width * ratio));
      canvas.height = Math.max(1, Math.round(box.height * ratio));
      context.setTransform(
        (box.width * ratio) / 1000,
        0,
        0,
        (box.height * ratio) / 600,
        0,
        0,
      );
      context.clearRect(0, 0, 1000, 600);

      context.fillStyle = "#f7f0df";
      context.fillRect(0, 0, 1000, 600);

      context.lineWidth = 1;
      context.strokeStyle = "rgba(32, 91, 68, 0.13)";
      for (let x = -100; x < 1100; x += 62) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x + 190, 600);
        context.stroke();
      }
      for (let y = 28; y < 620; y += 54) {
        context.beginPath();
        context.moveTo(0, y);
        context.bezierCurveTo(240, y - 28, 720, y + 34, 1000, y - 12);
        context.stroke();
      }

      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = "#bfe2e6";
      context.lineWidth = 54;
      context.beginPath();
      context.moveTo(35, 220);
      context.bezierCurveTo(210, 160, 310, 312, 450, 280);
      context.bezierCurveTo(570, 252, 590, 394, 724, 364);
      context.bezierCurveTo(830, 340, 882, 286, 984, 300);
      context.stroke();

      const drawRoute = (stroke: string, width: number, dashed = false) => {
        context.strokeStyle = stroke;
        context.lineWidth = width;
        context.setLineDash(dashed ? [16, 16] : []);
        context.lineDashOffset = dashed ? -frame * 0.6 : 0;
        context.beginPath();
        context.moveTo(850, 470);
        context.bezierCurveTo(795, 445, 730, 440, 686, 394);
        context.bezierCurveTo(640, 345, 585, 330, 535, 335);
        context.bezierCurveTo(492, 340, 464, 300, 430, 258);
        context.bezierCurveTo(485, 225, 568, 225, 616, 268);
        context.bezierCurveTo(658, 307, 670, 352, 638, 374);
        context.bezierCurveTo(590, 404, 548, 320, 518, 268);
        context.bezierCurveTo(486, 215, 430, 202, 388, 226);
        context.bezierCurveTo(318, 264, 252, 224, 202, 210);
        context.bezierCurveTo(170, 202, 150, 190, 130, 178);
        context.stroke();
      };

      drawRoute("rgba(240, 111, 114, 0.22)", 26);
      drawRoute("#f06f72", 11);
      drawRoute("#fff7ed", 3, true);
      context.setLineDash([]);

      courseStops.forEach((stop, index) => {
        const pulse =
          reduceMotion || index !== 0
            ? 0
            : 3 + Math.sin(frame * 0.05) * 2;
        context.fillStyle = "rgba(59, 39, 140, 0.12)";
        context.beginPath();
        context.arc(stop.x, stop.y, 13 + pulse, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = "#3b278c";
        context.beginPath();
        context.arc(stop.x, stop.y, 7, 0, Math.PI * 2);
        context.fill();
        context.font = "700 17px Arial, sans-serif";
        context.fillText(stop.label, stop.x + 14, stop.y - 12);
      });

      context.fillStyle = "#205b44";
      context.font = "700 13px Arial, sans-serif";
      context.fillText("RIVER THAMES", 474, 312);
      context.fillStyle = "#f06f72";
      context.font = "800 14px Arial, sans-serif";
      context.fillText("START", 862, 484);
      context.fillStyle = "#205b44";
      context.fillText("FINISH", 58, 182);

      if (!reduceMotion) {
        frame += 1;
        animationId = requestAnimationFrame(draw);
      }
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="route-map">
      <canvas
        ref={canvasRef}
        aria-label="Stylised route map showing the London Marathon journey from Greenwich to The Mall"
        role="img"
      />
      <div className="route-map__caption" aria-hidden="true">
        <span>South-east London</span>
        <span>Central London</span>
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
              <img
                src="/kate-hero.png"
                alt="Illustration of Kate running with an outstretched arm and a joyful smile"
              />
            </div>
            <figcaption>Training now · London bound</figcaption>
          </figure>

          <Flower className="hero-flower hero-flower--one" tone="cream" />
          <Flower className="hero-flower hero-flower--two" tone="coral" />
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
          <Flower className="why-flower" tone="purple" />
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
              <Flower className="garden-flower garden-flower--one" tone="cream" />
              <Flower className="garden-flower garden-flower--two" tone="coral" />
              <Flower className="garden-flower garden-flower--three" tone="purple" />
              <span className="garden-line garden-line--one" />
              <span className="garden-line garden-line--two" />
              <span className="garden-line garden-line--three" />
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
                An original illustrated route overview. Final 2027 event details
                should be checked against the organiser&apos;s latest guidance.
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
          <Flower className="donate-flower donate-flower--one" tone="cream" />
          <Flower className="donate-flower donate-flower--two" tone="coral" />
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
        <img
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
