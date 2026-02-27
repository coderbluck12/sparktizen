import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Product } from '../types';

type Currency = 'NGN' | 'USD';

interface CurrencyContextType {
    currency: Currency;
    toggleCurrency: () => void;
    formatPrice: (product: Product) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
    const [currency, setCurrency] = useState<Currency>(() => {
        return (localStorage.getItem('currency') as Currency) || 'NGN';
    });

    const toggleCurrency = useCallback(() => {
        setCurrency(prev => {
            const next = prev === 'NGN' ? 'USD' : 'NGN';
            localStorage.setItem('currency', next);
            return next;
        });
    }, []);

    const formatPrice = useCallback(
        (product: Product): string => {
            if (currency === 'USD') {
                if (product.priceUSD != null) {
                    return `$${product.priceUSD.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}`;
                }
                return '$ —';
            }
            return `₦${product.price.toLocaleString('en-NG', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`;
        },
        [currency]
    );

    return (
        <CurrencyContext.Provider value={{ currency, toggleCurrency, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const ctx = useContext(CurrencyContext);
    if (!ctx) throw new Error('useCurrency must be used within a CurrencyProvider');
    return ctx;
};
