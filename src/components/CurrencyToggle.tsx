import { useCurrency } from '../context/CurrencyContext';

const CurrencyToggle = () => {
    const { currency, toggleCurrency } = useCurrency();
    const isUSD = currency === 'USD';

    return (
        <button
            onClick={toggleCurrency}
            title={`Switch to ${isUSD ? 'Naira (₦)' : 'Dollar ($)'}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-input hover:border-foreground transition-all duration-200 text-sm font-medium text-foreground bg-background select-none"
        >
            <span className="text-base leading-none">{isUSD ? '$' : '₦'}</span>
            <span>{isUSD ? 'USD' : 'NGN'}</span>
            {/* Small animated indicator */}
            <span className="relative inline-flex items-center ml-1">
                <span className={`inline-block w-6 h-3 rounded-full transition-colors duration-200 ${isUSD ? 'bg-foreground' : 'bg-input'}`} />
                <span
                    className={`absolute inline-block w-2 h-2 rounded-full bg-background border border-input transition-transform duration-200 ${isUSD ? 'translate-x-3.5' : 'translate-x-0.5'}`}
                />
            </span>
        </button>
    );
};

export default CurrencyToggle;
