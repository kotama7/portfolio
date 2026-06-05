const functions = require('firebase-functions');
const { initializeApp, getApps, getApp } = require('firebase/app');
const { getAI, getGenerativeModel, VertexAIBackend } = require('@firebase/ai');

let app;
if (!getApps().length) {
  app = initializeApp({
    apiKey: process.env.FIREBASE_WEB_API_KEY,
    projectId: process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID,
    appId: process.env.FIREBASE_APP_ID,
  });
} else {
  app = getApp();
}

const ai = getAI(app, { backend: new VertexAIBackend() });
const model = getGenerativeModel(ai, { model: 'gemini-1.5-pro' });

// --- Security helpers ---
const ALLOWED_ORIGINS = [
  'https://fir-939f3.web.app',
  'https://fir-939f3.firebaseapp.com',
];
if (process.env.FUNCTIONS_EMULATOR) {
  ALLOWED_ORIGINS.push('http://localhost:3000', 'http://localhost:5000');
}

function setCors(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
  }
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Max-Age', '3600');
}

function handlePreflight(req, res) {
  if (req.method === 'OPTIONS') {
    setCors(req, res);
    res.status(204).send('');
    return true;
  }
  return false;
}

function rejectMethod(req, res, allowed) {
  if (!allowed.includes(req.method)) {
    setCors(req, res);
    res.status(405).json({ error: 'Method not allowed' });
    return true;
  }
  return false;
}

const MAX_INPUT_LENGTH = 500;

