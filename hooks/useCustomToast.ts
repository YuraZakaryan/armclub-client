export function useCustomToast() {
  const toast = useToast();
  const { t } = useI18n();

  const showToast = (description: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) => {
    toast.add({
      title: type === 'success' ? t('success_toast') : type === 'error' ? t('error_toast') : t('announcement_toast'),
      description,
      duration,
      color: type === 'success' ? 'success' : type === 'error' ? 'error' : 'primary',
      icon: type === 'success' ? 'mdi:check-circle' : type === 'error' ? 'mdi:alert' : 'mdi:information-variant-circle',
    });
  };

  return {
    showToast,
  };
}
