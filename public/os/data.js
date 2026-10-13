// Every fact the three directions show. Project copy is taken from each repo's README;
// interests, milestones and the playlist are the original site's own data.

export const PROJECTS = {
  launchguard: {
    key: 'launchguard', n: '01', title: 'LaunchGuard', kind: 'PROJECT', stack: ['Rust', 'Podman', 'Trivy', 'OSV-Scanner', 'Ollama'],
    status: 'In development. Phases 1 and 2 audit and plan only.',
    url: 'https://bananatruck.github.io/launchguard/', host: 'bananatruck.github.io/launchguard',
    source: 'https://github.com/bananatruck/launchguard', image: '/project-previews/launchguard.webp',
    tagline: 'A local-first deployment intelligence platform for unfinished software projects.',
    summary: 'LaunchGuard inspects a local repository or GitHub URL, works out how the project is built, normalizes security findings, tests it in an isolated environment, and generates a reviewable deployment pull request.',
    points: [
      ['Deterministic evidence first', 'Manifests, scanners, tests and health checks are authoritative. AI explains and suggests repairs.'],
      ['Constrained autonomy', 'The engine can iterate inside an approved sandbox, but it cannot approve commands, credentials, publication or paid resources.'],
      ['No unknown code on the host', 'Builds run through a rootless OCI runtime with a staged workspace and an explicit resource policy.'],
      ['Everything is reviewable', 'Commands, generated files, findings, model proposals and verification results go into one audit record.']
    ],
    facts: [['TARGETS', 'React/Vite, Next.js, FastAPI, Rust Axum'], ['SCANNERS', 'Trivy + OSV-Scanner, one schema'], ['RUNTIME', 'Rootless Podman'], ['OUTCOME', 'A user-approved pull request']]
  },
  logistics: {
    key: 'logistics', n: '02', title: 'JM Global Logistics', kind: 'CLIENT WORK', stack: ['React', 'Vite', 'Web3Forms'],
    status: 'Live production site for the client.',
    url: 'https://www.jmgloballogistics.co.in/', host: 'jmgloballogistics.co.in',
    source: 'https://github.com/bananatruck/jmgloballogistics', image: '/project-previews/jm-global-logistics.webp',
    tagline: 'A five-page marketing site for a shipping company, with quote and tracking flows.',
    summary: 'Production website for JM Global Logistics. The home page carries the hero, a quote panel, the network and a service preview; the quote and contact forms post through Web3Forms.',
    points: [
      ['Home', 'Hero, quote panel, network and service preview.'],
      ['Specifications', 'Container specs with imperial and metric conversion.'],
      ['Quote flow', 'A quote panel and modal backed by a small Web3Forms client.'],
      ['About, Services, Contact', 'The rest of the five pages, sharing one layout and chrome.']
    ],
    facts: [['TYPE', 'Client site'], ['PAGES', '5'], ['STACK', 'React + Vite'], ['FORMS', 'Web3Forms']]
  },
  gates: {
    key: 'gates', n: '03', title: 'G.A.T.E.S.', kind: 'RESEARCH', stack: ['Python', 'pytest', 'Ollama'],
    status: 'Gate 1 measured on a live scaffold. Gates 2 and 3 evaluated offline. Benchmark run planned, not yet run.',
    url: 'https://portfolio-liart-three-33.vercel.app/research', host: 'portfolio/research',
    source: 'https://github.com/bananatruck/gates', image: '/project-previews/gates.webp',
    tagline: 'A portable validity layer for autonomous research agents.',
    summary: 'Research scaffolds publish numbers their experiments never produced. In the scaffold we audited, the host cut experiment output to 1,000 characters before any agent read it, and the crash marker went with it. G.A.T.E.S. treats that as an information-flow defect and closes the channel at three points.',
    points: [
      ['Gate 1 / execution validity', 'Did this code run, and did this run produce the reported numbers? Complete, measured on a live scaffold.'],
      ['Gate 2 / source-result coherence', 'Are results inside their bounds, consistent, and produced the way the plan said? Built and evaluated offline.'],
      ['Gate 3 / report validity', 'Does every number and citation in the manuscript trace to something that exists? Built and evaluated offline.']
    ],
    facts: [['ROLE', 'Research assistant, CSULB'], ['GATES', '3'], ['LIVE CAMPAIGN', 'Gate 1 A/B'], ['MODEL', 'deepseek-v4-flash']],
    table: {
      caption: 'Gate 1 on a live scaffold, one controlled A/B campaign',
      head: ['Measure', 'Gate 1 on', 'Gate 1 off'],
      rows: [
        ['Required key/value pairs delivered downstream', '40/40', '0/40'],
        ['Attempts delivering all four required values', '10/10', '0/10'],
        ['Paper claims traceable to the registry', '28/29', '0/11']
      ]
    }
  },
  "devflow": {"key": "devflow", "n": "04", "title": "DevFlow Agent", "kind": "PROJECT", "stack": ["Python", "FastAPI", "LangGraph"], "url": null, "host": "github.com/bananatruck/DevFlow", "source": "https://github.com/bananatruck/DevFlow", "image": null, "tagline": "A LangGraph workflow that turns a feature request into a plan, patch, validation pass and summary.", "summary": "A LangGraph workflow that turns a feature request into a plan, patch, validation pass and summary.", "points": [["The loop", "The graph runs through planning, a checklist, execution, validation and a summary. A retry path handles failed work."], ["The interface", "FastAPI exposes the workflow. The repository also has a Next.js dashboard shell."]]},
  "docweave": {"key": "docweave", "n": "05", "title": "DocWeave", "kind": "PROJECT", "stack": ["Go", "PostgreSQL", "Prometheus"], "url": "https://bananatruck.github.io/docweave/", "host": "bananatruck.github.io/docweave", "source": "https://github.com/bananatruck/docweave", "image": "/project-previews/docweave.webp", "tagline": "A documentation crawler with leased work queues, host rate limits and observability for distributed runs.", "summary": "A documentation crawler with leased work queues, host rate limits and observability for distributed runs.", "points": []},
  "employmentmaxxing": {"key": "employmentmaxxing", "n": "06", "title": "Employmentmaxxing", "kind": "PROJECT", "stack": ["Python", "FastAPI", "SQLite"], "url": null, "host": "github.com/bananatruck/employmentmaxxing", "source": "https://github.com/bananatruck/employmentmaxxing", "image": null, "tagline": "A self-hosted job search tracker that collects early-career listings, checks apply links and tracks applications.", "summary": "A self-hosted job search tracker that collects early-career listings, checks apply links and tracks applications.", "points": [["Listings", "The backend collects jobs from company career sources and filters for US early-career roles."], ["Link checks", "It checks direct application URLs and deactivates expired postings."], ["A place to keep track", "A Kanban board follows applications from interest through interview and offer."]]},
  "hubris": {"key": "hubris", "n": "07", "title": "Hubris", "kind": "PROJECT", "stack": ["React Native", "TypeScript", "SQLite"], "url": "https://bananatruck.github.io/Hubris/", "host": "bananatruck.github.io/Hubris", "source": "https://github.com/bananatruck/Hubris", "image": "/project-previews/hubris.webp", "tagline": "A personal activity and habit tracker across a mobile app and browser extension.", "summary": "A personal activity and habit tracker across a mobile app and browser extension.", "points": []},
  "barter": {"key": "barter", "n": "08", "title": "Barter", "kind": "PROJECT", "stack": ["React", "Marketplace", "Community"], "url": "https://bananatruck.github.io/Barter/", "host": "bananatruck.github.io/Barter", "source": "https://github.com/bananatruck/Barter", "image": "/project-previews/barter.webp", "tagline": "A social marketplace for posting items, finding useful things and following a community feed.", "summary": "A social marketplace for posting items, finding useful things and following a community feed.", "points": []},
  "fablefrog": {"key": "fablefrog", "n": "09", "title": "FableFrog", "kind": "HACKATHON", "stack": ["Python", "Gradio", "ElevenLabs"], "url": "https://devpost.com/software/storyteller-ai-h7ro1v", "host": "devpost.com", "source": "https://github.com/bananatruck/FableFrog", "image": null, "tagline": "An early storytelling prototype that lets a child choose plot turns while a narrator speaks the story aloud.", "summary": "An early storytelling prototype that lets a child choose plot turns while a narrator speaks the story aloud.", "points": [["A collaborative story", "The storyteller prompt stops at plot checkpoints and asks the child what should happen next."], ["Spoken replies", "The prototype sends finished replies to ElevenLabs for narration."], ["Prototype status", "The GitHub repository is an early snapshot. The hackathon demo is documented separately on Devpost."]]},
  "almanack": {"key": "almanack", "n": "10", "title": "Almanack", "kind": "PROJECT", "stack": ["TypeScript", "Design", "Media"], "url": "https://bananatruck.github.io/almanack/", "host": "bananatruck.github.io/almanack", "source": "https://github.com/bananatruck/almanack", "image": "/project-previews/almanack.webp", "tagline": "A place to keep ratings, reviews and lists for films, books, games, manga and music together.", "summary": "A place to keep ratings, reviews and lists for films, books, games, manga and music together.", "points": []},
  "clanker": {"key": "clanker", "n": "11", "title": "clanker.tracker", "kind": "PROJECT", "stack": ["TypeScript", "Browser extension", "Local-first"], "url": "https://bananatruck.github.io/clanker.tracker/", "host": "bananatruck.github.io/clanker.tracker", "source": "https://github.com/bananatruck/clanker.tracker", "image": "/project-previews/clanker.webp", "tagline": "A local browser extension for job applications, with resume matching and an idle RPG tucked into the process.", "summary": "A local browser extension for job applications, with resume matching and an idle RPG tucked into the process.", "points": []}
};