exports.selectFunction = functions.https.onRequest(async (req, res) => {
  if (handlePreflight(req, res)) return;
  if (rejectMethod(req, res, ['POST'])) return;
  setCors(req, res);

  const text = typeof req.body.text === 'string' ? req.body.text.slice(0, MAX_INPUT_LENGTH) : '';
  if (!text) {
    res.status(400).json({ error: 'No text provided' });
    return;
  }

  const lang = (req.body.lang || 'en').toLowerCase() === 'ja' ? 'ja' : 'en';
  const basePrompt =
    'Possible functions include:\n' +
    '- bioGraph: returns the biography graph.\n' +
    '- skillTree: returns the skill hierarchy.\n' +
    '- interestGraph: returns an interest graph.\n' +

    '- contactInfo: returns contact information.\n' +
    '- portfolioSummary: gives a summary of the portfolio.\n' +
    '- otherSiteLinks: returns links to other sites.\n' +
    '- profileInfo: returns life summary, award, qualifications and lab info.\n' +
    '- favoriteLanguage: tells my favorite programming language.\n' +
    '- thesisSummary: returns the Encouragement Award thesis summary.\n' +
    '- fusepThesisSummary: returns the FuSEP thesis summary.\n' +
    '- majorProjects: returns a list of major projects.\n' +
    '- contributions: returns open-source contributions.\n' +
    '- researchWorks: returns research works and publications.\n' +
    '- greeting: responds to greetings like hello, hi, hey.\n' +
    '- thankYou: responds to thank-you messages.\n' +
    '- goodbye: responds to farewell messages.\n' +
    '- help: lists available topics the user can ask about.\n' +
    '- aboutThisSite: explains how this portfolio site was built.\n' +
    '- qualifications: returns education and qualifications.\n' +
    '- workExperience: returns internship and work experience.\n' +
    '- awards: returns awards and achievements.\n' +
    '- futureGoals: returns future career goals and plans.\n' +
    '- spokenLanguages: returns spoken languages.\n' +
    '- devEnvironment: returns development tools and technologies used.\n' +
    'Respond with only the function name that best matches the user\'s request.';
  const prompt =
    lang === 'ja'
      ? `あなたはユーザーのリクエストを関数名に対応付けるアシスタントです。\n${basePrompt}`
      : `You are a helpful assistant that maps user requests to function names.\n${basePrompt}`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `${prompt}\n${text}` }] }],
      generationConfig: { maxOutputTokens: 10, temperature: 0 }
    });
    const functionName = result.response.text().trim();
    res.json({ function: functionName });
  } catch (err) {
    console.error(err);
    const normalized = text.toLowerCase();
    const fallbackMap = [
      { keyword: 'bio', func: 'bioGraph' },
      { keyword: '経歴', func: 'bioGraph' },
      { keyword: 'skill', func: 'skillTree' },
      { keyword: 'スキル', func: 'skillTree' },
      { keyword: 'interest', func: 'interestGraph' },
      { keyword: '興味', func: 'interestGraph' },

      { keyword: 'contact', func: 'contactInfo' },
      { keyword: '連絡', func: 'contactInfo' },
      { keyword: 'portfolio', func: 'portfolioSummary' },
      { keyword: 'ポートフォリオ', func: 'portfolioSummary' },
      { keyword: 'link', func: 'otherSiteLinks' },
      { keyword: 'リンク', func: 'otherSiteLinks' },
      { keyword: 'external', func: 'otherSiteLinks' },
      { keyword: 'profile', func: 'profileInfo' },
      { keyword: 'プロフィール', func: 'profileInfo' },
      { keyword: 'intro', func: 'briefIntro' },
      { keyword: '自己紹介', func: 'briefIntro' },
      { keyword: 'favorite programming language', func: 'favoriteLanguage' },
      { keyword: 'favorite language', func: 'favoriteLanguage' },
      { keyword: '好きな言語', func: 'favoriteLanguage' },
      { keyword: 'thesis', func: 'thesisSummary' },
      { keyword: '論文要約', func: 'thesisSummary' },
      { keyword: 'fusep', func: 'fusepThesisSummary' },
      { keyword: '夏研', func: 'fusepThesisSummary' },
      { keyword: 'project', func: 'majorProjects' },
      { keyword: 'プロジェクト', func: 'majorProjects' },
      { keyword: 'contribution', func: 'contributions' },
      { keyword: 'コントリビューション', func: 'contributions' },
      { keyword: 'oss', func: 'contributions' },
      { keyword: 'research', func: 'researchWorks' },
      { keyword: '研究', func: 'researchWorks' },
      { keyword: 'publication', func: 'researchWorks' },
      { keyword: '功績', func: 'researchWorks' },

      // Conversation functions
      { keyword: 'hello', func: 'greeting' },
      { keyword: 'hi', func: 'greeting' },
      { keyword: 'hey', func: 'greeting' },
      { keyword: 'こんにちは', func: 'greeting' },
      { keyword: 'やあ', func: 'greeting' },
      { keyword: 'はじめまして', func: 'greeting' },
      { keyword: 'thanks', func: 'thankYou' },
      { keyword: 'thank you', func: 'thankYou' },
      { keyword: 'ありがとう', func: 'thankYou' },
      { keyword: '感謝', func: 'thankYou' },
      { keyword: 'bye', func: 'goodbye' },
      { keyword: 'goodbye', func: 'goodbye' },
      { keyword: 'さようなら', func: 'goodbye' },
      { keyword: 'またね', func: 'goodbye' },
      { keyword: 'help', func: 'help' },
      { keyword: 'ヘルプ', func: 'help' },
      { keyword: '何が聞ける', func: 'help' },
      { keyword: 'what can', func: 'help' },
      { keyword: 'about this site', func: 'aboutThisSite' },
      { keyword: 'how was this made', func: 'aboutThisSite' },
      { keyword: 'このサイト', func: 'aboutThisSite' },
      { keyword: '技術スタック', func: 'aboutThisSite' },

      // Content functions
      { keyword: 'qualification', func: 'qualifications' },
      { keyword: '資格', func: 'qualifications' },
      { keyword: '学歴', func: 'qualifications' },
      { keyword: 'internship', func: 'workExperience' },
      { keyword: 'work experience', func: 'workExperience' },
      { keyword: 'インターン', func: 'workExperience' },
      { keyword: '職歴', func: 'workExperience' },
      { keyword: 'award', func: 'awards' },
      { keyword: '受賞', func: 'awards' },
      { keyword: '表彰', func: 'awards' },
      { keyword: 'goal', func: 'futureGoals' },
      { keyword: 'future', func: 'futureGoals' },
      { keyword: '目標', func: 'futureGoals' },
      { keyword: '将来', func: 'futureGoals' },
      { keyword: 'spoken language', func: 'spokenLanguages' },
      { keyword: 'what language do you speak', func: 'spokenLanguages' },
      { keyword: '話せる言語', func: 'spokenLanguages' },
      { keyword: '何語', func: 'spokenLanguages' },
      { keyword: 'tool', func: 'devEnvironment' },
      { keyword: 'environment', func: 'devEnvironment' },
      { keyword: 'setup', func: 'devEnvironment' },
      { keyword: '開発環境', func: 'devEnvironment' },
      { keyword: 'ツール', func: 'devEnvironment' },
    ];
    const matched = fallbackMap.find(({ keyword }) =>
      normalized.includes(keyword)
    );
    if (matched) {
      res.json({ function: matched.func, fallback: true });
    } else {
      res.status(500).json({ error: 'Failed to select function' });
    }
  }
});

// Automatically reply to the initial prompt shown in the chat UI
exports.autoReply = functions.https.onRequest((req, res) => {
  if (handlePreflight(req, res)) return;
  if (rejectMethod(req, res, ['GET', 'POST'])) return;
  setCors(req, res);

  const lang = (req.body.lang || 'en').toLowerCase() === 'ja' ? 'ja' : 'en';

  const replies = {
    ja: [
      `
    名古屋大学大学院情報学研究科情報システム学専攻の修士1年生（M1）の樹神宇徳です。2026年3月に学部を卒業し、同年4月に大学院に進学しました。\n
    研究テーマはHPC環境向けLLMを用いた汎用自律研究基盤（ARI: Autonomous Research Infrastructure）の構築です。\n
      `,
      `
    2026年4月より名古屋大学大学院に在学中です。2024年には学生論文コンテストで奨励賞を受賞しました。
      `,
    ],
    en: [
      `
    I am Takanori Kotama, a first-year M.S. student at Nagoya University Graduate School of Informatics (Information Systems). I received my B.S. in March 2026 and enrolled in the M.S. program in April 2026. My research focuses on ARI (Autonomous Research Infrastructure) — a general-purpose autonomous research platform for HPC environments.
      `,
      `
    I enrolled in the M.S. program at Nagoya University in April 2026. I won the Encouragement Award at the 2024 Nagoya University Student Paper Contest.
      `,
    ],
  };

  const candidates = replies[lang] || replies.en;
  const message = candidates[Math.floor(Math.random() * candidates.length)];
  res.json({ message });
});

