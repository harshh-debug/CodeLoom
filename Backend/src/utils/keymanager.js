let currentApiKey = null;

export const getJudge0Keys = () => {
  const keys = process.env.JUDGE0_KEYS?.split(",").map(k => k.trim()).filter(Boolean);
  if (!keys || keys.length === 0) {
    throw new Error("No Judge0 API keys found in environment variable JUDGE0_KEYS");
  }
  return keys;
};

export const getCurrentJudgeKey = () => {
  if (!currentApiKey) {
    const keys = getJudge0Keys();
    const randomIndex = Math.floor(Math.random() * keys.length);
    currentApiKey = keys[randomIndex];
    console.log(`🎯 Using Judge0 Key: [${randomIndex + 1}]`);
  }
  return currentApiKey;
};

export const rotateJudge0Key = () => {
  const keys = getJudge0Keys();
  const currentIndex = keys.indexOf(currentApiKey);
  const nextIndex = (currentIndex + 1) % keys.length;
  currentApiKey = keys[nextIndex];
  console.warn(`⚠️ Judge0 Key limit reached. Switching to key [${nextIndex + 1}]`);
};
