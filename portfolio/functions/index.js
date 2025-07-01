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

exports.selectFunction = functions.https.onRequest(async (req, res) => {
  const text = req.body.text || '';
  if (!text) {
    res.status(400).json({ error: 'No text provided' });
    return;
  }

  const lang = (req.body.lang || 'en').toLowerCase();
  const basePrompt =
    'Possible functions include:\n' +
    '- bioGraph: returns the biography graph.\n' +
    '- skillTree: returns the skill hierarchy.\n' +
    '- interestGraph: returns an interest graph.\n' +
    '- personalityRadar: shows a personality radar chart.\n' +
    '- contactInfo: returns contact information.\n' +
    '- portfolioSummary: gives a summary of the portfolio.\n' +
    '- otherSiteLinks: returns links to other sites.\n' +
    '- profileInfo: returns life summary, award, qualifications and lab info.\n' +
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
      { keyword: 'personality', func: 'personalityRadar' },
      { keyword: '性格', func: 'personalityRadar' },
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
  const lang = (req.body.lang || 'en').toLowerCase();

  const replies = {
    ja: [
      `
    名古屋大学片桐・星野研究室所属のコンピュータ科学科4年、小玉貴教です。\n
    Aixtalで製造データからAIモデルを構築するデータサイエンティストとして活動しています。\n
      `,
      `
    2026年3月卒業予定で、2025年2月に名古屋大学高等教育研究センターの修了証を取得しました。
      `,
    ],
    en: [
      `
    I am Takanori Kotama, a fourth-year Computer Science student at Nagoya University's Katagiri–Hoshino Lab. I work as a Data Scientist at Aixtal building AI models from manufacturing data.
      `,
      `
    I enjoy AI and music processing, singing, travel, food, and making things. B.Sc. expected March 2026.
      `,
    ],
  };

  const candidates = replies[lang] || replies.en;
  const message = candidates[Math.floor(Math.random() * candidates.length)];
  res.json({ message });
});

// Provide profile details such as life summary, awards, qualifications and lab
exports.profileInfo = functions.https.onRequest((req, res) => {
  const query = (req.body.query || '').toLowerCase();

  const details = {
    summary:
      'Takanori Kotama is a fourth-year undergraduate at Nagoya University\'s Department of Computer Science. ' +
      'He specializes in artificial intelligence and music processing, interns as an AI engineer at Aixtal, ' +
      'and completed a two-month FuSEP research program at the University of Science and Technology of China. ' +
      'He formerly led the app development circle "jack" and enjoys singing, travel, food and creating things.',
    award:
      "Nagoya University Student Thesis's Contest – Encouragement Award (Feb 2025) issued by the Center for the Studies of Higher Education.",
    qualifications:
      'Bachelor of Science in Computer Science expected in March 2026 from Nagoya University.',
    lab:
      'Member of the Katagiri–Hoshino Laboratory, Information Systems division at Nagoya University.'
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
  const intros = {
    ja: [
      '名古屋大学コンピュータ科学科4年の小玉貴教です。AIと音楽処理が得意です。',
      '小玉貴教と申します。名古屋大学でAIを研究し、音楽も好きです。'
    ],
    en: [
      'I\'m Takanori Kotama, a fourth-year CS student at Nagoya University focused on AI and music processing.',
      'Takanori Kotama here – a student researcher in AI who also enjoys music.'
    ]
  };

  const lang = (req.body.lang || 'en').toLowerCase();
  const candidates = intros[lang] || intros.en;
  const message = candidates[Math.floor(Math.random() * candidates.length)];
  res.json({ message });
});