// Provide profile details such as life summary, awards, qualifications and lab
exports.profileInfo = functions.https.onRequest((req, res) => {
  if (handlePreflight(req, res)) return;
  if (rejectMethod(req, res, ['GET', 'POST'])) return;
  setCors(req, res);

  const query = (typeof req.body.query === 'string' ? req.body.query : '').toLowerCase();

  const details = {
    summary:
      'Takanori Kotama is a first-year M.S. student in the Graduate School of Informatics (Information Systems) at Nagoya University. ' +
      'He received his B.S. from Nagoya University in March 2026 and enrolled in the M.S. program in April 2026. ' +
      'His research focuses on ARI (Autonomous Research Infrastructure) — a general-purpose autonomous research platform for HPC environments using LLMs. ' +
      'He has worked as a part-time data scientist at AIxtal Corporation (2023–present) and interned at Panasonic Connect (Sep 2024), USTC FuSEP, and RIKEN R-CCS, and has been a research part-timer at RIKEN R-CCS since November 2025. He was a member of the app development group "jack" from 2022 and its vice-president from 2023 to 2025.',
    award:
      'Encouragement Award at the 2024 Nagoya University Student Paper Contest for the paper "A quantitative definition of 青春 using large language models." BFT Inc. Corporate Award at JPHacks 2023 (Nagoya Block) for CalmEngine.',
    qualifications:
      'Bachelor of Science in Information Systems from Nagoya University (March 2026). Currently enrolled in the M.S. program at Nagoya University Graduate School of Informatics (April 2026–present). Applied Information Technology Engineer Examination (passed, Spring 2024). TOEIC L&R 790 (Sep 2024). TOEFL iBT 76 (May 2025).',
    lab:
      'Information Technology Center, Katagiri–Hoshino Laboratory at Nagoya University (advisor: Prof. Takahiro Katagiri; members include Assoc. Prof. Tetsuya Hoshino and Assistant Prof. Daichi Mukunoki).'
  };

  if (!query) {
    res.json(details);
    return;
  }

  if (Object.prototype.hasOwnProperty.call(details, query)) {
    res.json({ [query]: details[query] });
  } else {
    res.status(400).json({ error: 'Unknown query' });
  }
});

// Return a brief self-introduction
exports.briefIntro = functions.https.onRequest((req, res) => {
  if (handlePreflight(req, res)) return;
  if (rejectMethod(req, res, ['GET', 'POST'])) return;
  setCors(req, res);
  const intros = {
    ja: [
      `
    名古屋大学大学院情報学研究科情報システム学専攻M1の樹神宇徳です。2026年3月に学部を卒業し、同年4月に大学院に進学しました。\n
    研究テーマはHPC環境向けLLMを用いた汎用自律研究基盤（ARI: Autonomous Research Infrastructure）の構築です。\n
      `,
      `
    2026年4月より名古屋大学大学院に在学中です。2024年の学生論文コンテストで奨励賞を受賞しました。
      `,
    ],
    en: [
      `
    I'm Takanori Kotama, a first-year M.S. student at Nagoya University Graduate School of Informatics (Information Systems). I received my B.S. in March 2026 and enrolled in April 2026. My research focuses on ARI (Autonomous Research Infrastructure) — a general-purpose autonomous research platform for HPC environments.
      `,
      `
    I enrolled in the M.S. program at Nagoya University in April 2026. I won the Encouragement Award at the 2024 Nagoya University Student Paper Contest.
      `
    ]
  };

  const lang = (req.body.lang || 'en').toLowerCase();
  const candidates = intros[lang] || intros.en;
  const message = candidates[Math.floor(Math.random() * candidates.length)];
  res.json({ message });
});

// Return a summary of the Encouragement Award thesis
exports.thesisSummary = functions.https.onRequest((req, res) => {
  if (handlePreflight(req, res)) return;
  if (rejectMethod(req, res, ['GET', 'POST'])) return;
  setCors(req, res);
  const lang = (req.body.lang || 'en').toLowerCase();

  const summaries = {
    ja:
      '本論文では、文章の意外性・ポジティブさ・文法流暢性を情報エントロピーとして統合し「青春情報エントロピー」を提案した。' +
      '日本語BERTで推定した確率を用い、Llama-3-ELYZA-JP-8Bによる嗜好度との相関を36文で検証し、有意な弱い正相関(r=0.333, p=0.035)を確認した。' +
      '長文適用や概念多様性が課題だが、意外性と感情を情報理論で統合する枠組みとして有用性を示した。',
    en:
      'The thesis proposes "Youth Information Entropy" that sums the entropy of surprise, positivity and grammatical fluency. ' +
      'Probabilities estimated using a Japanese BERT model were validated against preference scores from Llama-3-ELYZA-JP-8B, ' +
      'showing a weak but significant positive correlation (r=0.333, p=0.035) across 36 sentences. ' +
      'While long texts and concept diversity remain challenges, it demonstrates the usefulness of integrating surprise and emotion via information theory.'
  };

  res.json({ summary: summaries[lang] || summaries.en });
});

