export const useToast = () => {
  if (import.meta.client) {
    // Dynamically import vue-sonner only on client side
    return import('vue-sonner').then(module => module.toast)
  }

  // Return dummy toast functions for SSR
  const dummyToast = () => {}
  return Promise.resolve(Object.assign(dummyToast, {
    success: dummyToast,
    error: dummyToast,
    warning: dummyToast,
    info: dummyToast,
    promise: dummyToast,
    loading: dummyToast,
    dismiss: dummyToast,
  }))
}
