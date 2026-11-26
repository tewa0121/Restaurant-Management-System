import { useCallback, useEffect, useState } from 'react';
import settingsService from '../services/settingsService';

// One shared request for the whole app session.
let cached = null;
let pending = null;

const loadCurrency = () => {
  if (cached) return Promise.resolve(cached);
  if (!pending) {
    pending = settingsService
      .getPublicSettings()
      .then((data) => {
        cached = data?.currency || 'ETB';
        return cached;
      })
      .catch(() => 'ETB')
      .finally(() => {
        pending = null;
      });
  }
  return pending;
};

// Currency code from the restaurant settings plus a formatter that uses it.
export default function useCurrency() {
  const [currency, setCurrency] = useState(cached || 'ETB');

  useEffect(() => {
    let active = true;
    loadCurrency().then((code) => {
      if (active) setCurrency(code);
    });
    return () => {
      active = false;
    };
  }, []);

  const formatMoney = useCallback(
    (amount) => `${currency} ${(Number(amount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    [currency]
  );

  return { currency, formatMoney };
}