// Return a summary of the FuSEP thesis
exports.fusepThesisSummary = functions.https.onRequest((req, res) => {
  if (handlePreflight(req, res)) return;
  if (rejectMethod(req, res, ['GET', 'POST'])) return;
  setCors(req, res);
  const lang = (req.body.lang || 'en').toLowerCase();

  const summaries = {
    ja:
      'Nb-Mo-Ta-W系高エントロピー合金の結晶エネルギーを高速かつ高精度に推定するため、機械学習ポテンシャルCrysEnergyModelを開発した。' +
      'CrystalGNNで16原子配置を処理し、FractionFNNで元素比を符号化、ConcatFNNで両情報を結合してエネルギーを予測する。' +
      '598点を含む計1049点で学習、198点で検証し、低エネルギー605点を追加して分布を補強した。' +
      'Optunaによる最適化でテストRMSEは0.00139eVに到達し、低エネルギーでは0.00054eVまで向上した。' +
      '大型系では誤差が拡大し過小・過大予測のバイアスが生じたが、組成空間全域を迅速に探索でき、合金設計を加速する手法となる。',
    en:
      'To rapidly and accurately estimate crystal energies of Nb-Mo-Ta-W high-entropy alloys, we developed a machine-learning potential called CrysEnergyModel. ' +
      'CrystalGNN processes 16-atom structures, FractionFNN encodes element ratios, and ConcatFNN merges both outputs to predict energy. ' +
      'Training used 1,049 structures including 598 quaternary compositions with 198 for validation and an additional 605 low-energy samples. ' +
      'Optuna hyperparameter tuning achieved a test RMSE of 0.00139 eV and 0.00054 eV for low-energy data. ' +
      'Although errors grew for larger supercells, the model enables fast screening across the composition space and can accelerate alloy design.'
  };

  res.json({ summary: summaries[lang] || summaries.en });
});

// Return external links to other profiles
exports.otherSiteLinks = functions.https.onRequest((req, res) => {
  if (handlePreflight(req, res)) return;
  if (rejectMethod(req, res, ['GET'])) return;
  setCors(req, res);

  res.json({
    github: 'https://github.com/kotama7',
    researchmap: 'https://researchmap.jp/kotama_takanori',
    speakerdeck: 'https://speakerdeck.com/kotama7',
    researchgate: 'https://www.researchgate.net/profile/Takanori-Kotama',
    qiita: 'https://qiita.com/kotama7',
    zenn: 'https://zenn.dev/kotama7',
    x: 'https://x.com/kotama8',
    linkedin: 'https://www.linkedin.com/in/takanori-kotama-b785b52a4/',
    orcid: 'https://orcid.org/0009-0001-0749-5486'
  });
});

// Return favorite programming language
exports.favoriteLanguage = functions.https.onRequest((req, res) => {
  if (handlePreflight(req, res)) return;
  if (rejectMethod(req, res, ['GET', 'POST'])) return;
  setCors(req, res);
  const lang = (req.body.lang || 'en').toLowerCase();
  const messages = {
    ja: '好きなプログラミング言語は Python です。読みやすく豊富なライブラリがあります。',
    en: 'My favorite programming language is Python because of its readability and rich ecosystem.'
  };
  res.json({ message: messages[lang] || messages.en });
});

