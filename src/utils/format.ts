export interface CurrencyFormatOptions {
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

// Default options can later be made user-configurable (settings/profile)
const DEFAULT_OPTIONS: Required<CurrencyFormatOptions> = {
  locale: 'es-AR',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}

export function formatCurrency(value: number, options?: CurrencyFormatOptions): string {
  const opts = { ...DEFAULT_OPTIONS, ...(options || {}) }
  try {
    return new Intl.NumberFormat(opts.locale, {
      style: 'currency',
      currency: opts.currency,
      minimumFractionDigits: opts.minimumFractionDigits,
      maximumFractionDigits: opts.maximumFractionDigits,
    }).format(value)
  } catch {
    // Fallback simple formatting
    const sign = value < 0 ? '-' : ''
    const abs = Math.abs(Math.trunc(value))
    return `${sign}$${abs.toLocaleString(opts.locale)}`
  }
}
