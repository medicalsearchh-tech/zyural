// src/config/config.ts
export const config = {
  stripe: {
    publishableKey: 'pk_test_51S8WbbRteu69rWCNjKy0FCxiBOqvTh1KFVBtMZfgIL95mYN0D3Rvn7tQ5MFa6QNeXPlPQYglK7sDAuTpECgcFnbH00veWI1MVK'
  },
};

// Alternative if process.env still doesn't work
export const configAlt = {
  stripe: {
    // Replace with your actual Stripe publishable key
    publishableKey: 'pk_test_51S8WbbRteu69rWCNjKy0FCxiBOqvTh1KFVBtMZfgIL95mYN0D3Rvn7tQ5MFa6QNeXPlPQYglK7sDAuTpECgcFnbH00veWI1MVK...' // Your actual key here
  },
};