// Return major projects
exports.majorProjects = functions.https.onRequest((req, res) => {
  if (handlePreflight(req, res)) return;
  if (rejectMethod(req, res, ['GET', 'POST'])) return;
  setCors(req, res);
  const lang = (req.body.lang || 'en').toLowerCase();
  const projects = {
    en: [
      { name: 'ARI', description: 'Autonomous Research Infrastructure — fully general autonomous research platform for any scientific domain and any computing environment (PC to supercomputer). BFTS/MCP/local-LLM support. MIT license.', url: 'https://github.com/kotama7/ARI', language: 'Python', stars: 0 },
      { name: 'AI-Scientist-v2-HPC', description: 'HPC-optimized adaptation of AI Scientist v2 with Singularity containers and BFTS for automated scientific paper generation.', url: 'https://github.com/kotama7/AI-Scientist-v2-HPC', language: 'Python', stars: 17 },
      { name: 'HPC-AutoResearch', description: 'Framework for automated research workflows in HPC environments using BFTS tree search, Singularity containers, and LLM integration.', url: 'https://github.com/kotama7/HPC-AutoResearch', language: 'Python', stars: 3 },
      { name: 'seisyun_information_entropy', description: "Computational framework measuring 'youth' through linguistic analysis using BERT and information theory.", url: 'https://github.com/kotama7/seisyun_information_entropy', language: 'Python', stars: 2 },
      { name: 'portfolio', description: 'Chat-UI portfolio website built with React and TypeScript.', url: 'https://github.com/kotama7/portfolio', language: 'TypeScript', stars: 1 },
    ],
    ja: [
      { name: 'ARI', description: 'あらゆる科学分野・あらゆる計算環境（PC〜スパコン）で動く完全汎用自律研究基盤。BFTS・MCP対応・ローカルLLM対応。MITライセンス。', url: 'https://github.com/kotama7/ARI', language: 'Python', stars: 0 },
      { name: 'AI-Scientist-v2-HPC', description: 'AI Scientist v2のHPC特化版。Singularityコンテナ+BFTSによる自動科学論文生成。', url: 'https://github.com/kotama7/AI-Scientist-v2-HPC', language: 'Python', stars: 17 },
      { name: 'HPC-AutoResearch', description: 'BFTS木探索・Singularityコンテナ・LLM統合によるHPC環境での自動研究ワークフローフレームワーク。', url: 'https://github.com/kotama7/HPC-AutoResearch', language: 'Python', stars: 3 },
      { name: 'seisyun_information_entropy', description: 'BERTと情報理論を用いた「青春」の定量分析フレームワーク。', url: 'https://github.com/kotama7/seisyun_information_entropy', language: 'Python', stars: 2 },
      { name: 'portfolio', description: 'React+TypeScriptで構築したチャットUIポートフォリオサイト。', url: 'https://github.com/kotama7/portfolio', language: 'TypeScript', stars: 1 },
    ],
  };
  res.json({ projects: projects[lang] || projects.en });
});

