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
    'Possible functions include:\n- bioGraph: returns the biography graph.\n- skillTree: returns the skill hierarchy.\n- interestGraph: returns an interest graph.\n- personalityRadar: shows a personality radar chart.\n- contactInfo: returns contact information.\n- portfolioSummary: gives a summary of the portfolio.\nRespond with only the function name that best matches the user\'s request.';
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
    名古屋大学情報学部コンピュータ科学科情報システム専攻3年の学生です。\n
    React と TypeScript を中心に、AI を活用したアプリを開発しています。\n
    ポートフォリオにはチャットボット型プロフィールサイトや LLM を利用したアプリなどがあります。\n
    詳細は GitHub (https://github.com/kotama7) をご覧ください。
      `,
      `
    名古屋大学3年生で、React と TypeScript を主に使って開発しています。\n
    AI を取り入れたプロジェクトに取り組んでおり、このサイトもその一つです。\n
    興味があれば GitHub (https://github.com/kotama7) をご覧ください。
      `,
    ],
    en: [
      `
    I am a third year student at Nagoya University majoring in Computer Science.\n
    My main stack is React and TypeScript, and I love building apps that leverage AI.\n
    My portfolio includes a chatbot style profile site and several applications powered by large language models.\n
    For more, please visit my GitHub: https://github.com/kotama7
      `,
      `
    I'm a junior at Nagoya University focusing on Computer Science.\n
    I build applications with React and TypeScript and enjoy exploring AI tools.\n
    Check out more of my projects on GitHub: https://github.com/kotama7
      `,
    ],
  };

  const candidates = replies[lang] || replies.en;
  const message = candidates[Math.floor(Math.random() * candidates.length)];
  res.json({ message });
});
