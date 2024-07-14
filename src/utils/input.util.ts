export const onlyNumber = (field: any) => {
  return {
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
    },
    onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        !/\d/.test(e.key) ||
        (e.key.startsWith('0') && e.currentTarget.value === '0')
      ) {
        e.preventDefault();
      }
    },
    onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const paste = e.clipboardData.getData('text');
      const onlyNumbers = paste.replace(/\D/g, '').trim();
      if (field) {
        field.onChange(onlyNumbers);
      }
    },
  };
};
