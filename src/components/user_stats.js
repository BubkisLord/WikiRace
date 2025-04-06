import React from "react";

export default function UserStats({ stats }) {
  var tips = [
    "Wikipedia has over 6.8 million articles in English alone (as of 2024).",
    "Every link in Wikipedia is internal or an external reference, but only internal links count in Wiki races.",
    "Wikipedia articles follow a hierarchical structure, moving from broad topics to specifics.",
    "Disambiguation pages can be both a shortcut and a dead end, depending on context.",
    "Portal pages (e.g., Portal:Science) are usually dead ends in races.",
    "Some articles are protected, meaning they can't be edited, but their links are still functional.",
    "Redirect pages can save time — they automatically forward you to the intended page.",
    "Wikipedia’s first link in almost every article often leads to a broader concept (like “Philosophy”).",
    "The average Wikipedia article has 100–300 internal links.",
    "Wikipedia has a “Random article” button, but it's rarely useful in structured races.",
    "Start from general topics to narrow down quickly.",
    "Open potential links in new tabs to compare paths in parallel.",
    "Use Ctrl+F to find keywords on a page fast.",
    "Avoid country-specific links unless your target is geographic.",
    "Recognise patterns: sciences often lead through related sciences.",
    "Prefer “List of...” pages when searching for examples or categories.",
    "Stay calm — rushing often leads to dead ends.",
    "Ignore citation links ([1], [2]) — they're external.",
    "Use “See also” sections, they are usually rich in useful links.",
    `Pre-map logical link hierarchies: e.g., "Disease" → "Infectious disease" → "Specific virus".`,
    `Learn high-traffic pivot pages, like "Science", "Technology", "History", which connect many domains.`,
    "Understand meta-structures: taxonomies (for biology), timelines (for history), filmographies (for cinema).",
    "Prioritise function over familiarity: pick a route with the most outbound links, not the one you know best.",
    `Predict redirects — knowing common synonyms increases speed (e.g., "Heart attack" redirects to "Myocardial infarction").`,
    "Exploit template navboxes at the bottom of articles for tightly clustered topics.",
    "Track common disambiguation paths — some ambiguous terms offer a backdoor route.",
    "If you get stuck, step back to broader categories rather than pushing into specifics.",
    "Use language patterns: scientific terms often follow Latin/Greek roots — predict link names accordingly.",
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
      <img
        alt=""
        src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
        className="absolute inset-0 -z-10 size-full object-cover object-right md:object-center"
      />
      <div
        aria-hidden="true"
        className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="aspect-1097/845 w-[68.5625rem] bg-linear-to-tr from-[#ff4694] to-[#776fff] opacity-20"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="aspect-1097/845 w-[68.5625rem] bg-linear-to-tr from-[#ff4694] to-[#776fff] opacity-20"
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            Your Statistics
          </h2>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8">
            Here are your current statistics at a glance. Keep track of your
            progress and achievements as you keep playing!
          </p>
          <p className="mt-4 text-lg font-medium text-gray-300 min-h-[4rem]">
            Tip: {randomTip}
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="flex flex-col-reverse gap-1">
                <dt className="text-base/7 text-gray-300">{stat.name}</dt>
                <dd className="text-4xl font-semibold tracking-tight text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
