import type { ActionKind, ParsedIntent } from '../types';

export type ParseIntentOptions = {
  demoRecipientAddress?: string;
  locale?: string;
};

const AMOUNT_TOKEN = /(\d+(?:\.\d+)?)\s*(SUI|USDC|MIST|mist)?/i;
const ADDRESS_TOKEN = /0x[a-f0-9]{3,}/i;

function normalize(text: string) {
  return text.trim().replace(/\s+/g, ' ');
}

function detectLanguage(text: string) {
  const hasJapanese = /[ぁ-んァ-ヶ一-龯]/.test(text);
  const hasEnglish = /[a-zA-Z]/.test(text);
  if (hasJapanese && hasEnglish) return 'mixed';
  if (hasJapanese) return 'ja';
  if (hasEnglish) return 'en';
  return 'unknown';
}

function parseAmount(text: string) {
  const match = text.match(AMOUNT_TOKEN);
  if (!match) {
    return null;
  }

  return {
    amount: Number.parseFloat(match[1]),
    token: (match[2] ?? 'SUI').toUpperCase(),
  };
}

function parseRecipient(text: string, demoRecipientAddress: string) {
  if (/(my test wallet|test wallet|テストウォレット)/i.test(text)) {
    return demoRecipientAddress;
  }

  const directMatch = text.match(/(?:to|for|へ|に)\s+(0x[a-f0-9]{3,}|[A-Za-z][\w.-]*)/i);
  if (directMatch?.[1]) {
    return directMatch[1];
  }

  const addressMatch = text.match(ADDRESS_TOKEN);
  return addressMatch?.[0] ?? '';
}

function hasSuspiciousRecipient(recipient: string) {
  return /(?:evil|attacker|unknown|suspicious|怪しい|不正|危ない)/i.test(recipient);
}

function buildFlowId(kind: ActionKind, text: string) {
  if (kind === 'unknown' && /(?:block|stop|不正|怪しい|危ない|hidden transfer)/i.test(text)) {
    return 'block';
  }

  return kind;
}

export function parseIntent(input: string, options: ParseIntentOptions = {}): ParsedIntent {
  const normalized = normalize(input);
  const language = detectLanguage(normalized);
  const lower = normalized.toLowerCase();
  const demoRecipientAddress = options.demoRecipientAddress ?? '0xdemo_test_wallet';
  const amount = parseAmount(normalized);
  const recipient = parseRecipient(normalized, demoRecipientAddress);

  const transferLike = /(?:send|transfer|送金|送って|送る|pay|支払|振り込|move)/i.test(normalized);
  const deepbookLike = /(?:deepbook|ディープブック|swap|buy|買う|sui usdc|usdc .*sui|sui.*usdc)/i.test(
    normalized,
  );
  const transitLike = /(?:transit|交通|チャージ|トップアップ|top up|mobility|pass)/i.test(normalized);
  const balanceLike = /(?:balance|残高|check my balance|my balance)/i.test(normalized);
  const blockLike = /(?:block|stop|hidden transfer|怪しい|不正|危ない|ブロック)/i.test(normalized);

  let kind: ActionKind = 'unknown';
  let confidence = 0.24;
  let reason = 'Could not identify a supported action.';
  const slots: Record<string, string> = {};
  const missingSlots: string[] = [];

  if (blockLike) {
    kind = 'unknown';
    confidence = 0.92;
    reason = 'Safety request detected.';
  } else if (deepbookLike) {
    kind = 'deepbook_swap';
    confidence = 0.93;
    reason = 'DeepBook trade or preview request detected.';
    slots.tokenIn = 'SUI';
    slots.tokenOut = 'USDC';
    slots.venue = 'DeepBook';
    const parsed = amount ?? { amount: 5, token: 'SUI' };
    slots.amountIn = String(parsed.amount);
    slots.slippageBps = '50';
  } else if (transitLike) {
    kind = 'transit';
    confidence = 0.88;
    reason = 'Transit top-up request detected.';
    slots.venue = 'Transit';
  } else if (balanceLike) {
    kind = 'balance_check';
    confidence = 0.86;
    reason = 'Balance check request detected.';
  } else if (transferLike) {
    kind = 'transfer';
    confidence = 0.84;
    reason = 'Transfer request detected.';
  }

  if (kind === 'transfer' || kind === 'deepbook_swap') {
    if (amount) {
      slots.amount = String(amount.amount);
      slots.token = amount.token;
    } else {
      missingSlots.push('amount');
    }
  }

  if (kind === 'transfer') {
    slots.from = 'connected wallet';
    slots.network = 'testnet';
    if (recipient) {
      slots.recipient = recipient;
    } else {
      missingSlots.push('recipient');
    }

    if (!slots.token) {
      slots.token = 'SUI';
    }
  }

  if (kind === 'deepbook_swap') {
    if (!slots.amountIn) {
      missingSlots.push('amountIn');
    }
    if (!slots.tokenIn) {
      slots.tokenIn = 'SUI';
    }
    if (!slots.tokenOut) {
      slots.tokenOut = 'USDC';
    }
  }

  if (kind === 'transit') {
    slots.asset = 'USDC';
    slots.amount = String(amount?.amount ?? 10);
  }

  if (kind === 'balance_check') {
    slots.asset = 'SUI';
  }

  if (kind === 'unknown') {
    missingSlots.push('intent');
  }

  if (kind === 'transfer' && recipient && recipient === demoRecipientAddress) {
    slots.recipient = demoRecipientAddress;
  }

  if (kind === 'transfer' && recipient && hasSuspiciousRecipient(recipient)) {
    slots.recipient = recipient;
    missingSlots.push('safety');
  }

  if (kind === 'transfer' && amount && amount.amount <= 0) {
    missingSlots.push('amount');
  }

  if (kind === 'transfer' && !amount) {
    confidence = 0.58;
  }

  if (kind === 'deepbook_swap' && !amount) {
    confidence = 0.66;
  }

  const normalizedIntent =
    kind === 'transfer'
      ? `transfer ${slots.amount ?? 'amount'} ${slots.token ?? 'SUI'} to ${slots.recipient ?? 'recipient'}`
      : kind === 'deepbook_swap'
        ? `preview DeepBook swap ${slots.amountIn ?? 'amount'} ${slots.tokenIn ?? 'SUI'} -> ${slots.tokenOut ?? 'USDC'}`
        : kind === 'transit'
          ? 'preview transit top-up'
          : kind === 'balance_check'
            ? 'check balance'
            : blockLike
              ? 'block suspicious transfer'
              : 'unknown intent';

  const needsClarification = missingSlots.length > 0 || confidence < 0.55;

  return {
    input,
    kind,
    flowId: buildFlowId(kind, lower),
    confidence,
    normalizedIntent,
    reason,
    slots,
    missingSlots,
    needsClarification,
    language,
  };
}
