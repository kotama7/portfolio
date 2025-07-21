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
    '- certificateHistory: lists certificates and awards.\n' +
    '- thesisSummary: returns the Encouragement Award thesis summary.\n' +
    '- fusepThesisSummary: returns the FuSEP thesis summary.\n' +
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
      { keyword: 'thesis', func: 'thesisSummary' },
      { keyword: '論文要約', func: 'thesisSummary' },
      { keyword: 'certificate', func: 'certificateHistory' },
      { keyword: '資格', func: 'certificateHistory' },
      { keyword: 'award', func: 'certificateHistory' },
      { keyword: 'fusep', func: 'fusepThesisSummary' },
      { keyword: '夏研', func: 'fusepThesisSummary' },
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
    名古屋大学情報学部コンピュータ科学科情報システム専攻4年の樹神宇徳です。\n
    高エントロピー合金やGNNを用いた材料研究、HPC 活用に興味があります。\n
      `,
      `
    2026年3月卒業予定で、2024年には学生論文コンテストで奨励賞を受賞しました。
      `,
    ],
    en: [
      `
    I am Takanori Kotama, a fourth-year Computer Science student in Nagoya University's Information Systems program. My work centers on high-entropy alloys and GNNs for materials science with an interest in HPC.
      `,
      `
    I expect to graduate in March 2026 and won the Encouragement Award at the 2024 Nagoya University Student Paper Contest.
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
      'Takanori Kotama is a fourth-year undergraduate in the Information Systems program at Nagoya University. ' +
      'His interests include high-entropy alloys, graph neural networks for materials science and HPC-driven discovery. ' +
      'He joined the FuSEP Summer Researcher Program at USTC and interned at Panasonic applying AI to manufacturing. ' +
      'He plans to participate in the RIKEN R-CCS HPC internship in 2025 and previously served as vice-president of the app development group "jack".',
    award:
      'Encouragement Award at the 2024 Nagoya University Student Paper Contest for the paper "A quantitative definition of青春 using large language models."',
    qualifications:
      'Bachelor of Science in Information Systems expected in March 2026 from Nagoya University.',
    lab:
      'Affiliated with the Faculty of Informatics at Nagoya University.'
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
      `
    名古屋大学情報学部コンピュータ科学科情報システム専攻4年の樹神宇徳です。\n
    高エントロピー合金やGNNを用いた材料研究、HPC 活用に興味があります。\n
      `,
      `
    2026年3月卒業予定で、2024年の学生論文コンテストで奨励賞を受賞しました。
      `,
    ],
    en: [
      `
    I'm Takanori Kotama, a fourth-year Computer Science student in Nagoya University's Information Systems program. My work centers on high-entropy alloys and GNNs with a focus on HPC.
      `,
      `
    I expect to graduate in March 2026 and won the Encouragement Award at the 2024 Nagoya University Student Paper Contest.
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
  res.json({
    github: 'https://github.com/kotama7',
    qiita: 'https://qiita.com/kotama7',
    x: 'https://x.com/kotama8',
    linkedin: 'https://www.linkedin.com/in/takanori-kotama-b785b52a4/'
  });
});

// Return certificate history
exports.certificateHistory = functions.https.onRequest((req, res) => {
  res.json({
    certificates: [
      'Applied Information Technology Engineer Examination (Jul. 2024)',
      'TOEIC Listening and Reading Score: 790 Points (Sep. 2024)',
      'Nagoya University Student Thesis Contest Encouragement Award (Mar. 2025)'
    ]
  });
});