export const PROFILE = {
  bio: 'Creatively enriched software developer who tries to build useful applications.',
  links: [
    ['LETTERBOXD', 'https://letterboxd.com/TommyWiseauo/'],
    ['MEDIUM', 'https://medium.com/@wanderingstoicist'],
    ['MYANIMELIST', 'https://myanimelist.net/profile/Kenshai'],
    ['POKEMON SHOWDOWN', 'https://play.pokemonshowdown.com/users/canihave5dollars']
  ],
  aside: '"I use Arch btw"',
  avatar: '/images/Mori-pfp.webp',
  email: 'keshav.jmgl@gmail.com',
  linkedin: 'https://www.linkedin.com/in/keshavjindal04/',
  github: 'https://github.com/bananatruck',
  resume: '/keshav-jindal-resume.pdf'
};

// Shelves, in the order the original about page showed them.
export const SHELVES = [
  { key: 'hobbies', label: 'HOBBIES', items: [
    { title: 'Writing', sub: 'Essays & Stories', image: '/images/writing.webp' },
    { title: 'Photography', sub: 'Street & Nature', image: '/images/photography.webp' },
    { title: 'Art', sub: 'Drawing & Design', image: '/images/art.webp' },
    { title: 'Tech', sub: 'Building & Tinkering', image: '/images/tech.webp' }
  ] },
  { key: 'cinema', label: 'CINEMA', items: [
    { title: 'Dead Poets Society', sub: '1989', image: '/images/dead-poets-society.webp' },
    { title: 'Perfect Blue', sub: '1997', image: '/images/perfect-blue.webp' },
    { title: 'Good Will Hunting', sub: '1997', image: '/images/good-will-hunting.webp' },
    { title: 'Dune: Part Two', sub: '2024', image: '/images/dune-2.webp' }
  ] },
  { key: 'manga', label: 'MANGA', items: [
    { title: 'Vagabond', sub: 'Takehiko Inoue', image: '/images/Vagabond.webp' },
    { title: 'The Climber', sub: "Shin'ichi Sakamoto", image: '/images/The-climber.webp' },
    { title: 'Berserk', sub: 'Kentaro Miura', image: '/images/berserk.webp' },
    { title: 'Kingdom', sub: 'Yasuhisa Hara', image: '/images/Kingdom.webp' }
  ] },
  { key: 'anime', label: 'ANIME', items: [
    { title: 'Orb: On the Movements of the Earth', sub: '2024', image: '/images/Orb.webp' },
    { title: 'Vinland Saga', sub: '2019', image: '/images/Vinland-Saga.webp' },
    { title: 'Neon Genesis Evangelion', sub: '1995', image: '/images/evangelion.webp' },
    { title: 'Hunter X Hunter', sub: '2011', image: '/images/hunter-x-hunter.webp' }
  ] },
  { key: 'tv', label: 'TV', items: [
    { title: 'Mr Robot', sub: '2015', image: '/images/mr-robot.webp' },
    { title: 'Breaking Bad', sub: '2008', image: '/images/Breaking-bad.webp' },
    { title: 'Better Call Saul', sub: '2015', image: '/images/better-call-saul.webp' },
    { title: 'Game of Thrones', sub: '2011', image: '/images/game-of-thrones.webp' }
  ] },
  { key: 'music', label: 'MUSIC', items: [
    { title: 'Radiohead', sub: 'OK Computer', image: '/images/radiohead.webp' },
    { title: 'Black Country, New Road', sub: 'Ants From Up There', image: '/images/ants-from-up-there.webp' },
    { title: 'Masayoshi Takanaka', sub: 'All Of Me', image: '/images/Masayoshi-Takanaka.webp' },
    { title: 'Pink Floyd', sub: 'Dark Side of the Moon', image: '/images/Pink-Floyd.webp' }
  ] },
  { key: 'games', label: 'GAMES', items: [
    { title: 'Disco Elysium', sub: '2019', image: '/images/disco-elysium.webp' },
    { title: 'Super Mario Odyssey', sub: '2017', image: '/images/super-mario-odyssey.webp' },
    { title: 'Pokemon', sub: 'the whole series', image: '/images/pokemon.webp' },
    { title: 'Slay the Spire 2', sub: '2026', image: '/images/slay-the-spire-2.webp' }
  ] }
];

