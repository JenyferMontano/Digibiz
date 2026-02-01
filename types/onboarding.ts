export type OnboardingData = {
    businessName?: string;
    description?: string;
    size?: string;
};

export type OnboardingContextType = {
    data: OnboardingData;
    setData: (data: OnboardingData) => void;
    reset: () => void;
}