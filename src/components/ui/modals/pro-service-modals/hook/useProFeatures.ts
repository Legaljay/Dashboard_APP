import { fetchAvailableSubscriptions, fetchCurrentSubscription, selectAdjacentPlans, selectedBusinessPlans, Subscription } from "@/redux-slice/business-subscription/business-subscription.slice";
import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
import { useRef, useEffect, useCallback, useState, useMemo } from "react";

const useProFeatures = () => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [lastFetchTime, setLastFetchTime] = useState<number>(0);

    const { currentPlan, subscriptions } = useAppSelector(selectedBusinessPlans);
    const wallets = useAppSelector((state) => state.businessWallet.wallets);
    const walletCredit = wallets.find(wallet => wallet.currency === 'USD');
    const walletBalanceValue = walletCredit ? walletCredit.balance : "0";
    const giftWallet = wallets?.filter((wallet) => wallet.currency === "GIFT");
    const giftBalance = giftWallet[0]?.balance;

    const sufficient = useMemo(
        () => Number(walletBalanceValue) + Number(giftBalance),
        [walletCredit, giftBalance]
    );

    const currentPlanIndex: number = subscriptions.findIndex((sub) => sub.name === currentPlan?.name);
    const previousPlan: Subscription | undefined = subscriptions.find((plan) => {
        if(currentPlanIndex === 0) {
            return null;
        }
        return plan.id === subscriptions[currentPlanIndex - 1]?.id
    });
    const nextPlan: Subscription | undefined = subscriptions.find((plan) => {
        if(currentPlanIndex === subscriptions.length - 1) {
            return null;
        }
        return plan.id === subscriptions[currentPlanIndex + 1]?.id
    });
    
    const is_BasePlan: boolean = currentPlanIndex === 0;
    const is_ProPlan: boolean = currentPlanIndex > 0 && currentPlanIndex < subscriptions.length - 1;
    const is_sufficientBalance: boolean = sufficient < Number(nextPlan?.monthly_amount);

    const fetchSomeData = useCallback(async (event?: FocusEvent) => {
        // Debounce: Prevent fetching if last fetch was less than 30 seconds ago
        const now = Date.now();
        if (now - lastFetchTime < 300000) {
            console.log('Skipping fetch - too soon since last fetch');
            return;
        }

        // Don't fetch if already loading
        if (isLoading) {
            console.log('Skipping fetch - already loading');
            return;
        }

        // Check if focus came from a user interaction vs programmatic focus
        if (event && !event.isTrusted) {
            console.log('Skipping fetch - programmatic focus');
            return;
        }

        try {
            setIsLoading(true);
            const [currentSubscriptionResult, availableSubscriptionsResult] = await Promise.allSettled([
                dispatch(fetchCurrentSubscription()).unwrap(),
                dispatch(fetchAvailableSubscriptions()).unwrap(),
            ]);

            // Handle potential rejections
            if (currentSubscriptionResult.status === 'rejected' || 
                availableSubscriptionsResult.status === 'rejected') {
                throw new Error('One or more requests failed');
            }

            setLastFetchTime(Date.now());
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [dispatch, isLoading, lastFetchTime]);

    // Initial focus (only on mount)
    useEffect(() => {
        if (buttonRef.current && !lastFetchTime) {
            buttonRef.current.focus();
        }
    }, []); // Empty dependency array for mount only

    // Focus event handler
    useEffect(() => {
        const button = buttonRef.current;
        if (!button) return;

        const handleFocus = (event: FocusEvent) => {
            fetchSomeData(event);
        };

        button.addEventListener('focus', handleFocus);
        
        return () => {
            button.removeEventListener('focus', handleFocus);
        };
    }, [fetchSomeData]);


    return {
        is_BasePlan,
        is_ProPlan,
        planBefore : previousPlan,
        planAfter: nextPlan,
        giftBalance,
        giftWallet,
        subscriptions,
        currentPlan,
        currentPlanIndex,
        buttonRef,
        isLoading,
        fetchSomeData,
        walletBalanceValue,
        walletCredit,
        is_sufficientBalance,
    };
};

export default useProFeatures;