// Unified endpoint for LLM agents
// GET/POST ?lang=en|ja&section=profile|bio|skills|interests|theses|projects|contributions|research|links|contact
// If section is omitted, returns all sections.
exports.agent = functions.https.onRequest((req, res) => {
  if (handlePreflight(req, res)) return;
  if (rejectMethod(req, res, ['GET', 'POST'])) return;
  setCors(req, res);
  const params = req.method === 'GET' ? req.query : req.body;
  const lang = ((params && params.lang) || 'en').toLowerCase();
  const section = params && params.section ? params.section.toLowerCase() : null;

  const profile = {
    name: 'Takanori Kotama',
    affiliation: lang === 'ja'
      ? '名古屋大学大学院 情報学研究科 情報システム学専攻 修士課程 M1'
      : 'Graduate School of Informatics, Information Systems, Nagoya University (M.S. 1st year)',
    lab: lang === 'ja'
      ? '情報基盤センター 片桐・星野研究室（主指導：片桐 孝洋 教授）'
      : 'Information Technology Center, Katagiri–Hoshino Laboratory (advisor: Prof. Takahiro Katagiri)',
    bsDegree: '2026-03',
    msEnrolled: '2026-04',
    research: lang === 'ja'
      ? 'HPC環境向けLLMを用いた汎用自律研究基盤（ARI: Autonomous Research Infrastructure）'
      : 'ARI (Autonomous Research Infrastructure) — general-purpose autonomous research platform for HPC environments using LLMs',
    awards: lang === 'ja'
      ? ['2024年 名古屋大学学生論文コンテスト 奨励賞', 'JPHacks 2023 名古屋ブロック 株式会社BFT 企業賞（CalmEngine）']
      : ['Encouragement Award at the 2024 Nagoya University Student Paper Contest', 'BFT Inc. Corporate Award at JPHacks 2023 (Nagoya Block) for CalmEngine'],
    contact: 'kotamatakanori2@gmail.com',
    orcid: 'https://orcid.org/0009-0001-0749-5486',
    researchmap: 'https://researchmap.jp/kotama_takanori',
  };

  const bio = [
    { year: 2003, event: lang === 'ja' ? '日本で出生' : 'Born in Japan' },
    { year: 2022, event: lang === 'ja' ? '名古屋大学情報学部入学' : 'Enrolled at Nagoya University (CS & Information Systems)' },
    { year: '2022-2025', event: lang === 'ja' ? 'アプリ開発団体jack（2022年加入・2023〜2025年 副代表）：Lightning Talk企画運営' : 'App-development group "jack" (member since 2022, Vice-President 2023–2025): organized Lightning Talk events' },
    { year: '2023', event: lang === 'ja' ? '第64回名大祭 Webチーフ（おみくじページ・キャンパスマップ等を担当）' : 'Web Chief of the 64th Nagoya University Festival (built the omikuji page, campus map, etc.)' },
    { year: '2023-present', event: lang === 'ja' ? 'アイクリスタル株式会社 Part-timeデータサイエンティスト（プロセスインフォマティクス）' : 'Part-time Data Scientist at AIxtal Corporation (process informatics)' },
    { year: '2024-03', event: lang === 'ja' ? 'JENESYS 2024 韓国（2024 韓・日学術文化及び青少年交流 大学生招聘研修、NIIED主催、3月10〜16日）' : 'JENESYS 2024 Korea (2024 Korea–Japan Academic, Cultural and Youth Exchange Program, hosted by NIIED, Mar 10–16)' },
    { year: '2024-09', event: lang === 'ja' ? 'パナソニック コネクト AIインターンシップ（生産現場向けAIソリューション、9月2〜13日）' : 'AI Internship at Panasonic Connect (manufacturing-site AI solutions, Sep 2–13)' },
    { year: '2024-07-08', event: lang === 'ja' ? 'USTC FuSEP夏季研究プログラム' : 'FuSEP Summer Researcher at USTC' },
    { year: 2024, event: lang === 'ja' ? '学生論文コンテスト奨励賞受賞' : 'Encouragement Award at Student Paper Contest' },
    { year: '2025-09', event: lang === 'ja' ? '理化学研究所R-CCS HPCインターン' : 'HPC Internship at RIKEN R-CCS AI for Science Team' },
    { year: '2025-11-present', event: lang === 'ja' ? '理化学研究所R-CCS 研究パートタイマー' : 'Research Part-timer at RIKEN R-CCS AI for Science Team' },
    { year: '2026-03', event: lang === 'ja' ? '名古屋大学学士課程修了（学士号取得）' : 'Received B.S. degree from Nagoya University' },
    { year: '2026-04', event: lang === 'ja' ? '名古屋大学大学院情報学研究科 修士課程 入学' : 'Enrolled in M.S. program at Nagoya University Graduate School of Informatics' },
  ];

  const skills = [
    { category: lang === 'ja' ? 'プログラミング' : 'Programming', items: ['Python', 'JavaScript'] },
    { category: lang === 'ja' ? 'フレームワーク・ライブラリ' : 'Frameworks & Libraries', items: ['PyTorch', 'OpenSpiel', 'LightGBM', 'TensorFlow (JPHacks 2023)'] },
    { category: lang === 'ja' ? 'ツール' : 'Tooling', items: ['Docker', 'CMake', 'MPI', 'CUDA'] },
    { category: 'HPC', items: [
      lang === 'ja' ? '並列化' : 'Parallelization',
      lang === 'ja' ? '分散学習' : 'Distributed training',
      lang === 'ja' ? 'GPUアクセラレーション' : 'GPU acceleration',
    ]},
    { category: lang === 'ja' ? '言語' : 'Languages', items: [
      lang === 'ja' ? '日本語（母語）' : 'Japanese (Native)',
      lang === 'ja' ? '英語（上級、TOEFL iBT 76・TOEIC 790）' : 'English (advanced, TOEFL iBT 76, TOEIC 790)',
      lang === 'ja' ? '中国語（中級）' : 'Chinese (intermediate)',
    ]},
  ];

  const interests = {
    research: lang === 'ja'
      ? ['HPC環境での自律的研究', 'LLMによる研究自動化', 'AI駆動の科学的発見', '強化学習・ゲーム理論']
      : ['Autonomous research in HPC environments', 'LLM-driven research automation', 'AI-driven scientific discovery', 'Reinforcement learning & game theory'],
  };

  const theses = [
    {
      title: lang === 'ja'
        ? '大規模言語モデルを用いた青春の定量的定義'
        : 'A quantitative definition of youth using large language models',
      label: lang === 'ja' ? '奨励賞論文' : 'Encouragement Award Thesis',
      summary: lang === 'ja'
        ? '文章の意外性・ポジティブさ・文法流暢性を情報エントロピーとして統合し「青春情報エントロピー」を提案。日本語BERTとLlama-3-ELYZA-JP-8Bで検証し有意な弱い正相関(r=0.333, p=0.035)を確認。'
        : 'Proposes "Youth Information Entropy" integrating surprise, positivity and fluency. Validated with Japanese BERT and Llama-3-ELYZA-JP-8B showing weak but significant positive correlation (r=0.333, p=0.035).',
    },
    {
      title: lang === 'ja'
        ? 'Nb-Mo-Ta-W系高エントロピー合金の機械学習ポテンシャル'
        : 'Machine-learning potential for Nb-Mo-Ta-W high-entropy alloys',
      label: 'FuSEP',
      summary: lang === 'ja'
        ? 'CrysEnergyModelを開発。CrystalGNN+FractionFNN+ConcatFNNで結晶エネルギーを予測。テストRMSE 0.00139eV、低エネルギーでは0.00054eV。'
        : 'Developed CrysEnergyModel using CrystalGNN+FractionFNN+ConcatFNN. Achieved test RMSE of 0.00139 eV (0.00054 eV for low-energy data).',
    },
    {
      title: lang === 'ja'
        ? 'HPC-AutoResearch: HPC環境における自律的研究フレームワーク'
        : 'HPC-AutoResearch: Autonomous research framework in HPC environments',
      label: lang === 'ja' ? '卒業論文' : 'Graduation Thesis',
      summary: lang === 'ja'
        ? 'BFTS木探索・Singularityコンテナ・LLM統合によるHPC環境での自動研究ワークフローフレームワーク。'
        : 'Framework for automated research workflows in HPC environments using BFTS tree search, Singularity containers, and LLM integration.',
    },
  ];

  const projects = [
    { name: 'ARI', language: 'Python', stars: 0, url: 'https://github.com/kotama7/ARI',
      description: lang === 'ja' ? 'あらゆる科学分野・あらゆる計算環境（PC〜スパコン）で動く完全汎用自律研究基盤。BFTS・MCP対応・ローカルLLM対応。MITライセンス。' : 'Autonomous Research Infrastructure — fully general autonomous research platform for any scientific domain and computing environment (PC to supercomputer). BFTS/MCP/local-LLM support. MIT license.' },
    { name: 'AI-Scientist-v2-HPC', language: 'Python', stars: 17, url: 'https://github.com/kotama7/AI-Scientist-v2-HPC',
      description: lang === 'ja' ? 'AI Scientist v2のHPC特化版。Singularityコンテナ+BFTSによる自動科学論文生成。' : 'HPC-optimized adaptation of AI Scientist v2 with Singularity containers and BFTS for automated scientific paper generation.' },
    { name: 'HPC-AutoResearch', language: 'Python', stars: 3, url: 'https://github.com/kotama7/HPC-AutoResearch',
      description: lang === 'ja' ? 'BFTS木探索・Singularityコンテナ・LLM統合によるHPC環境での自動研究ワークフロー。' : 'Framework for automated research workflows in HPC environments using BFTS tree search, Singularity containers, and LLM integration.' },
    { name: 'seisyun_information_entropy', language: 'Python', stars: 2, url: 'https://github.com/kotama7/seisyun_information_entropy',
      description: lang === 'ja' ? 'BERTと情報理論を用いた「青春」の定量分析フレームワーク。' : "Computational framework measuring 'youth' through linguistic analysis using BERT and information theory." },
    { name: 'portfolio', language: 'TypeScript', stars: 1, url: 'https://github.com/kotama7/portfolio',
      description: lang === 'ja' ? 'React+TypeScriptで構築したチャットUIポートフォリオサイト。' : 'Chat-UI portfolio website built with React and TypeScript.' },
  ];

  const contribs = [
    { name: 'SakanaAI/AI-Scientist-v2', role: lang === 'ja' ? 'Fork + HPC拡張' : 'Fork + HPC extension', url: 'https://github.com/SakanaAI/AI-Scientist-v2',
      description: lang === 'ja' ? 'BFTSベースの自動科学発見フレームワークをHPC環境向けに拡張。' : 'Extended the BFTS-based automated scientific discovery framework for HPC environments with Singularity container support.' },
    { name: 'SakanaAI/ShinkaEvolve', role: 'Fork', url: 'https://github.com/SakanaAI/ShinkaEvolve',
      description: lang === 'ja' ? 'オープンエンドかつサンプル効率の高いプログラム進化研究。' : 'Open-ended and sample-efficient program evolution research.' },
    { name: 'jack-app', role: lang === 'ja' ? 'メンバー（2022年〜）／副代表（2023〜2025年）' : 'Member (2022–) / Vice-President (2023–2025)', url: 'https://github.com/jack-app',
      description: lang === 'ja' ? 'アプリ開発団体jack。副代表としてLightning Talkイベントを企画・運営。' : 'App development group jack. As Vice-President, organized the Lightning Talk events.' },
  ];

  const researchWorks = [
    {
      title: 'HPC-AutoResearch: An HPC-Native Framework for Autonomous LLM-Driven Experimentation',
      type: lang === 'ja' ? '国際会議口頭発表' : 'Conference Talk',
      date: '2026-03',
      venue: lang === 'ja'
        ? 'ATAT 2026（高性能科学計算における先進的トピックと自動チューニング国際会議）、国立台湾大学、2026年3月20〜21日（発表済）'
        : 'ATAT 2026 (Conference on Advanced Topics and Auto Tuning in High-Performance Scientific Computing), National Taiwan University, Mar 20–21 2026 (presented)',
      authors: lang === 'ja'
        ? '樹神 宇徳（名古屋大／理研）, 林 俊一郎（名古屋大）, 椋木 大地（名古屋大）, 横田 理央（理研）, 大島 聡史（九大）, 星野 哲也（名古屋大）, 片桐 孝洋（名古屋大）'
        : 'Takanori Kotama (Nagoya U. / RIKEN), Shun-ichiro Hayashi (Nagoya U.), Daichi Mukunoki (Nagoya U.), Rio Yokota (RIKEN), Satoshi Ohshima (Kyushu U.), Tetsuya Hoshino (Nagoya U.), Takahiro Katagiri (Nagoya U.)',
      url: 'https://ncts.ntu.edu.tw/events_2_detail.php?nid=546',
    },
    {
      title: 'Crystal Fractional Graph Neural Network for Energy Prediction of High-Entropy Alloys',
      type: lang === 'ja' ? 'プレプリント（arXiv）' : 'Preprint (arXiv)',
      date: '2026-04',
      venue: 'arXiv:2605.08103 · DOI 10.48550/arXiv.2605.08103 · physics.comp-ph (primary), cond-mat.mtrl-sci, cs.AI',
      authors: lang === 'ja'
        ? '樹神 宇徳（名古屋大、筆頭著者）, Yang Huang（USTC）'
        : 'Takanori Kotama (Nagoya U., 1st author), Yang Huang (USTC)',
      url: 'https://arxiv.org/abs/2605.08103',
    },
    {
      title: lang === 'ja'
        ? 'HPC-AutoResearch：AI Scientist v2に基づくフェーズ分離実行と階層記憶によるHPC向け自律研究システム'
        : 'HPC-AutoResearch: An Autonomous Research System for HPC Based on AI Scientist v2 with Phase-Separated Execution and Hierarchical Memory',
      type: lang === 'ja' ? '口頭発表' : 'Conference Talk',
      date: '2026-03',
      venue: lang === 'ja'
        ? '第203回情処HPC研究会・第17回量子ソフトウェア研究会 合同研究発表会（北海道大学）'
        : '203rd IPSJ HPC SIG / 17th Quantum Software SIG Joint Workshop, Hokkaido University',
      authors: lang === 'ja'
        ? '樹神 宇徳（名古屋大／理研）, 林 俊一郎（名古屋大）, 椋木 大地（名古屋大）, 横田 理央（理研）, 大島 聡史（九大）, 星野 哲也（名古屋大）, 片桐 孝洋（名古屋大）'
        : 'Takanori Kotama (Nagoya U. / RIKEN), Shun-ichiro Hayashi (Nagoya U.), Daichi Mukunoki (Nagoya U.), Rio Yokota (RIKEN), Satoshi Ohshima (Kyushu U.), Tetsuya Hoshino (Nagoya U.), Takahiro Katagiri (Nagoya U.)',
    },
    {
      title: 'Proposal of The AI Scientist v2 for High Performance Computing with Local Large Language Models',
      type: lang === 'ja' ? 'ポスター発表' : 'Conference Poster',
      date: '2026-01',
      venue: 'HPC Asia 2026',
      url: 'https://www.sca-hpcasia2026.jp/data/poster/post213.pdf',
    },
  ];

  const links = {
    github: 'https://github.com/kotama7',
    researchmap: 'https://researchmap.jp/kotama_takanori',
    speakerdeck: 'https://speakerdeck.com/kotama7',
    researchgate: 'https://www.researchgate.net/profile/Takanori-Kotama',
    qiita: 'https://qiita.com/kotama7',
    zenn: 'https://zenn.dev/kotama7',
    x: 'https://x.com/kotama8',
    linkedin: 'https://www.linkedin.com/in/takanori-kotama-b785b52a4/',
    orcid: 'https://orcid.org/0009-0001-0749-5486',
  };

  const sections = {
    profile,
    bio,
    skills,
    interests,
    theses,
    projects,
    contributions: contribs,
    research: researchWorks,
    links,
    contact: { email: 'kotamatakanori2@gmail.com' },
  };

  if (section) {
    if (Object.prototype.hasOwnProperty.call(sections, section)) {
      res.json({ section, data: sections[section] });
    } else {
      res.status(400).json({
        error: 'Unknown section',
        available: Object.keys(sections),
      });
    }
    return;
  }

  res.json(sections);
});