export const MILESTONES = [
  ['2026', 'Research Assistant, Autonomous Research Agents', 'Building execution-grounded pipelines at CSULB so research agents can only report numbers they actually measured. Paper pending peer review.'],
  ['2025', 'Founder and President of a Startup', 'Trying to build something new and foster a better computer science community in my college.'],
  ['2024', 'First Hackathon', 'Saw the inspiring CS community for the first time ever and built one of the coolest projects I ever have.'],
  ['2023', 'CS Undergrad', 'Enrolled into my CS undergrad Bachelors and started my formal journey into computer science.'],
  ['2022', 'Small Internships', 'Helping out local companies to practice more experience before college.'],
  ['2021', 'Coding Adventure', 'Learning how to code finally through online tutorials and high school classes.'],
  ['2016', 'Android app modding', 'Getting back into CS as an android app modder and helping random indie devs.'],
  ['2013', 'Android Rooting and ROM ricing', 'Learning to root android devices to install custom operating skins of android to really get more into CS.'],
  ['2012', 'C++ snake game', 'Made my first project ever and got into programming.']
];

export const PLAYLIST = [
  ['01 (01) Airbag.mp3', 'Airbag', 'Radiohead'],
  ['02 (02) Paranoid Android.mp3', 'Paranoid Android', 'Radiohead'],
  ['03 (03) Subterranean Homesick Alien.mp3', 'Subterranean Homesick Alien', 'Radiohead'],
  ['05 (05) Let Down.mp3', 'Let Down', 'Radiohead'],
  ['06 (06) Karma Police.mp3', 'Karma Police', 'Radiohead'],
  ['10 (10) No Surprises.mp3', 'No Surprises', 'Radiohead'],
  ['04 Fake Plastic Trees.mp3', 'Fake Plastic Trees', 'Radiohead'],
  ['01 The Adults Are Talking.mp3', 'The Adults Are Talking', 'The Strokes'],
  ['02 Selfless.mp3', 'Selfless', 'The Strokes'],
  ['09 Ode To The Mets.mp3', 'Ode To The Mets', 'The Strokes'],
  ['4 Time.mp3', 'Time', 'Pink Floyd'],
  ['5 The Great Gig in the Sky.mp3', 'The Great Gig in the Sky', 'Pink Floyd'],
  ['7 Us and Them.mp3', 'Us and Them', 'Pink Floyd'],
  ['Masayoshi Takanaka - Chill Me Out - 1982.mp3', 'Chill Me Out', 'Masayoshi Takanaka'],
  ['Masayoshi Takanaka -Thunderstorm - 1981.mp3', 'Thunderstorm', 'Masayoshi Takanaka'],
  ['01 Space Oddity David Bowie.mp3', 'Space Oddity', 'David Bowie'],
  ['21. George Michael - Careless Whisper.mp3', 'Careless Whisper', 'George Michael'],
  ["Jeff Buckley - Grace - 07 - Lover, You Should've Come Over.mp3", "Lover, You Should've Come Over", 'Jeff Buckley'],
  ['4. 11. Shihoko Hirata - Heartbeat, Heartbreak.mp3', 'Heartbeat, Heartbreak', 'Shihoko Hirata']
].map(([file, title, artist]) => ({ src: `/music/${encodeURIComponent(file)}`, title, artist }));

// The original emulator's cartridges, from secret-game/roms/manifest.json.
export const CARTRIDGES = [
  { file: 'pokemon-firered.zip', label: 'Pokemon FireRed', mb: 5.3, cover: '/secret-game/boot/firered.gif' },
  { file: 'pokemon-radical-red.zip', label: 'Pokemon Radical Red', mb: 17.3, cover: '/images/rom-hacks/radical-red.webp' },
  { file: 'pokemon-unbound.zip', label: 'Pokemon Unbound', mb: 19.5, cover: '/images/rom-hacks/unbound.webp' },
  { file: 'pokemon-adventure-red-chapter.zip', label: 'Pokemon Adventure Red Chapter', mb: 13.9, cover: '/images/rom-hacks/adventures-red.webp' },
  { file: 'pokemon-team-rocket-johto.zip', label: 'Pokemon Team Rocket: Johto', mb: 17.1, cover: '/images/rom-hacks/team-rocket.webp' }
];

// Boot animations are picked at random on power-on, as the original does.
export const BOOTS = ['firered', 'emerald', 'heartgold', 'platinum', 'black', 'white'].map(k => `/secret-game/boot/${k}.gif`);