// Return open-source contributions
exports.contributions = functions.https.onRequest((req, res) => {
  if (handlePreflight(req, res)) return;
  if (rejectMethod(req, res, ['GET', 'POST'])) return;
  setCors(req, res);
  const lang = (req.body.lang || 'en').toLowerCase();
  const items = {
    en: [
      { name: 'SakanaAI/AI-Scientist-v2', role: 'Fork + HPC extension', description: 'Extended the BFTS-based automated scientific discovery framework for HPC environments with Singularity container support.', url: 'https://github.com/SakanaAI/AI-Scientist-v2' },
      { name: 'SakanaAI/ShinkaEvolve', role: 'Fork', description: 'Open-ended and sample-efficient program evolution research.', url: 'https://github.com/SakanaAI/ShinkaEvolve' },
      { name: 'jack-app', role: 'Member (2022–) / Vice-President (2023–2025)', description: 'App development group jack. As Vice-President, organized the Lightning Talk events.', url: 'https://github.com/jack-app' },
    ],
    ja: [
      { name: 'SakanaAI/AI-Scientist-v2', role: 'Fork + HPC拡張', description: 'BFTSベースの自動科学発見フレームワークをHPC環境向けに拡張。Singularityコンテナ対応。', url: 'https://github.com/SakanaAI/AI-Scientist-v2' },
      { name: 'SakanaAI/ShinkaEvolve', role: 'Fork', description: 'オープンエンドかつサンプル効率の高いプログラム進化研究。', url: 'https://github.com/SakanaAI/ShinkaEvolve' },
      { name: 'jack-app', role: 'メンバー（2022年〜）／副代表（2023〜2025年）', description: 'アプリ開発団体jack。副代表としてLightning Talkイベントを企画・運営。', url: 'https://github.com/jack-app' },
    ],
  };
  res.json({ contributions: items[lang] || items.en });
});
